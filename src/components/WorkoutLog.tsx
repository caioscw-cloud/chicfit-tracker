
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const WorkoutLog = () => {
  return (
    <div className="animate-fade-up space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Workout Log</h2>
        <Button variant="outline" className="rounded-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Workout
        </Button>
      </div>
      <div className="grid gap-4">
        <Card className="p-4 bg-card hover:bg-card-hover transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Today</p>
              <h3 className="text-lg font-medium">Upper Body Strength</h3>
              <p className="text-sm text-muted-foreground">45 minutes • 350 cal</p>
            </div>
            <span className="px-2 py-1 bg-workout/10 text-workout rounded-full text-xs">
              Completed
            </span>
          </div>
        </Card>
        {/* Example of a previous workout */}
        <Card className="p-4 bg-card hover:bg-card-hover transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Yesterday</p>
              <h3 className="text-lg font-medium">HIIT Cardio</h3>
              <p className="text-sm text-muted-foreground">30 minutes • 280 cal</p>
            </div>
            <span className="px-2 py-1 bg-workout/10 text-workout rounded-full text-xs">
              Completed
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WorkoutLog;
