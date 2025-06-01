
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { SpinResult, AviatorGame, GameDifficulty } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const GamesPage: React.FC = () => {
  const [spinLoading, setSpinLoading] = useState(false);
  const [spinDifficulty, setSpinDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('EASY');
  const [aviatorBet, setAviatorBet] = useState('');
  const [aviatorDifficulty, setAviatorDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('EASY');
  const [aviatorLoading, setAviatorLoading] = useState(false);
  const [spinHistory, setSpinHistory] = useState<SpinResult[]>([]);
  const [aviatorHistory, setAviatorHistory] = useState<AviatorGame[]>([]);
  const [difficulties, setDifficulties] = useState<GameDifficulty[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    try {
      // TODO: Connect to backend - Load game histories
      const [spinHist, aviatorHist, gameDiff] = await Promise.all([
        apiService.getSpinHistory(),
        apiService.getAviatorHistory(),
        apiService.getGameDifficulties()
      ]);
      setSpinHistory(spinHist);
      setAviatorHistory(aviatorHist);
      setDifficulties(gameDiff);
    } catch (error) {
      console.error('Failed to load game data:', error);
    }
  };

  const handleSpin = async () => {
    setSpinLoading(true);
    try {
      // TODO: Connect to backend - Play spin with difficulty
      const result = await apiService.playSpin(spinDifficulty);
      toast({
        title: "🎰 Spin Result!",
        description: `${spinDifficulty} mode - You won ${result.reward} USDT!`,
      });
      loadGameData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Spin failed",
        variant: "destructive",
      });
    } finally {
      setSpinLoading(false);
    }
  };

  const handleAviatorPlay = async () => {
    const betAmount = parseFloat(aviatorBet);
    if (!betAmount || betAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid bet amount",
        variant: "destructive",
      });
      return;
    }

    setAviatorLoading(true);
    try {
      // TODO: Connect to backend - Play aviator with difficulty and bet
      const result = await apiService.playAviator(aviatorDifficulty, betAmount);
      toast({
        title: "✈️ Aviator Result!",
        description: `${aviatorDifficulty} mode - Multiplier: ${result.multiplier}x - You won ${result.winAmount} USDT!`,
      });
      setAviatorBet('');
      loadGameData();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Game failed",
        variant: "destructive",
      });
    } finally {
      setAviatorLoading(false);
    }
  };

  const getDifficultyInfo = (gameType: 'SPIN' | 'AVIATOR', level: string) => {
    const difficulty = difficulties.find(d => d.gameType === gameType && d.level === level);
    return difficulty || { multiplier: 1.0, description: 'Standard difficulty' };
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'EASY': return 'text-green-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'HARD': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  // Type-safe handlers for Select components
  const handleSpinDifficultyChange = (value: string) => {
    if (value === 'EASY' || value === 'MEDIUM' || value === 'HARD') {
      setSpinDifficulty(value);
    }
  };

  const handleAviatorDifficultyChange = (value: string) => {
    if (value === 'EASY' || value === 'MEDIUM' || value === 'HARD') {
      setAviatorDifficulty(value);
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="glass-effect rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-white mb-2">🎮 Games</h1>
        <p className="text-gray-300">Choose your difficulty and win big!</p>
      </div>

      {/* Featured Games */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spin Wheel */}
        <Card className="game-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center">
              🎰 Fortune Wheel
            </CardTitle>
            <CardDescription className="text-gray-300">
              Spin to win USDT with different difficulty levels!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-6xl mb-4 glow-purple">
                🎰
              </div>
              
              {/* Difficulty Selection */}
              <div className="mb-4">
                <Label className="text-white text-sm mb-2 block">Select Difficulty</Label>
                <Select value={spinDifficulty} onValueChange={handleSpinDifficultyChange}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="EASY">
                      <span className="text-green-400">🟢 Easy</span>
                    </SelectItem>
                    <SelectItem value="MEDIUM">
                      <span className="text-yellow-400">🟡 Medium</span>
                    </SelectItem>
                    <SelectItem value="HARD">
                      <span className="text-red-400">🔴 Hard</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-xs text-gray-400 mt-1">
                  {getDifficultyInfo('SPIN', spinDifficulty).description}
                </div>
                <div className={`text-sm font-semibold mt-1 ${getDifficultyColor(spinDifficulty)}`}>
                  Multiplier: {getDifficultyInfo('SPIN', spinDifficulty).multiplier}x
                </div>
              </div>

              <Button
                onClick={handleSpin}
                disabled={spinLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white text-lg py-3 hover:from-pink-600 hover:to-red-600"
              >
                {spinLoading ? "Spinning..." : `Spin Now! (${spinDifficulty})`}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Aviator */}
        <Card className="game-card rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center">
              ✈️ Aviator
            </CardTitle>
            <CardDescription className="text-gray-300">
              Fly high and cash out before it's too late!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-6xl mb-4 glow-blue">
                ✈️
              </div>

              {/* Difficulty Selection */}
              <div className="mb-4">
                <Label className="text-white text-sm mb-2 block">Select Difficulty</Label>
                <Select value={aviatorDifficulty} onValueChange={handleAviatorDifficultyChange}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="EASY">
                      <span className="text-green-400">🟢 Easy</span>
                    </SelectItem>
                    <SelectItem value="MEDIUM">
                      <span className="text-yellow-400">🟡 Medium</span>
                    </SelectItem>
                    <SelectItem value="HARD">
                      <span className="text-red-400">🔴 Hard</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-xs text-gray-400 mt-1">
                  {getDifficultyInfo('AVIATOR', aviatorDifficulty).description}
                </div>
                <div className={`text-sm font-semibold mt-1 ${getDifficultyColor(aviatorDifficulty)}`}>
                  Risk Level: {getDifficultyInfo('AVIATOR', aviatorDifficulty).multiplier}x
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="aviatorBet" className="text-white text-sm">Bet Amount (USDT)</Label>
                  <Input
                    id="aviatorBet"
                    type="number"
                    placeholder="Enter bet amount"
                    value={aviatorBet}
                    onChange={(e) => setAviatorBet(e.target.value)}
                    className="bg-gray-800 text-white border-gray-600 mt-1"
                  />
                </div>
                <Button
                  onClick={handleAviatorPlay}
                  disabled={aviatorLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg py-3 hover:from-blue-600 hover:to-purple-600"
                >
                  {aviatorLoading ? "Flying..." : `Take Off! (${aviatorDifficulty})`}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Other Games */}
      <Card className="glass-effect border-0 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-white">🎲 More Games</CardTitle>
          <CardDescription className="text-gray-300">
            Additional gaming options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 text-lg bg-green-600 hover:bg-green-700 text-white border-green-500"
              onClick={() => navigate('/betting')}
            >
              ⚽ Sports Betting
              <span className="block text-xs opacity-70">Real matches</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 text-lg bg-gray-700 text-gray-400 border-gray-600" 
              disabled
            >
              🎲 Dice Game
              <span className="block text-xs opacity-70">Coming Soon</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 text-lg bg-gray-700 text-gray-400 border-gray-600" 
              disabled
            >
              🃏 Card Games
              <span className="block text-xs opacity-70">Coming Soon</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Game History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spin History */}
        <Card className="glass-effect border-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-pink-400">🎰 Recent Spins</CardTitle>
          </CardHeader>
          <CardContent>
            {spinHistory.length > 0 ? (
              <div className="space-y-2">
                {spinHistory.slice(0, 5).map((spin) => (
                  <div key={spin.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <span className={`text-sm ${getDifficultyColor(spin.difficultyLevel)}`}>
                        {spin.difficultyLevel}
                      </span>
                      <div className="text-xs text-gray-400">
                        {new Date(spin.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <span className="font-bold text-green-400">
                      +{spin.reward.toFixed(2)} USDT
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No spins yet. Try the fortune wheel!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Aviator History */}
        <Card className="glass-effect border-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-blue-400">✈️ Recent Flights</CardTitle>
          </CardHeader>
          <CardContent>
            {aviatorHistory.length > 0 ? (
              <div className="space-y-2">
                {aviatorHistory.slice(0, 5).map((game) => (
                  <div key={game.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                    <div>
                      <span className={`text-sm ${getDifficultyColor(game.difficultyLevel)}`}>
                        {game.difficultyLevel}
                      </span>
                      <div className="text-xs text-gray-400">
                        Bet: {game.betAmount} USDT • {game.multiplier}x
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(game.playedAt).toLocaleString()}
                      </div>
                    </div>
                    <span className={`font-bold ${game.winAmount > game.betAmount ? 'text-green-400' : 'text-red-400'}`}>
                      {game.winAmount > game.betAmount ? '+' : ''}{(game.winAmount - game.betAmount).toFixed(2)} USDT
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No flights yet. Take off with Aviator!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GamesPage;
