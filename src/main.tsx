
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { checkSupabaseConnection, isSupabaseConfigured, getProjectName } from './lib/supabase.ts'
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
  const projectName = getProjectName();
  
  checkSupabaseConnection()
    .then(isConnected => {
      if (isConnected) {
        console.log(`Conexão com Supabase (${projectName}) estabelecida com sucesso`);
        toast({
          title: "Conexão estabelecida",
          description: `Conectado ao projeto "${projectName}" do Supabase.`,
          duration: 3000,
        });
      } else {
        console.warn(`Problemas de conexão com o Supabase (${projectName}) detectados. Verifique suas credenciais.`);
      }
    })
    .catch(error => {
      console.error('Falha ao verificar conexão com o Supabase:', error);
    });
} else {
  console.warn('Credenciais do Supabase não configuradas. Alguns recursos podem não funcionar corretamente.');
  
  // Show toast notification to direct user to settings
  setTimeout(() => {
    toast({
      title: "Configuração necessária",
      description: "Configure as credenciais do Supabase para habilitar todos os recursos.",
      duration: 5000,
    });
  }, 2000);
}
