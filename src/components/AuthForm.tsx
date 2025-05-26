
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
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isResetPassword) {
        // Handle password reset
        if (!email) {
          setError('Please enter your email address');
          setLoading(false);
          return;
        }
        
        // Create password reset request
        StorageService.createPasswordResetRequest(email);
        setResetMessage('Password reset request submitted! An admin will review your request. Please try again after some minutes.');
        setIsResetPassword(false);
        setEmail('');
      } else if (isLogin) {
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
          const newUser = StorageService.registerUser(email, username, password, referralCode);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-2 sm:p-4">
      <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md crypto-card text-white border-0">
        <CardHeader className="text-center px-3 sm:px-4 md:px-6">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold neon-text">
            💰 CryptoEarn Pro
          </CardTitle>
          <p className="text-yellow-300 font-semibold text-xs sm:text-sm md:text-base">
            {isResetPassword ? 'Reset Password' : isLogin ? 'Welcome Back!' : 'Join & Get 1 USDT Bonus!'}
          </p>
        </CardHeader>
        <CardContent className="px-3 sm:px-4 md:px-6">
          {resetMessage && (
            <div className="bg-green-500/20 border border-green-500/30 p-2 sm:p-3 rounded text-green-300 text-xs sm:text-sm mb-3 sm:mb-4">
              {resetMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3 md:space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 p-2 sm:p-3 rounded text-red-300 text-xs sm:text-sm">
                {error}
              </div>
            )}
            
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder-white/60 text-xs sm:text-sm md:text-base h-8 sm:h-10 md:h-12"
            />
            
            {!isLogin && !isResetPassword && (
              <Input
                type="text"
                placeholder="Username (optional)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-white/60 text-xs sm:text-sm md:text-base h-8 sm:h-10 md:h-12"
              />
            )}
            
            {!isResetPassword && (
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder-white/60 text-xs sm:text-sm md:text-base h-8 sm:h-10 md:h-12"
              />
            )}
            
            {!isLogin && !isResetPassword && (
              <Input
                type="text"
                placeholder="Referral Code (optional)"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                className="bg-white/10 border-white/20 text-white placeholder-white/60 text-xs sm:text-sm md:text-base h-8 sm:h-10 md:h-12"
              />
            )}
            
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full gold-gradient text-black font-bold text-xs sm:text-sm md:text-lg py-2 sm:py-3 hover:scale-105 transition-transform disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-black"></div>
                  {isResetPassword ? 'Sending...' : isLogin ? 'Logging in...' : 'Creating account...'}
                </div>
              ) : (
                isResetPassword ? '🔑 RESET PASSWORD' : isLogin ? '🚀 LOGIN NOW' : '💎 CLAIM 1 USDT BONUS'
              )}
            </Button>
          </form>
          
          <div className="text-center mt-2 sm:mt-3 md:mt-4 space-y-2">
            {!isResetPassword && (
              <>
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setResetMessage('');
                  }}
                  className="text-yellow-300 hover:text-yellow-100 underline text-xs sm:text-sm md:text-base block w-full"
                >
                  {isLogin ? "Don't have an account? Sign up!" : 'Already have an account? Login!'}
                </button>
                
                {isLogin && (
                  <button
                    onClick={() => {
                      setIsResetPassword(true);
                      setError('');
                      setResetMessage('');
                    }}
                    className="text-blue-300 hover:text-blue-100 underline text-xs sm:text-sm md:text-base"
                  >
                    Forgot Password?
                  </button>
                )}
              </>
            )}
            
            {isResetPassword && (
              <button
                onClick={() => {
                  setIsResetPassword(false);
                  setError('');
                  setResetMessage('');
                }}
                className="text-yellow-300 hover:text-yellow-100 underline text-xs sm:text-sm md:text-base"
              >
                Back to Login
              </button>
            )}
          </div>
          
          {!isLogin && !isResetPassword && (
            <div className="mt-2 sm:mt-3 md:mt-4 p-2 sm:p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
              <p className="text-yellow-200 text-xs sm:text-sm text-center">
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
