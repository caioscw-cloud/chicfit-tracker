
import { Card } from "@/components/ui/card";
import { NutritionGoals } from "@/services/mealService";

interface MacroProgressBarProps {
  current: number;
  goal: number;
  color: string;
}

export const MacroProgressBar = ({ current, goal, color }: MacroProgressBarProps) => {
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

interface MacroDisplayProps {
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    waterIntake: number;
  };
  goals: NutritionGoals;
}

const MacroDisplay = ({ totals, goals }: MacroDisplayProps) => (
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

export default MacroDisplay;
