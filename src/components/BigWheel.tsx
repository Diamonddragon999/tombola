import { useEffect, useState } from 'react';
import PrizeWheel from './PrizeWheel';
import { QRCodeDisplay } from './QRCodeDisplay';
import { StockTable } from './StockTable';
import {
  getAvailablePrizes,
  pickPrize,
  consumePrize,
  addSpinResult,
  setSpinning as setSpinningFlag,
} from '@/utils/gameState';
import { listen, trigger, unlisten } from '@/utils/realtime';
import { Prize } from '@/types/prizes';

export default function BigWheel() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [selected, setSelected] = useState<Prize | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [player, setPlayer] = useState('');
  const [msg, setMsg] = useState('Așteptăm participanți…');

  /* inițial: încărcăm stocul în roată */
  useEffect(() => setPrizes(getAvailablePrizes()), []);

  /* ▶️ vine cererea de la telefon */
  useEffect(() => {
    const cb = (d: { firstName: string }) => {
      if (spinning) return;

      const prize = pickPrize();
      setPlayer(d.firstName);
      setSelected(prize);
      setMsg(`${d.firstName} învârte roata…`);
      setSpinning(true);
      setSpinningFlag(true);

      /* salvăm în localStorage – dacă dai F5 pe /display roata știe ce are de făcut */
      localStorage.setItem('prizes', JSON.stringify(getAvailablePrizes()));
      localStorage.setItem('selectedPrize', JSON.stringify(prize));
    };
    listen('request_spin', cb);
    return () => unlisten('request_spin', cb);
  }, [spinning]);

  /* ✅ roata s‑a oprit */
  const handleDone = async () => {
    if (!selected) return;

    consumePrize(selected.id);
    addSpinResult({ prize: selected, firstName: player });
    setMsg(`${player} a câștigat: ${selected.name}!`);

    await trigger('spin_result', { firstName: player, prize: selected });

    /* actualizăm stocul din tabel */
    setPrizes(getAvailablePrizes());

    /* reset după 5 secunde */
    setTimeout(() => {
      setSpinning(false);
      setSpinningFlag(false);
      setSelected(null);
      setPlayer('');
      setMsg('Așteptăm participanți…');
      localStorage.removeItem('prizes');
      localStorage.removeItem('selectedPrize');
    }, 5000);
  };

  /* UI ----------------------------------------------------------- */
  const qrUrl = `${window.location.origin}/spin`;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <header className="p-8 text-center">
        <img
          src="https://rovision.ro/wp-content/themes/storefront-child/rovision-logo.svg"
          alt="logo"
          className="h-16 mx-auto mb-4"
        />
        <h2 className="text-3xl font-bold text-white">{msg}</h2>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 px-8">
        <section className="lg:flex-1 flex justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <QRCodeDisplay url={qrUrl} size={250} />
          </div>
        </section>

        <section className="lg:flex-1 flex justify-center">
          {prizes.length ? (
            <PrizeWheel
              prizes={prizes}
              selected={selected}
              spinning={spinning}
              onDone={handleDone}
            />
          ) : (
            <p className="text-red-400 text‑xl font-bold">
              Nu mai sunt premii disponibile!
            </p>
          )}
        </section>
      </main>

      <footer className="p-8">
        <StockTable />
      </footer>
    </div>
  );
}
