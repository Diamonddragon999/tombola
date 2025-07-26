import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';

interface PasswordPromptProps {
  onCorrectPassword: () => void;
}

export function PasswordPrompt({ onCorrectPassword }: PasswordPromptProps) {
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'festival2025') onCorrectPassword();
    else { setErr('Parolă incorectă!'); setPassword(''); }
  };

  return (
    <div className="min-h-screen bg-premium scanlines flex items-center justify-center p-4">
      <Card className="glass neon-red w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-white flex items-center justify-center gap-2 font-orbitron font-bold">
            <Lock className="h-6 w-6" />
            Acces Restricționat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <Input
              type="password"
              placeholder="Introdu parola"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
              autoFocus
            />

            {err && (
              <Alert variant="destructive">
                <AlertDescription>{err}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="btn-primary w-full">
              Acces
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
