import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  url: string;
  px?: number;
}

export function QRCodeDisplay({ url, px = 320 }: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    QRCode.toDataURL(url, { width: px, margin: 2 }).then(setQrCodeUrl);
  }, [url, px]);

  return (
    <div className="glass neon-violet p-6 flex flex-col items-center max-w-fit">
      <p className="text-xl font-bold mb-4 text-white drop-shadow">Scanează pentru a te înscrie!</p>
      {qrCodeUrl && (
        <img
          src={qrCodeUrl}
          alt="QR Code"
          className="rounded-lg shadow-[0_0_24px_rgba(255,255,255,.25)] bg-white p-3"
        />
      )}
    </div>
  );
}
