
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Pencil } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { FoodItem, searchFoods, addCustomFood } from "@/services/mealService";
import { useAuth } from "@/hooks/useAuth";
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
  editingFood?: FoodItem;
  mealTitle?: string;
}

const AddFoodModal = ({ open, onClose, onAddFood, editingFood, mealTitle }: AddFoodModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(editingFood || null);
  const [quantity, setQuantity] = useState(editingFood ? String(editingFood.quantity) : "100");
  const [isSearching, setIsSearching] = useState(false);
  const [customFood, setCustomFood] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Search for foods
  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchFoods(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching foods:", error);
      toast({
        title: "Erro ao buscar alimentos",
        description: "Não foi possível encontrar alimentos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  React.useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        handleSearch(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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
      title: editingFood ? "Alimento atualizado" : "Alimento adicionado",
      description: `${selectedFood.name} (${quantity}g) foi ${editingFood ? 'atualizado' : 'adicionado'} à refeição ${mealTitle ? mealTitle : ""}.`,
    });
    
    setSelectedFood(null);
    setQuantity("100");
    setSearchQuery("");
    onClose();
  };

  const handleAddCustomFood = async () => {
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

    if (!user) {
      toast({
        title: "Usuário não autenticado",
        description: "Você precisa estar logado para adicionar alimentos personalizados.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create new custom food
      const newCustomFoodData = {
        name,
        calories: parseInt(calories),
        protein: parseFloat(protein),
        carbs: parseFloat(carbs),
        fats: parseFloat(fats),
        quantity: 100,
      };

      const savedFood = await addCustomFood(newCustomFoodData, user.id);
      
      if (!savedFood) {
        throw new Error("Erro ao salvar alimento personalizado");
      }

      setSelectedFood(savedFood);
      setShowCustomForm(false);
      
      toast({
        title: "Alimento criado",
        description: `${name} foi adicionado ao seu catálogo de alimentos.`,
      });
    } catch (err) {
      toast({
        title: "Erro ao criar alimento",
        description: "Não foi possível salvar o alimento personalizado.",
        variant: "destructive",
      });
    }
  };

  if (!open) return null;

  // Display sample foods if no search results and no query
  const displayFoods = searchQuery.length < 2 ? [] : searchResults;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {editingFood ? "Editar Alimento" : "Adicionar Alimento"}
            {mealTitle && ` em ${mealTitle}`}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4">
          {!editingFood && (
            <>
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

              {isSearching && (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Buscando alimentos...</p>
                </div>
              )}

              {searchQuery.length >= 2 && !isSearching && (
                <div className="grid gap-2 max-h-[30vh] overflow-y-auto">
                  {displayFoods.length > 0 ? (
                    displayFoods.map((food) => (
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
                    ))
                  ) : (
                    <div className="text-center py-4">
                      Nenhum alimento encontrado para "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {(selectedFood || editingFood) && (
          <div className="mt-4 border-t pt-4">
            <h3 className="font-medium mb-2">{selectedFood?.name || editingFood?.name}</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Calorias</p>
                <p className="text-lg font-medium">{selectedFood?.calories || editingFood?.calories} kcal</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Proteínas</p>
                <p className="text-lg font-medium">{selectedFood?.protein || editingFood?.protein}g</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Carboidratos</p>
                <p className="text-lg font-medium">{selectedFood?.carbs || editingFood?.carbs}g</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gorduras</p>
                <p className="text-lg font-medium">{selectedFood?.fats || editingFood?.fats}g</p>
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
          {(selectedFood || editingFood) && (
            <Button onClick={handleAddToMeal}>
              {editingFood ? "Atualizar" : "Adicionar à Refeição"}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddFoodModal;
