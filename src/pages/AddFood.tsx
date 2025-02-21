
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

const commonFoods: FoodItem[] = [
  {
    id: "1",
    name: "Arroz Branco",
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fats: 0.3,
  },
  {
    id: "2",
    name: "Feijão Carioca",
    calories: 77,
    protein: 4.8,
    carbs: 14,
    fats: 0.5,
  },
  {
    id: "3",
    name: "Peito de Frango",
    calories: 165,
    protein: 31,
    carbs: 0,
    fats: 3.6,
  },
];

const AddFood = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState("");

  const filteredFoods = commonFoods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToMeal = () => {
    if (!quantity) {
      toast({
        title: "Quantidade necessária",
        description: "Por favor, insira a quantidade em gramas.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Alimento adicionado",
      description: `${selectedFood?.name} (${quantity}g) foi adicionado à sua refeição.`,
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
          <h1 className="text-2xl font-semibold">Adicionar Alimento</h1>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Buscar alimentos..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-4">
          {filteredFoods.map((food) => (
            <Card
              key={food.id}
              className="p-4 hover:bg-card-hover transition-colors cursor-pointer"
              onClick={() => setSelectedFood(food)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{food.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {food.calories} kcal • {food.protein}g prot • {food.carbs}g carb • {food.fats}g gord
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {selectedFood && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{selectedFood.name}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFood(null)}
                >
                  ✕
                </Button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Calorias</p>
                    <p className="text-lg font-medium">{selectedFood.calories} kcal</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Proteínas</p>
                    <p className="text-lg font-medium">{selectedFood.protein}g</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Carboidratos</p>
                    <p className="text-lg font-medium">{selectedFood.carbs}g</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gorduras</p>
                    <p className="text-lg font-medium">{selectedFood.fats}g</p>
                  </div>
                </div>
                <Input
                  type="number"
                  placeholder="Quantidade (g)"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full"
                />
                <Button className="w-full" onClick={handleAddToMeal}>
                  Adicionar à Refeição
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddFood;
