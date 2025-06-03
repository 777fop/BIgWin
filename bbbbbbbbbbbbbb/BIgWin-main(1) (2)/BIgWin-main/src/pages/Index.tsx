
import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import AuthForm from '@/components/AuthForm';
import Dashboard from '@/components/Dashboard';
import AdminDashboard from '@/components/AdminDashboard';
import { StorageService } from '@/services/storageService';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const currentUser = StorageService.getCurrentUser();
    if (currentUser) {
      // Refresh user data from storage in case it was updated
      const refreshedUser = StorageService.getUserByEmail(currentUser.email);
      if (refreshedUser) {
        setUser(refreshedUser);
        StorageService.setCurrentUser(refreshedUser);
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    // Handle registration bonus for new users
    if (userData.hasRegistrationBonus && userData.balance === 0) {
      const updatedUser = {
        ...userData,
        balance: 1.00,
        totalEarned: 1.00,
        hasRegistrationBonus: false
      };
      StorageService.saveUser(updatedUser);
      StorageService.setCurrentUser(updatedUser);
      setUser(updatedUser);
      
      setTimeout(() => {
        alert('Welcome! You received 1 USDT registration bonus! 🎉');
      }, 1000);
    } else {
      setUser(userData);
    }
  };

  const handleUserUpdate = (updatedUser: User) => {
    StorageService.saveUser(updatedUser);
    StorageService.setCurrentUser(updatedUser);
    setUser(updatedUser);
  };

  const handleLogout = () => {
    StorageService.clearCurrentUser();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {!user ? (
        <AuthForm onLogin={handleLogin} />
      ) : user.isAdmin ? (
        <AdminDashboard 
          user={user} 
          onUserUpdate={handleUserUpdate}
          onLogout={handleLogout}
        />
      ) : (
        <Dashboard 
          user={user} 
          onUserUpdate={handleUserUpdate}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default Index;
