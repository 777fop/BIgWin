
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/types';

interface AdminPanelProps {
  user: User;
  onUserUpdate: (user: User) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ user, onUserUpdate, onClose }) => {
  const [adminCode, setAdminCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const ADMIN_CODE = 'ADMIN123'; // Simple admin authentication

  const mockPendingUpgrades = [
    {
      userId: user.id,
      username: user.username,
      planId: 'premium',
      planName: 'Premium',
      amount: 10,
      transactionHash: 'TX123456789',
      status: 'pending' as const
    }
  ];

  const handleAdminLogin = () => {
    if (adminCode === ADMIN_CODE) {
      setIsAuthenticated(true);
    } else {
      alert('Invalid admin code!');
    }
  };

  const handleConfirmUpgrade = (upgrade: any) => {
    const updatedUser = {
      ...user,
      plan: upgrade.planId as 'basic' | 'premium' | 'vip',
      pendingUpgrade: undefined
    };
    onUserUpdate(updatedUser);
    alert(`User ${upgrade.username} upgraded to ${upgrade.planName} plan!`);
  };

  const handleRejectUpgrade = (upgrade: any) => {
    const updatedUser = {
      ...user,
      pendingUpgrade: undefined
    };
    onUserUpdate(updatedUser);
    alert(`Upgrade request for ${upgrade.username} rejected!`);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <Card className="bg-gradient-to-br from-gray-900 to-black text-white border-yellow-500 w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-yellow-400">
              🔐 Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Admin Code</label>
              <input
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                placeholder="Enter admin code"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdminLogin} className="flex-1 bg-yellow-600 hover:bg-yellow-700">
                Login
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="bg-gradient-to-br from-gray-900 to-black text-white border-yellow-500 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-yellow-400">
            👑 Admin Panel
          </CardTitle>
          <p className="text-gray-300">Manage user upgrades and transactions</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Card className="bg-blue-900/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400">Pending Upgrades</CardTitle>
              </CardHeader>
              <CardContent>
                {mockPendingUpgrades.length === 0 ? (
                  <p className="text-gray-400">No pending upgrades</p>
                ) : (
                  <div className="space-y-4">
                    {mockPendingUpgrades.map((upgrade, index) => (
                      <div key={index} className="bg-gray-800/50 p-4 rounded border border-gray-600">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-bold text-white">{upgrade.username}</div>
                            <div className="text-sm text-gray-300">
                              Plan: {upgrade.planName} | Amount: {upgrade.amount} USDT
                            </div>
                            <div className="text-xs text-gray-400">
                              TX: {upgrade.transactionHash}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleConfirmUpgrade(upgrade)}
                              className="bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              ✅ Confirm
                            </Button>
                            <Button
                              onClick={() => handleRejectUpgrade(upgrade)}
                              className="bg-red-600 hover:bg-red-700"
                              size="sm"
                            >
                              ❌ Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button onClick={onClose} variant="outline" className="border-white/30 text-white">
              Close Admin Panel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
