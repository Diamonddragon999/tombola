// src/components/QRCodeDisplay.tsx
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  url: string;
  px?: number;            // dimensiunea reală în pixeli a imaginii QR
}

export function QRCodeDisplay({ url, px = 520 }: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(url, { width: px, margin: 2 }).then(setQrCodeUrl);
  }, [url, px]);

  return (
    <div
      className="shrink-0 glass rounded-2xl p-6 flex flex-col items-center gap-4"
      style={{ maxWidth: px + 48 }}   // + padding
    >
      <p className="text-2xl font-extrabold text-white drop-shadow-md tracking-wide">
        Scanează pentru a te înscrie!
      </p>

      {qrCodeUrl && (
        <img
          src={qrCodeUrl}
          alt="QR Code"
          className="w-full h-auto rounded-xl shadow-[0_0_36px_rgba(255,255,255,.2)] bg-white p-3"
        />
      )}
    </div>
  );
}
