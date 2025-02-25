import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, X, ChevronDown, ChevronUp, Save, Search, Trophy, Clock, Scale, Trash2, FileText, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Set {
  id: string;
  type: 'work' | 'preparatory' | 'warmup' | 'failure' | 'drop';
  weight: number;
  reps: number;
  rest: number;
  dropSetWeights?: number[];
  dropSetReps?: number[];
}

interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  equipment?: string;
  previousWeight?: number;
  personalRecord?: number;
  targetMuscles?: string[];
  notes?: string;
}

interface ExerciseLibraryItem {
  name: string;
  targetMuscles: string[];
  description: string;
  beginnerRange: { min: number; max: number };
  intermediateRange: { min: number; max: number };
  advancedRange: { min: number; max: number };
}

interface CustomExercise extends ExerciseLibraryItem {
  isCustom: true;
  notes?: string;
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
];

const customExercises: CustomExercise[] = [];

const SetTypeInfo = {
  work: {
    label: "Série Normal",
    description: "Série padrão para desenvolvimento muscular e força"
  },
  preparatory: {
    label: "Série Preparatória",
    description: "Série leve para preparar os músculos para cargas maiores"
  },
  warmup: {
    label: "Aquecimento",
    description: "Série mais leve focada em aquecer os músculos"
  },
  failure: {
    label: "Falha",
    description: "Série executada até a falha muscular"
  },
  drop: {
    label: "Drop Set",
    description: "Série com redução progressiva de peso sem descanso"
  }
};

const SetInput = ({ set, onUpdate, onDelete, isLast }) => {
  const [showDropSets, setShowDropSets] = useState(false);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-5 gap-2 items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Select
                value={set.type}
                onValueChange={(value: Set['type']) => onUpdate({ ...set, type: value })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SetTypeInfo).map(([type, info]) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        {info.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TooltipTrigger>
            <TooltipContent>
              <p>{SetTypeInfo[set.type].description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

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

      {set.type === 'drop' && (
        <div className="pl-4 border-l-2 border-primary/20">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-2"
            onClick={() => setShowDropSets(!showDropSets)}
          >
            {showDropSets ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
            Configurar Drop Sets
          </Button>
          
          {showDropSets && (
            <div className="space-y-2">
              {(set.dropSetWeights || []).map((weight, index) => (
                <div key={index} className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Peso (kg)"
                    value={weight || ""}
                    onChange={(e) => {
                      const newWeights = [...(set.dropSetWeights || [])];
                      newWeights[index] = parseFloat(e.target.value);
                      onUpdate({ ...set, dropSetWeights: newWeights });
                    }}
                    className="text-right"
                  />
                  <Input
                    type="number"
                    placeholder="Reps"
                    value={set.dropSetReps?.[index] || ""}
                    onChange={(e) => {
                      const newReps = [...(set.dropSetReps || [])];
                      newReps[index] = parseInt(e.target.value);
                      onUpdate({ ...set, dropSetReps: newReps });
                    }}
                    className="text-right"
                  />
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm"
                className="w-full"
                onClick={() => {
                  const newWeights = [...(set.dropSetWeights || []), 0];
                  const newReps = [...(set.dropSetReps || []), 0];
                  onUpdate({ ...set, dropSetWeights: newWeights, dropSetReps: newReps });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Drop Set
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CreateExerciseModal = ({ query, onSave, onClose }) => {
  const [name, setName] = useState(query);
  const [targetMuscles, setTargetMuscles] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [beginnerRange, setBeginnerRange] = useState({ min: 0, max: 0 });
  const [intermediateRange, setIntermediateRange] = useState({ min: 0, max: 0 });
  const [advancedRange, setAdvancedRange] = useState({ min: 0, max: 0 });
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    const newExercise: CustomExercise = {
      name,
      targetMuscles,
      description,
      beginnerRange,
      intermediateRange,
      advancedRange,
      isCustom: true,
      notes
    };
    
    customExercises.push(newExercise);
    onSave(newExercise);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Criar Novo Exercício</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Nome</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Músculos Trabalhados (separados por vírgula)</label>
            <Input
              value={targetMuscles.join(", ")}
              onChange={(e) => setTargetMuscles(e.target.value.split(",").map(s => s.trim()))}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Descrição</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Notas Pessoais</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1"
              rows={3}
              placeholder="Adicione dicas ou lembretes pessoais sobre este exercício..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Faixa Iniciante (kg)</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Input
                  type="number"
                  placeholder="Min"
                  value={beginnerRange.min}
                  onChange={(e) => setBeginnerRange({ ...beginnerRange, min: parseInt(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={beginnerRange.max}
                  onChange={(e) => setBeginnerRange({ ...beginnerRange, max: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Faixa Intermediário (kg)</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Input
                  type="number"
                  placeholder="Min"
                  value={intermediateRange.min}
                  onChange={(e) => setIntermediateRange({ ...intermediateRange, min: parseInt(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={intermediateRange.max}
                  onChange={(e) => setIntermediateRange({ ...intermediateRange, max: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <Button className="w-full" onClick={handleSave}>
            Salvar Exercício
          </Button>
        </div>
      </Card>
    </div>
  );
};

const ExerciseCard = ({ exercise, onUpdate, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [notes, setNotes] = useState(exercise.notes || "");
  
  const addSet = () => {
    const newSet: Set = {
      id: Date.now().toString(),
      type: 'work',
      weight: exercise.previousWeight || 0,
      reps: 12,
      rest: 60
    };
    onUpdate({
      ...exercise,
      sets: [...exercise.sets, newSet],
      notes
    });
  };

  const updateSet = (setId: string, updatedSet: Set) => {
    onUpdate({
      ...exercise,
      sets: exercise.sets.map(s => s.id === setId ? updatedSet : s),
      notes
    });
  };

  const deleteSet = (setId: string) => {
    onUpdate({
      ...exercise,
      sets: exercise.sets.filter(s => s.id !== setId),
      notes
    });
  };

  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
    onUpdate({
      ...exercise,
      notes: newNotes
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
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notas
              </label>
              <Textarea
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Adicione notas sobre este exercício..."
                className="min-h-[100px] bg-card"
              />
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
  const [showCreateExercise, setShowCreateExercise] = useState(false);

  const allExercises = [...exerciseLibrary, ...customExercises];
  const filteredExercises = allExercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddExercise = (exerciseInfo: ExerciseLibraryItem | CustomExercise) => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exerciseInfo.name,
      sets: [{
        id: Date.now().toString(),
        type: 'work',
        weight: exerciseInfo.beginnerRange.min,
        reps: 12,
        rest: 60
      }],
      targetMuscles: exerciseInfo.targetMuscles,
      previousWeight: exerciseInfo.beginnerRange.min,
      personalRecord: exerciseInfo.intermediateRange.max,
      notes: 'isCustom' in exerciseInfo ? exerciseInfo.notes : undefined
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
                    {filteredExercises.length === 0 && (
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-workout"
                        onClick={() => setShowCreateExercise(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Criar "{searchQuery}"
                      </Button>
                    )}
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

      {showCreateExercise && (
        <CreateExerciseModal
          query={searchQuery}
          onSave={(exercise) => {
            handleAddExercise(exercise);
            setShowCreateExercise(false);
          }}
          onClose={() => setShowCreateExercise(false)}
        />
      )}
    </div>
  );
};

export default NewWorkout;
