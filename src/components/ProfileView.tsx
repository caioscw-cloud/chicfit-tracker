
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Calendar, Trophy, Plus, Pencil, User, Image, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

interface WeightEntry {
  date: string;
  weight: number;
}

interface ProfileData {
  name: string;
  bio: string;
  avatar: string;
  streak: number;
  cardioTime: number;
}

const initialWeightData: WeightEntry[] = [
  { date: "Jan", weight: 70 },
  { date: "Feb", weight: 69 },
  { date: "Mar", weight: 68.5 },
  { date: "Apr", weight: 68 },
  { date: "May", weight: 67.5 },
];

const defaultProfileData: ProfileData = {
  name: "João Fitness",
  bio: "Dedicado a alcançar o máximo desempenho através de treino consistente e nutrição adequada. Comecei minha jornada fitness em 2022 e nunca olhei para trás. Apaixonado por musculação e por ajudar outros a alcançarem seus objetivos fitness.",
  avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
  streak: 24,
  cardioTime: 18,
};

const ProfileView = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [weightData, setWeightData] = useState<WeightEntry[]>(initialWeightData);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [editingWeight, setEditingWeight] = useState<WeightEntry | null>(null);
  
  // Adding state for profile editing
  const [profileData, setProfileData] = useState<ProfileData>(() => {
    const savedData = localStorage.getItem('profileData');
    return savedData ? JSON.parse(savedData) : defaultProfileData;
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfileData, setTempProfileData] = useState<ProfileData>(profileData);
  const [activeTab, setActiveTab] = useState("stats");

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

  const handleSaveProfile = () => {
    setProfileData(tempProfileData);
    localStorage.setItem('profileData', JSON.stringify(tempProfileData));
    setIsEditing(false);
    
    toast({
      title: "Perfil atualizado",
      description: "Suas informações de perfil foram atualizadas com sucesso.",
    });
  };

  const handleCancelEdit = () => {
    setTempProfileData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="animate-fade-up space-y-6">
      {!isEditing ? (
        <div className="text-center mb-8 relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-workout to-diet mx-auto mb-4 overflow-hidden">
            <img
              src={profileData.avatar}
              alt="Perfil"
              className="w-full h-full object-cover"
            />
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-0 right-0 md:right-1/4" 
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <h2 className="text-2xl font-bold">{profileData.name}</h2>
          <p className="text-muted-foreground">
            {user?.email || "Entusiasta do Fitness"}
          </p>
        </div>
      ) : (
        <div className="space-y-4 bg-card p-6 rounded-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Editar Perfil</h2>
            <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-workout to-diet overflow-hidden">
                <img
                  src={tempProfileData.avatar}
                  alt="Perfil"
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full bg-background"
                onClick={() => {
                  const newAvatar = prompt("Insira a URL da nova imagem:", tempProfileData.avatar);
                  if (newAvatar) {
                    setTempProfileData({...tempProfileData, avatar: newAvatar});
                  }
                }}
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="w-full space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Nome</label>
                <Input 
                  value={tempProfileData.name} 
                  onChange={(e) => setTempProfileData({...tempProfileData, name: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">Bio</label>
                <Textarea 
                  value={tempProfileData.bio} 
                  onChange={(e) => setTempProfileData({...tempProfileData, bio: e.target.value})}
                  className="mt-1"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Sequência de Treinos (dias)</label>
                  <Input 
                    type="number" 
                    value={tempProfileData.streak} 
                    onChange={(e) => setTempProfileData({...tempProfileData, streak: parseInt(e.target.value) || 0})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Tempo de Cardio (horas)</label>
                  <Input 
                    type="number" 
                    value={tempProfileData.cardioTime} 
                    onChange={(e) => setTempProfileData({...tempProfileData, cardioTime: parseInt(e.target.value) || 0})}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <Button className="w-full" onClick={handleSaveProfile}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      )}

      {!isEditing && (
        <>
          <Card className="p-6 bg-card">
            <p className="text-sm leading-relaxed text-muted-foreground">
              "{profileData.bio}"
            </p>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
              <TabsTrigger value="photos">Fotos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="stats" className="space-y-4 mt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="p-4 bg-card">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-workout/10">
                      <Trophy className="w-5 h-5 text-workout" />
                    </div>
                    <div>
                      <h3 className="text-sm text-muted-foreground">Sequência de Treinos</h3>
                      <p className="text-2xl font-semibold">{profileData.streak} Dias</p>
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
                      <p className="text-2xl font-semibold">{profileData.cardioTime} Horas</p>
                    </div>
                  </div>
                </Card>
              </div>

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
            </TabsContent>
            
            <TabsContent value="photos" className="mt-4">
              <Card className="p-6 bg-card">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Fotos de Progresso</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => {
                      const newPhotoUrl = prompt("Insira a URL da nova foto:");
                      if (newPhotoUrl) {
                        toast({
                          title: "Foto adicionada",
                          description: "Nova foto de progresso adicionada com sucesso.",
                        });
                      }
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Foto
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square rounded-lg bg-muted overflow-hidden relative group">
                      <img
                        src={`https://images.unsplash.com/photo-167${i}332755192-727a05c4013d?w=200&h=200&fit=crop`}
                        alt={`Foto de progresso ${i}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" className="rounded-full bg-background/20 hover:bg-background/40">
                          <X className="w-4 h-4 text-white" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {showWeightModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
