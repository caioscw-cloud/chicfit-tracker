
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Plus, X, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

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

const MacroDisplay = ({ totals }) => (
  <Card className="p-6 mb-6 bg-card">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Calorias Diárias</p>
        <p className="text-2xl font-semibold text-diet">{totals.calories}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Proteínas</p>
        <p className="text-xl font-semibold">{totals.protein}g</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Carboidratos</p>
        <p className="text-xl font-semibold">{totals.carbs}g</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Gorduras</p>
        <p className="text-xl font-semibold">{totals.fats}g</p>
      </div>
    </div>
  </Card>
);

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

  return (
    <div className="animate-fade-up space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Registro de Refeições</h2>
      <MacroDisplay totals={totals} />
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
