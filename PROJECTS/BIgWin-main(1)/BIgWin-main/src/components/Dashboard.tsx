import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Plan } from '@/types';
import SpinningWheel from './SpinningWheel';
import AviatorGame from './AviatorGame';
import FootballBetting from './FootballBetting';
import DepositForm from './DepositForm';
import WithdrawalForm from './WithdrawalForm';
import PlanUpgrade from './PlanUpgrade';
import TransactionHistory from './TransactionHistory';
import NotificationCenter from './NotificationCenter';
import ApiService from '@/services/apiService';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUpdateBalance: (newBalance: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onUpdateBalance }) => {
  const [activeGame, setActiveGame] = useState<'spin' | 'aviator' | 'football' | null>(null);
  const [activeModal, setActiveModal] = useState<'deposit' | 'withdraw' | 'upgrade' | 'transactions' | 'notifications' | 'support' | null>(null);
  const [dailyReward, setDailyReward] = useState({ canClaim: false, amount: 0 });
  const [notifications, setNotifications] = useState<any[]>([]);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [lastClaimDate, setLastClaimDate] = useState<string | null>(null);

  // Define plans with proper structure
  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      dailyClaim: 0.5,
      withdrawalMinimum: 100,
      color: 'bg-gradient-to-br from-gray-700 to-gray-800',
      features: ['$0.5 Daily Claims', '$100 Minimum Withdrawal', 'Basic Support']
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 50,
      dailyClaim: 3,
      withdrawalMinimum: 5,
      color: 'bg-gradient-to-br from-blue-700 to-blue-800',
      features: ['$3 Daily Claims', '$5 Minimum Withdrawal', 'Priority Support']
    },
    {
      id: 'gold',
      name: 'Gold',
      price: 100,
      dailyClaim: 6,
      withdrawalMinimum: 5,
      color: 'bg-gradient-to-br from-yellow-600 to-yellow-700',
      features: ['$6 Daily Claims', '$5 Minimum Withdrawal', 'VIP Support', 'Exclusive Bonuses']
    }
  ];

  const currentPlan = plans.find(p => p.id === user.plan) || plans[0];

  useEffect(() => {
    checkDailyReward();
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkDailyReward = async () => {
    try {
      const data = await ApiService.checkDailyReward();
      setDailyReward(data);
      setLastClaimDate(data.lastClaimDate);
    } catch (error) {
      console.error('Error checking daily reward:', error);
      // Set local daily reward based on plan and check if already claimed today
      const lastClaim = user.lastClaim ? new Date(user.lastClaim) : null;
      const now = new Date();
      const today = now.toDateString();
      const lastClaimDay = lastClaim ? lastClaim.toDateString() : null;
      
      const canClaim = lastClaimDay !== today;
      setDailyReward({ canClaim, amount: currentPlan.dailyClaim });
      setLastClaimDate(lastClaim ? lastClaim.toISOString() : null);
    }
  };

  const claimDailyReward = async () => {
    if (!dailyReward.canClaim) {
      alert('You have already claimed your daily reward today. Come back tomorrow!');
      return;
    }

    try {
      const data = await ApiService.claimDailyReward();
      onUpdateBalance(data.newBalance || user.balance + dailyReward.amount);
      setDailyReward({ canClaim: false, amount: 0 });
      setLastClaimDate(new Date().toISOString());
      alert(`Daily reward claimed: $${dailyReward.amount} USDT!`);
    } catch (error) {
      console.error('Error claiming reward:', error);
      // Local fallback
      onUpdateBalance(user.balance + dailyReward.amount);
      setDailyReward({ canClaim: false, amount: 0 });
      setLastClaimDate(new Date().toISOString());
      alert(`Daily reward claimed: $${dailyReward.amount} USDT!`);
    }
  };

  const loadNotifications = async () => {
    try {
      const data = await ApiService.getNotifications();
      setNotifications(data.data || data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleGameWin = (amount: number) => {
    onUpdateBalance(user.balance + amount);
  };

  const handleGameLose = (amount: number) => {
    onUpdateBalance(user.balance - amount);
  };

  const handleBetPlaced = (amount: number) => {
    onUpdateBalance(user.balance - amount);
  };

  const handleSendSupportMessage = async () => {
    if (!supportSubject.trim() || !supportMessage.trim()) {
      alert('Please fill in both subject and message');
      return;
    }

    try {
      const adminUsers = await ApiService.getAllUsers();
      const admin = adminUsers.find((u: any) => u.isAdmin || u.role === 'ADMIN');
      
      if (admin) {
        await ApiService.sendMessage(admin.id, `Subject: ${supportSubject}\n\nMessage: ${supportMessage}`);
        alert('Support message sent successfully!');
        setSupportSubject('');
        setSupportMessage('');
        setActiveModal(null);
      } else {
        alert('No admin found to send message to');
      }
    } catch (error) {
      console.error('Error sending support message:', error);
      alert('Failed to send support message');
    }
  };

  const handleUpgrade = (plan: Plan) => {
    console.log('Upgrading to:', plan.name);
  };

  const successStories = [
    { name: "Alex K.", amount: 1250, game: "Aviator" },
    { name: "Maria S.", amount: 890, game: "Spin Wheel" },
    { name: "John D.", amount: 2100, game: "Sport Bet" },
    { name: "Sarah L.", amount: 567, game: "Aviator" },
    { name: "Mike R.", amount: 1450, game: "Spin Wheel" },
    { name: "Emma T.", amount: 780, game: "Sport Bet" },
  ];

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStoryIndex((prev) => (prev + 1) % successStories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700/50 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                🎰 CRYPTO CASINO
              </h1>
              <p className="text-lg text-white font-bold mt-1">Welcome back, {user.username || user.email}!</p>
              <p className="text-sm text-yellow-300 font-semibold">Current Plan: {currentPlan.name}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-center sm:text-right">
                <div className="text-lg text-white font-bold">Balance</div>
                <div className="text-2xl sm:text-3xl font-bold text-green-400">
                  {user.balance?.toFixed(2) || '0.00'} USDT
                </div>
              </div>
              <Button
                onClick={onLogout}
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white font-bold"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Live Success Stories */}
        <Card className="bg-gradient-to-r from-green-900/80 to-emerald-900/80 border-green-500/50 overflow-hidden shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-2xl animate-pulse">🎉</div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {successStories[currentStoryIndex].name} just won {successStories[currentStoryIndex].amount} USDT
                </div>
                <div className="text-sm text-green-300 font-semibold">
                  Playing {successStories[currentStoryIndex].game}
                </div>
              </div>
              <div className="text-2xl animate-bounce">💰</div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Reward */}
        <Card className="bg-gradient-to-r from-yellow-900/80 to-orange-900/80 border-yellow-500/50 shadow-xl">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-white mb-2">🎁 Daily Reward</div>
            <div className="text-lg text-white font-semibold mb-4">
              {dailyReward.canClaim 
                ? `Claim your $${currentPlan.dailyClaim} USDT bonus!` 
                : `Next reward: $${currentPlan.dailyClaim} USDT (Come back tomorrow!)`}
            </div>
            <Button
              onClick={claimDailyReward}
              disabled={!dailyReward.canClaim}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-lg px-8 py-3 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {dailyReward.canClaim ? 'CLAIM REWARD' : 'CLAIMED TODAY'}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-green-900/90 to-emerald-900/90 border-green-500/60 hover:scale-105 transition-transform cursor-pointer shadow-xl">
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">💰</div>
              <Button
                onClick={() => setActiveModal('deposit')}
                className="w-full bg-green-600/40 border border-green-500/50 text-white font-bold hover:bg-green-600/60 text-sm py-2 shadow-lg"
              >
                Deposit
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/90 to-cyan-900/90 border-blue-500/60 hover:scale-105 transition-transform cursor-pointer shadow-xl">
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">💸</div>
              <Button
                onClick={() => setActiveModal('withdraw')}
                className="w-full bg-blue-600/40 border border-blue-500/50 text-white font-bold hover:bg-blue-600/60 text-sm py-2 shadow-lg"
              >
                Withdraw
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 border-purple-500/60 hover:scale-105 transition-transform cursor-pointer shadow-xl">
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">⬆️</div>
              <Button
                onClick={() => setActiveModal('upgrade')}
                className="w-full bg-purple-600/40 border border-purple-500/50 text-white font-bold hover:bg-purple-600/60 text-sm py-2 shadow-lg"
              >
                Upgrade
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-900/90 to-red-900/90 border-orange-500/60 hover:scale-105 transition-transform cursor-pointer shadow-xl">
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2 relative">
                🔔
                {notifications.filter(n => !n.read).length > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <Button
                onClick={() => setActiveModal('notifications')}
                className="w-full bg-orange-600/40 border border-orange-500/50 text-white font-bold hover:bg-orange-600/60 text-sm py-2 shadow-lg"
              >
                Alerts
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900/90 to-slate-900/90 border-gray-500/60 hover:scale-105 transition-transform cursor-pointer shadow-xl">
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">🎧</div>
              <Button
                onClick={() => setActiveModal('support')}
                className="w-full bg-gray-600/40 border border-gray-500/50 text-white font-bold hover:bg-gray-600/60 text-sm py-2 shadow-lg"
              >
                Support
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Game Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Spin Wheel */}
          <Card className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 border-purple-500/60 hover:scale-105 transition-transform cursor-pointer group shadow-xl">
            <CardHeader className="text-center">
              <div className="text-4xl mb-2 group-hover:animate-spin">🎰</div>
              <CardTitle className="text-xl text-white font-bold">Spin Wheel</CardTitle>
              <p className="text-sm text-white font-semibold">Win up to 10x your stake!</p>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => setActiveGame('spin')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-bold shadow-lg text-white"
              >
                Play Now
              </Button>
            </CardContent>
          </Card>

          {/* Aviator Game */}
          <Card className="bg-gradient-to-br from-blue-900/90 to-cyan-900/90 border-blue-500/60 hover:scale-105 transition-transform cursor-pointer group shadow-xl">
            <CardHeader className="text-center">
              <div className="text-4xl mb-2 group-hover:animate-bounce">✈️</div>
              <CardTitle className="text-xl text-white font-bold">Aviator</CardTitle>
              <p className="text-sm text-white font-semibold">Cash out before it crashes!</p>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => setActiveGame('aviator')}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-bold shadow-lg text-white"
              >
                Take Flight
              </Button>
            </CardContent>
          </Card>

          {/* Sport Betting */}
          <Card className="bg-gradient-to-br from-green-900/90 to-emerald-900/90 border-green-500/60 hover:scale-105 transition-transform cursor-pointer group shadow-xl">
            <CardHeader className="text-center">
              <div className="text-4xl mb-2 group-hover:animate-pulse">⚽</div>
              <CardTitle className="text-xl text-white font-bold">Sport Betting</CardTitle>
              <p className="text-sm text-white font-semibold">Bet on live matches!</p>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => setActiveGame('football')}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 font-bold shadow-lg text-white"
              >
                Place Bets
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Referral Section */}
        <Card className="bg-gradient-to-r from-orange-900/90 to-red-900/90 border-orange-500/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-orange-400 text-center font-bold text-xl">👥 Invite Friends & Earn</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-white font-semibold text-lg">Share your referral link and earn 10% of their deposits!</p>
            <div className="bg-gray-800/50 p-3 rounded border border-gray-600">
              <div className="text-sm text-white font-bold mb-1">Your Referral Link:</div>
              <div className="text-orange-300 font-mono text-sm break-all bg-black/30 p-2 rounded">
                https://cryptocasino.com/register?ref={user.id || 'USER123'}
              </div>
            </div>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(`https://cryptocasino.com/register?ref=${user.id || 'USER123'}`);
                alert('Referral link copied to clipboard!');
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-lg"
            >
              📋 Copy Referral Link
            </Button>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gray-800/90 border-gray-600 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{user.balance?.toFixed(2) || '0.00'}</div>
              <div className="text-sm text-white font-semibold">Balance (USDT)</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/90 border-gray-600 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{currentPlan.name}</div>
              <div className="text-sm text-white font-semibold">Current Plan</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/90 border-gray-600 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">${currentPlan.dailyClaim}</div>
              <div className="text-sm text-white font-semibold">Daily Claims</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800/90 border-gray-600 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">${currentPlan.withdrawalMinimum}</div>
              <div className="text-sm text-white font-semibold">Min Withdrawal</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Game Modals */}
      {activeGame === 'spin' && (
        <SpinningWheel
          user={user}
          onWin={handleGameWin}
          onLose={handleGameLose}
          onClose={() => setActiveGame(null)}
        />
      )}

      {activeGame === 'aviator' && (
        <AviatorGame
          user={user}
          onWin={handleGameWin}
          onLose={handleGameLose}
          onClose={() => setActiveGame(null)}
        />
      )}

      {activeGame === 'football' && (
        <FootballBetting
          user={user}
          onBetPlaced={handleBetPlaced}
          onClose={() => setActiveGame(null)}
        />
      )}

      {/* Action Modals */}
      {activeModal === 'deposit' && (
        <DepositForm 
          user={user} 
          onClose={() => setActiveModal(null)} 
          onSuccess={() => {
            setActiveModal(null);
          }}
        />
      )}

      {activeModal === 'withdraw' && (
        <WithdrawalForm user={user} onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'upgrade' && (
        <PlanUpgrade 
          user={user} 
          plans={plans} 
          currentPlan={currentPlan}
          onUpgrade={handleUpgrade}
          onClose={() => setActiveModal(null)} 
        />
      )}

      {activeModal === 'transactions' && (
        <TransactionHistory transactions={[]} onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'notifications' && (
        <NotificationCenter 
          notifications={notifications} 
          onMarkAsRead={() => {}}
          onClose={() => setActiveModal(null)} 
        />
      )}

      {activeModal === 'support' && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <Card className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white border-0 w-full max-w-md shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-center text-white font-bold">🎧 Contact Support</CardTitle>
              <Button
                onClick={() => setActiveModal(null)}
                className="bg-red-600 hover:bg-red-700 text-white border-0 w-8 h-8 p-0 text-sm font-bold rounded-full"
                size="sm"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white text-center font-semibold">Send a direct message to admin:</p>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Subject</label>
                <Input
                  type="text"
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  placeholder="Enter subject"
                  className="bg-white/10 border-white/20 text-white placeholder-white/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Message</label>
                <textarea
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Enter your message..."
                  className="w-full h-24 p-3 bg-white/10 border border-white/20 rounded text-white placeholder-white/60 resize-none"
                />
              </div>

              <Button
                onClick={handleSendSupportMessage}
                disabled={!supportSubject.trim() || !supportMessage.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold hover:scale-105 transition-transform disabled:opacity-50"
              >
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
