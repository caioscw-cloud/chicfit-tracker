
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { 
  fetchMeals, 
  fetchNutritionGoals, 
  saveNutritionGoals, 
  saveMeal, 
  saveWaterIntake, 
  fetchWaterIntake,
  Meal,
  FoodItem,
  NutritionGoals
} from "@/services/mealService";

// Componentes extraídos
import MacroDisplay from "./nutrition/MacroDisplay";
import WaterTracker from "./nutrition/WaterTracker";
import NutritionGoalsSettings from "./nutrition/NutritionGoalsSettings";
import MealSlot from "./nutrition/MealSlot";
import EditFoodModal from "./nutrition/EditFoodModal";

const DEFAULT_MEALS: Meal[] = [
  { title: "Café da Manhã", time: "07:00", foods: [] },
  { title: "Lanche da Manhã", time: "10:00", foods: [] },
  { title: "Almoço", time: "13:00", foods: [] },
  { title: "Lanche da Tarde", time: "16:00", foods: [] },
  { title: "Jantar", time: "19:00", foods: [] },
  { title: "Ceia", time: "21:00", foods: [] }
];

const DEFAULT_NUTRITION_GOALS: NutritionGoals = {
  calories: 2500,
  protein: 180,
  carbs: 300,
  fats: 70,
  waterIntake: 3700
};

