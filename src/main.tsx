
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { checkSupabaseConnection } from './lib/supabase.ts'

// Verify Supabase connection on app startup
checkSupabaseConnection()
  .then(isConnected => {
    if (!isConnected) {
      console.warn('Supabase connection issues detected. Some features may not work properly.');
    }
  })
  .catch(error => {
    console.error('Failed to check Supabase connection:', error);
  });

const container = document.getElementById("root");

if (!container) {
  throw new Error("No root element found. Cannot mount React app.");
}

createRoot(container).render(<App />);
