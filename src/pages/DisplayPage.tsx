import { useEffect, useState } from 'react';
import BigWheel from '@/components/BigWheel';
import { PasswordPrompt } from '../components/PasswordPrompt';

const STORAGE_KEY = 'tombola_display_auth';

export function DisplayPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /* la prima randare verifică dacă există token-ul */
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === 'ok') {
      setIsAuthenticated(true);
    }
  }, []);

  /* callback după introducerea parolei corecte */
  const handleAuth = () => {
    localStorage.setItem(STORAGE_KEY, 'ok');
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <PasswordPrompt onCorrectPassword={handleAuth} />;
  }

  return <BigWheel />;
}
