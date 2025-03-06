
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FoodItem, Meal } from "@/services/mealService";

interface FoodItemCardProps {
  food: FoodItem;
  onEdit: () => void;
  onDelete: () => void;
}

export const FoodItemCard = ({ food, onEdit, onDelete }: FoodItemCardProps) => (
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </svg>
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
          onClick={onDelete}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </Button>
      </div>
    </div>
  </Card>
);

interface MealSlotProps {
  meal: Meal;
  onAddFood: (mealTitle: string) => void;
  onEditFood: (mealTitle: string, food: FoodItem) => void;
  onDeleteFood: (mealTitle: string, foodId: string) => void;
}

const MealSlot = ({ meal, onAddFood, onEditFood, onDeleteFood }: MealSlotProps) => {
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

export default MealSlot;