const MealLog = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [showSettings, setShowSettings] = useState(false);
  const [editingFood, setEditingFood] = useState<{ mealTitle: string; food: FoodItem } | null>(null);
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Verificar se o usuário está autenticado
  useEffect(() => {
    if (!user) {
      toast({
        title: "Autenticação necessária",
        description: "Faça login para acessar o registro de refeições.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, navigate, toast]);

  // Buscar as refeições do usuário
  const { 
    data: meals = DEFAULT_MEALS,
    isLoading: isLoadingMeals 
  } = useQuery({
    queryKey: ['meals', user?.id, currentDate],
    queryFn: () => user ? fetchMeals(user.id, currentDate) : Promise.resolve([]),
    enabled: !!user,
  });

  // Buscar as metas nutricionais do usuário
  const { 
    data: nutritionGoals = DEFAULT_NUTRITION_GOALS,
    isLoading: isLoadingGoals
  } = useQuery({
    queryKey: ['nutritionGoals', user?.id],
    queryFn: () => user ? fetchNutritionGoals(user.id) : Promise.resolve(DEFAULT_NUTRITION_GOALS),
    enabled: !!user,
  });

  // Buscar o consumo de água do usuário
  const { 
    data: waterIntake = 0
  } = useQuery({
    queryKey: ['waterIntake', user?.id, currentDate],
    queryFn: () => user ? fetchWaterIntake(user.id, currentDate) : Promise.resolve(0),
    enabled: !!user,
  });

  // Mutation para salvar metas nutricionais
  const saveNutritionMutation = useMutation({
    mutationFn: (goals: NutritionGoals) => {
      if (!user) throw new Error("Usuário não autenticado");
      return saveNutritionGoals({ ...goals, userId: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutritionGoals', user?.id] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar metas",
        description: String(error),
        variant: "destructive",
      });
    },
  });

  // Mutation para salvar consumo de água
  const saveWaterMutation = useMutation({
    mutationFn: (amount: number) => {
      if (!user) throw new Error("Usuário não autenticado");
      return saveWaterIntake(user.id, amount, currentDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waterIntake', user?.id, currentDate] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar consumo de água",
        description: String(error),
        variant: "destructive",
      });
    },
  });

  // Mutation para salvar refeição
  const saveMealMutation = useMutation({
    mutationFn: (updatedMeal: Meal) => {
      if (!user) throw new Error("Usuário não autenticado");
      return saveMeal({ ...updatedMeal, userId: user.id, date: currentDate });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals', user?.id, currentDate] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar refeição",
        description: String(error),
        variant: "destructive",
      });
    },
  });

  const handleUpdateNutritionGoals = (goals: NutritionGoals) => {
    saveNutritionMutation.mutate(goals);
  };

  const handleUpdateWaterIntake = (amount: number) => {
    saveWaterMutation.mutate(amount);
  };

  const handleAddFood = (mealTitle: string) => {
    // Salvar o título da refeição no estado para usar quando o usuário voltar
    localStorage.setItem('currentMealTitle', mealTitle);
    navigate('/add-food');
  };

  const handleEditFood = (mealTitle: string, food: FoodItem) => {
    setEditingFood({ mealTitle, food });
  };

  const handleDeleteFood = (mealTitle: string, foodId: string) => {
    const meal = meals.find(m => m.title === mealTitle);
    if (!meal) return;

    const updatedMeal: Meal = {
      ...meal,
      foods: meal.foods.filter(f => f.id !== foodId)
    };

    saveMealMutation.mutate(updatedMeal);
  };

  const handleSaveEdit = (updatedFood: FoodItem) => {
    if (!editingFood) return;

    const meal = meals.find(m => m.title === editingFood.mealTitle);
    if (!meal) return;

    const updatedMeal: Meal = {
      ...meal,
      foods: meal.foods.map(food =>
        food.id === updatedFood.id ? updatedFood : food
      )
    };

    saveMealMutation.mutate(updatedMeal);
    setEditingFood(null);
  };

  const totals = {
    calories: meals.reduce((sum, meal) => 
      sum + meal.foods.reduce((mealSum, food) => mealSum + food.calories, 0), 0),
    protein: meals.reduce((sum, meal) => 
      sum + meal.foods.reduce((mealSum, food) => mealSum + food.protein, 0), 0),
    carbs: meals.reduce((sum, meal) => 
      sum + meal.foods.reduce((mealSum, food) => mealSum + food.carbs, 0), 0),
    fats: meals.reduce((sum, meal) => 
      sum + meal.foods.reduce((mealSum, food) => mealSum + food.fats, 0), 0),
    waterIntake
  };

  // Verificar alertas nutricionais
  useEffect(() => {
    const checkNutritionGoals = () => {
      const caloriePercentage = (totals.calories / nutritionGoals.calories) * 100;
      const proteinPercentage = (totals.protein / nutritionGoals.protein) * 100;

      if (caloriePercentage >= 90) {
        toast({
          title: "Atenção às calorias",
          description: "Você está próximo do seu limite calórico diário.",
          variant: "default"
        });
      }

      if (proteinPercentage < 50 && totals.calories > nutritionGoals.calories / 2) {
        toast({
          title: "Consumo de proteína baixo",
          description: "Considere adicionar mais proteína às suas refeições.",
          variant: "default"
        });
      }
    };

    checkNutritionGoals();
  }, [totals, nutritionGoals, toast]);

  // Efeito para lidar com o retorno da página de adicionar alimentos
  useEffect(() => {
    const handleAddFoodReturn = () => {
      const newFood = localStorage.getItem('newFood');
      const mealTitle = localStorage.getItem('currentMealTitle');
      
      if (newFood && mealTitle) {
        try {
          const foodData = JSON.parse(newFood) as Omit<FoodItem, 'id'>;
          const meal = meals.find(m => m.title === mealTitle);
          
          if (meal) {
            const updatedMeal: Meal = {
              ...meal,
              foods: [...meal.foods, { ...foodData, id: uuidv4() }]
            };
            
            saveMealMutation.mutate(updatedMeal);
          }
          
          // Limpar o localStorage após usar
          localStorage.removeItem('newFood');
          localStorage.removeItem('currentMealTitle');
        } catch (error) {
          console.error("Erro ao adicionar novo alimento:", error);
        }
      }
    };

    handleAddFoodReturn();
  }, [meals]);

  if (isLoadingMeals || isLoadingGoals) {
    return <div className="p-4 text-center">Carregando...</div>;
  }

  return (
    <TooltipProvider>
      <div className="animate-fade-up space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Registro de Refeições</h2>
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full"
            onClick={() => setShowSettings(true)}
          >
            <Settings2 className="h-5 w-5" />
          </Button>
        </div>

        <MacroDisplay totals={totals} goals={nutritionGoals} />
        
        <WaterTracker 
          totals={totals}
          goals={nutritionGoals}
          onUpdate={handleUpdateWaterIntake}
        />

        <div className="grid gap-4">
          {meals.map((meal) => (
            <MealSlot
              key={meal.title}
              meal={meal}
              onAddFood={handleAddFood}
              onEditFood={handleEditFood}
              onDeleteFood={handleDeleteFood}
            />
          ))}
        </div>

        <AlertDialog open={showSettings} onOpenChange={setShowSettings}>
          <NutritionGoalsSettings
            goals={nutritionGoals}
            onUpdateGoals={handleUpdateNutritionGoals}
            onClose={() => setShowSettings(false)}
          />
        </AlertDialog>

        {editingFood && (
          <EditFoodModal
            food={editingFood.food}
            onSave={handleSaveEdit}
            onClose={() => setEditingFood(null)}
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default MealLog;
