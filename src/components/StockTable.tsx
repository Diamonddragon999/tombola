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
    <Card className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white text-center">
          Stoc Premii – {gs.day}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white font-bold">Premiu</TableHead>
              <TableHead className="text-white font-bold">Raritate</TableHead>
              <TableHead className="text-white font-bold">Stoc Rămas</TableHead>
              <TableHead className="text-white font-bold">Stoc Inițial</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {PRIZES.map(p => {
              const rem = gs.remainingStock[p.id] ?? 0;
              return (
                <TableRow key={p.id} className="border-white/10">
                  <TableCell className="text-white">{p.name}</TableCell>
                  <TableCell>
                    <span
                      className="px-3 py-1 rounded-full text-black font-bold text-sm shadow-lg uppercase"
                      style={{ background: RARITY_COLORS[p.rarity] }}
                    >
                      {p.rarity}
                    </span>
                  </TableCell>
                  <TableCell className="font-bold text-lg text-green-400">
                    {fmt(rem)}
                  </TableCell>
                  <TableCell className="text-gray-200">{fmt(p.dailyStock)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="mt-6 text-center text-gray-200 space-y-1">
          <p>Total rotiri astăzi: {gs.totalSpins}</p>
          <p>Participanți: {gs.participants.length}</p>
        </div>
      </CardContent>
    </Card>
  );
}
