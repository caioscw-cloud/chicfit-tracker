
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const MealLog = () => {
  return (
    <div className="animate-fade-up space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Meal Log</h2>
        <Button variant="outline" className="rounded-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Meal
        </Button>
      </div>
      <div className="grid gap-4">
        <Card className="p-4 bg-card hover:bg-card-hover transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Breakfast</p>
              <h3 className="text-lg font-medium">Protein Smoothie</h3>
              <p className="text-sm text-muted-foreground">320 cal • 24g protein</p>
            </div>
            <span className="px-2 py-1 bg-diet/10 text-diet rounded-full text-xs">
              Logged
            </span>
          </div>
        </Card>
        <Card className="p-4 bg-card hover:bg-card-hover transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Lunch</p>
              <h3 className="text-lg font-medium">Chicken Salad</h3>
              <p className="text-sm text-muted-foreground">450 cal • 35g protein</p>
            </div>
            <span className="px-2 py-1 bg-diet/10 text-diet rounded-full text-xs">
              Logged
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MealLog;
