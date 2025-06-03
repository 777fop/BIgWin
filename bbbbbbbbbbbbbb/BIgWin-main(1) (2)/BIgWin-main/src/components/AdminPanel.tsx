import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import ApiService from '@/services/apiService';

interface AdminPanelProps {
  user: User;
  onUserUpdate: (user: User) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ user, onUserUpdate, onClose }) => {
  const [adminCode, setAdminCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [gameDifficulty, setGameDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [pendingUpgrades, setPendingUpgrades] = useState([]);
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [showMessaging, setShowMessaging] = useState(false);
  const [showBroadcast, setShowBroadcast] = useState(false);
  
  const ADMIN_CODE = 'ADMIN123';

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated]);

  const loadAdminData = async () => {
    try {
      const [upgrades, deposits, withdrawals, difficulty, users] = await Promise.all([
        ApiService.getUpgradeRequests(),
        ApiService.getDepositRequests(),
        ApiService.getWithdrawalRequests(),
        ApiService.getGameDifficulty(),
        ApiService.getAllUsers()
      ]);
      
      setPendingUpgrades(upgrades.data || upgrades);
      setPendingDeposits(deposits.data || deposits);
      setPendingWithdrawals(withdrawals.data || withdrawals);
      setAllUsers(users.data || users);
      if (difficulty && difficulty.difficulty) {
        setGameDifficulty(difficulty.difficulty);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const handleAdminLogin = () => {
    if (adminCode === ADMIN_CODE) {
      setIsAuthenticated(true);
    } else {
      alert('Invalid admin code!');
    }
  };

  const handleGameDifficultyUpdate = async () => {
    try {
      await ApiService.setGameDifficulty(gameDifficulty);
      alert('Game difficulty updated successfully!');
    } catch (error) {
      console.error('Error updating game difficulty:', error);
      alert('Failed to update game difficulty');
    }
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !message.trim()) return;
    
    try {
      await ApiService.sendMessage(selectedUser.id, message);
      alert('Message sent successfully!');
      setMessage('');
      setSelectedUser(null);
      setShowMessaging(false);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const handleBroadcastMessage = async () => {
    if (!broadcastMessage.trim()) return;
    
    try {
      await ApiService.sendBroadcastMessage(broadcastMessage);
      alert('Broadcast message sent to all users!');
      setBroadcastMessage('');
      setShowBroadcast(false);
    } catch (error) {
      console.error('Error sending broadcast:', error);
      alert('Failed to send broadcast message');
    }
  };

  const handleApproveRequest = async (type: string, id: string) => {
    try {
      switch (type) {
        case 'upgrade':
          await ApiService.approveUpgradeRequest(id);
          break;
        case 'deposit':
          await ApiService.approveDepositRequest(id);
          break;
        case 'withdrawal':
          await ApiService.approveWithdrawalRequest(id);
          break;
      }
      loadAdminData(); // Refresh data
      alert(`${type} request approved successfully!`);
    } catch (error) {
      console.error(`Error approving ${type}:`, error);
      alert(`Failed to approve ${type} request`);
    }
  };

  const handleRejectRequest = async (type: string, id: string) => {
    try {
      switch (type) {
        case 'upgrade':
          await ApiService.rejectUpgradeRequest(id);
          break;
        case 'deposit':
          await ApiService.rejectDepositRequest(id);
          break;
        case 'withdrawal':
          await ApiService.rejectWithdrawalRequest(id);
          break;
      }
      loadAdminData(); // Refresh data
      alert(`${type} request rejected successfully!`);
    } catch (error) {
      console.error(`Error rejecting ${type}:`, error);
      alert(`Failed to reject ${type} request`);
    }
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
      <Card className="bg-gradient-to-br from-gray-900 to-black text-white border-yellow-500 w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-yellow-400">
            👑 Admin Panel
          </CardTitle>
          <p className="text-gray-300">Manage users, games, and system settings</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {/* Game Difficulty Control */}
            <Card className="bg-purple-900/30 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-400">🎮 Game Difficulty Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Global Game Difficulty</label>
                  <select
                    value={gameDifficulty}
                    onChange={(e) => setGameDifficulty(e.target.value as 'EASY' | 'MEDIUM' | 'HARD')}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                  >
                    <option value="EASY">EASY (Higher Win Rate)</option>
                    <option value="MEDIUM">MEDIUM (Balanced)</option>
                    <option value="HARD">HARD (Lower Win Rate)</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-2">
                    Controls difficulty for both Aviator and Spin Wheel games
                  </p>
                </div>
                
                <div className="bg-gray-800/50 p-3 rounded border border-gray-600">
                  <div className="text-sm text-gray-300">
                    <div className="font-bold text-purple-400 mb-2">Difficulty Effects:</div>
                    <div>• <span className="text-green-400">EASY</span>: 60% win rate, higher multipliers</div>
                    <div>• <span className="text-yellow-400">MEDIUM</span>: 40% win rate, balanced multipliers</div>
                    <div>• <span className="text-red-400">HARD</span>: 25% win rate, lower multipliers</div>
                  </div>
                </div>
                
                <Button
                  onClick={handleGameDifficultyUpdate}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  🎯 Update Game Difficulty
                </Button>
              </CardContent>
            </Card>

            {/* User Messaging */}
            <Card className="bg-indigo-900/30 border-indigo-500/30">
              <CardHeader>
                <CardTitle className="text-indigo-400">💬 User Messaging</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => setShowMessaging(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  📨 Send Individual Message
                </Button>
                
                <Button
                  onClick={() => setShowBroadcast(true)}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  📢 Broadcast to All Users
                </Button>
                
                <div className="bg-gray-800/50 p-3 rounded border border-gray-600">
                  <div className="text-sm text-gray-300">
                    <div className="font-bold text-indigo-400 mb-1">Messaging Stats:</div>
                    <div>Total Users: <span className="text-white font-bold">{allUsers.length}</span></div>
                    <div>Active Users: <span className="text-green-400 font-bold">
                      {allUsers.filter((u: any) => u.enabled !== false).length}
                    </span></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Upgrades */}
            <Card className="bg-blue-900/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400">⬆️ Pending Upgrades ({pendingUpgrades.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingUpgrades.length === 0 ? (
                  <p className="text-gray-400">No pending upgrades</p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {pendingUpgrades.map((upgrade: any, index) => (
                      <div key={index} className="bg-gray-800/50 p-3 rounded border border-gray-600">
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <div className="font-bold text-white">{upgrade.username || upgrade.user?.username}</div>
                            <div className="text-gray-300">Plan: {upgrade.planName || upgrade.planId}</div>
                            <div className="text-gray-300">Amount: ${upgrade.amount}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleApproveRequest('upgrade', upgrade.id)}
                              className="bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              ✅
                            </Button>
                            <Button
                              onClick={() => handleRejectRequest('upgrade', upgrade.id)}
                              className="bg-red-600 hover:bg-red-700"
                              size="sm"
                            >
                              ❌
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pending Deposits */}
            <Card className="bg-green-900/30 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400">💰 Pending Deposits ({pendingDeposits.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingDeposits.length === 0 ? (
                  <p className="text-gray-400">No pending deposits</p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {pendingDeposits.map((deposit: any, index) => (
                      <div key={index} className="bg-gray-800/50 p-3 rounded border border-gray-600">
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <div className="font-bold text-white">{deposit.username || deposit.user?.username}</div>
                            <div className="text-gray-300">Amount: {deposit.amount} USDT</div>
                            <div className="text-gray-300">Method: {deposit.paymentMethod}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleApproveRequest('deposit', deposit.id)}
                              className="bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              ✅
                            </Button>
                            <Button
                              onClick={() => handleRejectRequest('deposit', deposit.id)}
                              className="bg-red-600 hover:bg-red-700"
                              size="sm"
                            >
                              ❌
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pending Withdrawals */}
            <Card className="bg-orange-900/30 border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-orange-400">💸 Pending Withdrawals ({pendingWithdrawals.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingWithdrawals.length === 0 ? (
                  <p className="text-gray-400">No pending withdrawals</p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {pendingWithdrawals.map((withdrawal: any, index) => (
                      <div key={index} className="bg-gray-800/50 p-3 rounded border border-gray-600">
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <div className="font-bold text-white">{withdrawal.username || withdrawal.user?.username}</div>
                            <div className="text-gray-300">Amount: {withdrawal.amount} USDT</div>
                            <div className="text-gray-300 text-xs">Wallet: {withdrawal.walletAddress}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleApproveRequest('withdrawal', withdrawal.id)}
                              className="bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              ✅
                            </Button>
                            <Button
                              onClick={() => handleRejectRequest('withdrawal', withdrawal.id)}
                              className="bg-red-600 hover:bg-red-700"
                              size="sm"
                            >
                              ❌
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

      {/* Individual Messaging Modal */}
      {showMessaging && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
          <Card className="bg-gray-900 text-white border-indigo-500 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-indigo-400">Send Message to User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select User</label>
                <select
                  value={selectedUser?.id || ''}
                  onChange={(e) => {
                    const user = allUsers.find((u: any) => u.id === e.target.value);
                    setSelectedUser(user);
                  }}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                >
                  <option value="">Choose a user...</option>
                  {allUsers.map((user: any) => (
                    <option key={user.id} value={user.id}>
                      {user.username} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white h-24"
                  placeholder="Enter your message..."
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleSendMessage}
                  disabled={!selectedUser || !message.trim()}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  Send Message
                </Button>
                <Button
                  onClick={() => {
                    setShowMessaging(false);
                    setSelectedUser(null);
                    setMessage('');
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Broadcast Messaging Modal */}
      {showBroadcast && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
          <Card className="bg-gray-900 text-white border-red-500 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-400">Broadcast Message to All Users</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Broadcast Message</label>
                <textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white h-24"
                  placeholder="Enter broadcast message..."
                />
              </div>
              
              <div className="bg-red-900/30 border border-red-500/30 p-3 rounded">
                <p className="text-sm text-red-300">
                  ⚠️ This will send a message to all {allUsers.length} users
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleBroadcastMessage}
                  disabled={!broadcastMessage.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  Send Broadcast
                </Button>
                <Button
                  onClick={() => {
                    setShowBroadcast(false);
                    setBroadcastMessage('');
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
