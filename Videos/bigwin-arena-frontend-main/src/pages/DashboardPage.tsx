
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';
import StatCard from '../components/StatCard';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dailyReward, setDailyReward] = useState<{ canClaim: boolean; amount?: number }>({ canClaim: false });
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // TODO: Connect to backend - Check daily reward status
      const rewardStatus = await apiService.checkDailyReward();
      setDailyReward(rewardStatus);

      // TODO: Connect to backend - Get referral count
      const referrals = await apiService.getMyReferrals();
      setReferralCount(referrals.length);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const claimDailyReward = async () => {
    setLoading(true);
    try {
      // TODO: Connect to backend - Claim daily reward
      const reward = await apiService.claimDailyReward();
      toast({
        title: "Daily Reward Claimed! 🎁",
        description: `You received ${reward.amount} USDT`,
      });
      setDailyReward({ canClaim: false });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to claim reward",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      toast({
        title: "Copied! 📋",
        description: "Referral code copied to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-green-400">Welcome back, {user?.username || 'User'}! 🚀</h1>
            <p className="text-gray-300">Your crypto earning dashboard</p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              🔔 Notifications
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              💬 Contact Support
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              🔓 Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Balance and Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance Card */}
        <div className="glass-effect rounded-2xl p-6">
          <div className="text-center">
            <div className="text-lg text-gray-300 mb-2">💰 Balance</div>
            <div className="text-4xl font-bold text-white mb-2">
              {user?.balance?.toFixed(2) || '0.00'} USDT
            </div>
            <div className="text-sm text-gray-400">
              Total Earned: {user?.balance?.toFixed(2) || '0.00'} USDT
            </div>
          </div>
        </div>

        {/* Plan Card */}
        <div className="glass-effect rounded-2xl p-6 border-2 border-yellow-400">
          <div className="text-center">
            <div className="text-lg text-yellow-400 mb-2">⭐ {user?.plan || 'BASIC'} Plan</div>
            <div className="text-sm text-gray-300 mb-2">Daily Claim: 0.1 USDT</div>
            <div className="text-sm text-gray-300 mb-2">Min Withdrawal: 100 USDT</div>
            <div className="text-sm text-gray-300">Referrals: {referralCount}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-green rounded-xl">
          <CardContent className="p-4 text-center text-white">
            <div className="text-2xl mb-2">🎁</div>
            <div className="font-semibold">Daily Claim</div>
            <div className="text-sm opacity-90 mb-3">
              {dailyReward.canClaim ? 'Available now' : 'Claimed today'}
            </div>
            <Button
              onClick={claimDailyReward}
              disabled={!dailyReward.canClaim || loading}
              className="w-full bg-white text-green-600 hover:bg-gray-100"
              size="sm"
            >
              {dailyReward.canClaim ? 'Claim Now' : 'Claimed'}
            </Button>
          </CardContent>
        </Card>

        <Card className="card-blue rounded-xl">
          <CardContent className="p-4 text-center text-white">
            <div className="text-2xl mb-2">📁</div>
            <div className="font-semibold">Deposit</div>
            <div className="text-sm opacity-90 mb-3">Add funds</div>
            <Button className="w-full bg-white text-blue-600 hover:bg-gray-100" size="sm">
              Deposit
            </Button>
          </CardContent>
        </Card>

        <Card className="card-purple rounded-xl">
          <CardContent className="p-4 text-center text-white">
            <div className="text-2xl mb-2">🚀</div>
            <div className="font-semibold">Withdraw</div>
            <div className="text-sm opacity-90 mb-3">Cash out</div>
            <Button className="w-full bg-white text-purple-600 hover:bg-gray-100" size="sm">
              Withdraw
            </Button>
          </CardContent>
        </Card>

        <Card className="card-orange rounded-xl">
          <CardContent className="p-4 text-center text-white">
            <div className="text-2xl mb-2">⬆️</div>
            <div className="font-semibold">Upgrade</div>
            <div className="text-sm opacity-90 mb-3">Better plan</div>
            <Button className="w-full bg-white text-orange-600 hover:bg-gray-100" size="sm">
              Upgrade
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Games & Betting */}
      <div className="glass-effect rounded-2xl p-6">
        <h2 className="text-xl font-bold text-green-400 mb-4">🎮 Games & Betting</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-pink rounded-xl game-card">
            <CardContent className="p-6 text-center text-white">
              <div className="text-4xl mb-3">🎰</div>
              <h3 className="font-bold text-lg mb-2">Fortune Wheel</h3>
              <p className="text-sm opacity-90 mb-4">Spin to win USDT!</p>
              <Button className="w-full bg-white text-pink-600 hover:bg-gray-100">
                Play Now
              </Button>
            </CardContent>
          </Card>

          <Card className="card-blue rounded-xl game-card">
            <CardContent className="p-6 text-center text-white">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-bold text-lg mb-2">Aviator</h3>
              <p className="text-sm opacity-90 mb-4">Fly high & cash out!</p>
              <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                Play Now
              </Button>
            </CardContent>
          </Card>

          <Card className="card-green rounded-xl game-card">
            <CardContent className="p-6 text-center text-white">
              <div className="text-4xl mb-3">⚽</div>
              <h3 className="font-bold text-lg mb-2">Football Bet</h3>
              <p className="text-sm opacity-90 mb-4">Real matches!</p>
              <Button className="w-full bg-white text-green-600 hover:bg-gray-100">
                Bet Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Referral Program */}
      <div className="glass-effect rounded-2xl p-6">
        <h2 className="text-xl font-bold text-blue-400 mb-4">👥 Referral Program</h2>
        <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="text-gray-300 mb-1">Your Referral Code:</div>
            <div className="text-2xl font-mono text-yellow-400">
              {user?.referralCode || 'D3EY0ZBR'}
            </div>
          </div>
          <Button
            onClick={copyReferralCode}
            className="copy-btn bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
