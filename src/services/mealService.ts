
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

// Ensure we're handling Supabase responses correctly
const handleSupabaseResponse = async (promise) => {
  try {
    const response = await promise;
    return response;
  } catch (error) {
    console.error('Error in Supabase operation:', error);
    return { data: null, error };
  }
};

// Buscar todas as refeições do usuário para a data atual
export async function fetchMeals(userId: string, date: string = new Date().toISOString().split('T')[0]) {
  try {
    const response = await handleSupabaseResponse(
      supabase
        .from('meals')
        .select('*')
        .eq('userId', userId)
        .eq('date', date)
    );
    
    if (response.error) {
      console.error('Erro ao buscar refeições:', response.error);
      throw response.error;
    }

    return response.data || [];
  } catch (err) {
    console.error('Erro ao buscar refeições:', err);
    return [];
  }
}

// Salvar uma refeição
export async function saveMeal(meal: Meal) {
  try {
    let response;
    
    // Se já existe um ID, atualiza, senão cria
    if (meal.id) {
      response = await handleSupabaseResponse(
        supabase
          .from('meals')
          .update(meal)
          .eq('id', meal.id)
          .select()
      );
    } else {
      response = await handleSupabaseResponse(
        supabase
          .from('meals')
          .insert(meal)
          .select()
      );
    }
    
    if (response.error) {
      console.error('Erro ao salvar refeição:', response.error);
      throw response.error;
    }

    return response.data?.[0] || null;
  } catch (err) {
    console.error('Erro ao salvar refeição:', err);
    return null;
  }
}

// Excluir uma refeição
export async function deleteMeal(id: string) {
  try {
    const response = await handleSupabaseResponse(
      supabase
        .from('meals')
        .delete()
        .eq('id', id)
    );
    
    if (response.error) {
      console.error('Erro ao excluir refeição:', response.error);
      throw response.error;
    }

    return true;
  } catch (err) {
    console.error('Erro ao excluir refeição:', err);
    return false;
  }
}

// Buscar as metas nutricionais do usuário
export async function fetchNutritionGoals(userId: string) {
  try {
    const response = await handleSupabaseResponse(
      supabase
        .from('nutrition_goals')
        .select('*')
        .eq('userId', userId)
        .single()
    );
    
    if (response.error && response.error.code !== 'PGRST116') { // PGRST116 é quando não encontra registros
      console.error('Erro ao buscar metas nutricionais:', response.error);
      throw response.error;
    }

    return response.data || null;
  } catch (err) {
    console.error('Erro ao buscar metas nutricionais:', err);
    return null;
  }
}

// Salvar metas nutricionais
export async function saveNutritionGoals(goals: NutritionGoals) {
  try {
    let response;
    
    // Se já existe um ID, atualiza, senão cria
    if (goals.id) {
      response = await handleSupabaseResponse(
        supabase
          .from('nutrition_goals')
          .update(goals)
          .eq('id', goals.id)
          .select()
      );
    } else {
      response = await handleSupabaseResponse(
        supabase
          .from('nutrition_goals')
          .insert(goals)
          .select()
      );
    }
    
    if (response.error) {
      console.error('Erro ao salvar metas nutricionais:', response.error);
      throw response.error;
    }

    return response.data?.[0] || null;
  } catch (err) {
    console.error('Erro ao salvar metas nutricionais:', err);
    return null;
  }
}

// Salvar consumo de água
export async function saveWaterIntake(userId: string, waterIntake: number, date: string = new Date().toISOString().split('T')[0]) {
  try {
    // Primeiro verificamos se já existe um registro para esta data
    const fetchResponse = await handleSupabaseResponse(
      supabase
        .from('water_intake')
        .select('*')
        .eq('userId', userId)
        .eq('date', date)
        .maybeSingle()
    );
    
    const existingData = fetchResponse.data;
    
    let updateResponse;
    
    if (existingData) {
      // Atualiza o registro existente
      updateResponse = await handleSupabaseResponse(
        supabase
          .from('water_intake')
          .update({ amount: waterIntake })
          .eq('id', existingData.id)
          .select()
      );
    } else {
      // Cria um novo registro
      updateResponse = await handleSupabaseResponse(
        supabase
          .from('water_intake')
          .insert({ userId, date, amount: waterIntake })
          .select()
      );
    }
    
    if (updateResponse.error) {
      console.error('Erro ao salvar consumo de água:', updateResponse.error);
      throw updateResponse.error;
    }

    return waterIntake;
  } catch (err) {
    console.error('Erro ao salvar consumo de água:', err);
    return 0;
  }
}

// Buscar consumo de água
export async function fetchWaterIntake(userId: string, date: string = new Date().toISOString().split('T')[0]) {
  try {
    const response = await handleSupabaseResponse(
      supabase
        .from('water_intake')
        .select('amount')
        .eq('userId', userId)
        .eq('date', date)
        .maybeSingle()
    );
    
    if (response.error && response.error.code !== 'PGRST116') {
      console.error('Erro ao buscar consumo de água:', response.error);
      throw response.error;
    }

    return response.data?.amount || 0;
  } catch (err) {
    console.error('Erro ao buscar consumo de água:', err);
    return 0;
  }
}

// Buscar alimentos no banco de dados
export async function searchFoods(query: string) {
  try {
    const response = await handleSupabaseResponse(
      supabase
        .from('foods')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(20)
    );
    
    if (response.error) {
      console.error('Erro ao buscar alimentos:', response.error);
      throw response.error;
    }

    return response.data || [];
  } catch (err) {
    console.error('Erro ao buscar alimentos:', err);
    return [];
  }
}

// Adicionar um alimento personalizado
export async function addCustomFood(food: Omit<FoodItem, 'id'>, userId: string) {
  try {
    const response = await handleSupabaseResponse(
      supabase
        .from('foods')
        .insert({ ...food, userId, isCustom: true })
        .select()
    );
    
    if (response.error) {
      console.error('Erro ao adicionar alimento personalizado:', response.error);
      throw response.error;
    }

    return response.data?.[0] || null;
  } catch (err) {
    console.error('Erro ao adicionar alimento personalizado:', err);
    return null;
  }
}
