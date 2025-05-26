
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { useRef, useState } from 'react';

interface SpinningWheelProps {
  user: { balance: number };
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
    { type: 'lose', amount: 0, color: '#ff4757' },
    { type: 'win', amount: 2, color: '#2ed573' },
    { type: 'lose', amount: 0, color: '#ff4757' },
    { type: 'win', amount: 5, color: '#2ed573' },
    { type: 'lose', amount: 0, color: '#ff4757' },
    { type: 'win', amount: 1, color: '#2ed573' },
    { type: 'lose', amount: 0, color: '#ff4757' },
    { type: 'win', amount: 3, color: '#2ed573' },
    { type: 'lose', amount: 0, color: '#ff4757' },
    { type: 'win', amount: 10, color: '#ffa502' },
    { type: 'lose', amount: 0, color: '#ff4757' }
  ];

  const minStake = 0.5;
  const maxStake = Math.min(user.balance, 10);

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

      // Improved probability logic
      if (user.balance > 60) {
        // Force lose if balance is above 60
        const loseSegments = segments.filter(s => s.type === 'lose');
        selectedSegment = loseSegments[Math.floor(Math.random() * loseSegments.length)];
      } else {
        // 60% chance to win
        const isWin = Math.random() < 0.6;
        if (isWin) {
          // Filter win segments based on stake amount
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

      // Don't auto-close, let user stay on the page
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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <Card className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white border-0 w-full max-w-2xl shadow-2xl max-h-[95vh] overflow-y-auto">
        <CardHeader className="text-center pb-4 px-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1"></div>
            <CardTitle className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent text-center">
              🎰 FORTUNE WHEEL 🎰
            </CardTitle>
            <Button
              onClick={onClose}
              className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 w-8 h-8 p-0 text-lg"
              size="sm"
            >
              ×
            </Button>
          </div>
          <p className="text-lg sm:text-xl text-yellow-300 font-semibold">Stake USDT to Spin & Win!</p>
          <div className="text-sm text-blue-300 mt-2">
            Balance: <span className="font-bold text-green-400">{user.balance.toFixed(2)} USDT</span>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-4 sm:space-y-6 px-4">
          {/* Staking Input */}
          <div className="w-full max-w-md bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 p-4 sm:p-6 rounded-lg">
            <div className="text-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-yellow-300">💰 Stake to Spin</h3>
              <p className="text-sm text-gray-300">Minimum stake: {minStake} USDT</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Stake Amount (USDT)</label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(Math.max(minStake, Math.min(maxStake, parseFloat(e.target.value) || minStake)))}
                  min={minStake}
                  max={maxStake}
                  step="0.1"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-center text-lg sm:text-xl font-bold"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[0.5, 1, 2, 5].filter(amount => amount <= maxStake).map(amount => (
                  <Button
                    key={amount}
                    onClick={() => setStakeAmount(amount)}
                    className="bg-yellow-600/20 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-600/30 text-sm"
                    size="sm"
                  >
                    {amount}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Spinning Wheel - Responsive size */}
          <div className="relative">
            <div className="absolute inset-0 w-60 h-60 sm:w-72 sm:h-72 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 blur-xl opacity-30 animate-pulse"></div>
            <div className="relative w-60 h-60 sm:w-72 sm:h-72">
              <div 
                className="w-full h-full rounded-full border-4 sm:border-8 border-yellow-400 relative overflow-hidden shadow-2xl"
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? 'transform 4s cubic-bezier(0.23, 1, 0.32, 1)' : 'none'
                }}
              >
                {segments.map((segment, index) => {
                  const angle = (360 / segments.length) * index;
                  const nextAngle = (360 / segments.length) * (index + 1);

                  return (
                    <div
                      key={index}
                      className="absolute w-1/2 h-1/2 flex items-center justify-center text-white font-bold"
                      style={{
                        backgroundColor: segment.color,
                        transformOrigin: '100% 100%',
                        transform: `rotate(${angle}deg)`,
                        clipPath: `polygon(0 0, 100% 0, ${50 + 50 * Math.cos((nextAngle - angle) * Math.PI / 180)}% ${50 + 50 * Math.sin((nextAngle - angle) * Math.PI / 180)}%)`
                      }}
                    >
                      <div 
                        className="absolute text-center"
                        style={{
                          transform: `rotate(${15}deg) translateY(-30px)`,
                          textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                        }}
                      >
                        {segment.type === 'win' ? (
                          <>
                            <div className="text-sm sm:text-lg font-bold">{segment.amount}</div>
                            <div className="text-xs">USDT</div>
                          </>
                        ) : (
                          <div className="text-sm sm:text-lg font-bold">🤑</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 sm:border-4 border-white shadow-lg flex items-center justify-center">
                <div className="text-sm sm:text-lg">🎯</div>
              </div>
            </div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 sm:border-l-6 sm:border-r-6 sm:border-b-12 border-l-transparent border-r-transparent border-b-red-500 shadow-lg"></div>
            </div>
          </div>

          {/* Result Display */}
          {result && !isSpinning && (
            <div className={`text-center p-4 sm:p-6 border-2 rounded-xl backdrop-blur-sm w-full max-w-md ${
              result.type === 'win' 
                ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-green-400' 
                : 'bg-gradient-to-r from-red-500/30 to-red-600/30 border-red-400'
            }`}>
              {result.type === 'win' ? (
                <>
                  <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">🎉 YOU WON! 🎉</div>
                  <div className="text-xl sm:text-2xl font-bold text-yellow-300">+{(result.amount * stakeAmount).toFixed(2)} USDT!</div>
                </>
              ) : (
                <>
                  <div className="text-2xl sm:text-3xl font-bold text-red-400 mb-2">💀 YOU LOST! 💀</div>
                  <div className="text-xl sm:text-2xl font-bold text-red-300">-{stakeAmount.toFixed(2)} USDT</div>
                </>
              )}
            </div>
          )}

          {/* Spin Button */}
          <Button
            onClick={spinWheel}
            disabled={!canSpin()}
            className={`w-full max-w-md text-lg sm:text-xl font-bold py-4 sm:py-6 transition-all duration-300 ${
              !canSpin()
                ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                : isSpinning
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse'
                : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 hover:scale-105 shadow-lg hover:shadow-xl'
            }`}
          >
            {isSpinning ? (
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
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
            className="w-full max-w-md border-white/50 text-white hover:bg-white/10"
          >
            Close Wheel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpinningWheel;
