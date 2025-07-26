import { useEffect, useState } from 'react';
import { BigWheel } from '@/components/BigWheel';
import { PasswordPrompt } from '@/components/PasswordPrompt';

const STORAGE_KEY = 'tombola_display_auth';

export function DisplayPage() {
  const [isAuth, setAuth] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === 'ok') setAuth(true);
  }, []);

  const handleAuth = () => {
    localStorage.setItem(STORAGE_KEY, 'ok');
    setAuth(true);
  };

  if (!isAuth) return <PasswordPrompt onCorrectPassword={handleAuth} />;

  return (
    <div className="min-h-screen bg-premium scanlines flex items-center justify-center p-6">
      <BigWheel />
    </div>
  );
}
