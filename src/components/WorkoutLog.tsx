
import { Card } from "@/components/ui/card";
import { Play, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const WorkoutRoutine = ({ name, exercises, duration, calories }) => (
  <Card className="p-4 bg-card hover:bg-card-hover transition-colors">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-medium">{name}</h3>
        <p className="text-sm text-muted-foreground">{exercises} exercises • {duration} min • {calories} cal</p>
        <div className="mt-2 text-sm text-muted-foreground">
          Next: Bench Press, Shoulder Press...
        </div>
      </div>
      <Button variant="outline" size="icon" className="rounded-full">
        <Play className="w-4 h-4" />
      </Button>
    </div>
  </Card>
);

const CompletedWorkout = ({ name, time, duration, calories }) => (
  <Card className="p-4 bg-card hover:bg-card-hover transition-colors">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-muted-foreground">{time}</p>
        <h3 className="text-lg font-medium">{name}</h3>
        <p className="text-sm text-muted-foreground">{duration} min • {calories} cal</p>
      </div>
      <span className="px-2 py-1 bg-workout/10 text-workout rounded-full text-xs">
        Completed
      </span>
    </div>
  </Card>
);

const WorkoutLog = () => {
  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Workout Log</h2>
        <Button variant="outline" className="rounded-full">
          <Plus className="w-4 h-4 mr-2" />
          New Routine
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Your Routines</h3>
          <div className="grid gap-4">
            <WorkoutRoutine name="Upper Body Power" exercises={8} duration={45} calories={350} />
            <WorkoutRoutine name="Lower Body Focus" exercises={6} duration={40} calories={300} />
            <Button variant="outline" className="w-full justify-between">
              View All Routines
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Recent Workouts</h3>
          <div className="grid gap-4">
            <CompletedWorkout 
              name="Upper Body Power"
              time="Today"
              duration={45}
              calories={350}
            />
            <CompletedWorkout 
              name="HIIT Cardio"
              time="Yesterday"
              duration={30}
              calories={280}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutLog;
