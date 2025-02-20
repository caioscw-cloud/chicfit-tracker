
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const MacroDisplay = () => (
  <Card className="p-6 mb-6 bg-card">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Daily Calories</p>
        <p className="text-2xl font-semibold text-diet">2,340</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Protein</p>
        <p className="text-xl font-semibold">180g</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Carbs</p>
        <p className="text-xl font-semibold">220g</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Fats</p>
        <p className="text-xl font-semibold">65g</p>
      </div>
    </div>
  </Card>
);

const MealSlot = ({ title, time, calories = 0, protein = 0 }) => (
  <Card className="p-4 bg-card hover:bg-card-hover transition-colors">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-muted-foreground">{time}</p>
        <h3 className="text-lg font-medium">{title}</h3>
        {calories > 0 ? (
          <p className="text-sm text-muted-foreground">{calories} cal • {protein}g protein</p>
        ) : (
          <Button variant="outline" size="sm" className="mt-2">
            <Plus className="w-4 h-4 mr-2" />
            Add Meal
          </Button>
        )}
      </div>
      {calories > 0 && (
        <span className="px-2 py-1 bg-diet/10 text-diet rounded-full text-xs">
          Logged
        </span>
      )}
    </div>
  </Card>
);

const MealLog = () => {
  return (
    <div className="animate-fade-up space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Meal Log</h2>
      <MacroDisplay />
      <div className="grid gap-4">
        <MealSlot title="Breakfast" time="7:00 AM" calories={320} protein={24} />
        <MealSlot title="Morning Snack" time="10:00 AM" />
        <MealSlot title="Lunch" time="1:00 PM" calories={450} protein={35} />
        <MealSlot title="Afternoon Snack" time="4:00 PM" />
        <MealSlot title="Dinner" time="7:00 PM" />
        <MealSlot title="Evening Snack" time="9:00 PM" />
      </div>
    </div>
  );
};

export default MealLog;
