import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Plus, X, Edit2, Settings2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface Meal {
  title: string;
  time: string;
  foods: FoodItem[];
}

interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  waterIntake: number;
}

const MacroProgressBar = ({ current, goal, color }) => {
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

const MacroDisplay = ({ totals, goals }) => (
  <Card className="p-6 mb-6 bg-card">
    <div className="grid gap-4">
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <p className="text-sm text-muted-foreground">Calorias Diárias</p>
          <p className="text-xs text-muted-foreground">{totals.calories} / {goals.calories} kcal</p>
        </div>
        <MacroProgressBar
          current={totals.calories}
          goal={goals.calories}
          color="bg-diet"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <p className="text-sm text-muted-foreground">Proteínas</p>
          <p className="text-xs text-muted-foreground">{totals.protein}g / {goals.protein}g</p>
        </div>
        <MacroProgressBar
          current={totals.protein}
          goal={goals.protein}
          color="bg-red-500"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <p className="text-sm text-muted-foreground">Carboidratos</p>
          <p className="text-xs text-muted-foreground">{totals.carbs}g / {goals.carbs}g</p>
        </div>
        <MacroProgressBar
          current={totals.carbs}
          goal={goals.carbs}
          color="bg-yellow-500"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <p className="text-sm text-muted-foreground">Gorduras</p>
          <p className="text-xs text-muted-foreground">{totals.fats}g / {goals.fats}g</p>
        </div>
        <MacroProgressBar
          current={totals.fats}
          goal={goals.fats}
          color="bg-blue-500"
        />
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-2">
          <p className="text-sm text-muted-foreground">Água</p>
          <p className="text-xs text-muted-foreground">{totals.waterIntake}ml / {goals.waterIntake}ml</p>
        </div>
        <MacroProgressBar
          current={totals.waterIntake}
          goal={goals.waterIntake}
          color="bg-cyan-500"
        />
      </div>
    </div>
  </Card>
);

const NutritionGoalsSettings = ({ goals, onUpdateGoals, onClose }) => {
  const [localGoals, setLocalGoals] = useState<NutritionGoals>(goals);
  const { toast } = useToast();

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
      </AlertDialogHeader>
      
      <Tabs defaultValue="calories">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calories">Calorias & Macros</TabsTrigger>
          <TabsTrigger value="water">Água</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calories" className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">
              Calorias Diárias: {localGoals.calories} kcal
            </label>
            <Slider
              value={[localGoals.calories]}
              onValueChange={([calories]) => setLocalGoals({ ...localGoals, calories })}
              max={5000}
              step={50}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">
              Proteínas: {localGoals.protein}g
            </label>
            <Slider
              value={[localGoals.protein]}
              onValueChange={([protein]) => setLocalGoals({ ...localGoals, protein })}
              max={300}
              step={5}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">
              Carboidratos: {localGoals.carbs}g
            </label>
            <Slider
              value={[localGoals.carbs]}
              onValueChange={([carbs]) => setLocalGoals({ ...localGoals, carbs })}
              max={500}
              step={5}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">
              Gorduras: {localGoals.fats}g
            </label>
            <Slider
              value={[localGoals.fats]}
              onValueChange={([fats]) => setLocalGoals({ ...localGoals, fats })}
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
              onValueChange={([waterIntake]) => setLocalGoals({ ...localGoals, waterIntake })}
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

const WaterTracker = ({ totals, goals, onUpdate }) => {
  const addWater = (amount: number) => {
    onUpdate(totals.waterIntake + amount);
  };

  return (
    <Card className="p-4 bg-card mb-6">
      <h3 className="text-lg font-medium mb-3">Consumo de Água</h3>
      <MacroProgressBar
        current={totals.waterIntake}
        goal={goals.waterIntake}
        color="bg-cyan-500"
      />
      <div className="mt-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => addWater(200)}
        >
          +200ml
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => addWater(300)}
        >
          +300ml
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => addWater(500)}
        >
          +500ml
        </Button>
      </div>
    </Card>
  );
};

