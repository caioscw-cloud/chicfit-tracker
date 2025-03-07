
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
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

interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  waterIntake: number;
}

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  quantity: number;
}

interface Meal {
  title: string;
  time: string;
  foods: FoodItem[];
}

const DEFAULT_GOALS: NutritionGoals = {
  calories: 2500,
  protein: 180,
  carbs: 300,
  fats: 70,
  waterIntake: 3000
};

const DEFAULT_MEALS: Meal[] = [
  { title: "Café da Manhã", time: "07:00", foods: [] },
  { title: "Lanche da Manhã", time: "10:00", foods: [] },
  { title: "Almoço", time: "13:00", foods: [] },
  { title: "Lanche da Tarde", time: "16:00", foods: [] },
  { title: "Jantar", time: "19:00", foods: [] },
  { title: "Ceia", time: "21:00", foods: [] }
];

// Progress bar component for macros
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

// Nutrition goals settings modal
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

  // Calculate calories based on macros
  const calculateCalories = (protein: number, carbs: number, fats: number) => {
    return (protein * 4) + (carbs * 4) + (fats * 9);
  };

  // Update calories when macros change
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
              max={500}
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
              max={500}
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
              max={200}
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

// Water tracker component
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

// Meal slot component
const MealSlot = ({ 
  meal, 
  onAddFood 
}: { 
  meal: Meal; 
  onAddFood: (mealTitle: string) => void 
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
            <Card key={food.id} className="p-3 bg-muted">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{food.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {food.quantity}g • {food.calories} cal • {food.protein}g prot
                  </p>
                </div>
              </div>
            </Card>
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

const Diet = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoals>(DEFAULT_GOALS);
  const [meals, setMeals] = useState<Meal[]>(DEFAULT_MEALS);
  const [waterIntake, setWaterIntake] = useState(0);

  // Check if user is logged in
  React.useEffect(() => {
    if (!user) {
      toast({
        title: "Autenticação necessária",
        description: "Faça login para acessar o registro de refeições.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, navigate, toast]);

  // Update nutrition goals
  const handleUpdateGoals = (goals: NutritionGoals) => {
    setNutritionGoals(goals);
  };

  // Add water intake
  const handleAddWater = (amount: number) => {
    setWaterIntake(prev => prev + amount);
  };

  // Add food to a meal
  const handleAddFood = (mealTitle: string) => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A adição de alimentos será implementada em breve.",
    });
  };

  // Calculate nutritional totals
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

      {/* Macro Tracker */}
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

      {/* Water Tracker */}
      <WaterTracker 
        waterIntake={waterIntake}
        waterGoal={nutritionGoals.waterIntake}
        onAddWater={handleAddWater}
      />

      {/* Meal Slots */}
      <div className="grid gap-4">
        {meals.map((meal) => (
          <MealSlot
            key={meal.title}
            meal={meal}
            onAddFood={handleAddFood}
          />
        ))}
      </div>

      {/* Settings Modal */}
      <AlertDialog open={showSettings} onOpenChange={setShowSettings}>
        <NutritionGoalsSettings
          goals={nutritionGoals}
          onUpdateGoals={handleUpdateGoals}
          onClose={() => setShowSettings(false)}
        />
      </AlertDialog>
    </div>
  );
};

export default Diet;
