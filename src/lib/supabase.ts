
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Local storage keys for credentials
const SUPABASE_URL_KEY = 'supabase_url';
const SUPABASE_ANON_KEY = 'supabase_anon_key';

// Try to get credentials from localStorage if not in env vars
const getStoredCredentials = () => {
  if (typeof window !== 'undefined') {
    const storedUrl = localStorage.getItem(SUPABASE_URL_KEY);
    const storedKey = localStorage.getItem(SUPABASE_ANON_KEY);
    return { 
      url: storedUrl || supabaseUrl, 
      key: storedKey || supabaseAnonKey 
    };
  }
  return { url: supabaseUrl, key: supabaseAnonKey };
};

// Save credentials to localStorage
export const saveCredentials = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SUPABASE_URL_KEY, url);
    localStorage.setItem(SUPABASE_ANON_KEY, key);
    // Reload the page to re-initialize Supabase with new credentials
    window.location.reload();
  }
};

// Create a mock Supabase client for development when credentials are missing
const createMockClient = () => {
  console.warn('Using mock Supabase client. Please set Supabase credentials in the settings page.');
  
  // Mock response for all operations
  const mockResponse = (data = null) => {
    return Promise.resolve({ data, error: null });
  };
  
  // Mock single response
  const mockSingleResponse = () => {
    return Promise.resolve({ data: null, error: null });
  };

  // Create a more functional mock client
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Mock Supabase client cannot authenticate') }),
      signUp: () => Promise.resolve({ data: null, error: new Error('Mock Supabase client cannot register users') }),
      signOut: () => Promise.resolve({ error: null })
    },
    from: (tableName: string) => {
      return {
        select: () => ({ 
          eq: () => ({
            eq: () => mockResponse([]),
            single: () => mockSingleResponse(),
            limit: () => mockResponse([])
          }),
          single: () => mockSingleResponse(),
          limit: () => mockResponse([]),
          ilike: () => ({ limit: () => mockResponse([]) })
        }),
        insert: () => ({
          select: () => mockResponse([])
        }),
        update: () => ({
          eq: () => ({ select: () => mockResponse([]) })
        }),
        delete: () => ({
          eq: () => mockResponse()
        })
      };
    }
  };
};

// Initialize Supabase client with credentials from env or localStorage
export const initializeSupabase = () => {
  const credentials = getStoredCredentials();
  
  if (credentials.url && credentials.key) {
    return createClient(credentials.url, credentials.key);
  }
  
  return createMockClient();
};

// Create the Supabase client
export const supabase = initializeSupabase();

// Function to check if the Supabase connection is working
export const checkSupabaseConnection = async () => {
  const credentials = getStoredCredentials();
  if (!credentials.url || !credentials.key) {
    console.error('Supabase URL e Anon Key são obrigatórios. Configure-os nas configurações.');
    
    // Show toast notification to the user
    setTimeout(() => {
      toast({
        title: "Configuração necessária",
        description: "As credenciais do Supabase não foram configuradas. Configure-as nas configurações.",
        variant: "destructive",
        duration: 5000,
      });
    }, 1000);
    
    return false;
  }
  
  try {
    // Try a simple query to check connection
    const { error } = await supabase.from('healthcheck').select('*').limit(1);
    
    if (error) {
      console.error('Erro ao conectar com o Supabase:', error.message);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao Supabase. Verifique suas credenciais.",
        variant: "destructive",
        duration: 5000,
      });
      return false;
    }
    
    console.log('Conexão com Supabase estabelecida com sucesso');
    return true;
  } catch (error) {
    console.error('Exceção ao verificar conexão com Supabase:', error);
    return false;
  }
};

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  const credentials = getStoredCredentials();
  return !!(credentials.url && credentials.key);
};
