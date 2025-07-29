//src/components/CaseDisplay.tsx
import { useEffect, useState, useCallback, useRef } from 'react';
import { PRIZES, Prize } from '@/types/prizes';
import { pickPrize, consumePrize, addSpinResult, setSpinning } from '@/utils/gameState';
import { listen, unlisten, trigger } from '@/utils/realtime';
import { QRCodeDisplay } from './QRCodeDisplay';
import { StockTable } from './StockTable';
import CaseOpening from './CaseOpening';
import { Howl } from 'howler';

const tickSnd = new Howl({ src: ['/scroll.mp3'], volume: 0.45 });
const winSnd = new Howl({ src: ['/win.mp3'], volume: 0.9 });
const handleTick = () => tickSnd.play(); // fără setInterval

export default function CaseDisplay() {
  const [selected, setSel] = useState<Prize | null>(null);
  const [rolling, setRoll] = useState(false);
  const [msg, setMsg] = useState('Așteptăm participanți…');
  const [player, setPl] = useState('');
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
    <div className="bg-premium min-h-screen w-full overflow-x-hidden flex flex-col items-center pb-16 tv-scale-xs">
      {/* HEADER */}
      <header className="w-full max-w-screen-xl mx-auto px-6 lg:px-12 py-6 flex items-center justify-between gap-6">
        {/* logo */}
        <img
          src="https://rovision.ro/wp-content/themes/storefront-child/rovision-logo.svg"
          alt="Rovision"
          className="h-10 sm:h-14 lg:h-20 drop-shadow-lg"
        />

        <h1 className="text-white font-extrabold tracking-tight
                   text-xl sm:text-2xl lg:text-3xl text-center">
      Tombola Norocului – Young Festival
    </h1>

        {/* titlu nou */}
        <p className="mt-4 text-white/90 font-medium text-base sm:text-lg lg:text-xl text-center">
          {msg}
        </p>
        
      </header>
      
      {/* RULETĂ + QR */}
      <section className="w-full max-w-screen-xl px-4 sm:px-6 lg:px-10 mt-6 sm:mt-10 flex flex-col items-center relative">
        <CaseOpening
          prizes={PRIZES}
          selected={selected}
          rolling={rolling}
          onDone={handleDone}
          onTick={handleTick}
        />

        {/* QR – desktop */}
        <div className="hidden lg:block fixed bottom-6 right-6 z-30">
          <QRCodeDisplay url={qrUrl} px={220} />   {/* ușor mai mic */}
        </div>

        {/* QR – mobile/tablet (centru sub ruletă) */}
        <div className="lg:hidden mt-8">
          <QRCodeDisplay url={qrUrl} px={180} />
        </div>
      </section>

      {/* TABEL */}
      <section className="w-full max-w-screen-xl px-4 sm:px-6 lg:px-10 mt-10 sm:mt-14">
        <StockTable />
      </section>
    </div>
  );
}
