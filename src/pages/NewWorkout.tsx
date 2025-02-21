
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, X, Clock, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest: number;
}

const NewWorkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [routineName, setRoutineName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState({
    name: "",
    sets: 3,
    reps: 12,
    rest: 60
  });

  const handleAddExercise = () => {
    if (!currentExercise.name) {
      toast({
        title: "Nome do exercício necessário",
        description: "Por favor, insira o nome do exercício.",
        variant: "destructive"
      });
      return;
    }

    setExercises([...exercises, { 
      id: Date.now().toString(),
      ...currentExercise 
    }]);
    setCurrentExercise({
      name: "",
      sets: 3,
      reps: 12,
      rest: 60
    });
  };

  const handleSaveRoutine = () => {
    if (!routineName) {
      toast({
        title: "Nome da rotina necessário",
        description: "Por favor, dê um nome para sua rotina.",
        variant: "destructive"
      });
      return;
    }

    if (exercises.length === 0) {
      toast({
        title: "Exercícios necessários",
        description: "Adicione pelo menos um exercício à rotina.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Rotina salva",
      description: `A rotina "${routineName}" foi salva com sucesso.`
    });
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-semibold">Nova Rotina</h1>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-card">
            <Input
              placeholder="Nome da Rotina"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              className="text-lg font-medium mb-4"
            />
            
            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <Card key={exercise.id} className="p-4 bg-muted">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{exercise.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {exercise.sets} séries × {exercise.reps} reps • {exercise.rest}s descanso
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setExercises(exercises.filter((_, i) => i !== index))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-4 space-y-4">
              <Input
                placeholder="Nome do Exercício"
                value={currentExercise.name}
                onChange={(e) => setCurrentExercise({ ...currentExercise, name: e.target.value })}
              />
              <div className="grid grid-cols-3 gap-4">
                <Input
                  type="number"
                  placeholder="Séries"
                  value={currentExercise.sets}
                  onChange={(e) => setCurrentExercise({ ...currentExercise, sets: parseInt(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="Repetições"
                  value={currentExercise.reps}
                  onChange={(e) => setCurrentExercise({ ...currentExercise, reps: parseInt(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="Descanso (s)"
                  value={currentExercise.rest}
                  onChange={(e) => setCurrentExercise({ ...currentExercise, rest: parseInt(e.target.value) })}
                />
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleAddExercise}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Exercício
              </Button>
            </div>
          </Card>

          <Button 
            className="w-full"
            onClick={handleSaveRoutine}
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Rotina
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewWorkout;
