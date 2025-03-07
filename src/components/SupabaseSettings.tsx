
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { saveCredentials, isSupabaseConfigured, getProjectName } from '@/lib/supabase';
import { AlertCircle, CheckCircle } from 'lucide-react';

const SupabaseSettings = () => {
  const [supabaseUrl, setSupabaseUrl] = useState('https://dsrtgqbavmpmgiofwrqx.supabase.co');
  const [supabaseKey, setSupabaseKey] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzcnRncWJhdm1wbWdpb2Z3cnF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTI4MTk2NSwiZXhwIjoyMDU2ODU3OTY1fQ.smluKWz55Xe6nCyJFplupzxHJ5Lww9-S6QEr4MjUYoc');
  const [projectName, setProjectName] = useState('auth-test');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Check if credentials exist in localStorage
    if (typeof window !== 'undefined') {
      const storedUrl = localStorage.getItem('supabase_url') || '';
      const storedKey = localStorage.getItem('supabase_anon_key') || '';
      const storedProjectName = getProjectName();
      
      if (storedUrl && storedKey) {
        setSupabaseUrl(storedUrl);
        setSupabaseKey(storedKey);
        setProjectName(storedProjectName);
      }
      
      setIsConfigured(isSupabaseConfigured());
    }
  }, []);

  const handleSaveCredentials = () => {
    if (!supabaseUrl || !supabaseKey) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha a URL do Supabase e a chave anônima.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      saveCredentials(supabaseUrl, supabaseKey, projectName);
      toast({
        title: "Configuração salva",
        description: `As credenciais do projeto "${projectName}" foram salvas com sucesso.`,
      });
      setIsConfigured(true);
      setIsSaving(false);
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as credenciais do Supabase.",
        variant: "destructive",
      });
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Configurações do Supabase</CardTitle>
        <CardDescription>
          Configure as credenciais do Supabase para habilitar a sincronização de dados.
          {isConfigured && (
            <div className="flex items-center gap-1 text-green-500 mt-2">
              <CheckCircle size={16} />
              <span>Supabase está configurado</span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="project-name" className="text-sm font-medium">
            Nome do Projeto
          </label>
          <Input
            id="project-name"
            placeholder="auth-test"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Um nome para identificar este projeto
          </p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="supabase-url" className="text-sm font-medium">
            URL do Supabase
          </label>
          <Input
            id="supabase-url"
            placeholder="https://your-project.supabase.co"
            value={supabaseUrl}
            onChange={(e) => setSupabaseUrl(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Encontre no dashboard do Supabase em Configurações &gt; API
          </p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="supabase-key" className="text-sm font-medium">
            Chave anônima do Supabase
          </label>
          <Input
            id="supabase-key"
            type="password"
            placeholder="sua-chave-anonima-aqui"
            value={supabaseKey}
            onChange={(e) => setSupabaseKey(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Chave anônima (anon key) encontrada em Configurações &gt; API
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveCredentials} 
          className="w-full"
          disabled={isSaving}
        >
          {isSaving ? 'Salvando...' : 'Salvar configurações'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SupabaseSettings;
