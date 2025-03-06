
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { NutritionGoals } from '@/services/mealService';

interface NutritionGoalsSettingsProps {
  goals: NutritionGoals;
  onUpdateGoals: (goals: NutritionGoals) => void;
  onClose: () => void;
}

const NutritionGoalsSettings = ({ goals, onUpdateGoals, onClose }: NutritionGoalsSettingsProps) => {
  const [localGoals, setLocalGoals] = useState<NutritionGoals>(goals);
  const { toast } = useToast();

  // Função para calcular calorias com base nos macronutrientes
  const calculateCalories = (protein: number, carbs: number, fats: number) => {
    // 1g de proteína = 4 calorias
    // 1g de carboidrato = 4 calorias
    // 1g de gordura = 9 calorias
    return (protein * 4) + (carbs * 4) + (fats * 9);
  };

  // Atualiza as calorias quando os macronutrientes mudam
  useEffect(() => {
    const calculatedCalories = calculateCalories(
      localGoals.protein,
      localGoals.carbs,
      localGoals.fats
    );
    setLocalGoals(prevGoals => ({
      ...prevGoals,
      calories: calculatedCalories
    }));
  }, [localGoals.protein, localGoals.carbs, localGoals.fats]);

  const handleSave = () => {
    onUpdateGoals(localGoals);
    toast({
      title: "Metas atualizadas",
      description: "Suas metas nutricionais foram atualizadas com sucesso.",
    });
    onClose();
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Metas Nutricionais</AlertDialogTitle>
        <AlertDialogDescription>
          Configure suas metas diárias de macronutrientes. As calorias serão calculadas automaticamente.
        </AlertDialogDescription>
      </AlertDialogHeader>
      
      <Tabs defaultValue="macros">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="macros">Macronutrientes</TabsTrigger>
          <TabsTrigger value="water">Água</TabsTrigger>
        </TabsList>
        
        <TabsContent value="macros" className="space-y-4">
          <div className="mb-6">
            <p className="text-lg font-medium mb-2">Calorias Totais: {localGoals.calories} kcal</p>
            <p className="text-sm text-muted-foreground">
              Calculado automaticamente com base nos macronutrientes (P × 4 + C × 4 + G × 9)
            </p>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">
              Proteínas: {localGoals.protein}g ({(localGoals.protein * 4)} kcal)
            </label>
            <Slider
              value={[localGoals.protein]}
              onValueChange={([protein]) => setLocalGoals(prev => ({ ...prev, protein }))}
              max={1000}
              step={5}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">
              Carboidratos: {localGoals.carbs}g ({(localGoals.carbs * 4)} kcal)
            </label>
            <Slider
              value={[localGoals.carbs]}
              onValueChange={([carbs]) => setLocalGoals(prev => ({ ...prev, carbs }))}
              max={1000}
              step={5}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">
              Gorduras: {localGoals.fats}g ({(localGoals.fats * 9)} kcal)
            </label>
            <Slider
              value={[localGoals.fats]}
              onValueChange={([fats]) => setLocalGoals(prev => ({ ...prev, fats }))}
              max={1000}
              step={5}
              className="mt-2"
            />
          </div>
        </TabsContent>

        <TabsContent value="water" className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">
              Meta de Água: {localGoals.waterIntake}ml
            </label>
            <Slider
              value={[localGoals.waterIntake]}
              onValueChange={([waterIntake]) => setLocalGoals(prev => ({ ...prev, waterIntake }))}
              max={5000}
              step={100}
              className="mt-2"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Recomendações:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Homens: 3.7L por dia</li>
              <li>Mulheres: 2.7L por dia</li>
              <li>Atletas: +500-1000ml por hora de treino</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialogFooter>
        <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
        <Button onClick={handleSave}>Salvar Alterações</Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default NutritionGoalsSettings;
