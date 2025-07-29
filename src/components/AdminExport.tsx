// src/components/AdminExport.tsx
import { useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Lock } from 'lucide-react';
import { getGameState } from '@/utils/gameState';

/* --------------------------------------------------------------- */
/*  helper: descarcă un Blob sub numele indicat                    */
/* --------------------------------------------------------------- */
const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

/* --------------------------------------------------------------- */
/*  agregare date pentru export                                    */
/* --------------------------------------------------------------- */
type ExpoRow = {
  prenume: string;
  nume: string;
  email: string;
  varsta: string | number;
  likeFb: string;
  likeIg: string;
  likeYt: string;
  premii: string[];          // array – poate fi >1
  oreCastig: string[];       // ISO locale - câte ună / premiu
};

const buildExportData = (): ExpoRow[] => {
  const gs = getGameState();

  /*--- creează un map indexat după email (fallback: prenume+nume) --*/
  const people = new Map<string, ExpoRow>();

  gs.participants.forEach((p: any) => {
    const key = p.email || `${p.firstName}-${p.lastName}`;
    people.set(key, {
      prenume : p.firstName        ?? '',
      nume    : p.lastName         ?? '',
      email   : p.email            ?? '',
      varsta  : p.age              ?? '',
      likeFb  : p.likeFb ? 'DA' : 'NU',
      likeIg  : p.likeIg ? 'DA' : 'NU',
      likeYt  : p.likeYt ? 'DA' : 'NU',
      premii  : [],
      oreCastig : [],
    });
  });

  /*--- adaugă premiile câştigate în array-ul persoanei corespunzătoare --*/
  gs.spinResults.forEach((r: any) => {
    // găseşte participantul după email, altfel după prenume+nume
    const p = people.get(r.email)
         || people.get(`${r.firstName}-${r.lastName}`)
         || people.get(r.firstName)           // fallback slab dar util
         || null;

    if (p) {
      p.premii.push(r.prize?.name ?? '—');
      p.oreCastig.push(new Date(r.timestamp).toLocaleString());
    }
  });

  return Array.from(people.values());
};

/* --------------------------------------------------------------- */
/*  construcţie fişiere                                             */
/* --------------------------------------------------------------- */
const exportAsJson = (): string => (
  JSON.stringify(buildExportData(), null, 2)
);

const exportAsCsv = (): string => {
  const rows = buildExportData().map(r => ([
    r.prenume,
    r.nume,
    r.email,
    r.varsta,
    r.likeFb,
    r.likeIg,
    r.likeYt,
    `"${r.premii.join('|')}"`,        // ghilimele pt. virgule interne
    `"${r.oreCastig.join('|')}"`,
  ].join(',')));

  return [
    'Prenume,Nume,Email,Varsta,LikeFB,LikeIG,LikeYT,Premii,OreCastig',
    ...rows,
  ].join('\n');
};

/* =================================================================
   COMPONENTA PRINCIPALĂ
   ================================================================= */
export function AdminExport() {
  const [pwd, setPwd]   = useState('');
  const [auth, setAuth] = useState(false);
  const [err, setErr]   = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === 'admin2025') { setAuth(true); setErr(''); }
    else { setErr('Parolă incorectă!'); setPwd(''); }
  };

  /* -------------------- UI LOGIN -------------------- */
  if (!auth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
              <Lock className="h-6 w-6" /> Admin Panel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <Input
                type="password"
                placeholder="Parola admin"
                value={pwd}
                onChange={e => setPwd(e.target.value)}
                className="bg-white/20 border-white/30 text-white"
              />
              {err && (
                <Alert variant="destructive">
                  <AlertDescription>{err}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold"
              >
                Autentificare
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ------------------ UI  EXPORT -------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-2xl text-white text-center">Export Date</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* JSON */}
          <Button
            onClick={() => downloadBlob(
              new Blob([exportAsJson()], { type: 'application/json' }),
              `festival2025_${Date.now()}.json`,
            )}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold"
          >
            <Download className="h-4 w-4 mr-2" /> Descarcă JSON
          </Button>

          {/* CSV */}
          <Button
            onClick={() => downloadBlob(
              new Blob([exportAsCsv()], { type: 'text/csv' }),
              `festival2025_${Date.now()}.csv`,
            )}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold"
          >
            <Download className="h-4 w-4 mr-2" /> Descarcă CSV
          </Button>

          {/* back */}
          <Button
            onClick={() => { window.location.href = '/'; }}
            className="w-full bg-white/20 hover:bg-white/30 text-white"
          >
            Înapoi la aplicație
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
