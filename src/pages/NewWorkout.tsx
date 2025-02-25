
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, X, Clock, Save, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest: number;
  equipment?: string;
}

const NewWorkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isRoutine = location.state?.type === 'routine';

  const [routineName, setRoutineName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentExercise, setCurrentExercise] = useState({
    name: "",
    sets: 3,
    reps: 12,
    rest: 60,
    equipment: ""
  });

  const commonExercises = [
    "Supino Reto",
    "Agachamento",
    "Levantamento Terra",
    "Desenvolvimento",
    "Remada",
    "Rosca Direta",
    "Extensão Triceps",
    "Elevação Lateral"
  ].filter(name => 
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      rest: 60,
      equipment: ""
    });
    setSearchQuery("");
  };

  const handleSaveWorkout = () => {
    if (isRoutine && !routineName) {
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
        description: "Adicione pelo menos um exercício.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: isRoutine ? "Rotina salva" : "Treino salvo",
      description: isRoutine
        ? `A rotina "${routineName}" foi salva com sucesso.`
        : "Seu treino foi salvo com sucesso."
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
          <h1 className="text-2xl font-semibold">
            {isRoutine ? "Nova Rotina" : "Novo Treino"}
          </h1>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-card">
            {isRoutine && (
              <Input
                placeholder="Nome da Rotina"
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value)}
                className="text-lg font-medium mb-4"
              />
            )}
            
            <div className="space-y-4">
              {exercises.map((exercise, index) => (
                <Card key={exercise.id} className="p-4 bg-muted">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{exercise.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {exercise.sets} séries × {exercise.reps} reps • {exercise.rest}s descanso
                        {exercise.equipment && ` • ${exercise.equipment}`}
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar ou adicionar exercício"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentExercise(prev => ({ ...prev, name: e.target.value }));
                  }}
                  className="pl-10"
                />
                {searchQuery && (
                  <Card className="absolute w-full mt-1 p-2 bg-card z-10">
                    {commonExercises.map((exercise) => (
                      <Button
                        key={exercise}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          setCurrentExercise(prev => ({ ...prev, name: exercise }));
                          setSearchQuery("");
                        }}
                      >
                        {exercise}
                      </Button>
                    ))}
                  </Card>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                <Input
                  placeholder="Equipamento"
                  value={currentExercise.equipment}
                  onChange={(e) => setCurrentExercise({ ...currentExercise, equipment: e.target.value })}
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
            onClick={handleSaveWorkout}
          >
            <Save className="w-4 h-4 mr-2" />
            {isRoutine ? "Salvar Rotina" : "Salvar Treino"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewWorkout;
