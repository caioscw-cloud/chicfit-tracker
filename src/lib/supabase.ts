
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock Supabase client for development when credentials are missing
const createMockClient = () => {
  console.warn('Using mock Supabase client. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  
  // Return a mock client with dummy methods
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ data: null, error: new Error('Mock Supabase client cannot authenticate') }),
      signUp: async () => ({ data: null, error: new Error('Mock Supabase client cannot register users') }),
      signOut: async () => ({ error: null })
    },
    from: () => ({
      select: () => ({ limit: () => ({ data: [], error: null }) }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    })
  };
};

// Create the Supabase client
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

// Function to check if the Supabase connection is working
export const checkSupabaseConnection = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL e Anon Key são obrigatórios. Verifique suas variáveis de ambiente.');
    
    // Show toast notification to the user
    setTimeout(() => {
      toast({
        title: "Erro de configuração",
        description: "As credenciais do Supabase não foram configuradas. O aplicativo funcionará em modo limitado.",
        variant: "destructive",
        duration: 5000,
      });
    }, 1000);
    
    return false;
  }
  
  try {
    const { data, error } = await supabase.from('healthcheck').select('*').limit(1);
    
    if (error) {
      console.error('Erro ao conectar com o Supabase:', error.message);
      return false;
    }
    
    console.log('Conexão com Supabase estabelecida com sucesso');
    return true;
  } catch (error) {
    console.error('Exceção ao verificar conexão com Supabase:', error);
    return false;
  }
};
