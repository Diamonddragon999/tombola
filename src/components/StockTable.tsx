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
    <Card className="w-full mx-auto glass neon-violet text-base sm:text-lg lg:text-2xl">
      <CardHeader>
        <CardTitle className="text-white text-center text-2xl sm:text-3xl lg:text-4xl font-extrabold">
          Stoc Premii – {gs.day}
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto pb-6 sm:pb-10">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="text-white/80">
              <TableHead className="text-white font-bold">Premiu</TableHead>
              <TableHead className="text-white font-bold">Raritate</TableHead>
              <TableHead className="text-white font-bold">Rămas</TableHead>
              <TableHead className="text-white font-bold">Inițial</TableHead>
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
                      className="px-4 py-0.5 rounded-full text-black font-bold text-xs sm:text-sm shadow-lg uppercase"
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

        <div className="mt-6 sm:mt-10 text-center text-gray-200 space-y-1 sm:space-y-2 text-sm sm:text-base lg:text-xl">
          <p>Total rotiri astăzi: {gs.totalSpins}</p>
          <p>Participanți: {gs.participants.length}</p>
        </div>
      </CardContent>
    </Card>
  );
}
