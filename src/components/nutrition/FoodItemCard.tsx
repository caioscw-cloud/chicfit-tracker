
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MoreVertical } from "lucide-react";
import { FoodItem } from "@/services/mealService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FoodItemCardProps {
  food: FoodItem;
  onEdit: (food: FoodItem) => void;
  onDelete: (foodId: string) => void;
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({ food, onEdit, onDelete }) => {
  return (
    <Card className="p-3 bg-muted hover:bg-muted/80 transition-colors group">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">{food.name}</p>
          <p className="text-sm text-muted-foreground">
            {food.quantity}g • {food.calories} cal • {food.protein}g prot
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(food)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive" 
              onClick={() => onDelete(food.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};

export default FoodItemCard;
