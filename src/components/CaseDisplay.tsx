/* src/components/CaseDisplay.tsx */
import { useEffect, useState, useCallback, useRef } from 'react';
import { PRIZES, Prize } from '@/types/prizes';
import {
  pickPrize, consumePrize, addSpinResult, setSpinning,
} from '@/utils/gameState';
import { listen, unlisten, trigger } from '@/utils/realtime';
import { QRCodeDisplay } from './QRCodeDisplay';
import { StockTable }    from './StockTable';
import CaseOpening       from './CaseOpening';
import { Howl }          from 'howler';

/* sunete (asigură-te că fișierele există în /public) */
const tickSnd = new Howl({ src: ['/scroll.mp3'], volume: 0.45 });
const winSnd  = new Howl({ src: ['/win.mp3'],    volume: 0.9  });

export default function CaseDisplay() {
  const [selected, setSel]  = useState<Prize | null>(null);
  const [rolling,  setRoll] = useState(false);
  const [msg,      setMsg]  = useState('Așteptăm participanți…');
  const [player,   setPl]   = useState('');

  const qrUrl = `${window.location.origin}/spin`;
  const tickTimer = useRef<number | null>(null);

  const startTicks = () => {
    stopTicks();
    tickTimer.current = window.setInterval(() => tickSnd.play(), 85);
  };
  const stopTicks = () => {
    if (tickTimer.current) {
      clearInterval(tickTimer.current);
      tickTimer.current = null;
    }
  };

  /* telefon cere spin */
  const handleRequest = useCallback((d: { firstName: string }) => {
    if (rolling) return;
    const prize = pickPrize();          // <-- UNICĂ dată când decidem premiul

    setPl(d.firstName);
    setSel(prize);
    setMsg(`${d.firstName} deschide cutia…`);
    setRoll(true);
    setSpinning(true);
    startTicks();
  }, [rolling]);

  useEffect(() => {
    listen('request_spin', handleRequest);
    return () => unlisten('request_spin', handleRequest);
  }, [handleRequest]);

  /* vine din CaseOpening exact ce e sub marker */
  const handleDone = async (prize: Prize) => {
    stopTicks();
    try { winSnd.play(); } catch {}

    consumePrize(prize.id);
    addSpinResult({ prize, firstName: player });
    setMsg(`Felicitări! ${player} a câștigat ${prize.name}! 🎉`);

    await trigger('spin_result', { firstName: player, prize });

    setTimeout(() => {
      setRoll(false);
      setSpinning(false);
      setSel(null);
      setPl('');
      setMsg('Așteptăm participanți…');
    }, 5000);
  };

  return (
    <div className="flex flex-col items-center">
      {/* HEADER */}
      <header className="w-full bg-blue-900/30 backdrop-blur-sm py-4 mb-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-1">
          <div className="flex items-center gap-4">
            <img
              src="https://rovision.ro/wp-content/themes/storefront-child/rovision-logo.svg"
              alt="Rovision"
              className="h-16"
            />
            <h1 className="text-white text-4xl font-extrabold drop-shadow-md tracking-wide">
              Tombola norocului
            </h1>
          </div>
          <p className="text-white text-2xl font-semibold mt-2 text-center">{msg}</p>
        </div>
      </header>

      {/* RULETĂ MARE */}
      <section className="w-full max-w-[1700px] px-6 mb-12">
        <CaseOpening
          prizes={PRIZES}
          selected={selected}
          rolling={rolling}
          onDone={handleDone}
        />
      </section>

      {/* TABEL + QR dedesubt */}
      <section className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-start">
        <StockTable />
        <div className="lg:justify-self-end">
          <QRCodeDisplay url={qrUrl} px={320} />
        </div>
      </section>
    </div>
  );
}
