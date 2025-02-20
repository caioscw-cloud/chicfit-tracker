
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const MacroDisplay = () => (
  <Card className="p-6 mb-6 bg-card">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Calorias Diárias</p>
        <p className="text-2xl font-semibold text-diet">2.340</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Proteínas</p>
        <p className="text-xl font-semibold">180g</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Carboidratos</p>
        <p className="text-xl font-semibold">220g</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Gorduras</p>
        <p className="text-xl font-semibold">65g</p>
      </div>
    </div>
  </Card>
);

const MealSlot = ({ title, time, calories = 0, protein = 0 }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="p-4 bg-card hover:bg-card-hover transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">{time}</p>
          <h3 className="text-lg font-medium">{title}</h3>
          {calories > 0 ? (
            <p className="text-sm text-muted-foreground">{calories} cal • {protein}g proteína</p>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => navigate('/add-food')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Alimento
            </Button>
          )}
        </div>
        {calories > 0 && (
          <span className="px-2 py-1 bg-diet/10 text-diet rounded-full text-xs">
            Registrado
          </span>
        )}
      </div>
    </Card>
  );
};

const MealLog = () => {
  return (
    <div className="animate-fade-up space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Registro de Refeições</h2>
      <MacroDisplay />
      <div className="grid gap-4">
        <MealSlot title="Café da Manhã" time="07:00" calories={320} protein={24} />
        <MealSlot title="Lanche da Manhã" time="10:00" />
        <MealSlot title="Almoço" time="13:00" calories={450} protein={35} />
        <MealSlot title="Lanche da Tarde" time="16:00" />
        <MealSlot title="Jantar" time="19:00" />
        <MealSlot title="Ceia" time="21:00" />
      </div>
    </div>
  );
};

export default MealLog;
