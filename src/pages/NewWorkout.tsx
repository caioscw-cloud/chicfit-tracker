
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, X, ChevronDown, ChevronUp, Save, Search, Trophy, Clock, Scale, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Set {
  id: string;
  weight: number;
  reps: number;
  rest: number;
}

interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  equipment?: string;
  previousWeight?: number;
  personalRecord?: number;
  targetMuscles?: string[];
}

interface ExerciseLibraryItem {
  name: string;
  targetMuscles: string[];
  description: string;
  beginnerRange: { min: number; max: number };
  intermediateRange: { min: number; max: number };
  advancedRange: { min: number; max: number };
}

const exerciseLibrary: ExerciseLibraryItem[] = [
  {
    name: "Supino Reto",
    targetMuscles: ["Peitoral", "Tríceps", "Ombro anterior"],
    description: "Exercício básico para desenvolvimento do peitoral",
    beginnerRange: { min: 20, max: 40 },
    intermediateRange: { min: 40, max: 80 },
    advancedRange: { min: 80, max: 150 }
  },
  {
    name: "Agachamento",
    targetMuscles: ["Quadríceps", "Glúteos", "Posterior"],
    description: "Exercício fundamental para membros inferiores",
    beginnerRange: { min: 40, max: 60 },
    intermediateRange: { min: 60, max: 100 },
    advancedRange: { min: 100, max: 200 }
  },
  // ... add more exercises
];

const SetInput = ({ set, onUpdate, onDelete, isLast }) => (
  <div className="grid grid-cols-4 gap-2 items-center">
    <Input
      type="number"
      placeholder="Peso (kg)"
      value={set.weight || ""}
      onChange={(e) => onUpdate({ ...set, weight: parseFloat(e.target.value) })}
      className="text-right"
    />
    <Input
      type="number"
      placeholder="Reps"
      value={set.reps || ""}
      onChange={(e) => onUpdate({ ...set, reps: parseInt(e.target.value) })}
      className="text-right"
    />
    <Input
      type="number"
      placeholder="Descanso (s)"
      value={set.rest || ""}
      onChange={(e) => onUpdate({ ...set, rest: parseInt(e.target.value) })}
      className="text-right"
    />
    <Button
      variant="ghost"
      size="icon"
      onClick={onDelete}
      className="h-8 w-8"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);

const ExerciseCard = ({ exercise, onUpdate, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const addSet = () => {
    const newSet: Set = {
      id: Date.now().toString(),
      weight: exercise.previousWeight || 0,
      reps: 12,
      rest: 60
    };
    onUpdate({
      ...exercise,
      sets: [...exercise.sets, newSet]
    });
  };

  const updateSet = (setId: string, updatedSet: Set) => {
    onUpdate({
      ...exercise,
      sets: exercise.sets.map(s => s.id === setId ? updatedSet : s)
    });
  };

  const deleteSet = (setId: string) => {
    onUpdate({
      ...exercise,
      sets: exercise.sets.filter(s => s.id !== setId)
    });
  };

  return (
    <Card className="p-4 bg-muted">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{exercise.name}</h3>
            <p className="text-sm text-muted-foreground">
              {exercise.targetMuscles?.join(", ")}
              {exercise.equipment && ` • ${exercise.equipment}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {exercise.personalRecord && (
              <span className="flex items-center gap-1 text-xs bg-workout/10 text-workout px-2 py-1 rounded-full">
                <Trophy className="w-3 h-3" />
                PR: {exercise.personalRecord}kg
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(exercise.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-3">
            {exercise.previousWeight && (
              <p className="text-sm text-muted-foreground">
                Último treino: {exercise.previousWeight}kg
              </p>
            )}
            
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                <div className="text-right px-3">Peso (kg)</div>
                <div className="text-right px-3">Reps</div>
                <div className="text-right px-3">Descanso (s)</div>
                <div></div>
              </div>
              {exercise.sets.map((set, index) => (
                <SetInput
                  key={set.id}
                  set={set}
                  onUpdate={(updatedSet) => updateSet(set.id, updatedSet)}
                  onDelete={() => deleteSet(set.id)}
                  isLast={index === exercise.sets.length - 1}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={addSet}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Série
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

const NewWorkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isRoutine = location.state?.type === 'routine';

  const [routineName, setRoutineName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExercises = exerciseLibrary.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddExercise = (exerciseInfo: ExerciseLibraryItem) => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exerciseInfo.name,
      sets: [{
        id: Date.now().toString(),
        weight: exerciseInfo.beginnerRange.min,
        reps: 12,
        rest: 60
      }],
      targetMuscles: exerciseInfo.targetMuscles,
      previousWeight: exerciseInfo.beginnerRange.min,
      personalRecord: exerciseInfo.intermediateRange.max
    };

    setExercises([...exercises, newExercise]);
    setSearchQuery("");
  };

  const handleUpdateExercise = (updatedExercise: Exercise) => {
    setExercises(exercises.map(ex =>
      ex.id === updatedExercise.id ? updatedExercise : ex
    ));
  };

  const handleDeleteExercise = (exerciseId: string) => {
    setExercises(exercises.filter(ex => ex.id !== exerciseId));
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

    // Calculate summary statistics
    const totalWeight = exercises.reduce((sum, exercise) =>
      sum + exercise.sets.reduce((setSum, set) => setSum + (set.weight * set.reps), 0), 0);

    const newPRs = exercises.filter(exercise =>
      Math.max(...exercise.sets.map(set => set.weight)) > (exercise.personalRecord || 0)
    ).length;

    toast({
      title: isRoutine ? "Rotina salva" : "Treino salvo",
      description: `${isRoutine ? `Rotina "${routineName}"` : "Treino"} salvo com sucesso. 
        Total: ${totalWeight}kg • ${newPRs} novo(s) PR(s)!`
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
              {exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onUpdate={handleUpdateExercise}
                  onDelete={handleDeleteExercise}
                />
              ))}
            </div>

            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar exercício"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {searchQuery && (
                  <Card className="absolute w-full mt-1 p-2 bg-card z-10 max-h-64 overflow-y-auto">
                    {filteredExercises.map((exercise) => (
                      <Button
                        key={exercise.name}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleAddExercise(exercise)}
                      >
                        <div className="text-left">
                          <div>{exercise.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {exercise.targetMuscles.join(", ")}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </Card>
                )}
              </div>
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
