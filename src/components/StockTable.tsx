/* src/components/StockTable.tsx */
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PRIZES, RARITY_COLORS, UNLIMITED } from '@/types/prizes';
import { getGameState } from '@/utils/gameState';

export function StockTable() {
  const gs = getGameState();
  const fmt = (n: number) => (n >= UNLIMITED ? '∞' : n);

  return (
    <Card className="w-full max-w-[1920px] mx-auto glass neon-violet mt-20 text-2xl">
      <CardHeader>
        <CardTitle className="text-white text-center text-4xl md:text-5xl font-extrabold">
          Stoc Premii – {gs.day}
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="text-white/80">
              <TableHead className="text-white font-bold text-2xl">Premiu</TableHead>
              <TableHead className="text-white font-bold text-2xl">Raritate</TableHead>
              <TableHead className="text-white font-bold text-2xl">Rămas</TableHead>
              <TableHead className="text-white font-bold text-2xl">Inițial</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {PRIZES.map(p => {
              const rem = gs.remainingStock[p.id] ?? 0;
              return (
                <TableRow key={p.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-white">{p.name}</TableCell>
                  <TableCell>
                    <span
                      className="px-5 py-1 rounded-full text-black font-bold text-base shadow-lg uppercase"
                      style={{ background: RARITY_COLORS[p.rarity] }}
                    >
                      {p.rarity}
                    </span>
                  </TableCell>
                  <TableCell className="font-bold text-green-400">{fmt(rem)}</TableCell>
                  <TableCell className="text-gray-200">{fmt(p.dailyStock)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="mt-10 text-center text-gray-200 space-y-2 text-xl">
          <p>Total rotiri astăzi: {gs.totalSpins}</p>
          <p>Participanți: {gs.participants.length}</p>
        </div>
      </CardContent>
    </Card>
  );
}
