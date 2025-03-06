
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock Supabase client for development when credentials are missing
const createMockClient = () => {
  console.warn('Using mock Supabase client. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  
  // Create a more complete mock implementation that returns chainable methods
  const mockQueryBuilder = () => {
    const emptyResponse = { data: [], error: null };
    const singleResponse = { data: null, error: null };
    
    // Create a chainable API for query methods
    const chainable = {
      select: () => chainable,
      insert: () => chainable,
      update: () => chainable,
      delete: () => chainable,
      eq: () => chainable,
      neq: () => chainable,
      gt: () => chainable,
      lt: () => chainable,
      gte: () => chainable,
      lte: () => chainable,
      like: () => chainable,
      ilike: () => chainable,
      is: () => chainable,
      in: () => chainable,
      contains: () => chainable,
      containedBy: () => chainable,
      rangeLt: () => chainable,
      rangeGt: () => chainable,
      rangeGte: () => chainable,
      rangeLte: () => chainable,
      overlaps: () => chainable,
      textSearch: () => chainable,
      filter: () => chainable,
      match: () => chainable,
      or: () => chainable,
      and: () => chainable,
      limit: () => chainable,
      order: () => chainable,
      range: () => chainable,
      // These methods terminate the chain and should return a Promise
      single: () => Promise.resolve(singleResponse),
      maybeSingle: () => Promise.resolve(singleResponse),
      // Important: Return a proper Promise instead of having a then method
      then: undefined
    };
    
    // Add the ability to await on the chainable object directly
    // This converts the chainable to a Promise when used with await
    Object.defineProperty(chainable, Symbol.toStringTag, { value: 'Promise' });
    Object.defineProperty(chainable, 'then', { 
      value: (resolve: any) => Promise.resolve(emptyResponse).then(resolve),
      enumerable: false 
    });
    
    return chainable;
  };

  // Return a mock client with chainable methods
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ data: null, error: new Error('Mock Supabase client cannot authenticate') }),
      signUp: async () => ({ data: null, error: new Error('Mock Supabase client cannot register users') }),
      signOut: async () => ({ error: null })
    },
    from: () => mockQueryBuilder()
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
    // Use Promise.resolve to ensure we're working with a proper Promise
    const response = await Promise.resolve(supabase.from('healthcheck').select('*').limit(1));
    const { data, error } = response;
    
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
