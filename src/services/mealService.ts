
import { supabase } from '@/lib/supabase';

export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Meal {
  id?: string;
  title: string;
  time: string;
  foods: FoodItem[];
  userId?: string;
  date?: string;
}

export interface NutritionGoals {
  id?: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  waterIntake: number;
  userId?: string;
}

// Buscar todas as refeições do usuário para a data atual
export async function fetchMeals(userId: string, date: string = new Date().toISOString().split('T')[0]) {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('userId', userId)
    .eq('date', date);

  if (error) {
    console.error('Erro ao buscar refeições:', error);
    throw error;
  }

  return data || [];
}

// Salvar uma refeição
export async function saveMeal(meal: Meal) {
  // Se já existe um ID, atualiza, senão cria
  if (meal.id) {
    const { data, error } = await supabase
      .from('meals')
      .update(meal)
      .eq('id', meal.id)
      .select();

    if (error) {
      console.error('Erro ao atualizar refeição:', error);
      throw error;
    }

    return data?.[0];
  } else {
    const { data, error } = await supabase
      .from('meals')
      .insert(meal)
      .select();

    if (error) {
      console.error('Erro ao criar refeição:', error);
      throw error;
    }

    return data?.[0];
  }
}

// Excluir uma refeição
export async function deleteMeal(id: string) {
  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao excluir refeição:', error);
    throw error;
  }

  return true;
}

// Buscar as metas nutricionais do usuário
export async function fetchNutritionGoals(userId: string) {
  const { data, error } = await supabase
    .from('nutrition_goals')
    .select('*')
    .eq('userId', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 é quando não encontra registros
    console.error('Erro ao buscar metas nutricionais:', error);
    throw error;
  }

  return data;
}

// Salvar metas nutricionais
export async function saveNutritionGoals(goals: NutritionGoals) {
  // Se já existe um ID, atualiza, senão cria
  if (goals.id) {
    const { data, error } = await supabase
      .from('nutrition_goals')
      .update(goals)
      .eq('id', goals.id)
      .select();

    if (error) {
      console.error('Erro ao atualizar metas nutricionais:', error);
      throw error;
    }

    return data?.[0];
  } else {
    const { data, error } = await supabase
      .from('nutrition_goals')
      .insert(goals)
      .select();

    if (error) {
      console.error('Erro ao criar metas nutricionais:', error);
      throw error;
    }

    return data?.[0];
  }
}

// Salvar consumo de água
export async function saveWaterIntake(userId: string, waterIntake: number, date: string = new Date().toISOString().split('T')[0]) {
  const { data: existingData, error: fetchError } = await supabase
    .from('water_intake')
    .select('*')
    .eq('userId', userId)
    .eq('date', date)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Erro ao buscar consumo de água:', fetchError);
    throw fetchError;
  }

  if (existingData) {
    // Atualiza o registro existente
    const { error } = await supabase
      .from('water_intake')
      .update({ amount: waterIntake })
      .eq('id', existingData.id);

    if (error) {
      console.error('Erro ao atualizar consumo de água:', error);
      throw error;
    }
  } else {
    // Cria um novo registro
    const { error } = await supabase
      .from('water_intake')
      .insert({ userId, date, amount: waterIntake });

    if (error) {
      console.error('Erro ao registrar consumo de água:', error);
      throw error;
    }
  }

  return waterIntake;
}

// Buscar consumo de água
export async function fetchWaterIntake(userId: string, date: string = new Date().toISOString().split('T')[0]) {
  const { data, error } = await supabase
    .from('water_intake')
    .select('amount')
    .eq('userId', userId)
    .eq('date', date)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Erro ao buscar consumo de água:', error);
    throw error;
  }

  return data?.amount || 0;
}

// Buscar alimentos no banco de dados
export async function searchFoods(query: string) {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .ilike('name', `%${query}%`)
    .limit(20);

  if (error) {
    console.error('Erro ao buscar alimentos:', error);
    throw error;
  }

  return data || [];
}

// Adicionar um alimento personalizado
export async function addCustomFood(food: Omit<FoodItem, 'id'>, userId: string) {
  const { data, error } = await supabase
    .from('foods')
    .insert({ ...food, userId, isCustom: true })
    .select();

  if (error) {
    console.error('Erro ao adicionar alimento personalizado:', error);
    throw error;
  }

  return data?.[0];
}
