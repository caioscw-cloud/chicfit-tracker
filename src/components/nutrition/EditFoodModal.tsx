
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FoodItem } from "@/services/mealService";

interface EditFoodModalProps {
  food: FoodItem;
  onSave: (food: FoodItem) => void;
  onClose: () => void;
}

const EditFoodModal = ({ food, onSave, onClose }: EditFoodModalProps) => {
  const [quantity, setQuantity] = useState(food.quantity.toString());
  const { toast } = useToast();

  const handleSave = () => {
    const newQuantity = parseInt(quantity);
    if (isNaN(newQuantity) || newQuantity <= 0) {
      toast({
        title: "Quantidade inválida",
        description: "Por favor, insira uma quantidade válida.",
        variant: "destructive",
      });
      return;
    }

    onSave({ ...food, quantity: newQuantity });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">{food.name}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Quantidade (g)</label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Calorias</p>
              <p className="font-medium">{food.calories} kcal</p>
            </div>
            <div>
              <p className="text-muted-foreground">Proteínas</p>
              <p className="font-medium">{food.protein}g</p>
            </div>
            <div>
              <p className="text-muted-foreground">Carboidratos</p>
              <p className="font-medium">{food.carbs}g</p>
            </div>
            <div>
              <p className="text-muted-foreground">Gorduras</p>
              <p className="font-medium">{food.fats}g</p>
            </div>
          </div>
          <Button className="w-full" onClick={handleSave}>
            Salvar Alterações
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EditFoodModal;
