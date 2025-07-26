import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  url: string;
  size?: number;
}

export function QRCodeDisplay({ url, size = 200 }: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(url, { width: size, margin: 2 }).then(setQrCodeUrl);
  }, [url, size]);

  return (
    <div className="glass neon p-4 flex flex-col items-center">
      <p className="text-lg font-bold mb-4 text-white drop-shadow">Scanează pentru a te înscrie!</p>
      {qrCodeUrl && (
        <img
          src={qrCodeUrl}
          alt="QR Code"
          className="rounded-lg shadow-[0_0_24px_rgba(255,255,255,.15)] bg-white p-2"
        />
      )}
    </div>
  );
}
