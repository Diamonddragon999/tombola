import { useEffect, useState } from 'react';
import { PasswordPrompt } from '@/components/PasswordPrompt';
import CaseDisplay from '@/components/CaseDisplay';

const KEY = 'tombola_razvan_auth';

export default function RazvanPage() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(KEY) === 'ok') setAuth(true);
  }, []);

  if (!auth) {
    return (
      <PasswordPrompt
        onCorrectPassword={() => {
          localStorage.setItem(KEY, 'ok');
          setAuth(true);
        }}
      />
    );
  }

  // NU mai înfășura cu alt min-h-screen/p-8; CaseDisplay se ocupă
  return <CaseDisplay />;
}
