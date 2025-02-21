import { useState } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Calendar, Trophy, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface WeightEntry {
  date: string;
  weight: number;
}

const initialWeightData: WeightEntry[] = [
  { date: "Jan", weight: 70 },
  { date: "Feb", weight: 69 },
  { date: "Mar", weight: 68.5 },
  { date: "Apr", weight: 68 },
  { date: "May", weight: 67.5 },
];

const ProfileView = () => {
  const { toast } = useToast();
  const [weightData, setWeightData] = useState<WeightEntry[]>(initialWeightData);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [editingWeight, setEditingWeight] = useState<WeightEntry | null>(null);

  const handleAddWeight = () => {
    const weight = parseFloat(newWeight);
    if (isNaN(weight) || weight <= 0) {
      toast({
        title: "Peso inválido",
        description: "Por favor, insira um peso válido.",
        variant: "destructive",
      });
      return;
    }

    const today = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const newEntry = {
      date: monthNames[today.getMonth()],
      weight: weight,
    };

    const updatedData = [...weightData, newEntry];
    setWeightData(updatedData);
    setShowWeightModal(false);
    setNewWeight("");

    const previousWeight = weightData[weightData.length - 1].weight;
    const difference = weight - previousWeight;
    
    toast({
      title: "Peso atualizado",
      description: `${difference > 0 ? "+" : ""}${difference.toFixed(1)}kg desde a última medição.`,
    });
  };

  return (
    <div className="animate-fade-up space-y-6">
      <div className="text-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-workout to-diet mx-auto mb-4 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"
            alt="Perfil"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-bold">João Fitness</h2>
        <p className="text-muted-foreground">Entusiasta do Fitness</p>
      </div>

      <Card className="p-6 bg-card">
        <p className="text-sm leading-relaxed text-muted-foreground">
          "Dedicado a alcançar o máximo desempenho através de treino consistente e nutrição adequada. 
          Comecei minha jornada fitness em 2022 e nunca olhei para trás. Apaixonado por musculação 
          e por ajudar outros a alcançarem seus objetivos fitness."
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-4 bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-workout/10">
              <Trophy className="w-5 h-5 text-workout" />
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground">Sequência de Treinos</h3>
              <p className="text-2xl font-semibold">24 Dias</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-diet/10">
              <Calendar className="w-5 h-5 text-diet" />
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground">Tempo de Cardio</h3>
              <p className="text-2xl font-semibold">18 Horas</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-card">
        <h3 className="text-lg font-medium mb-4">Fotos de Progresso</h3>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square rounded-lg bg-muted overflow-hidden">
              <img
                src={`https://images.unsplash.com/photo-167${i}332755192-727a05c4013d?w=200&h=200&fit=crop`}
                alt={`Foto de progresso ${i}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Progresso do Peso</h3>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setShowWeightModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Peso
          </Button>
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightData}>
              <XAxis
                dataKey="date"
                stroke="#A1A1AA"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#A1A1AA"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}kg`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A1A1A",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#BFA181"
                strokeWidth={2}
                dot={{ fill: "#BFA181", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {showWeightModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Adicionar Peso</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWeightModal(false)}
              >
                ✕
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Peso (kg)</label>
                <Input
                  type="number"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  step="0.1"
                  className="mt-1"
                />
              </div>
              <Button className="w-full" onClick={handleAddWeight}>
                Salvar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
