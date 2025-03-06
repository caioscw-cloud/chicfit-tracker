
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { searchFoods, addCustomFood, FoodItem } from "@/services/mealService";
import { useAuth } from "@/hooks/useAuth";

const AddFood = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState("");
  const [customFood, setCustomFood] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Buscar alimentos com base na pesquisa
  const { data: foods = [], isLoading } = useQuery({
    queryKey: ['foods', searchQuery],
    queryFn: () => searchQuery.length > 2 ? searchFoods(searchQuery) : Promise.resolve([]),
    enabled: searchQuery.length > 2,
  });

  // Verificar se o usuário está autenticado
  useEffect(() => {
    if (!user) {
      toast({
        title: "Autenticação necessária",
        description: "Faça login para adicionar alimentos.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, navigate, toast]);

  const handleAddToMeal = () => {
    if (!selectedFood) return;
    
    if (!quantity) {
      toast({
        title: "Quantidade necessária",
        description: "Por favor, insira a quantidade em gramas.",
        variant: "destructive",
      });
      return;
    }

    // Calcular os valores nutricionais com base na quantidade
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

    // Armazenar no localStorage para recuperar quando voltar
    localStorage.setItem('newFood', JSON.stringify(newFood));

    toast({
      title: "Alimento adicionado",
      description: `${selectedFood.name} (${quantity}g) foi adicionado à sua refeição.`,
    });

    navigate(-1);
  };

  const handleAddCustomFood = async () => {
    if (!user) return;
    
    // Validar os campos
    const { name, calories, protein, carbs, fats } = customFood;
    if (!name || !calories || !protein || !carbs || !fats) {
      toast({
        title: "Campos incompletos",
        description: "Preencha todos os campos do alimento personalizado.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Adicionar o alimento personalizado ao banco de dados
      // Fix: Remove the 'id' property from the object we're passing to addCustomFood
      const newFood = await addCustomFood({
        name,
        calories: parseInt(calories),
        protein: parseFloat(protein),
        carbs: parseFloat(carbs),
        fats: parseFloat(fats),
        quantity: 100, // Valores base para 100g
      }, user.id);

      // Selecionar o alimento recém-criado
      setSelectedFood(newFood);
      setShowCustomForm(false);
      setQuantity("100");
      
      toast({
        title: "Alimento criado",
        description: `${name} foi adicionado ao seu catálogo de alimentos.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao criar alimento",
        description: String(error),
        variant: "destructive",
      });
    }
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

        <div className="space-y-6">
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

          {isLoading && (
            <div className="text-center py-4">Buscando alimentos...</div>
          )}

          {!isLoading && searchQuery.length > 2 && foods.length === 0 && (
            <div className="text-center py-4">
              Nenhum alimento encontrado para "{searchQuery}"
            </div>
          )}

          <div className="grid gap-4">
            {foods.map((food) => (
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
        </div>

        {selectedFood && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
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
                <div>
                  <label className="text-sm text-muted-foreground">Quantidade (g)</label>
                  <Input
                    type="number"
                    placeholder="Quantidade (g)"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full"
                  />
                </div>
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
