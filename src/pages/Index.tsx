
import React, { useState } from 'react';
import { User } from '@/types';
import AuthForm from '@/components/AuthForm';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    // Set initial balance to 0 and give 1 USDT registration bonus
    const newUser = {
      ...userData,
      balance: 0.00, // Start with 0 balance
      totalEarned: 0.00,
      stakingBalance: 0,
      lastSpinDate: null,
      hasRegistrationBonus: !userData.id.includes('admin') // Only new users get registration bonus (not admin)
    };
    setUser(newUser);
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen">
      <div className="pt-16">
        {!user ? (
          <AuthForm onLogin={handleLogin} />
        ) : (
          <Dashboard 
            user={user} 
            onUserUpdate={handleUserUpdate}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
