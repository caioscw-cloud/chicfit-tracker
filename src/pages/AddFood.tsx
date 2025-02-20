
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, Plus } from "lucide-react";

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  image: string;
}

const commonFoods: FoodItem[] = [
  {
    id: "1",
    name: "Arroz Branco",
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fats: 0.3,
    image: "https://images.unsplash.com/photo-1618160146253-016aa8920e46?w=200&h=200&fit=crop"
  },
  {
    id: "2",
    name: "Feijão Carioca",
    calories: 77,
    protein: 4.8,
    carbs: 14,
    fats: 0.5,
    image: "https://images.unsplash.com/photo-1612257996916-c5c7c2daa8f7?w=200&h=200&fit=crop"
  },
  {
    id: "3",
    name: "Peito de Frango",
    calories: 165,
    protein: 31,
    carbs: 0,
    fats: 3.6,
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82c00?w=200&h=200&fit=crop"
  },
];

const AddFood = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const filteredFoods = commonFoods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredFoods.map((food) => (
            <Card
              key={food.id}
              className="overflow-hidden hover:bg-card-hover transition-colors cursor-pointer"
              onClick={() => setSelectedFood(food)}
            >
              <div className="aspect-square relative">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">{food.name}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>
                    <p>{food.calories} kcal</p>
                    <p>{food.protein}g proteína</p>
                  </div>
                  <div>
                    <p>{food.carbs}g carboidratos</p>
                    <p>{food.fats}g gorduras</p>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {selectedFood && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="max-w-lg w-full p-6">
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
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={selectedFood.image}
                    alt={selectedFood.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium">{selectedFood.calories} kcal</p>
                  <p>Proteína: {selectedFood.protein}g</p>
                  <p>Carboidratos: {selectedFood.carbs}g</p>
                  <p>Gorduras: {selectedFood.fats}g</p>
                </div>
              </div>
              <div className="space-y-4">
                <Input
                  type="number"
                  placeholder="Quantidade (g)"
                  className="w-full"
                />
                <Button className="w-full">
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
