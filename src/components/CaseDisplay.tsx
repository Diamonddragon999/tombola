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

const tickSnd = new Howl({ src: ['/scroll.mp3'], volume: 0.45 });
const winSnd  = new Howl({ src: ['/win.mp3'],    volume: 0.9  });

export default function CaseDisplay() {
  const [selected, setSel]  = useState<Prize | null>(null);
  const [rolling,  setRoll] = useState(false);
  const [msg,      setMsg]  = useState('Așteptăm participanți…');
  const [player,   setPl]   = useState('');
  const qrUrl = `${window.location.origin}/spin`;

  const tickTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTicks = () => {
    stopTicks();
    tickTimer.current = setInterval(() => tickSnd.play(), 90);
  };
  const stopTicks = () => {
    if (tickTimer.current) { clearInterval(tickTimer.current); tickTimer.current = null; }
  };

  const handleRequest = useCallback((d: { firstName: string }) => {
    if (rolling) return;
    const prize = pickPrize();

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

  const handleDone = async () => {
    stopTicks();
    winSnd.play();

    if (!selected) return;

    consumePrize(selected.id);
    addSpinResult({ prize: selected, firstName: player });
    setMsg(`Felicitări! ${player} a câștigat ${selected.name}! 🎉`);

    await trigger('spin_result', { firstName: player, prize: selected });

    setTimeout(() => {
      setRoll(false);
      setSpinning(false);
      setSel(null);
      setPl('');
      setMsg('Așteptăm participanți…');
    }, 6000);
  };

  return (
    <div className="bg-premium min-h-screen w-full overflow-x-hidden flex flex-col items-center pb-24">
      {/* HEADER */}
      <header className="w-full max-w-[1920px] mx-auto px-10 pt-10 flex flex-col items-center gap-4">
        <div className="flex items-center gap-6">
          <img
            src="https://rovision.ro/wp-content/themes/storefront-child/rovision-logo.svg"
            alt="Rovision"
            className="h-[110px]"
          />
          <h1 className="text-white text-6xl font-extrabold">Tombola norocului</h1>
        </div>
        <p className="text-white text-3xl font-semibold drop-shadow-md">{msg}</p>
      </header>

      {/* RULETĂ + QR */}
      <section className="w-full max-w-[1920px] px-10 mt-12 flex flex-col items-center relative">
        <CaseOpening
          prizes={PRIZES}
          selected={selected}
          rolling={rolling}
          onDone={handleDone}
        />

        {/* QR: lipit de marginea dreapta, mai mare */}
        <div className="hidden lg:block fixed right-6 top-1/2 -translate-y-1/2 z-30">
          <QRCodeDisplay url={qrUrl} px={420} />
        </div>
      </section>

      {/* TABEL DEDESUBT */}
      <section className="w-full max-w-[1920px] px-10">
        <StockTable />
      </section>
    </div>
  );
}
