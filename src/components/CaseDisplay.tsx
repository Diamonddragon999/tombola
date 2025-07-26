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

/* ---- sunete ---- */
const tickSnd = new Howl({ src: ['/scroll.mp3'], volume: 0.45 });
const winSnd  = new Howl({ src: ['/win.mp3'],    volume: 0.9  });

export default function CaseDisplay() {
  const [selected, setSel]  = useState<Prize | null>(null);
  const [rolling,  setRoll] = useState(false);
  const [msg,      setMsg]  = useState('Așteptăm participanți…');
  const [player,   setPl]   = useState('');

  const qrUrl = `${window.location.origin}/spin`;
  const tickTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* pornește / oprește ticurile */
  const startTicks = () => {
    stopTicks();
    tickTimer.current = setInterval(() => tickSnd.play(), 85); // ~12Hz
  };
  const stopTicks = () => {
    if (tickTimer.current) {
      clearInterval(tickTimer.current);
      tickTimer.current = null;
    }
  };

  /* request de pe telefon */
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
    return () => {
      unlisten('request_spin', handleRequest);
      stopTicks();
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, [handleRequest]);

  /* când animația s-a terminat în <CaseOpening> */
  const handleDone = async () => {
    stopTicks();
    winSnd.play();

    if (!selected) return;

    consumePrize(selected.id);
    addSpinResult({ prize: selected, firstName: player });
    setMsg(`Felicitări! ${player} a câștigat ${selected.name}! 🎉`);

    await trigger('spin_result', { firstName: player, prize: selected });

    /* ținem mesajul mai mult (8s) */
    resetTimer.current = setTimeout(() => {
      setRoll(false);
      setSpinning(false);
      setSel(null);
      setPl('');
      setMsg('Așteptăm participanți…');
    }, 8000);
  };

  /* UI */
  return (
    <div className="relative flex flex-col items-center">
      {/* HEADER */}
      <header className="w-full max-w-7xl mx-auto flex flex-col items-center mt-6 mb-8">
        <img
          src="https://rovision.ro/wp-content/themes/storefront-child/rovision-logo.svg"
          alt="Rovision"
          className="h-20 mb-3 drop-shadow-lg"
        />
        <h1 className="text-white text-4xl font-extrabold drop-shadow-md tracking-wide mb-1">
          Ruleta norocului
        </h1>
        <p className="text-white text-2xl font-semibold text-center px-4">{msg}</p>
      </header>

      {/* MAIN AREA */}
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center gap-10">
        {/* Ruleta mare pe centru */}
        <div className="w-full flex justify-center">
          <CaseOpening
            prizes={PRIZES}
            selected={selected}
            rolling={rolling}
            onDone={handleDone}
          />
        </div>

        {/* Tabel mare dedesubt */}
        <section className="w-full max-w-6xl mx-auto mt-10 px-4">
          <StockTable />
        </section>
      </div>

      {/* QR în dreapta, poziționat fix / vizibil mereu */}
      <div className="fixed right-8 top-24 z-30">
        {/* Ajustează px după nevoie (tipul prop-ului este px) */}
        <QRCodeDisplay url={qrUrl} px={320} />
      </div>
    </div>
  );
}
