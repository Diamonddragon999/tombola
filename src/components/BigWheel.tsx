import { useEffect, useState } from 'react';
import { PrizeWheel }     from './PrizeWheel';
import { StockTable }     from './StockTable';
import { QRCodeDisplay }  from './QRCodeDisplay';
import { Card, CardContent } from '@/components/ui/card';
import {
  getAvailablePrizes,
  selectRandomPrize,
  consumePrize,
  addSpinResult,
  setSpinning,
} from '../utils/gameState';
import { listen, trigger, unlisten } from '../utils/realtime';
import { Prize } from '../types/prizes';

export function BigWheel() {
  const [currentPrizes,  setCurrentPrizes]  = useState<Prize[]>([]);
  const [selectedPrize,  setSelectedPrize]  = useState<Prize | null>(null);
  const [isSpinning,     setIsSpinning]     = useState(false);
  const [currentPlayer,  setCurrentPlayer]  = useState('');
  const [message,        setMessage]        = useState('Așteptăm participanți…');
  const qrUrl = `${window.location.origin}/spin`;

  /* Stock inițial */
  useEffect(() => setCurrentPrizes(getAvailablePrizes()), []);

  /* Ascultă cereri de la telefoane */
  useEffect(() => {
    const cb = (d: any) => {
      if (isSpinning) return;
      setCurrentPlayer(d.firstName);
      setMessage(`${d.firstName} învârte roata…`);

      const prize = selectRandomPrize();
      if (!prize) {
        // felie gri „Încearcă din nou!”
        setSelectedPrize(null);          // PrizeWheel va alege slice‑ul „nothing”
        setMessage(`${d.firstName} încearcă din nou…`);
      } else {
        setSelectedPrize(prize);
        setMessage(`${d.firstName} învârte roata…`);
      }
      setSelectedPrize(prize);
      setIsSpinning(true);
    };

    listen('request_spin', cb);
    /*  cleanup – trebuie să întoarcă void! */
    return () => { unlisten('request_spin', cb); };
  }, [isSpinning]);

  /* După terminarea animației */
  const handleSpinComplete = async () => {
    /* 2️⃣  dacă selectedPrize === null => n‑a câștigat nimic */
    if (!selectedPrize) {
       await trigger('spin_result', { firstName: currentPlayer, prize: null });
       resetAfterDelay();                // funcție ajutătoare (vezi mai jos)
       return;
    }

    if (!consumePrize(selectedPrize.id)) {
      setMessage('Eroare la acordarea premiului!');
      setIsSpinning(false);
      setSpinning(false);
      return;
    }

    addSpinResult({ prize: selectedPrize, firstName: currentPlayer });
    setMessage(`${currentPlayer} a câștigat: ${selectedPrize.name}!`);

    /* Trimite către pusher backend */
    await fetch('/api/pusher/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'spin_result',
        data: { firstName: currentPlayer, prize: selectedPrize },
      }),
    });

    setCurrentPrizes(getAvailablePrizes());

    setTimeout(() => {
      setIsSpinning(false);
      setSpinning(false);
      setSelectedPrize(null);
      setCurrentPlayer('');
      setMessage('Așteptăm participanți…');
    }, 5000);
  };
 /* -----------------Helper ---------------- */
  function resetAfterDelay() {
    setTimeout(() => {
      setIsSpinning(false);
      setSpinning(false);
      setSelectedPrize(null);
      setCurrentPlayer('');
      setMessage('Așteptăm participanți…');
    }, 5000);
  }

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex flex-col">
      {/* HEADER + mesaj */}
      <div className="p-8 text-center">
        <img
          src="https://rovision.ro/wp-content/themes/storefront-child/rovision-logo.svg"
          alt="Rovision Logo"
          className="h-16 w-auto mx-auto mb-4"
        />
        <h2 className="text-3xl font-bold text-white">{message}</h2>
      </div>

      {/* QR + Wheel */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 px-8">
        {/* QR stânga */}
        <div className="lg:flex-1 flex justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <QRCodeDisplay url={qrUrl} size={250} />
          </div>
        </div>

        {/* Roata */}
        <div className="lg:flex-1 flex justify-center">
          {currentPrizes.length ? (
            <PrizeWheel
              prizes={currentPrizes}
              selectedPrize={selectedPrize}
              isSpinning={isSpinning}
              onSpinComplete={handleSpinComplete}
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

      {/* Tabel stoc */}
      <div className="p-8">
        <StockTable />
      </div>
    </div>
  );
}
