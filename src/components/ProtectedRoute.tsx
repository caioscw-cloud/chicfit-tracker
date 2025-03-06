
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const [isCheckingEnv, setIsCheckingEnv] = useState(true);
  const [envMissing, setEnvMissing] = useState(false);

  useEffect(() => {
    // Check if Supabase environment variables are set
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      setEnvMissing(true);
    }
    
    setIsCheckingEnv(false);
  }, []);

  // If we're still checking environment variables or loading auth state, show loading
  if (isCheckingEnv || isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  // If environment variables are missing, bypass auth check and allow access
  if (envMissing) {
    console.warn('Supabase environment variables missing, bypassing authentication check');
    return <>{children}</>;
  }

  // If the user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the children components
  return <>{children}</>;
};

export default ProtectedRoute;
