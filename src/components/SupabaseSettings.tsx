
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { saveCredentials, isSupabaseConfigured } from '@/lib/supabase';

const SupabaseSettings = () => {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Check if credentials exist in localStorage
    if (typeof window !== 'undefined') {
      const storedUrl = localStorage.getItem('supabase_url') || '';
      const storedKey = localStorage.getItem('supabase_anon_key') || '';
      setSupabaseUrl(storedUrl);
      setSupabaseKey(storedKey);
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

    try {
      saveCredentials(supabaseUrl, supabaseKey);
      toast({
        title: "Configuração salva",
        description: "As credenciais do Supabase foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as credenciais do Supabase.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Configurações do Supabase</CardTitle>
        <CardDescription>
          Configure as credenciais do Supabase para habilitar a sincronização de dados.
          {isConfigured && (
            <p className="text-green-500 mt-2">
              ✓ Supabase está configurado
            </p>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
        <Button onClick={handleSaveCredentials} className="w-full">
          Salvar configurações
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SupabaseSettings;
