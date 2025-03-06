
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MacroProgressBar } from "./MacroDisplay";
import { NutritionGoals } from "@/services/mealService";

interface WaterTrackerProps {
  totals: {
    waterIntake: number;
  };
  goals: NutritionGoals;
  onUpdate: (amount: number) => void;
}

const WaterTracker = ({ totals, goals, onUpdate }: WaterTrackerProps) => {
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

export default WaterTracker;
