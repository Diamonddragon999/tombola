import { useEffect, useState, useCallback } from 'react';
import { PRIZES, Prize } from '@/types/prizes';
import {
  pickPrize, consumePrize, addSpinResult, setSpinning,
} from '@/utils/gameState';
import { listen, unlisten, trigger } from '@/utils/realtime';
import { QRCodeDisplay } from './QRCodeDisplay';
import { StockTable } from './StockTable';
import CaseOpening from './CaseOpening';

const WIN_MSG_MS = 10000; // 10 sec pe ecran

export default function CaseDisplay() {
  const [selected, setSel]  = useState<Prize | null>(null);
  const [rolling,  setRoll] = useState(false);
  const [msg,      setMsg]  = useState('Așteptăm participanți…');

  const qrUrl = `${window.location.origin}/spin`;

  const handleRequest = useCallback(async (d: { firstName: string }) => {
    if (rolling) return;

    const prize = pickPrize();
    setSel(prize);
    setMsg(`${d.firstName} deschide cutia…`);
    setRoll(true);
    setSpinning(true);

    await new Promise(r => setTimeout(r, 3300)); // animație

    consumePrize(prize.id);
    addSpinResult({ prize, firstName: d.firstName });
    setMsg(`Felicitări! ${d.firstName} a câștigat ${prize.name}! 🎉`);

    await trigger('spin_result', { firstName: d.firstName, prize });

    setTimeout(() => {
      setRoll(false);
      setSpinning(false);
      setSel(null);
      setMsg('Așteptăm participanți…');
    }, WIN_MSG_MS);
  }, [rolling]);

  useEffect(() => {
    listen('request_spin', handleRequest);
    return () => unlisten('request_spin', handleRequest);
  }, [handleRequest]);

  return (
    <div className="w-full max-w-[1500px] grid grid-cols-1 xl:grid-cols-[320px_1fr_420px] gap-10 items-start">
      {/* QR */}
      <div className="glass neon-blue p-6">
        <QRCodeDisplay url={qrUrl} size={240} />
      </div>

      {/* cutie + mesaj */}
      <div className="flex flex-col items-center">
        <img
          src="https://rovision.ro/wp-content/themes/storefront-child/rovision-logo.svg"
          alt="Rovision"
          className="h-20 mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,.35)]"
        />

        <p className="text-2xl font-semibold text-white mb-6 text-center drop-shadow-[0_0_8px_rgba(0,0,0,.5)]">
          {msg}
        </p>

        <CaseOpening
          prizes={PRIZES}
          selected={selected}
          rolling={rolling}
          onDone={()=>{}}
        />
      </div>

      {/* Tabel stoc */}
      <div className="glass neon-violet p-6 max-h-[80vh] overflow-auto">
        <StockTable />
      </div>
    </div>
  );
}
