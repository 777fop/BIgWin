
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types';

interface AuthFormProps {
  onLogin: (user: User) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for admin credentials
    if (email === 'robivine99@gmail.com' && password === 'BK-24') {
      // Create admin user
      const adminUser: User = {
        id: 'admin-user',
        email,
        username: 'Admin',
        balance: 0,
        referralCode: 'ADMIN',
        referralCount: 0,
        plan: 'vip',
        lastClaim: null,
        totalEarned: 0,
        registrationDate: new Date().toISOString(),
        lastSpinDate: null,
        stakingBalance: 0,
        isAdmin: true
      };
      onLogin(adminUser);
      return;
    }
    
    // Simulate user creation
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      username: username || email.split('@')[0],
      balance: 0, // Start with 0 balance
      referralCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
      referralCount: 0,
      plan: 'basic',
      lastClaim: null,
      totalEarned: 0,
      registrationDate: new Date().toISOString(),
      lastSpinDate: null,
      stakingBalance: 0,
      hasRegistrationBonus: !isLogin // Only new users get registration bonus
    };

    onLogin(newUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <Card className="w-full max-w-md crypto-card text-white border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold neon-text">
            💰 CryptoEarn Pro
          </CardTitle>
          <p className="text-yellow-300 font-semibold">
            {isLogin ? 'Welcome Back!' : 'Join & Get 1 USDT Bonus!'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder-white/60"
            />
            
            {!isLogin && (
              <Input
                type="text"
                placeholder="Username (optional)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-white/60"
              />
            )}
            
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder-white/60"
            />
            
            {!isLogin && (
              <Input
                type="text"
                placeholder="Referral Code (optional)"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-white/60"
              />
            )}
            
            <Button 
              type="submit" 
              className="w-full gold-gradient text-black font-bold text-lg py-3 hover:scale-105 transition-transform"
            >
              {isLogin ? '🚀 LOGIN NOW' : '💎 CLAIM 1 USDT BONUS'}
            </Button>
          </form>
          
          <div className="text-center mt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-yellow-300 hover:text-yellow-100 underline"
            >
              {isLogin ? "Don't have an account? Sign up!" : 'Already have an account? Login!'}
            </button>
          </div>
          
          {!isLogin && (
            <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
              <p className="text-yellow-200 text-sm text-center">
                🎁 Limited Time: Get 1 USDT signup bonus + 5 USDT per referral!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
