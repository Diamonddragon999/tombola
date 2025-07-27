// src/components/StockTable.tsx
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PRIZES, RARITY_COLORS, UNLIMITED } from '@/types/prizes';
import { getGameState } from '@/utils/gameState';

export function StockTable() {
  const gs  = getGameState();
  const fmt = (n: number) => (n >= UNLIMITED ? '∞' : n);

  return (
    <Card className="w-full max-w-6xl mx-auto bg-white/10 backdrop-blur-md border-white/20 shadow-[0_0_35px_rgba(0,0,0,.35)]">
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-3xl font-bold text-white drop-shadow">
          Stoc Premii – {gs.day}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <Table className="text-lg">
          <TableHeader>
            <TableRow className="hover:bg-white/5">
              <TableHead className="text-white font-bold py-4 px-6 text-left text-xl">Premiu</TableHead>
              <TableHead className="text-white font-bold py-4 px-6 text-left text-xl">Raritate</TableHead>
              <TableHead className="text-white font-bold py-4 px-6 text-center text-xl">Rămas</TableHead>
              <TableHead className="text-white font-bold py-4 px-6 text-center text-xl">Inițial</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {PRIZES.map(p => {
              const rem = gs.remainingStock[p.id] ?? 0;
              return (
                <TableRow key={p.id} className="border-white/10 hover:bg-white/5 transition-colors">
                  <TableCell className="text-white py-5 px-6 text-left leading-snug">{p.name}</TableCell>
                  <TableCell className="py-5 px-6">
                    <span
                      className="px-4 py-1.5 rounded-full text-black font-bold text-sm shadow-lg uppercase tracking-wide"
                      style={{ background: RARITY_COLORS[p.rarity] }}
                    >
                      {p.rarity}
                    </span>
                  </TableCell>
                  <TableCell className="py-5 px-6 text-center font-extrabold text-2xl text-green-400">
                    {fmt(rem)}
                  </TableCell>
                  <TableCell className="py-5 px-6 text-center text-gray-200 text-xl">
                    {fmt(p.dailyStock)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="mt-8 text-center text-gray-200 space-y-1 text-lg">
          <p>Total rotiri astăzi: <span className="font-semibold text-white">{gs.totalSpins}</span></p>
          <p>Participanți: <span className="font-semibold text-white">{gs.participants.length}</span></p>
        </div>
      </CardContent>
    </Card>
  );
}
