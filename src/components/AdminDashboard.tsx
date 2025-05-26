
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, UpgradeRequest } from '@/types';
import { StorageService, PasswordResetRequest } from '@/services/storageService';
import { LogOut } from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  onUserUpdate: (user: User) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onUserUpdate, onLogout }) => {
  const [upgradeRequests, setUpgradeRequests] = useState<UpgradeRequest[]>([]);
  const [passwordResetRequests, setPasswordResetRequests] = useState<PasswordResetRequest[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadRequests();
  }, [refreshKey]);

  const loadRequests = () => {
    const upgrades = StorageService.getAllUpgradeRequests();
    setUpgradeRequests(upgrades.sort((a, b) => 
      new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
    ));

    const passwordResets = StorageService.getAllPasswordResetRequests();
    setPasswordResetRequests(passwordResets.sort((a, b) => 
      new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
    ));
  };

  const handleApproveUpgrade = (requestId: string) => {
    StorageService.approveUpgradeRequest(requestId);
    setRefreshKey(prev => prev + 1);
    alert('Upgrade request approved successfully!');
  };

  const handleRejectUpgrade = (requestId: string) => {
    StorageService.rejectUpgradeRequest(requestId);
    setRefreshKey(prev => prev + 1);
    alert('Upgrade request rejected.');
  };

  const handleApprovePasswordReset = (requestId: string) => {
    StorageService.approvePasswordReset(requestId);
    setRefreshKey(prev => prev + 1);
    alert('Password reset approved! User password has been reset to "BK-24".');
  };

  const handleRejectPasswordReset = (requestId: string) => {
    StorageService.rejectPasswordReset(requestId);
    setRefreshKey(prev => prev + 1);
    alert('Password reset request rejected.');
  };

  const pendingUpgrades = upgradeRequests.filter(r => r.status === 'pending');
  const processedUpgrades = upgradeRequests.filter(r => r.status !== 'pending');
  const pendingPasswordResets = passwordResetRequests.filter(r => r.status === 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <Card className="crypto-card text-white border-0">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-6">
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-bold neon-text">
                👑 Admin Dashboard
              </CardTitle>
              <p className="text-gray-300 text-sm sm:text-base">Manage user requests</p>
            </div>
            <Button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base"
              size="sm"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Logout
            </Button>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
          <Card className="bg-yellow-600 text-white border-0">
            <CardHeader className="text-center pb-1 sm:pb-2 px-2 sm:px-4">
              <CardTitle className="text-sm sm:text-lg">⏳ Pending Upgrades</CardTitle>
            </CardHeader>
            <CardContent className="text-center px-2 sm:px-4">
              <div className="text-xl sm:text-3xl font-bold">{pendingUpgrades.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-blue-600 text-white border-0">
            <CardHeader className="text-center pb-1 sm:pb-2 px-2 sm:px-4">
              <CardTitle className="text-sm sm:text-lg">🔑 Password Resets</CardTitle>
            </CardHeader>
            <CardContent className="text-center px-2 sm:px-4">
              <div className="text-xl sm:text-3xl font-bold">{pendingPasswordResets.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-green-600 text-white border-0">
            <CardHeader className="text-center pb-1 sm:pb-2 px-2 sm:px-4">
              <CardTitle className="text-sm sm:text-lg">✅ Approved</CardTitle>
            </CardHeader>
            <CardContent className="text-center px-2 sm:px-4">
              <div className="text-xl sm:text-3xl font-bold">
                {upgradeRequests.filter(r => r.status === 'approved').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-600 text-white border-0">
            <CardHeader className="text-center pb-1 sm:pb-2 px-2 sm:px-4">
              <CardTitle className="text-sm sm:text-lg">❌ Rejected</CardTitle>
            </CardHeader>
            <CardContent className="text-center px-2 sm:px-4">
              <div className="text-xl sm:text-3xl font-bold">
                {upgradeRequests.filter(r => r.status === 'rejected').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Password Reset Requests */}
        {pendingPasswordResets.length > 0 && (
          <Card className="crypto-card text-white border-0">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-2xl text-blue-400">🔑 Pending Password Reset Requests</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-3 sm:space-y-4">
                {pendingPasswordResets.map((request) => (
                  <div key={request.id} className="bg-gray-800/50 p-3 sm:p-4 rounded border border-gray-600">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="font-bold text-white text-sm sm:text-base">{request.username}</div>
                          <div className="text-xs bg-blue-600 px-2 py-1 rounded text-white">
                            PASSWORD RESET
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-300 space-y-1">
                          <div>Email: {request.email}</div>
                          <div>Requested: {new Date(request.requestDate).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApprovePasswordReset(request.id)}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                          size="sm"
                        >
                          ✅ Approve
                        </Button>
                        <Button
                          onClick={() => handleRejectPasswordReset(request.id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm"
                          size="sm"
                        >
                          ❌ Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pending Upgrade Requests */}
        <Card className="crypto-card text-white border-0">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-2xl text-yellow-400">⏳ Pending Upgrade Requests</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {pendingUpgrades.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-gray-400">
                No pending upgrade requests
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {pendingUpgrades.map((request) => (
                  <div key={request.id} className="bg-gray-800/50 p-3 sm:p-4 rounded border border-gray-600">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="font-bold text-white text-sm sm:text-base">{request.username}</div>
                          <div className="text-xs bg-yellow-600 px-2 py-1 rounded text-white">
                            {request.status.toUpperCase()}
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-300 space-y-1">
                          <div>Email: {request.email}</div>
                          <div>Plan: {request.planName} | Amount: {request.amount} USDT</div>
                          <div>Requested: {new Date(request.requestDate).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApproveUpgrade(request.id)}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                          size="sm"
                        >
                          ✅ Approve
                        </Button>
                        <Button
                          onClick={() => handleRejectUpgrade(request.id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm"
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

        {/* Recent Processed Requests */}
        {processedUpgrades.length > 0 && (
          <Card className="crypto-card text-white border-0">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-2xl text-blue-400">📋 Recent Processed Requests</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-2 sm:space-y-3">
                {processedUpgrades.slice(0, 10).map((request) => (
                  <div key={request.id} className="bg-gray-800/30 p-2 sm:p-3 rounded border border-gray-700">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-semibold text-white text-xs sm:text-sm">{request.username}</div>
                          <div className={`text-xs px-2 py-1 rounded text-white ${
                            request.status === 'approved' ? 'bg-green-600' : 'bg-red-600'
                          }`}>
                            {request.status.toUpperCase()}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {request.planName} - {request.amount} USDT | 
                          Processed: {request.responseDate ? new Date(request.responseDate).toLocaleString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
