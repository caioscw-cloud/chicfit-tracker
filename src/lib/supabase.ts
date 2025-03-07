
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Local storage keys for credentials
const SUPABASE_URL_KEY = 'supabase_url';
const SUPABASE_ANON_KEY = 'supabase_anon_key';
const SUPABASE_PROJECT_NAME = 'supabase_project_name';

// Try to get credentials from localStorage if not in env vars
const getStoredCredentials = () => {
  if (typeof window !== 'undefined') {
    const storedUrl = localStorage.getItem(SUPABASE_URL_KEY);
    const storedKey = localStorage.getItem(SUPABASE_ANON_KEY);
    return { 
      url: storedUrl || supabaseUrl, 
      key: storedKey || supabaseAnonKey,
      projectName: localStorage.getItem(SUPABASE_PROJECT_NAME) || 'Default Project'
    };
  }
  return { url: supabaseUrl, key: supabaseAnonKey, projectName: 'Default Project' };
};

// Save credentials to localStorage
export const saveCredentials = (url: string, key: string, projectName: string = 'Default Project') => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SUPABASE_URL_KEY, url);
    localStorage.setItem(SUPABASE_ANON_KEY, key);
    localStorage.setItem(SUPABASE_PROJECT_NAME, projectName);
    // Reload the page to re-initialize Supabase with new credentials
    window.location.reload();
  }
};

// Helper function to ensure we're always dealing with a proper Promise
const ensurePromise = <T>(value: Promise<T> | T): Promise<T> => {
  return value instanceof Promise ? value : Promise.resolve(value);
};

// Create a mock Supabase client for development when credentials are missing
const createMockClient = () => {
  console.warn('Using mock Supabase client. Please set Supabase credentials in the settings page.');
  
  // Mock response for all operations
  const mockResponse = (data = null) => {
    return Promise.resolve({ data, error: null });
  };
  
  // Mock error response
  const mockErrorResponse = (message = "Operation not available in mock mode") => {
    return Promise.resolve({ data: null, error: { message } });
  };

  // Create a more consistent mock client that always returns Promises with data and error properties
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => mockErrorResponse('Mock Supabase client cannot authenticate'),
      signUp: () => mockErrorResponse('Mock Supabase client cannot register users'),
      signOut: () => Promise.resolve({ error: null })
    },
    from: (tableName: string) => {
      return {
        select: () => ({
          eq: () => ({
            eq: () => mockResponse([]),
            single: () => mockResponse(null),
            limit: () => mockResponse([])
          }),
          single: () => mockResponse(null),
          limit: () => mockResponse([]),
          ilike: () => ({ limit: () => mockResponse([]) }),
          then: (onfulfilled: any) => ensurePromise(mockResponse([])).then(onfulfilled)
        }),
        insert: () => ({
          select: () => mockResponse([]),
          then: (onfulfilled: any) => ensurePromise(mockResponse([])).then(onfulfilled)
        }),
        update: () => ({
          eq: () => ({ 
            select: () => mockResponse([]),
            then: (onfulfilled: any) => ensurePromise(mockResponse([])).then(onfulfilled)
          }),
          then: (onfulfilled: any) => ensurePromise(mockResponse([])).then(onfulfilled)
        }),
        delete: () => ({
          eq: () => mockResponse(),
          then: (onfulfilled: any) => ensurePromise(mockResponse()).then(onfulfilled)
        }),
        then: (onfulfilled: any) => ensurePromise(mockResponse()).then(onfulfilled)
      };
    }
  } as unknown as SupabaseClient;
};

// Initialize Supabase client with credentials from env or localStorage
let supabaseInstance: SupabaseClient | null = null;

export const initializeSupabase = (): SupabaseClient => {
  if (supabaseInstance) return supabaseInstance;
  
  const credentials = getStoredCredentials();
  
  if (credentials.url && credentials.key) {
    supabaseInstance = createClient(credentials.url, credentials.key);
    return supabaseInstance;
  }
  
  supabaseInstance = createMockClient();
  return supabaseInstance;
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
    const response = await supabase.from('healthcheck').select('*').limit(1);
    
    if (response.error) {
      console.error('Erro ao conectar com o Supabase:', response.error.message);
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

// Get the project name
export const getProjectName = () => {
  const credentials = getStoredCredentials();
  return credentials.projectName;
};
