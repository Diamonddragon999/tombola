import { useState, useEffect } from 'react';
import { PrizeWheel } from './PrizeWheel';
import { StockTable } from './StockTable';
import { QRCodeDisplay } from './QRCodeDisplay';
import { Card, CardContent } from '@/components/ui/card';
import { getAvailablePrizes, selectRandomPrize, consumePrize, addSpinResult, setSpinning } from '../utils/gameState';
import { socketManager } from '../utils/socket';
import { Prize } from '../types/prizes';

export function BigWheel() {
  const [currentPrizes, setCurrentPrizes] = useState<Prize[]>([]);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<string>('');
  const [message, setMessage] = useState<string>('Așteptăm participanți...');
  const qrUrl = `${window.location.origin}/spin`;

  useEffect(() => {
    setCurrentPrizes(getAvailablePrizes());
  }, []);

  useEffect(() => {
    const socket = socketManager.connect();
    
    socket.on('request_spin', (data) => {
      if (isSpinning) return;
      
      setCurrentPlayer(data.firstName);
      setMessage(`${data.firstName} învârte roata...`);
      
      const prize = selectRandomPrize();
      if (!prize) {
        setMessage('Nu mai sunt premii disponibile!');
        return;
      }
      
      setSelectedPrize(prize);
      setIsSpinning(true);
    });

    return () => {
      socket.off('request_spin');
    };
  }, [isSpinning]);

  const handleSpinComplete = () => {
    if (!selectedPrize) return;
    
    const success = consumePrize(selectedPrize.id);
    if (success) {
      addSpinResult({
        prize: selectedPrize,
        firstName: currentPlayer
      });
      
      setMessage(`${currentPlayer} a câștigat: ${selectedPrize.name}!`);
      
      // Emit result
      socketManager.emit('spin_result', {
        firstName: currentPlayer,
        prize: selectedPrize
      });
      
      // Update available prizes
      setCurrentPrizes(getAvailablePrizes());
      
      // Reset after 5 seconds
      setTimeout(() => {
        setIsSpinning(false);
        setSpinning(false);
        setSelectedPrize(null);
        setCurrentPlayer('');
        setMessage('Așteptăm participanți...');
      }, 5000);
    } else {
      setMessage('Eroare la acordarea premiului!');
      setIsSpinning(false);
      setSpinning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex flex-col">
      {/* Header */}
      <div className="p-8 text-center relative">
        <div className="flex items-center justify-center gap-8 mb-4">
          <img 
            src="https://rovision.ro/wp-content/themes/storefront-child/rovision-logo.svg" 
            alt="Rovision Logo" 
            className="h-16 w-auto"
          />
          <div>
            <h1 className="text-6xl font-bold text-white mb-2">Young Festival 2025</h1>
            <h2 className="text-3xl text-yellow-400">Roata Norocului</h2>
            <p className="text-xl text-green-400 font-semibold mt-2">🎯 Toată lumea câștigă!</p>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="text-center mb-8">
        <Card className="w-fit mx-auto bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <p className="text-2xl font-bold text-white">{message}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Desktop: QR left, Wheel right */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 px-8">
        {/* QR Code Section */}
        <div className="lg:flex-1 flex justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <QRCodeDisplay url={qrUrl} size={250} />
          </div>
        </div>
        
        {/* Wheel Section */}
        <div className="lg:flex-1 flex justify-center">
          {currentPrizes.length > 0 ? (
            <PrizeWheel
              prizes={currentPrizes}
              selectedPrize={selectedPrize}
              isSpinning={isSpinning}
              onSpinComplete={handleSpinComplete}
            />
          ) : (
            <Card className="w-fit mx-auto bg-red-500/20 backdrop-blur-sm border-red-500/30">
              <CardContent className="p-8">
                <p className="text-3xl text-red-300 font-bold">Nu mai sunt premii disponibile!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Stock Table */}
      <div className="p-8">
        <StockTable />
      </div>
    </div>
  );
}