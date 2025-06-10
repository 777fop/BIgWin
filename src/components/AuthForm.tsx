import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User } from '@/types';

interface AuthFormProps {
  onLogin: (user: User) => void;
}

const API_BASE_URL = '/api';

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
      setIsLogin(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    const apiUrl = isLogin ? `${API_BASE_URL}/auth/login` : `${API_BASE_URL}/auth/register`;
  
    const payload = isLogin
      ? { email, password }
      : { email, username, password, referralCode: referralCode || undefined };
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }
  
      const data = await response.json();
      
      // Store token if provided
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      // Get user data - might be directly in response or need to fetch
      let user = data.user || data;
      
      // If we only got a token, fetch user data
      if (data.token && !user.id) {
        const userResponse = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${data.token}`,
            'Content-Type': 'application/json'
          },
        });
  
        if (userResponse.ok) {
          user = await userResponse.json();
        }
      }
  
      // Trigger login callback with user data
      onLogin(user);
  
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email first');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error requesting password reset');
      }

      alert('Password reset request submitted. An admin will process it shortly.');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error submitting password reset request');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/40 backdrop-blur-lg border-purple-500/20 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            BigWin Crypto
          </CardTitle>
          <p className="text-gray-300 mt-2">
            {isLogin ? 'Welcome back!' : 'Join the crypto revolution!'}
          </p>
          {referralCode && (
            <div className="bg-green-600/20 border border-green-500 p-2 rounded mt-2">
              <p className="text-green-300 text-sm">
                🎉 You were referred! Code: <span className="font-bold">{referralCode}</span>
              </p>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
              required
            />

            {!isLogin && (
              <Input
                type="text"
                placeholder="Username (optional)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
              />
            )}

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
              required
            />

            {!isLogin && (
              <Input
                type="text"
                placeholder="Referral Code (optional)"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
              />
            )}

            {error && (
              <div className="bg-red-600/20 border border-red-500 p-3 rounded">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 hover:scale-105 transition-transform"
            >
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-300 hover:text-white"
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
            </Button>

            {isLogin && (
              <Button
                type="button"
                variant="ghost"
                onClick={handlePasswordReset}
                className="text-blue-300 hover:text-white text-sm"
              >
                Forgot Password?
              </Button>
            )}
          </div>

          <div className="text-center text-xs text-gray-400 mt-6">
            <p>🚀 Start earning crypto today!</p>
            <p>💰 Daily rewards • 🎰 Games • 👥 Referrals</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
