import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { GameDifficulty } from '../types';

const GameDifficultySettings: React.FC = () => {
  const [difficulties, setDifficulties] = useState<GameDifficulty[]>([]);
  const [newDifficulty, setNewDifficulty] = useState({
    gameType: 'SPIN' as 'SPIN' | 'AVIATOR',
    level: 'EASY' as 'EASY' | 'MEDIUM' | 'HARD',
    multiplier: 1.0,
    description: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGameDifficulties();
  }, []);

  const loadGameDifficulties = async () => {
    try {
      // TODO: Connect to backend - Get game difficulties
      const data = await apiService.getGameDifficulties();
      setDifficulties(data);
    } catch (error) {
      console.error('Failed to load game difficulties:', error);
      // For demo purposes, set some mock data
      setDifficulties([
        {
          id: 1,
          gameType: 'SPIN',
          level: 'EASY',
          multiplier: 1.2,
          description: 'Easy spin with 20% bonus',
          isActive: true
        },
        {
          id: 2,
          gameType: 'SPIN',
          level: 'MEDIUM',
          multiplier: 1.5,
          description: 'Medium spin with 50% bonus',
          isActive: true
        },
        {
          id: 3,
          gameType: 'AVIATOR',
          level: 'EASY',
          multiplier: 1.1,
          description: 'Easy aviator with 10% bonus',
          isActive: true
        }
      ]);
    }
  };

  const handleCreateDifficulty = async () => {
    setLoading(true);
    try {
      // TODO: Connect to backend - Create new game difficulty
      await apiService.createGameDifficulty(newDifficulty);
      toast({
        title: "Success",
        description: "Game difficulty created successfully",
      });
      setNewDifficulty({
        gameType: 'SPIN',
        level: 'EASY',
        multiplier: 1.0,
        description: '',
        isActive: true
      });
      loadGameDifficulties();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create game difficulty",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDifficulty = async (id: number, updates: Partial<GameDifficulty>) => {
    try {
      // TODO: Connect to backend - Update game difficulty
      await apiService.updateGameDifficulty(id, updates);
      toast({
        title: "Success",
        description: "Game difficulty updated successfully",
      });
      loadGameDifficulties();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update game difficulty",
        variant: "destructive",
      });
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'EASY': return 'bg-green-600';
      case 'MEDIUM': return 'bg-yellow-600';
      case 'HARD': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="glass-effect rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-blue-400">⚙️ Game Difficulty Settings</h1>
        <p className="text-gray-300">Configure difficulty levels for Spin Wheel and Aviator games</p>
      </div>

      {/* Add New Difficulty */}
      <Card className="glass-effect border-0">
        <CardHeader>
          <CardTitle className="text-green-400">➕ Add New Difficulty Level</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label className="text-gray-300">Game Type</Label>
              <Select 
                value={newDifficulty.gameType} 
                onValueChange={(value: 'SPIN' | 'AVIATOR') => 
                  setNewDifficulty(prev => ({ ...prev, gameType: value }))
                }
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="SPIN">🎰 Spin Wheel</SelectItem>
                  <SelectItem value="AVIATOR">✈️ Aviator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-gray-300">Difficulty Level</Label>
              <Select 
                value={newDifficulty.level} 
                onValueChange={(value: 'EASY' | 'MEDIUM' | 'HARD') => 
                  setNewDifficulty(prev => ({ ...prev, level: value }))
                }
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="EASY">🟢 Easy</SelectItem>
                  <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
                  <SelectItem value="HARD">🔴 Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-gray-300">Multiplier</Label>
              <Input
                type="number"
                step="0.1"
                min="0.1"
                max="10"
                value={newDifficulty.multiplier}
                onChange={(e) => setNewDifficulty(prev => ({ 
                  ...prev, 
                  multiplier: parseFloat(e.target.value) || 1.0 
                }))}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="1.5"
              />
            </div>
            
            <div>
              <Label className="text-gray-300">Description</Label>
              <Input
                value={newDifficulty.description}
                onChange={(e) => setNewDifficulty(prev => ({ 
                  ...prev, 
                  description: e.target.value 
                }))}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Description..."
              />
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={handleCreateDifficulty}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Difficulties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spin Wheel Difficulties */}
        <Card className="glass-effect border-0">
          <CardHeader>
            <CardTitle className="text-pink-400">🎰 Spin Wheel Difficulties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {difficulties
              .filter(d => d.gameType === 'SPIN')
              .map((difficulty) => (
                <div key={difficulty.id} className="bg-gray-800 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getDifficultyColor(difficulty.level)}`}>
                      {difficulty.level}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Label className="text-gray-300 text-sm">Active</Label>
                      <Switch
                        checked={difficulty.isActive}
                        onCheckedChange={(checked) => 
                          handleUpdateDifficulty(difficulty.id, { isActive: checked })
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-400 text-xs">Multiplier</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={difficulty.multiplier}
                        onChange={(e) => 
                          handleUpdateDifficulty(difficulty.id, { 
                            multiplier: parseFloat(e.target.value) || 1.0 
                          })
                        }
                        className="bg-gray-700 border-gray-600 text-white text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs">Reward</Label>
                      <div className="text-green-400 font-semibold">
                        +{((difficulty.multiplier - 1) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-400 text-xs">Description</Label>
                    <Input
                      value={difficulty.description}
                      onChange={(e) => 
                        handleUpdateDifficulty(difficulty.id, { description: e.target.value })
                      }
                      className="bg-gray-700 border-gray-600 text-white text-sm"
                    />
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Aviator Difficulties */}
        <Card className="glass-effect border-0">
          <CardHeader>
            <CardTitle className="text-blue-400">✈️ Aviator Difficulties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {difficulties
              .filter(d => d.gameType === 'AVIATOR')
              .map((difficulty) => (
                <div key={difficulty.id} className="bg-gray-800 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getDifficultyColor(difficulty.level)}`}>
                      {difficulty.level}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Label className="text-gray-300 text-sm">Active</Label>
                      <Switch
                        checked={difficulty.isActive}
                        onCheckedChange={(checked) => 
                          handleUpdateDifficulty(difficulty.id, { isActive: checked })
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-400 text-xs">Multiplier</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={difficulty.multiplier}
                        onChange={(e) => 
                          handleUpdateDifficulty(difficulty.id, { 
                            multiplier: parseFloat(e.target.value) || 1.0 
                          })
                        }
                        className="bg-gray-700 border-gray-600 text-white text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs">Risk Level</Label>
                      <div className="text-yellow-400 font-semibold">
                        {difficulty.multiplier > 2 ? 'High' : difficulty.multiplier > 1.5 ? 'Medium' : 'Low'}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-400 text-xs">Description</Label>
                    <Input
                      value={difficulty.description}
                      onChange={(e) => 
                        handleUpdateDifficulty(difficulty.id, { description: e.target.value })
                      }
                      className="bg-gray-700 border-gray-600 text-white text-sm"
                    />
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* Usage Instructions */}
      <Card className="glass-effect border-0">
        <CardHeader>
          <CardTitle className="text-yellow-400">💡 How Game Difficulties Work</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 space-y-2">
          <p><strong>Spin Wheel:</strong> Higher difficulty levels increase the reward multiplier but may reduce win probability.</p>
          <p><strong>Aviator:</strong> Higher difficulty affects the flight pattern and crash probability.</p>
          <p><strong>Multiplier:</strong> Multiplies the base reward/bet amount. Values above 1.0 increase rewards.</p>
          <p><strong>Active:</strong> Only active difficulties are available to players in the games.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameDifficultySettings;
