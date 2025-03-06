
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { checkSupabaseConnection, isSupabaseConfigured } from './lib/supabase.ts'
import { toast } from '@/components/ui/use-toast'

// Get the container element
const container = document.getElementById("root");

if (!container) {
  throw new Error("No root element found. Cannot mount React app.");
}

// Create the React root and render the app
createRoot(container).render(<App />);

// Verify Supabase connection after rendering
if (isSupabaseConfigured()) {
  checkSupabaseConnection()
    .then(isConnected => {
      if (!isConnected) {
        console.warn('Supabase connection issues detected. Check your credentials.');
      }
    })
    .catch(error => {
      console.error('Failed to check Supabase connection:', error);
    });
} else {
  console.warn('Supabase credentials not configured. Some features may not work properly.');
  
  // Show toast notification to direct user to settings
  setTimeout(() => {
    toast({
      title: "Configuração necessária",
      description: "Configure as credenciais do Supabase para habilitar todos os recursos.",
      duration: 5000,
    });
  }, 2000);
}
