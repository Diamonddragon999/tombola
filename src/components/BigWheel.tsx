import { useEffect, useState } from 'react';
import PrizeWheel from './PrizeWheel';
import { StockTable } from './StockTable';
import { QRCodeDisplay } from './QRCodeDisplay';
import { Card, CardContent } from '@/components/ui/card';
import {
  getAvailablePrizes, pickPrize, consumePrize,
  addSpinResult, setSpinning,
} from '@/utils/gameState';
import { listen, trigger, unlisten } from '@/utils/realtime';
import { Prize } from '@/types/prizes';

export function BigWheel() {
  const [currentPrizes, setCurrentPrizes] = useState<Prize[]>([]);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [spinning,      setSpinningLocal] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState('');
  const [message,       setMessage]       = useState('Așteptăm participanți…');
  const qrUrl = `${window.location.origin}/spin`;

  /* inițial stoc */
  useEffect(() => setCurrentPrizes(getAvailablePrizes()), []);

  /* cereri de la telefoane */
  useEffect(() => {
    const cb = (d: any) => {
      if (spinning) return;

      const prize = pickPrize();
      setCurrentPlayer(d.firstName);
      setSelectedPrize(prize);
      setMessage(`${d.firstName} învârte roata…`);
      setSpinningLocal(true);
    };

    listen('request_spin', cb);
    return () => unlisten('request_spin', cb);
  }, [spinning]);

  /* după animație */
  const handleSpinComplete = async () => {
    if (!selectedPrize) return;

    consumePrize(selectedPrize.id);
    addSpinResult({ prize: selectedPrize, firstName: currentPlayer });
    setMessage(`${currentPlayer} a câștigat: ${selectedPrize.name}!`);

    await trigger('spin_result', { firstName: currentPlayer, prize: selectedPrize });

    setCurrentPrizes(getAvailablePrizes());
    setTimeout(resetState, 5000);
  };

  function resetState() {
    setSpinningLocal(false);
    setSpinning(false);
    setSelectedPrize(null);
    setCurrentPlayer('');
    setMessage('Așteptăm participanți…');
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex flex-col">
      <div className="p-8 text-center">
        <img
          src="https://rovision.ro/wp-content/themes/storefront-child/rovision-logo.svg"
          alt="Rovision Logo"
          className="h-16 w-auto mx-auto mb-4"
        />
        <h2 className="text-3xl font-bold text-white">{message}</h2>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 px-8">
        <div className="lg:flex-1 flex justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <QRCodeDisplay url={qrUrl} size={250} />
          </div>
        </div>

        <div className="lg:flex-1 flex justify-center">
          {currentPrizes.length ? (
            <PrizeWheel
              prizes={currentPrizes}
              selected={selectedPrize}
              spinning={spinning}
              onDone={handleSpinComplete}
            />

          ) : (
            <Card className="bg-red-500/20 backdrop-blur-sm border-red-500/30">
              <CardContent className="p-8">
                <p className="text-3xl text-red-300 font-bold">
                  Nu mai sunt premii disponibile!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="p-8">
        <StockTable />
      </div>
    </div>
  );
}