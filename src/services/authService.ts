
import { supabase } from '@/lib/supabase';

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const signInWithEmail = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      return {
        success: false,
        message: error.message
      };
    }
    
    return {
      success: true,
      message: 'Login realizado com sucesso',
      data
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erro ao fazer login. Tente novamente.'
    };
  }
};

export const signUpWithEmail = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    
    if (error) {
      return {
        success: false,
        message: error.message
      };
    }
    
    return {
      success: true,
      message: data.user?.identities?.length === 0 
        ? 'Email já cadastrado. Faça login.' 
        : 'Cadastro realizado. Verifique seu email.',
      data
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erro ao criar conta. Tente novamente.'
    };
  }
};

export const signOut = async (): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return {
        success: false,
        message: error.message
      };
    }
    
    return {
      success: true,
      message: 'Logout realizado com sucesso'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erro ao fazer logout. Tente novamente.'
    };
  }
};
