
import { Card } from "@/components/ui/card";
import { Play, Plus, ChevronRight, Dumbbell, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest: number;
}

interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
  duration: number;
  calories: number;
}

const WorkoutRoutine = ({ name, exercises, duration, calories }) => (
  <Card className="p-4 bg-card hover:bg-card-hover transition-colors">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-medium">{name}</h3>
        <p className="text-sm text-muted-foreground">{exercises} exercícios • {duration} min • {calories} cal</p>
        <div className="mt-2 text-sm text-muted-foreground">
          Próximo: Supino, Desenvolvimento...
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
        Concluído
      </span>
    </div>
  </Card>
);

const WorkoutLog = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNewWorkout = () => {
    navigate('/new-workout', { state: { type: 'single' } });
  };

  const handleNewRoutine = () => {
    navigate('/new-workout', { state: { type: 'routine' } });
  };

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold">Registro de Treino</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto rounded-full"
            onClick={handleNewRoutine}
          >
            <Save className="w-4 h-4 mr-2" />
            Nova Rotina
          </Button>
          <Button 
            variant="default"
            className="w-full sm:w-auto rounded-full"
            onClick={handleNewWorkout}
          >
            <Dumbbell className="w-4 h-4 mr-2" />
            Criar Novo Treino
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Suas Rotinas</h3>
          <div className="grid gap-4">
            <WorkoutRoutine name="Treino Superior" exercises={8} duration={45} calories={350} />
            <WorkoutRoutine name="Treino Inferior" exercises={6} duration={40} calories={300} />
            <Button variant="outline" className="w-full justify-between">
              Ver Todas as Rotinas
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Treinos Recentes</h3>
          <div className="grid gap-4">
            <CompletedWorkout 
              name="Treino Superior"
              time="Hoje"
              duration={45}
              calories={350}
            />
            <CompletedWorkout 
              name="Cardio HIIT"
              time="Ontem"
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
