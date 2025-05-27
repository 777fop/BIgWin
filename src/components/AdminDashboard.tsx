import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, UpgradeRequest, DepositRequest, WithdrawalRequest } from '@/types';
import { StorageService, PasswordResetRequest } from '@/services/storageService';
import { LogOut, Users } from 'lucide-react';
import UserManagement from './UserManagement';

interface AdminDashboardProps {
  user: User;
  onUserUpdate: (user: User) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onUserUpdate, onLogout }) => {
  const [upgradeRequests, setUpgradeRequests] = useState<UpgradeRequest[]>([]);
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [passwordResetRequests, setPasswordResetRequests] = useState<PasswordResetRequest[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'upgrades' | 'deposits' | 'withdrawals' | 'passwords'>('upgrades');

  useEffect(() => {
    loadRequests();
  }, [refreshKey]);

  const loadRequests = () => {
    const upgrades = StorageService.getAllUpgradeRequests();
    setUpgradeRequests(upgrades.sort((a, b) => 
      new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
    ));

    const deposits = StorageService.getAllDepositRequests();
    setDepositRequests(deposits.sort((a, b) => 
      new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
    ));

    const withdrawals = StorageService.getAllWithdrawalRequests();
    setWithdrawalRequests(withdrawals.sort((a, b) => 
      new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
    ));

    const passwordResets = StorageService.getAllPasswordResetRequests();
    setPasswordResetRequests(passwordResets.sort((a, b) => 
      new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
    ));

    const users = StorageService.getAllUsers();
    setAllUsers(users);
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

  const handleApproveDeposit = (requestId: string) => {
    StorageService.approveDepositRequest(requestId);
    setRefreshKey(prev => prev + 1);
    alert('Deposit approved! Amount added to user balance.');
  };

  const handleRejectDeposit = (requestId: string) => {
    const reason = prompt('Enter rejection reason (optional):');
    StorageService.rejectDepositRequest(requestId, reason || undefined);
    setRefreshKey(prev => prev + 1);
    alert('Deposit request rejected.');
  };

  const handleApproveWithdrawal = (requestId: string) => {
    StorageService.approveWithdrawalRequest(requestId);
    setRefreshKey(prev => prev + 1);
    alert('Withdrawal approved! Amount deducted from user balance.');
  };

  const handleRejectWithdrawal = (requestId: string) => {
    const reason = prompt('Enter rejection reason (optional):');
    StorageService.rejectWithdrawalRequest(requestId, reason || undefined);
    setRefreshKey(prev => prev + 1);
    alert('Withdrawal request rejected.');
  };

  const pendingUpgrades = upgradeRequests.filter(r => r.status === 'pending');
  const pendingDeposits = depositRequests.filter(r => r.status === 'pending');
  const pendingWithdrawals = withdrawalRequests.filter(r => r.status === 'pending');
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
              <p className="text-gray-300 text-sm sm:text-base">Manage user requests and accounts</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowUserManagement(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
                size="sm"
              >
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                View Users
              </Button>
              <Button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base"
                size="sm"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
          <Card className="bg-green-600 text-white border-0">
            <CardHeader className="text-center pb-1 sm:pb-2 px-2 sm:px-4">
              <CardTitle className="text-xs sm:text-lg">👥 Total Users</CardTitle>
            </CardHeader>
            <CardContent className="text-center px-2 sm:px-4">
              <div className="text-lg sm:text-3xl font-bold">{allUsers.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-600 text-white border-0">
            <CardHeader className="text-center pb-1 sm:pb-2 px-2 sm:px-4">
              <CardTitle className="text-xs sm:text-lg">⏳ Upgrades</CardTitle>
            </CardHeader>
            <CardContent className="text-center px-2 sm:px-4">
              <div className="text-lg sm:text-3xl font-bold">{pendingUpgrades.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-600 text-white border-0">
            <CardHeader className="text-center pb-1 sm:pb-2 px-2 sm:px-4">
              <CardTitle className="text-xs sm:text-lg">💰 Deposits</CardTitle>
            </CardHeader>
            <CardContent className="text-center px-2 sm:px-4">
              <div className="text-lg sm:text-3xl font-bold">{pendingDeposits.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-red-600 text-white border-0">
            <CardHeader className="text-center pb-1 sm:pb-2 px-2 sm:px-4">
              <CardTitle className="text-xs sm:text-lg">💸 Withdrawals</CardTitle>
            </CardHeader>
            <CardContent className="text-center px-2 sm:px-4">
              <div className="text-lg sm:text-3xl font-bold">{pendingWithdrawals.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-blue-600 text-white border-0">
            <CardHeader className="text-center pb-1 sm:pb-2 px-2 sm:px-4">
              <CardTitle className="text-xs sm:text-lg">🔑 Passwords</CardTitle>
            </CardHeader>
            <CardContent className="text-center px-2 sm:px-4">
              <div className="text-lg sm:text-3xl font-bold">{pendingPasswordResets.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-purple-600 text-white border-0">
            <CardHeader className="text-center pb-1 sm:pb-2 px-2 sm:px-4">
              <CardTitle className="text-xs sm:text-lg">📊 Total Requests</CardTitle>
            </CardHeader>
            <CardContent className="text-center px-2 sm:px-4">
              <div className="text-lg sm:text-3xl font-bold">
                {pendingUpgrades.length + pendingDeposits.length + pendingWithdrawals.length + pendingPasswordResets.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'upgrades', label: '⬆️ Upgrades', count: pendingUpgrades.length },
            { key: 'deposits', label: '💰 Deposits', count: pendingDeposits.length },
            { key: 'withdrawals', label: '💸 Withdrawals', count: pendingWithdrawals.length },
            { key: 'passwords', label: '🔑 Passwords', count: pendingPasswordResets.length }
          ].map(tab => (
            <Button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`text-xs sm:text-sm px-3 py-2 ${
                activeTab === tab.key 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
              }`}
            >
              {tab.label} ({tab.count})
            </Button>
          ))}
        </div>

        {/* Content Based on Active Tab */}
        {activeTab === 'upgrades' && (
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
        )}

        {activeTab === 'deposits' && (
          <Card className="crypto-card text-white border-0">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-2xl text-emerald-400">💰 Pending Deposit Requests</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              {pendingDeposits.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-gray-400">
                  No pending deposit requests
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {pendingDeposits.map((request) => (
                    <div key={request.id} className="bg-gray-800/50 p-3 sm:p-4 rounded border border-gray-600">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="font-bold text-white text-sm sm:text-base">{request.username}</div>
                            <div className="text-xs bg-emerald-600 px-2 py-1 rounded text-white">
                              DEPOSIT
                            </div>
                          </div>
                          <div className="text-xs sm:text-sm text-gray-300 space-y-1">
                            <div>Email: {request.email}</div>
                            <div>Amount: {request.amount} USDT</div>
                            <div>Wallet: {request.walletAddress}</div>
                            {request.transactionHash && (
                              <div>TX Hash: {request.transactionHash.slice(0, 20)}...</div>
                            )}
                            <div>Requested: {new Date(request.requestDate).toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApproveDeposit(request.id)}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                            size="sm"
                          >
                            ✅ Approve
                          </Button>
                          <Button
                            onClick={() => handleRejectDeposit(request.id)}
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
        )}

        {activeTab === 'withdrawals' && (
          <Card className="crypto-card text-white border-0">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-2xl text-red-400">💸 Pending Withdrawal Requests</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              {pendingWithdrawals.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-gray-400">
                  No pending withdrawal requests
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {pendingWithdrawals.map((request) => (
                    <div key={request.id} className="bg-gray-800/50 p-3 sm:p-4 rounded border border-gray-600">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="font-bold text-white text-sm sm:text-base">{request.username}</div>
                            <div className="text-xs bg-red-600 px-2 py-1 rounded text-white">
                              WITHDRAWAL
                            </div>
                          </div>
                          <div className="text-xs sm:text-sm text-gray-300 space-y-1">
                            <div>Email: {request.email}</div>
                            <div>Amount: {request.amount} USDT</div>
                            <div>Wallet: {request.walletAddress}</div>
                            <div>Requested: {new Date(request.requestDate).toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApproveWithdrawal(request.id)}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                            size="sm"
                          >
                            ✅ Approve
                          </Button>
                          <Button
                            onClick={() => handleRejectWithdrawal(request.id)}
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
        )}

        {activeTab === 'passwords' && pendingPasswordResets.length > 0 && (
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
      </div>

      {/* User Management Modal */}
      {showUserManagement && (
        <UserManagement 
          onClose={() => setShowUserManagement(false)}
          onRefresh={() => setRefreshKey(prev => prev + 1)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
