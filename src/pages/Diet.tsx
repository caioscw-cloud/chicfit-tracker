import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Settings2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import AddFoodModal from "@/components/nutrition/AddFoodModal";
import FoodItemCard from "@/components/nutrition/FoodItemCard";
import DateSelector from "@/components/nutrition/DateSelector";
import { 
  FoodItem, 
  Meal, 
  NutritionGoals, 
  fetchMeals, 
  saveMeal, 
  deleteMeal,
  fetchNutritionGoals,
  saveNutritionGoals,
  fetchWaterIntake,
  saveWaterIntake
} from "@/services/mealService";

const MacroProgressBar = ({ current, goal, color }: { current: number; goal: number; color: string }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  
  return (
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <div 
        className={`h-full ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

const NutritionGoalsSettings = ({ 
  goals, 
  onUpdateGoals, 
  onClose 
}: { 
  goals: NutritionGoals; 
  onUpdateGoals: (goals: NutritionGoals) => void; 
  onClose: () => void;
}) => {
  const [localGoals, setLocalGoals] = useState<NutritionGoals>(goals);
  const { toast } = useToast();

  const calculateCalories = (protein: number, carbs: number, fats: number) => {
    return (protein * 4) + (carbs * 4) + (fats * 9);
  };

  React.useEffect(() => {
    const calculatedCalories = calculateCalories(
      localGoals.protein,
      localGoals.carbs,
      localGoals.fats
    );
    setLocalGoals(prev => ({
      ...prev,
      calories: calculatedCalories
    }));
  }, [localGoals.protein, localGoals.carbs, localGoals.fats]);

  const handleSave = () => {
    onUpdateGoals(localGoals);
    toast({
      title: "Metas atualizadas",
      description: "Suas metas nutricionais foram atualizadas com sucesso.",
    });
    onClose();
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Metas Nutricionais</AlertDialogTitle>
        <AlertDialogDescription>
          Configure suas metas diárias de macronutrientes. As calorias serão calculadas automaticamente.
        </AlertDialogDescription>
      </AlertDialogHeader>
      
      <Tabs defaultValue="macros">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="macros">Macronutrientes</TabsTrigger>
          <TabsTrigger value="water">Água</TabsTrigger>
        </TabsList>
        
        <TabsContent value="macros" className="space-y-4">
          <div className="mb-6">
            <p className="text-lg font-medium mb-2">Calorias Totais: {localGoals.calories} kcal</p>
            <p className="text-sm text-muted-foreground">
              Calculado automaticamente com base nos macronutrientes (P × 4 + C × 4 + G × 9)
            </p>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">
              Proteínas: {localGoals.protein}g ({(localGoals.protein * 4)} kcal)
            </label>
            <Slider
              value={[localGoals.protein]}
              onValueChange={([protein]) => setLocalGoals(prev => ({ ...prev, protein }))}
              max={1000}
              step={5}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">
              Carboidratos: {localGoals.carbs}g ({(localGoals.carbs * 4)} kcal)
            </label>
            <Slider
              value={[localGoals.carbs]}
              onValueChange={([carbs]) => setLocalGoals(prev => ({ ...prev, carbs }))}
              max={1000}
              step={5}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">
              Gorduras: {localGoals.fats}g ({(localGoals.fats * 9)} kcal)
            </label>
            <Slider
              value={[localGoals.fats]}
              onValueChange={([fats]) => setLocalGoals(prev => ({ ...prev, fats }))}
              max={1000}
              step={5}
              className="mt-2"
            />
          </div>
        </TabsContent>

        <TabsContent value="water" className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">
              Meta de Água: {localGoals.waterIntake}ml
            </label>
            <Slider
              value={[localGoals.waterIntake]}
              onValueChange={([waterIntake]) => setLocalGoals(prev => ({ ...prev, waterIntake }))}
              max={5000}
              step={100}
              className="mt-2"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Recomendações:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Homens: 3.7L por dia</li>
              <li>Mulheres: 2.7L por dia</li>
              <li>Atletas: +500-1000ml por hora de treino</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialogFooter>
        <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
        <Button onClick={handleSave}>Salvar Alterações</Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

const WaterTracker = ({ 
  waterIntake, 
  waterGoal, 
  onAddWater 
}: { 
  waterIntake: number; 
  waterGoal: number; 
  onAddWater: (amount: number) => void 
}) => {
  return (
    <Card className="p-4 bg-card mb-6">
      <h3 className="text-lg font-medium mb-3">Consumo de Água</h3>
      <MacroProgressBar
        current={waterIntake}
        goal={waterGoal}
        color="bg-cyan-500"
      />
      <div className="flex justify-between items-baseline text-sm text-muted-foreground mt-1 mb-3">
        <span>{waterIntake}ml</span>
        <span>{waterGoal}ml</span>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onAddWater(200)}
        >
          +200ml
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onAddWater(300)}
        >
          +300ml
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onAddWater(500)}
        >
          +500ml
        </Button>
      </div>
    </Card>
  );
};

const MealSlot = ({ 
  meal, 
  onAddFood,
  onEditFood,
  onDeleteFood
}: { 
  meal: Meal; 
  onAddFood: (mealTitle: string) => void;
  onEditFood: (mealTitle: string, food: FoodItem) => void;
  onDeleteFood: (mealTitle: string, foodId: string) => void;
}) => {
  const totalCalories = meal.foods.reduce((sum, food) => sum + food.calories, 0);
  const totalProtein = meal.foods.reduce((sum, food) => sum + food.protein, 0);

  return (
    <Card className="p-4 bg-card">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm text-muted-foreground">{meal.time}</p>
          <h3 className="text-lg font-medium">{meal.title}</h3>
          {meal.foods.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {totalCalories} cal • {totalProtein}g proteína
            </p>
          )}
        </div>
        {meal.foods.length > 0 && (
          <span className="px-2 py-1 bg-diet/10 text-diet rounded-full text-xs">
            Registrado
          </span>
        )}
      </div>

      {meal.foods.length > 0 && (
        <div className="space-y-2 mb-3">
          {meal.foods.map((food) => (
            <FoodItemCard
              key={food.id}
              food={food}
              onEdit={(food) => onEditFood(meal.title, food)}
              onDelete={(foodId) => onDeleteFood(meal.title, foodId)}
            />
          ))}
        </div>
      )}

      <Button 
        variant="outline" 
        size="sm" 
        className="w-full"
        onClick={() => onAddFood(meal.title)}
      >
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Alimento
      </Button>
    </Card>
  );
};

const DEFAULT_MEAL_TEMPLATES: Omit<Meal, "id" | "userId" | "date">[] = [
  { title: "Café da Manhã", time: "07:00", foods: [] },
  { title: "Lanche da Manhã", time: "10:00", foods: [] },
  { title: "Almoço", time: "13:00", foods: [] },
  { title: "Lanche da Tarde", time: "16:00", foods: [] },
  { title: "Jantar", time: "19:00", foods: [] },
  { title: "Ceia", time: "21:00", foods: [] }
];

const DEFAULT_GOALS: NutritionGoals = {
  calories: 2500,
  protein: 180,
  carbs: 300,
  fats: 70,
  waterIntake: 3000
};

const Diet = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoals>(DEFAULT_GOALS);
  const [waterIntake, setWaterIntake] = useState(0);
  const [addFoodModalOpen, setAddFoodModalOpen] = useState(false);
  const [selectedMealTitle, setSelectedMealTitle] = useState<string | null>(null);
  const [editingFood, setEditingFood] = useState<FoodItem | undefined>(undefined);

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  useEffect(() => {
    if (!user) {
      toast({
        title: "Autenticação necessária",
        description: "Faça login para acessar o registro de refeições.",
        variant: "destructive",
      });
      navigate("/login");
    } else {
      loadData();
    }
  }, [user, navigate, toast, formattedDate]);

  const loadData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const fetchedMeals = await fetchMeals(user.id, formattedDate);
      
      if (fetchedMeals.length === 0) {
        const defaultMeals = DEFAULT_MEAL_TEMPLATES.map(template => ({
          ...template,
          userId: user.id,
          date: formattedDate
        }));
        
        const savedMeals = await Promise.all(
          defaultMeals.map(meal => saveMeal(meal))
        );
        
        setMeals(savedMeals.filter(Boolean) as Meal[]);
      } else {
        setMeals(fetchedMeals);
      }
      
      const goals = await fetchNutritionGoals(user.id);
      if (goals) {
        setNutritionGoals(goals);
      }
      
      const water = await fetchWaterIntake(user.id, formattedDate);
      setWaterIntake(water);
      
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar suas refeições. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateGoals = async (goals: NutritionGoals) => {
    if (!user) return;
    
    try {
      goals.userId = user.id;
      const updatedGoals = await saveNutritionGoals(goals);
      if (updatedGoals) {
        setNutritionGoals(updatedGoals);
      }
    } catch (error) {
      console.error("Error updating goals:", error);
      toast({
        title: "Erro ao salvar metas",
        description: "Não foi possível salvar suas metas nutricionais.",
        variant: "destructive",
      });
    }
  };

  const handleAddWater = async (amount: number) => {
    if (!user) return;
    
    try {
      const newTotal = waterIntake + amount;
      const updatedWaterIntake = await saveWaterIntake(user.id, newTotal, formattedDate);
      setWaterIntake(updatedWaterIntake);
      
      toast({
        title: "Água adicionada",
        description: `+${amount}ml de água registrados.`,
      });
    } catch (error) {
      console.error("Error adding water:", error);
      toast({
        title: "Erro ao adicionar água",
        description: "Não foi possível salvar seu consumo de água.",
        variant: "destructive",
      });
    }
  };

  const handleOpenAddFoodModal = (mealTitle: string) => {
    setSelectedMealTitle(mealTitle);
    setEditingFood(undefined);
    setAddFoodModalOpen(true);
  };

  const handleEditFood = (mealTitle: string, food: FoodItem) => {
    setSelectedMealTitle(mealTitle);
    setEditingFood(food);
    setAddFoodModalOpen(true);
  };

  const handleDeleteFood = async (mealTitle: string, foodId: string) => {
    if (!user) return;
    
    try {
      const meal = meals.find(m => m.title === mealTitle);
      if (!meal || !meal.id) return;
      
      const updatedFoods = meal.foods.filter(f => f.id !== foodId);
      
      const updatedMeal = { ...meal, foods: updatedFoods };
      const savedMeal = await saveMeal(updatedMeal);
      
      if (savedMeal) {
        setMeals(meals.map(m => m.id === savedMeal.id ? savedMeal : m));
        
        toast({
          title: "Alimento removido",
          description: "O alimento foi removido da refeição.",
        });
      }
    } catch (error) {
      console.error("Error deleting food:", error);
      toast({
        title: "Erro ao remover alimento",
        description: "Não foi possível remover o alimento da refeição.",
        variant: "destructive",
      });
    }
  };

  const handleAddFoodToMeal = async (food: FoodItem) => {
    if (!user || !selectedMealTitle) return;
    
    try {
      const meal = meals.find(m => m.title === selectedMealTitle);
      if (!meal || !meal.id) return;
      
      let updatedFoods: FoodItem[];
      
      if (editingFood) {
        updatedFoods = meal.foods.map(f => 
          f.id === editingFood.id ? food : f
        );
      } else {
        updatedFoods = [...meal.foods, food];
      }
      
      const updatedMeal = { ...meal, foods: updatedFoods };
      const savedMeal = await saveMeal(updatedMeal);
      
      if (savedMeal) {
        setMeals(meals.map(m => m.id === savedMeal.id ? savedMeal : m));
      }
    } catch (error) {
      console.error("Error adding food to meal:", error);
      toast({
        title: "Erro ao adicionar alimento",
        description: "Não foi possível adicionar o alimento à refeição.",
        variant: "destructive",
      });
    }
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
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [formattedDate, user]);

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Dieta Diária</h2>
        <Button 
          variant="outline" 
          size="icon"
          className="rounded-full"
          onClick={() => setShowSettings(true)}
        >
          <Settings2 className="h-5 w-5" />
        </Button>
      </div>

      <DateSelector
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p>Carregando dados...</p>
        </div>
      ) : (
        <>
          <Card className="p-6 mb-6 bg-card">
            <div className="grid gap-4">
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <p className="text-sm text-muted-foreground">Calorias Diárias</p>
                  <p className="text-xs text-muted-foreground">{totals.calories} / {nutritionGoals.calories} kcal</p>
                </div>
                <MacroProgressBar
                  current={totals.calories}
                  goal={nutritionGoals.calories}
                  color="bg-diet"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <p className="text-sm text-muted-foreground">Proteínas</p>
                  <p className="text-xs text-muted-foreground">{totals.protein}g / {nutritionGoals.protein}g</p>
                </div>
                <MacroProgressBar
                  current={totals.protein}
                  goal={nutritionGoals.protein}
                  color="bg-red-500"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <p className="text-sm text-muted-foreground">Carboidratos</p>
                  <p className="text-xs text-muted-foreground">{totals.carbs}g / {nutritionGoals.carbs}g</p>
                </div>
                <MacroProgressBar
                  current={totals.carbs}
                  goal={nutritionGoals.carbs}
                  color="bg-yellow-500"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <p className="text-sm text-muted-foreground">Gorduras</p>
                  <p className="text-xs text-muted-foreground">{totals.fats}g / {nutritionGoals.fats}g</p>
                </div>
                <MacroProgressBar
                  current={totals.fats}
                  goal={nutritionGoals.fats}
                  color="bg-blue-500"
                />
              </div>
            </div>
          </Card>

          <WaterTracker 
            waterIntake={waterIntake}
            waterGoal={nutritionGoals.waterIntake}
            onAddWater={handleAddWater}
          />

          <div className="grid gap-4">
            {meals.map((meal) => (
              <MealSlot
                key={meal.id || meal.title}
                meal={meal}
                onAddFood={handleOpenAddFoodModal}
                onEditFood={handleEditFood}
                onDeleteFood={handleDeleteFood}
              />
            ))}
          </div>
        </>
      )}

      <AlertDialog open={showSettings} onOpenChange={setShowSettings}>
        <NutritionGoalsSettings
          goals={nutritionGoals}
          onUpdateGoals={handleUpdateGoals}
          onClose={() => setShowSettings(false)}
        />
      </AlertDialog>

      <AddFoodModal
        open={addFoodModalOpen}
        onClose={() => setAddFoodModalOpen(false)}
        onAddFood={handleAddFoodToMeal}
        editingFood={editingFood}
        mealTitle={selectedMealTitle || undefined}
      />
    </div>
  );
};

export default Diet;
