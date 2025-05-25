import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Plan } from '@/types';
import PlanUpgrade from './PlanUpgrade';
import WithdrawalForm from './WithdrawalForm';
import TransactionHistory from './TransactionHistory';
import SpinningWheel from './SpinningWheel';
import AdminPanel from './AdminPanel';
import { LogOut } from 'lucide-react';

interface DashboardProps {
  user: User;
  onUserUpdate: (user: User) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onUserUpdate, onLogout }) => {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [successStories, setSuccessStories] = useState<string[]>([]);

  

  // Real names for success stories
  const realNames = [
    'Emmanuel', 'Richard', 'Stephanie', 'Michael', 'Sarah', 'David', 'Jessica', 
    'Andrew', 'Maria', 'Robert', 'Lisa', 'James', 'Ashley', 'Christopher', 
    'Amanda', 'Daniel', 'Nicole', 'Matthew', 'Michelle', 'Anthony', 'Jennifer',
    'Mark', 'Elizabeth', 'Donald', 'Linda', 'Steven', 'Barbara', 'Paul', 'Susan'
  ];

  const withdrawalAmounts = [50, 100, 150, 200, 250, 300, 400, 500, 750, 1000, 1200, 1500];
  const referralAmounts = [25, 50, 75, 100, 125, 150];

  // Generate success stories
  useEffect(() => {
    const generateStory = () => {
      const name = realNames[Math.floor(Math.random() * realNames.length)];
      const isWithdrawal = Math.random() > 0.3;
      
      if (isWithdrawal) {
        const amount = withdrawalAmounts[Math.floor(Math.random() * withdrawalAmounts.length)];
        return `${name} withdrew: ${amount} USDT ✅`;
      } else {
        const amount = referralAmounts[Math.floor(Math.random() * referralAmounts.length)];
        return `${name} earned: ${amount} USDT (Referral)`;
      }
    };

  // Start with 100 stories
  const initialStories = Array.from({ length: 100 }, generateStory);
  setSuccessStories(initialStories);

  const interval = setInterval(() => {
    setSuccessStories(prev => {
      const newStory = generateStory();
      const updated = [newStory, ...prev];
      return updated.slice(0, 600); // Keep only the last 500
    });
  }, 10000); // Add every 5 seconds

  return () => clearInterval(interval);
}, []);

 
  // Handle registration bonus
  useEffect(() => {
    if (user.hasRegistrationBonus && user.balance === 0) {
      const updatedUser = {
        ...user,
        balance: 1.00,
        totalEarned: 1.00,
        hasRegistrationBonus: false
      };
      onUserUpdate(updatedUser);
      setTimeout(() => {
        alert('Welcome! You received 1 USDT registration bonus! 🎉');
      }, 1000);
    }
  }, [user, onUserUpdate]);

  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      dailyClaim: 0.5,
      color: 'bg-gray-600',
      features: ['0.5 USDT daily claim', 'Basic support', '1 referral bonus']
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 10,
      dailyClaim: 3,
      color: 'bg-blue-600',
      features: ['3 USDT daily claim', 'Priority support', '3x referral bonus', '3 wheel spins/day']
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 20,
      dailyClaim: 6,
      color: 'bg-purple-600',
      features: ['6 USDT daily claim', 'VIP support', '5x referral bonus', 'Unlimited wheel spins']
    }
  ];

  const currentPlan = plans.find(p => p.id === user.plan) || plans[0];

  // Mock transactions for the history
  const mockTransactions = [
    {
      id: '1',
      type: 'claim' as const,
      amount: currentPlan.dailyClaim,
      status: 'completed' as const,
      date: new Date().toLocaleDateString(),
      description: 'Daily claim reward'
    },
    {
      id: '2',
      type: 'referral' as const,
      amount: 5,
      status: 'completed' as const,
      date: new Date(Date.now() - 86400000).toLocaleDateString(),
      description: 'Referral bonus'
    }
  ];

  const handleClaim = () => {
    const now = new Date().toISOString();
    const lastClaim = user.lastClaim ? new Date(user.lastClaim) : null;
    const today = new Date().toDateString();
    
    if (lastClaim && lastClaim.toDateString() === today) {
      alert('You have already claimed today! Come back tomorrow.');
      return;
    }

    const updatedUser = {
      ...user,
      balance: user.balance + currentPlan.dailyClaim,
      totalEarned: user.totalEarned + currentPlan.dailyClaim,
      lastClaim: now
    };
    
    onUserUpdate(updatedUser);
    alert(`Successfully claimed ${currentPlan.dailyClaim} USDT! 🎉`);
  };

  const handleUpgrade = (plan: Plan) => {
    // Set pending upgrade instead of immediate upgrade
    const updatedUser = { 
      ...user, 
      pendingUpgrade: {
        planId: plan.id,
        amount: plan.price,
        status: 'pending' as const
      }
    };
    onUserUpdate(updatedUser);
    setShowUpgrade(false);
    alert('Upgrade request submitted! Your account will be upgraded once payment is confirmed.');
  };

  const handleSpinWin = (amount: number) => {
    const updatedUser = {
      ...user,
      balance: user.balance + amount,
      totalEarned: user.totalEarned + amount
    };
    onUserUpdate(updatedUser);
    setShowSpinWheel(false);
  };

  const handleSpinLose = (amount: number) => {
    const updatedUser = {
      ...user,
      balance: user.balance - amount
    };
    onUserUpdate(updatedUser);
    setShowSpinWheel(false);
  };

  const canClaimToday = () => {
    if (!user.lastClaim) return true;
    const lastClaim = new Date(user.lastClaim);
    const today = new Date();
    return lastClaim.toDateString() !== today.toDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="crypto-card text-white border-0">
          <CardHeader className="text-center relative">
            <Button
              onClick={onLogout}
              className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white"
              size="sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            <CardTitle className="text-4xl font-bold neon-text">
              Welcome back, {user.username}! 🚀
            </CardTitle>
            <p className="text-gray-300">Your crypto journey starts here</p>
            {user.pendingUpgrade && (
              <div className="bg-yellow-600/20 border border-yellow-500 p-3 rounded mt-4">
                <p className="text-yellow-300 font-semibold">
                  ⏳ Upgrade to {user.pendingUpgrade.planId} pending confirmation
                </p>
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Balance Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="gold-gradient text-black border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">💰 Balance</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold">{user.balance.toFixed(2)} USDT</div>
            </CardContent>
          </Card>

          <Card className="bg-green-600 text-white border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">📈 Total Earned</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold">{user.totalEarned.toFixed(2)} USDT</div>
            </CardContent>
          </Card>

          <Card className="bg-blue-600 text-white border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">👥 Referrals</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold">{user.referralCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-purple-600 text-white border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">⭐ Plan</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold">{currentPlan.name}</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-5 gap-4">
          <Button 
            onClick={handleClaim}
            disabled={!canClaimToday()}
            className="gold-gradient text-black font-bold text-lg py-6 hover:scale-105 transition-transform"
          >
            {canClaimToday() ? `💎 CLAIM ${currentPlan.dailyClaim} USDT` : '✅ CLAIMED TODAY'}
          </Button>
          
          <Button 
            onClick={() => setShowSpinWheel(true)}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-lg py-6 hover:scale-105 transition-transform"
          >
            🎰 SPIN WHEEL
          </Button>

          <Button 
            onClick={() => setShowUpgrade(true)}
            disabled={!!user.pendingUpgrade}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg py-6 hover:scale-105 transition-transform disabled:opacity-50"
          >
            ⬆️ UPGRADE
          </Button>

          <Button 
            onClick={() => setShowWithdrawal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg py-6 hover:scale-105 transition-transform"
          >
            💸 WITHDRAW
          </Button>

          <Button 
            onClick={() => setShowHistory(true)}
            className="bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold text-lg py-6 hover:scale-105 transition-transform"
          >
            📊 HISTORY
          </Button>
        </div>

        {/* Admin Panel Access (hidden for regular users) */}
        {user.isAdmin && (
          <div className="text-center">
            <Button 
              onClick={() => setShowAdminPanel(true)}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold text-lg py-3 px-6 hover:scale-105 transition-transform"
            >
              👑 ADMIN PANEL
            </Button>
          </div>
        )}

        {/* Referral Section */}
        <Card className="crypto-card text-white border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold neon-text">🔗 Invite Friends & Earn More!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Share your referral code and earn bonus USDT for every friend who joins!
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-black/30 p-3 rounded border border-yellow-500">
                <span className="text-yellow-400 font-mono text-lg">{user.referralCode}</span>
              </div>
              <Button 
                onClick={() => {
                  // navigator.clipboard.writeText(`https://bigwin-yq75.onrender.com/ Use my referral code: ${user.referralCode}`);
                  navigator.clipboard.writeText(`https://bigwin-yq75.onrender.com/ Use my referral code: ${user.referralCode}`);
                  alert('Referral message copied to clipboard!');
                }}
                className="gold-gradient text-black font-bold"
              >
                📋 COPY LINK
              </Button>
            </div>
            <div className="text-sm text-gray-400">
              Earn 10% of your referrals' daily claims forever! 💰
            </div>
          </CardContent>
        </Card>

        {/* Real-time Success Stories */}
        <Card className="bg-green-600/20 border-green-600/30 text-white overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-green-400">🏆 Live Success Stories</CardTitle>
          </CardHeader>
          <CardContent className="relative h-32">
            <div className="absolute inset-0 overflow-hidden">
              <div className="animate-scroll space-y-2">
                {successStories.map((story, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center py-1 px-2 bg-green-500/10 rounded transition-all duration-500"
                  >
                    <span className="text-sm">{story}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {showUpgrade && (
        <PlanUpgrade 
          plans={plans} 
          currentPlan={currentPlan} 
          onUpgrade={handleUpgrade} 
          onClose={() => setShowUpgrade(false)} 
        />
      )}

      {showWithdrawal && (
        <WithdrawalForm 
          user={user} 
          onClose={() => setShowWithdrawal(false)} 
        />
      )}

      {showHistory && (
        <TransactionHistory 
          transactions={mockTransactions}
          onClose={() => setShowHistory(false)} 
        />
      )}

      {showSpinWheel && (
        <SpinningWheel
          user={user}
          onWin={handleSpinWin}
          onLose={handleSpinLose}
          onClose={() => setShowSpinWheel(false)}
        />
      )}

      {showAdminPanel && user.isAdmin && (
        <AdminPanel
          user={user}
          onUserUpdate={onUserUpdate}
          onClose={() => setShowAdminPanel(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