const FoodItemCard = ({ food, onEdit, onDelete }) => (
  <Card className="p-3 bg-muted hover:bg-card-hover transition-colors cursor-pointer">
    <div className="flex justify-between items-start">
      <div>
        <p className="font-medium">{food.name}</p>
        <p className="text-sm text-muted-foreground">
          {food.quantity}g • {food.calories} cal • {food.protein}g prot
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
          onClick={onEdit}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
          onClick={onDelete}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </Card>
);

const MealSlot = ({ meal, onAddFood, onEditFood, onDeleteFood }) => {
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
              onEdit={() => onEditFood(meal.title, food)}
              onDelete={() => onDeleteFood(meal.title, food.id)}
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

const EditFoodModal = ({ food, onSave, onClose }) => {
  const [quantity, setQuantity] = useState(food.quantity.toString());
  const { toast } = useToast();

  const handleSave = () => {
    const newQuantity = parseInt(quantity);
    if (isNaN(newQuantity) || newQuantity <= 0) {
      toast({
        title: "Quantidade inválida",
        description: "Por favor, insira uma quantidade válida.",
        variant: "destructive",
      });
      return;
    }

    onSave({ ...food, quantity: newQuantity });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">{food.name}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Quantidade (g)</label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Calorias</p>
              <p className="font-medium">{food.calories} kcal</p>
            </div>
            <div>
              <p className="text-muted-foreground">Proteínas</p>
              <p className="font-medium">{food.protein}g</p>
            </div>
            <div>
              <p className="text-muted-foreground">Carboidratos</p>
              <p className="font-medium">{food.carbs}g</p>
            </div>
            <div>
              <p className="text-muted-foreground">Gorduras</p>
              <p className="font-medium">{food.fats}g</p>
            </div>
          </div>
          <Button className="w-full" onClick={handleSave}>
            Salvar Alterações
          </Button>
        </div>
      </Card>
    </div>
  );
};

const MealLog = () => {
  const navigate = useNavigate();
  const [meals, setMeals] = useState<Meal[]>([
    { title: "Café da Manhã", time: "07:00", foods: [] },
    { title: "Lanche da Manhã", time: "10:00", foods: [] },
    { title: "Almoço", time: "13:00", foods: [] },
    { title: "Lanche da Tarde", time: "16:00", foods: [] },
    { title: "Jantar", time: "19:00", foods: [] },
    { title: "Ceia", time: "21:00", foods: [] }
  ]);

  const [showSettings, setShowSettings] = useState(false);
  const [nutritionGoals, setNutritionGoals] = useState<NutritionGoals>({
    calories: 2500,
    protein: 180,
    carbs: 300,
    fats: 70,
    waterIntake: 3700
  });

  const [waterIntake, setWaterIntake] = useState(0);
  const [editingFood, setEditingFood] = useState<{ mealTitle: string; food: FoodItem } | null>(null);

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

  const handleAddFood = (mealTitle: string) => {
    navigate('/add-food');
  };

  const handleEditFood = (mealTitle: string, food: FoodItem) => {
    setEditingFood({ mealTitle, food });
  };

  const handleDeleteFood = (mealTitle: string, foodId: string) => {
    setMeals(meals.map(meal => 
      meal.title === mealTitle
        ? { ...meal, foods: meal.foods.filter(f => f.id !== foodId) }
        : meal
    ));
  };

  const handleSaveEdit = (updatedFood: FoodItem) => {
    if (!editingFood) return;

    setMeals(meals.map(meal =>
      meal.title === editingFood.mealTitle
        ? {
            ...meal,
            foods: meal.foods.map(food =>
              food.id === updatedFood.id ? updatedFood : food
            )
          }
        : meal
    ));
    setEditingFood(null);
  };

  const { toast } = useToast();

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

  React.useEffect(() => {
    checkNutritionGoals();
  }, [totals]);

  return (
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
        onUpdate={setWaterIntake}
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
          onUpdateGoals={setNutritionGoals}
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
  );
};

export default MealLog;
