import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PRIZES, RARITY_COLORS } from '../types/prizes';
import { getGameState } from '../utils/gameState';

export function StockTable() {
  const gameState = getGameState();
  
  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white text-center">Stoc Premii - {gameState.day}</CardTitle>
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
            {PRIZES.map((prize) => {
              const remaining = gameState.remainingStock[prize.id] || 0;
              const rarityColor = RARITY_COLORS[prize.rarity];
              
              return (
                <TableRow key={prize.id} className="border-white/10">
                  <TableCell className="text-white font-medium">
                    {prize.name}
                  </TableCell>
                  <TableCell>
                    <span
                      className="px-3 py-1 rounded-full text-black font-bold text-sm shadow-lg"
                      style={{ backgroundColor: rarityColor }}
                    >
                      {prize.rarity.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className={`font-bold text-lg ${remaining === 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {remaining}
                  </TableCell>
                  <TableCell className="text-gray-200">
                    {prize.dailyStock}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        <div className="mt-6 text-center text-gray-200 space-y-1">
          <p>Total rotiri astăzi: {gameState.totalSpins}</p>
          <p>Participanți: {gameState.participants.length}</p>
        </div>
      </CardContent>
    </Card>
  );
}