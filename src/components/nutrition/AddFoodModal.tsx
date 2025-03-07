
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { FoodItem } from "@/services/mealService";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AddFoodModalProps {
  open: boolean;
  onClose: () => void;
  onAddFood: (food: FoodItem) => void;
}

const SAMPLE_FOODS: FoodItem[] = [
  {
    id: "1",
    name: "Frango Grelhado",
    calories: 165,
    protein: 31,
    carbs: 0,
    fats: 3.6,
    quantity: 100
  },
  {
    id: "2",
    name: "Arroz Branco",
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fats: 0.3,
    quantity: 100
  },
  {
    id: "3",
    name: "Batata Doce",
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fats: 0.1,
    quantity: 100
  },
  {
    id: "4",
    name: "Ovo (Inteiro)",
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fats: 11,
    quantity: 100
  },
  {
    id: "5",
    name: "Aveia",
    calories: 389,
    protein: 16.9,
    carbs: 66.3,
    fats: 6.9,
    quantity: 100
  }
];

const AddFoodModal = ({ open, onClose, onAddFood }: AddFoodModalProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState("100");
  const [customFood, setCustomFood] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Filter foods based on search query
  const filteredFoods = searchQuery.length > 0
    ? SAMPLE_FOODS.filter(food => 
        food.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : SAMPLE_FOODS;

  const handleAddToMeal = () => {
    if (!selectedFood) return;
    
    if (!quantity || isNaN(Number(quantity))) {
      toast({
        title: "Quantidade inválida",
        description: "Por favor, insira uma quantidade válida em gramas.",
        variant: "destructive",
      });
      return;
    }

    // Calculate nutritional values based on quantity
    const qtdMultiplier = parseInt(quantity) / 100;
    const newFood = {
      id: selectedFood.id,
      name: selectedFood.name,
      quantity: parseInt(quantity),
      calories: Math.round(selectedFood.calories * qtdMultiplier),
      protein: Math.round(selectedFood.protein * qtdMultiplier * 10) / 10,
      carbs: Math.round(selectedFood.carbs * qtdMultiplier * 10) / 10,
      fats: Math.round(selectedFood.fats * qtdMultiplier * 10) / 10,
    };

    onAddFood(newFood);
    
    toast({
      title: "Alimento adicionado",
      description: `${selectedFood.name} (${quantity}g) foi adicionado à refeição.`,
    });
    
    setSelectedFood(null);
    setQuantity("100");
    setSearchQuery("");
    onClose();
  };

  const handleAddCustomFood = () => {
    // Validate fields
    const { name, calories, protein, carbs, fats } = customFood;
    if (!name || !calories || !protein || !carbs || !fats) {
      toast({
        title: "Campos incompletos",
        description: "Preencha todos os campos do alimento personalizado.",
        variant: "destructive",
      });
      return;
    }

    // Create new custom food
    const newCustomFood: FoodItem = {
      id: `custom-${Date.now()}`,
      name,
      calories: parseInt(calories),
      protein: parseFloat(protein),
      carbs: parseFloat(carbs),
      fats: parseFloat(fats),
      quantity: 100,
    };

    setSelectedFood(newCustomFood);
    setShowCustomForm(false);
    
    toast({
      title: "Alimento criado",
      description: `${name} foi adicionado ao seu catálogo de alimentos.`,
    });
  };

  if (!open) return null;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Adicionar Alimento</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Buscar alimentos..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {!showCustomForm && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowCustomForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> 
              Adicionar alimento personalizado
            </Button>
          )}

          {showCustomForm && (
            <Card className="p-4">
              <h2 className="text-lg font-medium mb-4">Novo Alimento Personalizado</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">Nome</label>
                  <Input
                    value={customFood.name}
                    onChange={(e) => setCustomFood({...customFood, name: e.target.value})}
                    placeholder="Ex: Pão integral caseiro"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Calorias (kcal/100g)</label>
                    <Input
                      type="number"
                      value={customFood.calories}
                      onChange={(e) => setCustomFood({...customFood, calories: e.target.value})}
                      placeholder="Ex: 240"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Proteínas (g/100g)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={customFood.protein}
                      onChange={(e) => setCustomFood({...customFood, protein: e.target.value})}
                      placeholder="Ex: 8.4"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Carboidratos (g/100g)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={customFood.carbs}
                      onChange={(e) => setCustomFood({...customFood, carbs: e.target.value})}
                      placeholder="Ex: 45.3"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Gorduras (g/100g)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={customFood.fats}
                      onChange={(e) => setCustomFood({...customFood, fats: e.target.value})}
                      placeholder="Ex: 3.2"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="w-1/2"
                    onClick={() => setShowCustomForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className="w-1/2"
                    onClick={handleAddCustomFood}
                  >
                    Salvar Alimento
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <div className="grid gap-2 max-h-[30vh] overflow-y-auto">
            {filteredFoods.map((food) => (
              <Card
                key={food.id}
                className="p-3 hover:bg-card-hover transition-colors cursor-pointer"
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
            {searchQuery.length > 0 && filteredFoods.length === 0 && (
              <div className="text-center py-4">
                Nenhum alimento encontrado para "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        {selectedFood && (
          <div className="mt-4 border-t pt-4">
            <h3 className="font-medium mb-2">{selectedFood.name}</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
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
            <div className="mb-4">
              <label className="text-sm text-muted-foreground">Quantidade (g)</label>
              <Input
                type="number"
                placeholder="Quantidade (g)"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          {selectedFood && (
            <Button onClick={handleAddToMeal}>
              Adicionar à Refeição
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddFoodModal;
