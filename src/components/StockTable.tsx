import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { PRIZES, RARITY_COLORS, UNLIMITED } from '@/types/prizes';
import { getGameState } from '@/utils/gameState';

export function StockTable() {
  const gs = getGameState();
  const fmt = (n: number) => (n >= UNLIMITED ? '∞' : n);

  return (
    <div className="w-full">
      <h3 className="text-center text-white text-xl font-semibold mb-6 drop-shadow">
        Stoc Premii – {gs.day}
      </h3>

      <Table className="text-white/90">
        <TableHeader>
          <TableRow className="border-white/10">
            <TableHead className="font-bold">Premiu</TableHead>
            <TableHead className="font-bold">Raritate</TableHead>
            <TableHead className="font-bold">Rămas</TableHead>
            <TableHead className="font-bold">Inițial</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {PRIZES.map(p => {
            const rem = gs.remainingStock[p.id] ?? 0;
            return (
              <TableRow key={p.id} className="border-white/10">
                <TableCell>{p.name}</TableCell>
                <TableCell>
                  <span
                    className="px-3 py-1 rounded-full text-black font-bold text-xs uppercase shadow-lg"
                    style={{ background: RARITY_COLORS[p.rarity] }}
                  >
                    {p.rarity}
                  </span>
                </TableCell>
                <TableCell className="font-bold text-green-400">{fmt(rem)}</TableCell>
                <TableCell className="text-gray-300">{fmt(p.dailyStock)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="mt-6 text-center text-gray-300 space-y-1 text-sm">
        <p>Total rotiri astăzi: {gs.totalSpins}</p>
        <p>Participanți: {gs.participants.length}</p>
      </div>
    </div>
  );
}
