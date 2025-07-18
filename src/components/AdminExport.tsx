import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Lock } from 'lucide-react';
import { exportGameData } from '../utils/gameState';

export function AdminExport() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === 'admin2025') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Parolă incorectă!');
      setPassword('');
    }
  };

  const handleExport = () => {
    const data = exportGameData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `festival2025_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-white flex items-center justify-center gap-2 font-bold">
              <Lock className="h-6 w-6" />
              Admin Panel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Parola admin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-yellow-400 focus:ring-yellow-400"
                  autoFocus
                />
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold"
              >
                Autentificare
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-white font-bold">
            Export Date
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-white text-center">
            Descarcă toate datele participanților și rezultatele tragerilor.
          </p>
          
          <Button 
            onClick={handleExport}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold"
          >
            <Download className="h-4 w-4 mr-2" />
            Descarcă Date JSON
          </Button>
          
          <Button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50"
          >
            Înapoi la Aplicație
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}