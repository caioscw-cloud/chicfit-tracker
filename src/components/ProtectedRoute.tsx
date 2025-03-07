
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { isSupabaseConfigured, getProjectName } from '@/lib/supabase';
import SupabaseSettings from './SupabaseSettings';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    // Check if Supabase is configured
    const configured = isSupabaseConfigured();
    setShowSettings(!configured);
    setProjectName(getProjectName());
  }, []);

  // If we're still loading auth state, show loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  // If Supabase is not configured, show settings screen
  if (showSettings) {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-8">Configuração do Supabase</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Para utilizar todos os recursos do aplicativo, configure suas credenciais do Supabase abaixo.
        </p>
        <SupabaseSettings />
        <button
          onClick={() => setShowSettings(false)}
          className="mt-8 text-sm text-muted-foreground hover:text-foreground"
        >
          Continuar sem configurar (funcionalidade limitada)
        </button>
      </div>
    );
  }

  // If the user is not authenticated and Supabase is configured, redirect to login
  if (!user && isSupabaseConfigured()) {
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated or we're in mock mode, render the children components
  return <>{children}</>;
};

export default ProtectedRoute;
