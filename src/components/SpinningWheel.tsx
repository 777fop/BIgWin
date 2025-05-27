
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { useRef, useState } from 'react';

interface SpinningWheelProps {
  user: { balance: number; plan: string };
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

  const segments = [
    { type: 'lose', amount: 0, color: '#dc2626', textColor: '#ffffff', label: '💀' },
    { type: 'win', amount: 2, color: '#16a34a', textColor: '#ffffff', label: '2' },
    { type: 'lose', amount: 0, color: '#dc2626', textColor: '#ffffff', label: '💀' },
    { type: 'win', amount: 5, color: '#059669', textColor: '#ffffff', label: '5' },
    { type: 'lose', amount: 0, color: '#dc2626', textColor: '#ffffff', label: '💀' },
    { type: 'win', amount: 1, color: '#16a34a', textColor: '#ffffff', label: '1' },
    { type: 'lose', amount: 0, color: '#dc2626', textColor: '#ffffff', label: '💀' },
    { type: 'win', amount: 3, color: '#059669', textColor: '#ffffff', label: '3' },
    { type: 'lose', amount: 0, color: '#dc2626', textColor: '#ffffff', label: '💀' },
    { type: 'win', amount: 10, color: '#eab308', textColor: '#000000', label: '10' },
    { type: 'lose', amount: 0, color: '#dc2626', textColor: '#ffffff', label: '💀' }
  ];

  const minStake = 0.5;
  const maxStake = Math.min(user.balance, 10);

  // Get withdrawal minimum based on plan
  const getWithdrawalMinimum = () => {
    switch (user.plan) {
      case 'premium':
      case 'vip':
        return 5;
      default:
        return 100;
    }
  };

  const withdrawalMinimum = getWithdrawalMinimum();

  const canSpin = () => {
    return user.balance >= stakeAmount && stakeAmount >= minStake && !isSpinning;
  };

