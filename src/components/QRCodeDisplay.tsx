//src/components/QRCodeDisplay.tsx
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export interface QRCodeDisplayProps {
  url: string;
  px?: number;         // <-- dimensiune în px (default 280)
}

export function QRCodeDisplay({ url, px = 280 }: QRCodeDisplayProps) {
  const [qr, setQr] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(url, { width: px, margin: 2 }).then(setQr);
  }, [url, px]);

  return (
    <div className="glass p-4 rounded-xl shadow-xl flex flex-col items-center">
      <p className="text-white/90 font-bold mb-3 drop-shadow">Scanează pentru a te înscrie!</p>
      {qr && (
        <img
          src={qr}
          alt="QR Code"
          style={{ width: px }}
          className="rounded-lg bg-white p-2 shadow-[0_0_32px_rgba(255,255,255,.15)]"
        />
      )}
    </div>
  );
}
