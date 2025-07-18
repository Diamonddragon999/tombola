import { useState } from 'react';
import { BigWheel } from '../components/BigWheel';
import { PasswordPrompt } from '../components/PasswordPrompt';

export function DisplayPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <PasswordPrompt onCorrectPassword={() => setIsAuthenticated(true)} />;
  }

  return <BigWheel />;
}