  const spinWheel = () => {
    if (!canSpin()) return;

    setIsSpinning(true);
    setResult(null);

    const spins = 5 + Math.random() * 5;
    const finalRotation = rotation + spins * 360;
    setRotation(finalRotation);

    setTimeout(() => {
      let selectedSegment;

      // Prevent balance from exceeding withdrawal minimum via spinning
      const potentialBalance = user.balance + (10 * stakeAmount); // Max possible win
      const shouldPreventWin = potentialBalance >= (withdrawalMinimum - 5);

      if (shouldPreventWin) {
        const loseSegments = segments.filter(s => s.type === 'lose');
        selectedSegment = loseSegments[Math.floor(Math.random() * loseSegments.length)];
      } else {
        const isWin = Math.random() < 0.6;
        if (isWin) {
          const winSegments = segments.filter(s => 
            s.type === 'win' && !(s.amount === 10 && stakeAmount <= 1)
          );
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
          onWin(selectedSegment.amount * stakeAmount);
        } else {
          onLose(stakeAmount);
        }
      }, 1000);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 z-50 overflow-y-auto">
      <Card className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white border-0 w-full max-w-sm sm:max-w-md md:max-w-lg shadow-2xl my-4">
        <CardHeader className="text-center pb-2 px-3 sm:px-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1"></div>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent text-center flex-1">
              🎰 FORTUNE WHEEL 🎰
            </CardTitle>
            <Button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white border-0 w-8 h-8 sm:w-10 sm:h-10 p-0 text-sm font-bold flex-shrink-0 rounded-full"
              size="sm"
            >
              ✕
            </Button>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-yellow-300 font-semibold">Stake USDT to Spin & Win!</p>
          <div className="text-xs sm:text-sm text-blue-300 mt-1">
            Balance: <span className="font-bold text-green-400">{user.balance.toFixed(2)} USDT</span>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-3 sm:space-y-4 px-3 sm:px-4">
          {/* Staking Input */}
          <div className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 p-3 sm:p-4 rounded-lg">
            <div className="text-center mb-2 sm:mb-3">
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-yellow-300">💰 Stake to Spin</h3>
              <p className="text-xs text-gray-300">Minimum stake: {minStake} USDT</p>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">Stake Amount (USDT)</label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(Math.max(minStake, Math.min(maxStake, parseFloat(e.target.value) || minStake)))}
                  min={minStake}
                  max={maxStake}
                  step="0.1"
                  className="w-full px-2 py-1 sm:px-3 sm:py-2 bg-gray-800 border border-gray-600 rounded text-white text-center text-sm sm:text-base font-bold"
                />
              </div>
              <div className="grid grid-cols-4 gap-1 sm:gap-2">
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

          {/* Spinning Wheel */}
          <div className="relative">
            <div className="absolute inset-0 w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 blur-xl opacity-30 animate-pulse"></div>
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56">
              <div 
                className="w-full h-full rounded-full border-4 border-yellow-400 relative overflow-hidden shadow-2xl"
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? 'transform 4s cubic-bezier(0.23, 1, 0.32, 1)' : 'none'
                }}
              >
                {segments.map((segment, index) => {
                  const angle = (360 / segments.length) * index;
                  const segmentAngle = 360 / segments.length;
                  const isWinSegment = segment.type === 'win';

                  return (
                    <div
                      key={index}
                      className="absolute w-1/2 h-1/2 flex items-center justify-center"
                      style={{
                        backgroundColor: segment.color,
                        transformOrigin: '100% 100%',
                        transform: `rotate(${angle}deg)`,
                        clipPath: `polygon(0 0, 100% 0, ${50 + 50 * Math.cos(segmentAngle * Math.PI / 180)}% ${50 + 50 * Math.sin(segmentAngle * Math.PI / 180)}%)`
                      }}
                    >
                      <div 
                        className="absolute text-center flex flex-col items-center justify-center"
                        style={{
                          transform: `rotate(${segmentAngle/2}deg) translateY(-20px) sm:translateY(-24px) md:translateY(-28px)`,
                          textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
                          fontWeight: 'bold',
                          color: segment.textColor
                        }}
                      >
                        {isWinSegment ? (
                          <div className="flex flex-col items-center">
                            <div className="text-lg sm:text-xl md:text-2xl font-black leading-none">{segment.label}</div>
                            <div className="text-xs sm:text-sm font-bold leading-none mt-0.5">USDT</div>
                          </div>
                        ) : (
                          <div className="text-lg sm:text-xl md:text-2xl">{segment.label}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center z-10">
                <div className="text-sm sm:text-base">🎯</div>
              </div>
            </div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 z-10">
              <div className="w-0 h-0 border-l-3 border-r-3 border-b-6 sm:border-l-4 sm:border-r-4 sm:border-b-8 border-l-transparent border-r-transparent border-b-red-500 shadow-lg"></div>
            </div>
          </div>

          {/* Result Display */}
          {result && !isSpinning && (
            <div className={`text-center p-3 sm:p-4 border-2 rounded-xl backdrop-blur-sm w-full ${
              result.type === 'win' 
                ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-green-400' 
                : 'bg-gradient-to-r from-red-500/30 to-red-600/30 border-red-400'
            }`}>
              {result.type === 'win' ? (
                <>
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-400 mb-1">🎉 YOU WON! 🎉</div>
                  <div className="text-base sm:text-lg md:text-xl font-bold text-yellow-300">+{(result.amount * stakeAmount).toFixed(2)} USDT!</div>
                </>
              ) : (
                <>
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-red-400 mb-1">💀 YOU LOST! 💀</div>
                  <div className="text-base sm:text-lg md:text-xl font-bold text-red-300">-{stakeAmount.toFixed(2)} USDT</div>
                </>
              )}
            </div>
          )}

          {/* Spin Button */}
          <Button
            onClick={spinWheel}
            disabled={!canSpin()}
            className={`w-full text-sm sm:text-base font-bold py-3 sm:py-4 transition-all duration-300 ${
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
            className="w-full border-gray-400 text-gray-200 hover:bg-gray-700 hover:text-white bg-gray-800/70 backdrop-blur-sm text-sm font-semibold py-2 sm:py-3"
          >
            Close Wheel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpinningWheel;
