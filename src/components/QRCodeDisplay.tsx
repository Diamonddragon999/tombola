import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QRCodeDisplayProps {
  url: string;
  size?: number;
}

export function QRCodeDisplay({ url, size = 200 }: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    const generateQR = async () => {
      try {
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(qrDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQR();
  }, [url, size]);

  return (
    <Card className="w-fit mx-auto bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-center text-gray-800 text-lg font-bold">
          Scanează pentru a te înscrie!
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        {qrCodeUrl && (
          <img 
            src={qrCodeUrl} 
            alt="QR Code" 
            className="rounded-lg shadow-lg"
          />
        )}
      </CardContent>
    </Card>
  );
}