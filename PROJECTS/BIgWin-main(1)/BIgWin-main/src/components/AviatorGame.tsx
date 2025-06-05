import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import ApiService from '@/services/apiService';

interface AviatorGameProps {
  user: { balance: number; id: string };
  onWin: (amount: number) => void;
  onLose: (amount: number) => void;
  onClose: () => void;
}

const AviatorGame: React.FC<AviatorGameProps> = ({ user, onWin, onLose, onClose }) => {
  const [gameState, setGameState] = useState<'waiting' | 'flying' | 'crashed' | 'cashed_out'>('waiting');
  const [multiplier, setMultiplier] = useState(1.00);
  const [betAmount, setBetAmount] = useState(1);
  const [hasPlacedBet, setHasPlacedBet] = useState(false);
  const [crashPoint, setCrashPoint] = useState(0);
  const [gameHistory, setGameHistory] = useState<number[]>([2.34, 1.23, 4.56, 1.89, 3.21]);
  const intervalRef = useRef<NodeJS.Timeout>();
  const engineSoundRef = useRef<HTMLAudioElement>();
  const crashSoundRef = useRef<HTMLAudioElement>();

  const minBet = 0.5;
  const maxBet = Math.min(user.balance, 50);

  useEffect(() => {
    // Initialize audio
    engineSoundRef.current = new Audio('/sounds/engine.mp3');
    crashSoundRef.current = new Audio('/sounds/crash.mp3');
    
    // Set audio properties
    if (engineSoundRef.current) {
      engineSoundRef.current.loop = true;
      engineSoundRef.current.volume = 0.3;
    }
    if (crashSoundRef.current) {
      crashSoundRef.current.volume = 0.5;
    }

    return () => {
      if (engineSoundRef.current) {
        engineSoundRef.current.pause();
      }
    };
  }, []);

  const playEngineSound = () => {
    if (engineSoundRef.current) {
      engineSoundRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const stopEngineSound = () => {
    if (engineSoundRef.current) {
      engineSoundRef.current.pause();
      engineSoundRef.current.currentTime = 0;
    }
  };

  const playCrashSound = () => {
    if (crashSoundRef.current) {
      crashSoundRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const startGame = async () => {
    if (!hasPlacedBet || user.balance < betAmount) {
      console.log('Cannot start game: bet not placed or insufficient balance');
      return;
    }

    console.log('Starting Aviator game with bet:', betAmount);
    setGameState('flying');
    setMultiplier(1.00);
    playEngineSound();
    
    try {
      // Call backend to play the game
      const result = await ApiService.playAviator(user.id, betAmount);
      console.log('Aviator game result:', result);
      
      const newCrashPoint = result.crashPoint || (1.2 + Math.random() * 3);
      setCrashPoint(newCrashPoint);
      
      let currentMultiplier = 1.00;
      intervalRef.current = setInterval(() => {
        currentMultiplier += 0.01;
        setMultiplier(currentMultiplier);
        
        if (currentMultiplier >= newCrashPoint) {
          console.log('Game crashed at:', currentMultiplier);
          setGameState('crashed');
          stopEngineSound();
          playCrashSound();
          onLose(betAmount);
          setGameHistory(prev => [newCrashPoint, ...prev.slice(0, 4)]);
          clearInterval(intervalRef.current!);
          setTimeout(() => {
            setGameState('waiting');
            setHasPlacedBet(false);
          }, 3000);
        }
      }, 100);
    } catch (error) {
      console.error('Error starting Aviator game:', error);
      
      // Fallback to local game logic if backend fails
      const fallbackCrashPoint = 1.2 + Math.random() * 3;
      setCrashPoint(fallbackCrashPoint);
      
      let currentMultiplier = 1.00;
      intervalRef.current = setInterval(() => {
        currentMultiplier += 0.01;
        setMultiplier(currentMultiplier);
        
        if (currentMultiplier >= fallbackCrashPoint) {
          console.log('Fallback game crashed at:', currentMultiplier);
          setGameState('crashed');
          stopEngineSound();
          playCrashSound();
          onLose(betAmount);
          setGameHistory(prev => [fallbackCrashPoint, ...prev.slice(0, 4)]);
          clearInterval(intervalRef.current!);
          setTimeout(() => {
            setGameState('waiting');
            setHasPlacedBet(false);
          }, 3000);
        }
      }, 100);
    }
  };

  const cashOut = () => {
    if (gameState === 'flying') {
      console.log('Cashing out at multiplier:', multiplier);
      setGameState('cashed_out');
      stopEngineSound();
      const winAmount = betAmount * multiplier - betAmount;
      onWin(winAmount);
      setGameHistory(prev => [multiplier, ...prev.slice(0, 4)]);
      clearInterval(intervalRef.current!);
      setTimeout(() => {
        setGameState('waiting');
        setHasPlacedBet(false);
      }, 3000);
    }
  };

  const placeBet = () => {
    if (user.balance >= betAmount) {
      console.log('Bet placed:', betAmount);
      setHasPlacedBet(true);
    } else {
      alert('Insufficient balance!');
    }
  };

  useEffect(() => {
    if (gameState === 'waiting' && hasPlacedBet) {
      console.log('Auto-starting game in 2 seconds...');
      const timer = setTimeout(startGame, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState, hasPlacedBet]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      stopEngineSound();
    };
  }, []);

  // Cloud animation component
  const AnimatedClouds = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="cloud cloud-1">☁️</div>
      <div className="cloud cloud-2">☁️</div>
      <div className="cloud cloud-3">☁️</div>
      <div className="cloud cloud-4">☁️</div>
      <style>{`
        .cloud {
          position: absolute;
          font-size: 1.5rem;
          opacity: 0.6;
          animation: float 10s infinite linear;
        }
        .cloud-1 {
          top: 20%;
          animation-delay: 0s;
        }
        .cloud-2 {
          top: 40%;
          animation-delay: -3s;
        }
        .cloud-3 {
          top: 60%;
          animation-delay: -6s;
        }
        .cloud-4 {
          top: 80%;
          animation-delay: -9s;
        }
        @keyframes float {
          0% {
            transform: translateX(-100px);
          }
          100% {
            transform: translateX(calc(100vw + 100px));
          }
        }
        @keyframes fly {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-5px) rotate(2deg);
          }
          50% {
            transform: translateY(-10px) rotate(0deg);
          }
          75% {
            transform: translateY(-5px) rotate(-2deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 z-50">
      <Card className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white border-0 w-full max-w-sm sm:max-w-md shadow-2xl">
        <CardHeader className="text-center pb-2 px-3 sm:px-4">
          <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex-1 text-center">
              ✈️ AVIATOR GAME
            </CardTitle>
            <Button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white border-0 w-8 h-8 p-0 text-sm font-bold rounded-full ml-2"
              size="sm"
            >
              ✕
            </Button>
          </div>
          <div className="text-xs sm:text-sm text-blue-300">
            Balance: <span className="font-bold text-green-400">{user.balance.toFixed(2)} USDT</span>
          </div>
        </CardHeader>

        <CardContent className="px-3 sm:px-4 space-y-4">
          {/* Game History */}
          <div className="bg-black/30 p-3 rounded border border-purple-500/30">
            <div className="text-xs text-gray-400 mb-2">Recent Results:</div>
            <div className="flex gap-2 flex-wrap">
              {gameHistory.map((result, index) => (
                <div
                  key={index}
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    result >= 2 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  }`}
                >
                  {result.toFixed(2)}x
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Game Display with Sky Background */}
          <div className="bg-gradient-to-b from-blue-400 via-blue-300 to-blue-200 h-40 sm:h-48 rounded border border-purple-500/30 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Animated clouds */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20% text-lg opacity-60 animate-[float_10s_infinite_linear]">☁️</div>
              <div className="absolute top-40% text-lg opacity-60 animate-[float_10s_infinite_linear] animation-delay-[-3s]">☁️</div>
              <div className="absolute top-60% text-lg opacity-60 animate-[float_10s_infinite_linear] animation-delay-[-6s]">☁️</div>
              <div className="absolute top-80% text-lg opacity-60 animate-[float_10s_infinite_linear] animation-delay-[-9s]">☁️</div>
            </div>
            
            {gameState === 'waiting' && !hasPlacedBet && (
              <div className="text-center z-10">
                <img 
                  src="/lovable-uploads/a521463b-432e-4a84-96b0-445858831bdc.png" 
                  alt="Plane"
                  className="w-16 h-12 mx-auto mb-2"
                />
                <div className="text-lg font-bold text-purple-800">Place your bet!</div>
              </div>
            )}

            {gameState === 'waiting' && hasPlacedBet && (
              <div className="text-center z-10">
                <img 
                  src="/lovable-uploads/a521463b-432e-4a84-96b0-445858831bdc.png" 
                  alt="Plane"
                  className="w-16 h-12 mx-auto mb-2 animate-bounce"
                />
                <div className="text-lg font-bold text-purple-800">Starting...</div>
                <div className="text-sm text-purple-600">Bet: {betAmount} USDT</div>
              </div>
            )}

            {gameState === 'flying' && (
              <div className="text-center z-10">
                <img 
                  src="/lovable-uploads/a521463b-432e-4a84-96b0-445858831bdc.png" 
                  alt="Flying Plane"
                  className="w-20 h-16 mx-auto mb-2 transition-transform duration-100" 
                  style={{ 
                    transform: `translateY(-${multiplier * 2}px) scale(${1 + multiplier * 0.05}) rotate(${Math.sin(Date.now() / 1000) * 5}deg)`,
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                  }}
                />
                <div className="text-3xl sm:text-4xl font-bold text-green-600 bg-white/90 px-4 py-2 rounded-lg shadow-lg">
                  {multiplier.toFixed(2)}x
                </div>
                <div className="text-sm text-purple-800 mt-2 bg-white/80 px-3 py-1 rounded">
                  Potential win: {(betAmount * multiplier).toFixed(2)} USDT
                </div>
              </div>
            )}

            {gameState === 'crashed' && (
              <div className="text-center z-10">
                <div className="text-4xl sm:text-5xl mb-2 animate-pulse">💥</div>
                <div className="text-2xl font-bold text-red-600 bg-white/90 px-4 py-2 rounded-lg">CRASHED!</div>
                <div className="text-lg text-red-500">{crashPoint.toFixed(2)}x</div>
                <div className="text-sm text-purple-800">Lost {betAmount} USDT</div>
              </div>
            )}

            {gameState === 'cashed_out' && (
              <div className="text-center z-10">
                <div className="text-4xl sm:text-5xl mb-2">🎉</div>
                <div className="text-2xl font-bold text-green-600 bg-white/90 px-4 py-2 rounded-lg">CASHED OUT!</div>
                <div className="text-lg text-green-500">{multiplier.toFixed(2)}x</div>
                <div className="text-sm text-purple-800">
                  Won {(betAmount * multiplier - betAmount).toFixed(2)} USDT
                </div>
              </div>
            )}
          </div>

          {/* Betting Controls */}
          {gameState === 'waiting' && !hasPlacedBet && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Bet Amount (USDT)</label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Math.max(minBet, Math.min(maxBet, parseFloat(e.target.value) || minBet)))}
                  min={minBet}
                  max={maxBet}
                  step="0.1"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-center text-base font-bold"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {[0.5, 1, 2, 5].filter(amount => amount <= maxBet).map(amount => (
                  <Button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    className="bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 text-xs py-1"
                    size="sm"
                  >
                    {amount}
                  </Button>
                ))}
              </div>

              <Button
                onClick={placeBet}
                disabled={user.balance < betAmount}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 hover:scale-105 transition-transform disabled:opacity-50"
              >
                {user.balance < betAmount ? 'INSUFFICIENT BALANCE' : `PLACE BET (${betAmount} USDT)`}
              </Button>
            </div>
          )}

          {gameState === 'flying' && (
            <Button
              onClick={cashOut}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 text-lg hover:scale-105 transition-transform animate-pulse"
            >
              💰 CASH OUT ({(betAmount * multiplier).toFixed(2)} USDT)
            </Button>
          )}

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-gray-400 text-gray-200 hover:bg-gray-700 hover:text-white bg-gray-800/70 backdrop-blur-sm text-sm font-semibold py-2"
          >
            Close Game
          </Button>
        </CardContent>
      </Card>

      <style>{`
        @keyframes float {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(calc(100vw + 100px)); }
        }
      `}</style>
    </div>
  );
};

export default AviatorGame;
