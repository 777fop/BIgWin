import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Plan } from '@/types';
import { Notification } from '@/types/notifications';
import PlanUpgrade from './PlanUpgrade';
import WithdrawalForm from './WithdrawalForm';
import TransactionHistory from './TransactionHistory';
import SpinningWheel from './SpinningWheel';
import AdminPanel from './AdminPanel';
import DepositForm from './DepositForm';
import AviatorGame from './AviatorGame';
import NotificationCenter from './NotificationCenter';
import { LogOut, Bell } from 'lucide-react';
import { StorageService } from '@/services/storageService';

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
  const [showDeposit, setShowDeposit] = useState(false);
  const [showAviator, setShowAviator] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [successStories, setSuccessStories] = useState<string[]>([]);

  // Load user notifications
  useEffect(() => {
    const loadNotifications = () => {
      const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const userNotifications = allNotifications.filter((n: Notification) => n.userId === user.id);
      setNotifications(userNotifications);
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [user.id]);

  const unreadNotifications = notifications.filter(n => !n.read);

  const handleMarkAsRead = (notificationId: string) => {
    const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updatedNotifications = allNotifications.map((n: Notification) => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };

  const realNames = [
    'Emmanuel', 'Richard', 'Stephanie', 'Michael', 'Sarah', 'David', 'Jessica', 
    'Andrew', 'Maria', 'Robert', 'Lisa', 'James', 'Ashley', 'Christopher', 
    'Amanda', 'Daniel', 'Nicole', 'Matthew', 'Michelle', 'Anthony', 'Jennifer',
    'Mark', 'Elizabeth', 'Donald', 'Linda', 'Steven', 'Barbara', 'Paul', 'Susan'
  ];

  const withdrawalAmounts = [50, 100, 150, 200, 250, 300, 400, 500, 750, 1000, 1200, 1500];
  const referralAmounts = [25, 50, 75, 100, 125, 150];

  // Real names for success stories
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
    }, 14000); // Add every 5 seconds

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
      withdrawalMinimum: 100,
      color: 'bg-gray-600',
      features: ['0.5 USDT daily claim', 'Basic support', '1 referral bonus','withdrawalMinimum 100']
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 10,
      dailyClaim: 3,
      withdrawalMinimum: 5,
      color: 'bg-blue-600',
      features: ['3 USDT daily claim', 'Priority support', '3x referral bonus', '3 wheel spins/day','withdrawalMinimum 5']
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 20,
      dailyClaim: 7,
      withdrawalMinimum: 5,
      color: 'bg-purple-600',
      features: ['6 USDT daily claim', 'VIP support', '5x referral bonus', 'Unlimited wheel spins','withdrawalMinimum 5']
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
        status: 'pending' as const,
        requestDate: new Date().toISOString()
      }
    };
    onUserUpdate(updatedUser);
    setShowUpgrade(false);
    alert('Your account will be upgraded once payment is confirmed.');
  };

  const handleCancelUpgrade = () => {
    if (user.pendingUpgrade) {
      const upgradeRequests = StorageService.getAllUpgradeRequests();
      const userRequest = upgradeRequests.find(r => 
        r.userId === user.id && r.status === 'pending'
      );
      
      if (userRequest) {
        StorageService.cancelUpgradeRequest(userRequest.id);
        const updatedUser = { ...user, pendingUpgrade: undefined };
        onUserUpdate(updatedUser);
        alert('Upgrade request cancelled successfully.');
      }
    }
  };

  const handleSpinWin = (amount: number) => {
    const updatedUser = {
      ...user,
      balance: user.balance + amount,
      totalEarned: user.totalEarned + amount
    };
    onUserUpdate(updatedUser);
  };

  const handleSpinLose = (amount: number) => {
    const updatedUser = {
      ...user,
      balance: user.balance - amount
    };
    onUserUpdate(updatedUser);
  };

  const handleAviatorWin = (amount: number) => {
    const updatedUser = {
      ...user,
      balance: user.balance + amount,
      totalEarned: user.totalEarned + amount
    };
    onUserUpdate(updatedUser);
  };

  const handleAviatorLose = (amount: number) => {
    const updatedUser = {
      ...user,
      balance: user.balance - amount
    };
    onUserUpdate(updatedUser);
  };

  const canClaimToday = () => {
    if (!user.lastClaim) return true;
    const lastClaim = new Date(user.lastClaim);
    const today = new Date();
    return lastClaim.toDateString() !== today.toDateString();
  };

  const copyReferralLink = () => {
    const baseUrl = window.location.origin;
    const referralLink = `${baseUrl}?ref=${user.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied to clipboard! 🎉');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <Card className="crypto-card text-white border-0">
          <CardHeader className="text-center relative px-4 sm:px-6">
            <div className="flex justify-between items-start mb-2">
              {/* Notifications Button */}
              <Button
                onClick={() => setShowNotifications(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white relative"
                size="sm"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadNotifications.length}
                  </span>
                )}
              </Button>

              <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold neon-text flex-1 text-center">
                Welcome back, {user.username}! 🚀
              </CardTitle>

              <Button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm"
                size="sm"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Logout
              </Button>
            </div>
            <p className="text-gray-300 text-sm sm:text-base">Your crypto journey starts here</p>
            
            {/* Upgrade Status */}
            {user.pendingUpgrade && (
              <div className="bg-yellow-600/20 border border-yellow-500 p-3 rounded mt-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                  <p className="text-yellow-300 font-semibold text-sm sm:text-base">
                    ⏳ Upgrade to {user.pendingUpgrade.planId} pending confirmation
                  </p>
                  <Button
                    onClick={handleCancelUpgrade}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm"
                    size="sm"
                  >
                    Cancel Request
                  </Button>
                </div>
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Balance Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          <Card className="gold-gradient text-black border-0">
            <CardHeader className="text-center pb-2 px-2 sm:px-4">
              <CardTitle className="text-sm sm:text-lg">💰 Balance</CardTitle>
            </CardHeader>
            <CardContent className="text-center px-2 sm:px-4">
              <div className="text-lg sm:text-2xl md:text-3xl font-bold">{user.balance.toFixed(2)} USDT</div>
            </CardContent>
          </Card>

          <Card className="bg-green-600 text-white border-0">
            <CardHeader className="text-center pb-2 px-2 sm:px-4">
              <CardTitle className="text-sm sm:text-lg">📈 Total Earned</CardTitle>
            </CardHeader>
            <CardContent className="text-center px-2 sm:px-4">
              <div className="text-lg sm:text-2xl md:text-3xl font-bold">{user.totalEarned.toFixed(2)} USDT</div>
            </CardContent>
          </Card>

          <Card className="bg-blue-600 text-white border-0">
            <CardHeader className="text-center pb-2 px-2 sm:px-4">
              <CardTitle className="text-sm sm:text-lg">👥 Referrals</CardTitle>
            </CardHeader>
            <CardContent className="text-center px-2 sm:px-4">
              <div className="text-lg sm:text-2xl md:text-3xl font-bold">{user.referralCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-purple-600 text-white border-0">
            <CardHeader className="text-center pb-2 px-2 sm:px-4">
              <CardTitle className="text-sm sm:text-lg">⭐ Plan</CardTitle>
            </CardHeader>
            <CardContent className="text-center px-2 sm:px-4">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{currentPlan.name}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
          <Button 
            onClick={handleClaim}
            disabled={!canClaimToday()}
            className="gold-gradient text-black font-bold text-xs sm:text-base py-4 sm:py-6 hover:scale-105 transition-transform"
          >
            {canClaimToday() ? `💎 CLAIM ${currentPlan.dailyClaim} USDT` : '✅ CLAIMED TODAY'}
          </Button>
          
          <Button 
            onClick={() => setShowSpinWheel(true)}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-xs sm:text-base py-4 sm:py-6 hover:scale-105 transition-transform"
          >
            🎰 SPIN WHEEL
          </Button>

          <Button 
            onClick={() => setShowAviator(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-xs sm:text-base py-4 sm:py-6 hover:scale-105 transition-transform"
          >
            ✈️ AVIATOR
          </Button>

          <Button 
            onClick={() => setShowDeposit(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs sm:text-base py-4 sm:py-6 hover:scale-105 transition-transform"
          >
            💰 DEPOSIT
          </Button>

          <Button 
            onClick={() => setShowUpgrade(true)}
            disabled={!!user.pendingUpgrade}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-xs sm:text-base py-4 sm:py-6 hover:scale-105 transition-transform disabled:opacity-50"
          >
            ⬆️ UPGRADE
          </Button>

          <Button 
            onClick={() => setShowWithdrawal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-xs sm:text-base py-4 sm:py-6 hover:scale-105 transition-transform"
          >
            💸 WITHDRAW
          </Button>
        </div>

        {/* Admin Panel Access */}
        {user.isAdmin && (
          <div className="text-center">
            <Button 
              onClick={() => setShowAdminPanel(true)}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold text-base sm:text-lg py-3 px-6 hover:scale-105 transition-transform"
            >
              👑 ADMIN PANEL
            </Button>
          </div>
        )}

        {/* Referral Section */}
        <Card className="crypto-card text-white border-0">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl font-bold neon-text">🔗 Invite Friends & Earn More!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            <p className="text-gray-300 text-sm sm:text-base">
              Share your referral link and earn bonus USDT for every friend who joins!
            </p>
            <div className="space-y-3">
              <div className="flex-1 w-full bg-black/30 p-3 rounded border border-yellow-500">
                <div className="text-xs text-gray-400 mb-1">Your Referral Code:</div>
                <span className="text-yellow-400 font-mono text-base sm:text-lg">{user.referralCode}</span>
              </div>
              <div className="flex-1 w-full bg-black/30 p-3 rounded border border-blue-500">
                <div className="text-xs text-gray-400 mb-1">Your Referral Link:</div>
                <span className="text-blue-400 font-mono text-xs sm:text-sm break-all">
                  {window.location.origin}?ref={user.referralCode}
                </span>
              </div>
              <Button 
                onClick={copyReferralLink}
                className="gold-gradient text-black font-bold w-full"
              >
                📋 COPY REFERRAL LINK
              </Button>
            </div>
            <div className="text-sm text-gray-400">
              Earn 10% of your referrals' daily claims forever! 💰
            </div>
          </CardContent>
        </Card>

        {/* Real-time Success Stories */}
        <Card className="bg-green-600/20 border-green-600/30 text-white overflow-hidden">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl font-bold text-green-400">🏆 Live Success Stories</CardTitle>
          </CardHeader>
          <CardContent className="relative h-32 px-4 sm:px-6">
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
      {showNotifications && (
        <NotificationCenter 
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {showUpgrade && (
        <PlanUpgrade 
          plans={plans} 
          currentPlan={currentPlan}
          user={user}
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

      {showDeposit && (
        <DepositForm
          user={user}
          onClose={() => setShowDeposit(false)}
          onSuccess={() => window.location.reload()}
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

      {showAviator && (
        <AviatorGame
          user={user}
          onWin={handleAviatorWin}
          onLose={handleAviatorLose}
          onClose={() => setShowAviator(false)}
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
