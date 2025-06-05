import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ApiService from '@/services/apiService';

interface FootballBettingProps {
  user: { balance: number; id: string };
  onBetPlaced: (amount: number) => void;
  onClose: () => void;
}

const FootballBetting: React.FC<FootballBettingProps> = ({ user, onBetPlaced, onClose }) => {
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [betOption, setBetOption] = useState('');
  const [betAmount, setBetAmount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userBets, setUserBets] = useState<any[]>([]);

  useEffect(() => {
    loadMatches();
    loadUserBets();
  }, []);

  const loadMatches = async () => {
    try {
      const data = await ApiService.getFootballMatches();
      setMatches(data.data || data || []);
    } catch (error) {
      console.error('Error loading matches:', error);
    }
  };

  const loadUserBets = async () => {
    try {
      const data = await ApiService.getUserFootballBets();
      setUserBets(data.data || data || []);
    } catch (error) {
      console.error('Error loading user bets:', error);
    }
  };

  const placeBet = async () => {
    if (!selectedMatch || !betOption || betAmount <= 0 || betAmount > user.balance) {
      return;
    }

    setLoading(true);
    try {
      await ApiService.placeFootballBet(selectedMatch.id, betOption, betAmount);
      onBetPlaced(betAmount);
      setSelectedMatch(null);
      setBetOption('');
      setBetAmount(1);
      loadUserBets();
      alert('Bet placed successfully!');
    } catch (error) {
      console.error('Error placing bet:', error);
      alert('Failed to place bet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 text-white border-0 w-full max-w-4xl shadow-2xl my-4">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent flex-1 text-center">
              ⚽ SPORT BETTING
            </CardTitle>
            <Button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white border-0 w-8 h-8 p-0 text-sm font-bold rounded-full ml-2"
              size="sm"
            >
              ✕
            </Button>
          </div>
          <div className="text-sm text-green-300 font-bold">
            Balance: <span className="font-bold text-green-400">{user.balance.toFixed(2)} USDT</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Available Matches */}
          <div>
            <h3 className="text-xl font-bold text-green-400 mb-4">📅 Available Matches</h3>
            {matches.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-2">⚽</div>
                <p className="text-white font-bold">No matches available at the moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.map((match) => (
                  <Card 
                    key={match.id} 
                    className={`bg-gray-800/50 border cursor-pointer transition-all ${
                      selectedMatch?.id === match.id 
                        ? 'border-green-500 bg-green-900/30' 
                        : 'border-gray-600 hover:border-green-400'
                    }`}
                    onClick={() => setSelectedMatch(match)}
                  >
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-white mb-2">
                          {match.homeTeam} vs {match.awayTeam}
                        </div>
                        <div className="text-sm text-gray-400 mb-3 font-bold">
                          {new Date(match.matchDate).toLocaleString()}
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="bg-blue-600/30 p-2 rounded">
                            <div className="font-bold text-white">Home Win</div>
                            <div className="text-blue-300 font-bold">{match.homeOdds || '2.1'}x</div>
                          </div>
                          <div className="bg-yellow-600/30 p-2 rounded">
                            <div className="font-bold text-white">Draw</div>
                            <div className="text-yellow-300 font-bold">{match.drawOdds || '3.2'}x</div>
                          </div>
                          <div className="bg-red-600/30 p-2 rounded">
                            <div className="font-bold text-white">Away Win</div>
                            <div className="text-red-300 font-bold">{match.awayOdds || '2.8'}x</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Bet Placement */}
          {selectedMatch && (
            <div className="bg-green-900/30 border border-green-500/30 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-green-400 mb-4">💰 Place Your Bet</h3>
              <div className="text-center mb-4">
                <div className="text-lg font-bold text-white">
                  {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white font-bold">Bet Option</label>
                  <select
                    value={betOption}
                    onChange={(e) => setBetOption(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white font-bold"
                  >
                    <option value="">Select bet option...</option>
                    <option value="home_win">Home Win ({selectedMatch.homeOdds || '2.1'}x)</option>
                    <option value="draw">Draw ({selectedMatch.drawOdds || '3.2'}x)</option>
                    <option value="away_win">Away Win ({selectedMatch.awayOdds || '2.8'}x)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-white font-bold">Bet Amount (USDT)</label>
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Math.max(1, Math.min(user.balance, parseFloat(e.target.value) || 1)))}
                    min="1"
                    max={user.balance}
                    step="0.1"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white font-bold"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[1, 5, 10, 25].filter(amount => amount <= user.balance).map(amount => (
                  <Button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    className="bg-green-600/20 border border-green-500/30 text-green-300 hover:bg-green-600/30 font-bold"
                    size="sm"
                  >
                    {amount}
                  </Button>
                ))}
              </div>

              {betOption && betAmount > 0 && (
                <div className="mt-4 p-3 bg-gray-800/50 rounded border border-gray-600">
                  <div className="text-sm text-gray-300 font-bold">
                    <div>Potential Win: <span className="text-green-400 font-bold">
                      {(betAmount * parseFloat(
                        betOption === 'home_win' ? selectedMatch.homeOdds || '2.1' :
                        betOption === 'draw' ? selectedMatch.drawOdds || '3.2' :
                        selectedMatch.awayOdds || '2.8'
                      )).toFixed(2)} USDT
                    </span></div>
                    <div>Profit: <span className="text-yellow-400 font-bold">
                      {(betAmount * parseFloat(
                        betOption === 'home_win' ? selectedMatch.homeOdds || '2.1' :
                        betOption === 'draw' ? selectedMatch.drawOdds || '3.2' :
                        selectedMatch.awayOdds || '2.8'
                      ) - betAmount).toFixed(2)} USDT
                    </span></div>
                  </div>
                </div>
              )}

              <Button
                onClick={placeBet}
                disabled={!betOption || betAmount <= 0 || betAmount > user.balance || loading}
                className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 hover:scale-105 transition-transform disabled:opacity-50"
              >
                {loading ? 'PLACING BET...' : `PLACE BET (${betAmount} USDT)`}
              </Button>
            </div>
          )}

          {/* User's Bets */}
          <div>
            <h3 className="text-xl font-bold text-green-400 mb-4">📊 Your Active Bets</h3>
            {userBets.length === 0 ? (
              <div className="text-center text-gray-400 py-4">
                <p className="text-white font-bold">No active bets</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {userBets.map((bet, index) => (
                  <div key={index} className="bg-gray-800/50 p-4 rounded border border-gray-600">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white">{bet.matchName || `${bet.homeTeam} vs ${bet.awayTeam}`}</div>
                        <div className="text-sm text-gray-300 font-bold">
                          Bet: {bet.betOption} | Amount: {bet.amount} USDT
                        </div>
                        <div className="text-sm text-gray-400 font-bold">
                          Status: <span className={
                            bet.status === 'WON' ? 'text-green-400' :
                            bet.status === 'LOST' ? 'text-red-400' :
                            'text-yellow-400'
                          }>{bet.status || 'PENDING'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400 font-bold">Potential Win</div>
                        <div className="font-bold text-green-400">{bet.potentialWin || (bet.amount * 2).toFixed(2)} USDT</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-bold py-2"
          >
            Close Betting
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FootballBetting;
