
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { useRef, useState, useEffect } from 'react';
import ApiService from '@/services/apiService';

interface SpinningWheelProps {
  user: { balance: number; id: string };
  onWin: (amount: number) => void;
  onLose: (amount: number) => void;
  onClose: () => void;
}

const SpinningWheel: React.FC<SpinningWheelProps> = ({ user, onWin, onLose, onClose }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<{ type: 'win' | 'lose'; amount: number } | null>(null);
  const [rotation, setRotation] = useState(0);
  const [stakeAmount, setStakeAmount] = useState(1);
  const spinCountRef = useRef(0);
  const spinSoundRef = useRef<HTMLAudioElement>();
  const winSoundRef = useRef<HTMLAudioElement>();
  const loseSoundRef = useRef<HTMLAudioElement>();

  useEffect(() => {
    // Initialize audio
    spinSoundRef.current = new Audio('/sounds/spin.mp3');
    winSoundRef.current = new Audio('/sounds/win.mp3');
    loseSoundRef.current = new Audio('/sounds/lose.mp3');
    
    // Set audio properties
    if (spinSoundRef.current) spinSoundRef.current.volume = 0.4;
    if (winSoundRef.current) winSoundRef.current.volume = 0.5;
    if (loseSoundRef.current) loseSoundRef.current.volume = 0.5;
  }, []);

  const playSpinSound = () => {
    if (spinSoundRef.current) {
      spinSoundRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const playWinSound = () => {
    if (winSoundRef.current) {
      winSoundRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const playLoseSound = () => {
    if (loseSoundRef.current) {
      loseSoundRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  // Premium wheel segments with better visual distribution
  const segments = [
    { type: 'lose', amount: 0, color: '#dc2626', label: 'LOSE', textColor: '#ffffff' },
    { type: 'win', amount: 1, color: '#10b981', label: '1x', textColor: '#ffffff' },
    { type: 'lose', amount: 0, color: '#ef4444', label: 'LOSE', textColor: '#ffffff' },
    { type: 'win', amount: 2, color: '#059669', label: '2x', textColor: '#ffffff' },
    { type: 'lose', amount: 0, color: '#dc2626', label: 'LOSE', textColor: '#ffffff' },
    { type: 'win', amount: 3, color: '#16a34a', label: '3x', textColor: '#ffffff' },
    { type: 'lose', amount: 0, color: '#ef4444', label: 'LOSE', textColor: '#ffffff' },
    { type: 'win', amount: 5, color: '#eab308', label: '5x', textColor: '#000000' },
    { type: 'lose', amount: 0, color: '#dc2626', label: 'LOSE', textColor: '#ffffff' },
    { type: 'win', amount: 10, color: '#f59e0b', label: '10x', textColor: '#000000' },
  ];

  const minStake = 0.5;
  const maxStake = Math.min(user.balance, 10);

  const canSpin = () => {
    return user.balance >= stakeAmount && stakeAmount >= minStake && !isSpinning;
  };

  const spinWheel = async () => {
    if (!canSpin()) return;

    setIsSpinning(true);
    setResult(null);
    playSpinSound();

    const spins = 5 + Math.random() * 5;
    const finalRotation = rotation + spins * 360;
    setRotation(finalRotation);

    try {
      // Call backend to play the game with updated endpoint
      const gameResult = await ApiService.playSpinWheel(user.id);
      
      setTimeout(() => {
        let selectedSegment;
        
        // Use result from backend if available
        if (gameResult && typeof gameResult.isWin !== 'undefined') {
          if (gameResult.isWin) {
            const winSegments = segments.filter(s => s.type === 'win');
            selectedSegment = winSegments[Math.floor(Math.random() * winSegments.length)];
            if (gameResult.multiplier) {
              selectedSegment = winSegments.find(s => s.amount === gameResult.multiplier) || selectedSegment;
            }
          } else {
            const loseSegments = segments.filter(s => s.type === 'lose');
            selectedSegment = loseSegments[Math.floor(Math.random() * loseSegments.length)];
          }
        } else {
          // Fallback logic
          const isWin = Math.random() < 0.4; // 40% win rate
          if (isWin) {
            const winSegments = segments.filter(s => s.type === 'win');
            selectedSegment = winSegments[Math.floor(Math.random() * winSegments.length)];
          } else {
            const loseSegments = segments.filter(s => s.type === 'lose');
            selectedSegment = loseSegments[Math.floor(Math.random() * loseSegments.length)];
          }
        }

        spinCountRef.current++;
        setIsSpinning(false);
        setResult({ type: selectedSegment.type, amount: selectedSegment.amount });

        setTimeout(() => {
          if (selectedSegment.type === 'win') {
            playWinSound();
            // Win amount is the multiplier times stake minus the original stake
            const winAmount = selectedSegment.amount * stakeAmount - stakeAmount;
            onWin(winAmount);
          } else {
            playLoseSound();
            onLose(stakeAmount);
          }
        }, 1000);
      }, 4000);
    } catch (error) {
      console.error('Error playing spin wheel:', error);
      setTimeout(() => {
        setIsSpinning(false);
        playLoseSound();
        onLose(stakeAmount);
      }, 4000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 z-50 overflow-y-auto">
      <Card className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white border-0 w-full max-w-sm sm:max-w-md shadow-2xl my-4">
        <CardHeader className="text-center pb-2 px-3 sm:px-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1"></div>
            <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent text-center flex-1">
              🎰 FORTUNE WHEEL 🎰
            </CardTitle>
            <Button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white border-0 w-8 h-8 p-0 text-sm font-bold flex-shrink-0 rounded-full"
              size="sm"
            >
              ✕
            </Button>
          </div>
          <p className="text-sm text-yellow-300 font-semibold">Stake USDT to Spin & Win!</p>
          <div className="text-xs text-blue-300 mt-1">
            Balance: <span className="font-bold text-green-400">{user.balance.toFixed(2)} USDT</span>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-3 px-3 sm:px-4">
          {/* Staking Input */}
          <div className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 p-3 rounded-lg">
            <div className="text-center mb-2">
              <h3 className="text-sm font-bold text-yellow-300">💰 Stake to Spin</h3>
              <p className="text-xs text-gray-300">Minimum stake: {minStake} USDT</p>
            </div>
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium mb-1">Stake Amount (USDT)</label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(Math.max(minStake, Math.min(maxStake, parseFloat(e.target.value) || minStake)))}
                  min={minStake}
                  max={maxStake}
                  step="0.1"
                  className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white text-center text-sm font-bold"
                />
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[0.5, 1, 2, 5].filter(amount => amount <= maxStake).map(amount => (
                  <Button
                    key={amount}
                    onClick={() => setStakeAmount(amount)}
                    className="bg-yellow-600/20 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-600/30 text-xs py-1"
                    size="sm"
                  >
                    {amount}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Spinning Wheel */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 w-48 h-48 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 blur-xl opacity-20 animate-pulse"></div>
            
            {/* Main wheel container */}
            <div className="relative w-48 h-48">
              {/* Outer ring */}
              <div className="absolute inset-0 w-full h-full rounded-full border-4 border-gradient-to-r from-yellow-400 via-orange-500 to-red-500 shadow-2xl">
                {/* Inner wheel */}
                <div 
                  className="w-full h-full rounded-full relative overflow-hidden bg-gray-900 border-2 border-yellow-400"
                  style={{ 
                    transform: `rotate(${rotation}deg)`,
                    transition: isSpinning ? 'transform 4s cubic-bezier(0.23, 1, 0.32, 1)' : 'none'
                  }}
                >
                  {segments.map((segment, index) => {
                    const angle = (360 / segments.length) * index;
                    const segmentAngle = 360 / segments.length;

                    return (
                      <div
                        key={index}
                        className="absolute w-1/2 h-1/2 origin-bottom-right"
                        style={{
                          backgroundColor: segment.color,
                          transform: `rotate(${angle}deg)`,
                          clipPath: `polygon(0 0, 100% 0, ${50 + 50 * Math.cos((segmentAngle * Math.PI) / 180)}% ${50 + 50 * Math.sin((segmentAngle * Math.PI) / 180)}%)`
                        }}
                      >
                        <div 
                          className="absolute inset-0 flex items-center justify-center"
                          style={{
                            transform: `rotate(${segmentAngle / 2}deg) translateY(-30px)`,
                            transformOrigin: 'center bottom'
                          }}
                        >
                          <div 
                            className="text-center font-black text-sm"
                            style={{
                              color: segment.textColor,
                              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                              transform: 'rotate(-90deg)'
                            }}
                          >
                            {segment.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Center hub */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center z-10">
                <div className="text-base">🎯</div>
              </div>
            </div>

            {/* Pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 z-10">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500 shadow-lg"></div>
            </div>
          </div>

          {/* Result Display */}
          {result && !isSpinning && (
            <div className={`text-center p-3 border-2 rounded-xl backdrop-blur-sm w-full ${
              result.type === 'win' 
                ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-green-400' 
                : 'bg-gradient-to-r from-red-500/30 to-red-600/30 border-red-400'
            }`}>
              {result.type === 'win' ? (
                <>
                  <div className="text-lg font-bold text-green-400 mb-1">🎉 YOU WON! 🎉</div>
                  <div className="text-lg font-bold text-yellow-300">+{(result.amount * stakeAmount - stakeAmount).toFixed(2)} USDT!</div>
                  <div className="text-sm text-green-300">Multiplier: {result.amount}x</div>
                </>
              ) : (
                <>
                  <div className="text-lg font-bold text-red-400 mb-1">💀 YOU LOST! 💀</div>
                  <div className="text-lg font-bold text-red-300">-{stakeAmount.toFixed(2)} USDT</div>
                </>
              )}
            </div>
          )}

          {/* Spin Button */}
          <Button
            onClick={spinWheel}
            disabled={!canSpin()}
            className={`w-full font-bold py-3 transition-all duration-300 ${
              !canSpin()
                ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                : isSpinning
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse'
                : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 hover:scale-105 shadow-lg hover:shadow-xl'
            }`}
          >
            {isSpinning ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                SPINNING...
              </div>
            ) : user.balance < stakeAmount ? (
              '💸 INSUFFICIENT BALANCE'
            ) : (
              `🎰 SPIN FOR ${stakeAmount.toFixed(1)} USDT!`
            )}
          </Button>

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-gray-400 text-gray-200 hover:bg-gray-700 hover:text-white bg-gray-800/70 backdrop-blur-sm font-semibold py-2"
          >
            Close Wheel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpinningWheel;
