
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types';
import { StorageService } from '@/services/storageService';

interface AuthFormProps {
  onLogin: (user: User) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const user = StorageService.authenticateUser(email, password);
        if (user) {
          StorageService.setCurrentUser(user);
          onLogin(user);
        } else {
          setError('Invalid email or password');
        }
      } else {
        // Registration
        try {
          const newUser = StorageService.registerUser(email, username, referralCode);
          StorageService.setCurrentUser(newUser);
          onLogin(newUser);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Registration failed');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 p-3 rounded text-red-300 text-sm">
                {error}
              </div>
            )}
            
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
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                className="bg-white/10 border-white/20 text-white placeholder-white/60"
              />
            )}
            
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full gold-gradient text-black font-bold text-lg py-3 hover:scale-105 transition-transform disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  {isLogin ? 'Logging in...' : 'Creating account...'}
                </div>
              ) : (
                isLogin ? '🚀 LOGIN NOW' : '💎 CLAIM 1 USDT BONUS'
              )}
            </Button>
          </form>
          
          <div className="text-center mt-4">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
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

          <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
            <p className="text-blue-200 text-xs text-center">
              Demo credentials: Any email with password "BK-24"<br/>
              Admin access: robivine99@gmail.com / BK-24
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
