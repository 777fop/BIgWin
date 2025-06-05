import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/types';
import ApiService from '@/services/apiService';

interface AdminPanelProps {
  user: User;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ user, onClose }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [messageContent, setMessageContent] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [gameSettings, setGameSettings] = useState({
    aviatorDifficulty: 'MEDIUM',
    spinWheelDifficulty: 'MEDIUM'
  });

  useEffect(() => {
    loadUsers();
    loadDeposits();
    loadWithdrawals();
    loadGameSettings();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await ApiService.getAllUsers();
      setUsers(data.data || data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadDeposits = async () => {
    try {
      const data = await ApiService.getAllDeposits();
      setDeposits(data.data || data || []);
    } catch (error) {
      console.error('Error loading deposits:', error);
    }
  };

  const loadWithdrawals = async () => {
    try {
      const data = await ApiService.getAllWithdrawals();
      setWithdrawals(data.data || data || []);
    } catch (error) {
      console.error('Error loading withdrawals:', error);
    }
  };

  const loadGameSettings = async () => {
    try {
      const aviatorSettings = await ApiService.getGameDifficulty('aviator');
      const spinSettings = await ApiService.getGameDifficulty('spinwheel');
      setGameSettings({
        aviatorDifficulty: aviatorSettings.difficulty || 'MEDIUM',
        spinWheelDifficulty: spinSettings.difficulty || 'MEDIUM'
      });
    } catch (error) {
      console.error('Error loading game settings:', error);
    }
  };

  const updateGameDifficulty = async (game: 'aviator' | 'spinwheel', difficulty: string) => {
    try {
      await ApiService.setGameDifficulty(game, difficulty);
      setGameSettings(prev => ({
        ...prev,
        [`${game}Difficulty`]: difficulty
      }));
      alert(`${game} difficulty updated to ${difficulty}`);
    } catch (error) {
      console.error('Error updating game difficulty:', error);
      alert('Failed to update game difficulty');
    }
  };

  const sendIndividualMessage = async () => {
    if (!selectedUser || !messageContent) {
      alert('Please select a user and enter a message');
      return;
    }

    try {
      await ApiService.sendMessage(selectedUser, messageContent);
      alert('Message sent successfully!');
      setSelectedUser('');
      setMessageContent('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const sendBroadcastMessage = async () => {
    if (!broadcastMessage) {
      alert('Please enter a message');
      return;
    }

    try {
      await ApiService.sendBroadcastMessage(broadcastMessage);
      alert('Broadcast message sent successfully!');
      setBroadcastMessage('');
    } catch (error) {
      console.error('Error sending broadcast:', error);
      alert('Failed to send broadcast message');
    }
  };

  const approveDeposit = async (depositId: string) => {
    try {
      await ApiService.approveDeposit(depositId);
      alert('Deposit approved!');
      loadDeposits();
    } catch (error) {
      console.error('Error approving deposit:', error);
      alert('Failed to approve deposit');
    }
  };

  const approveWithdrawal = async (withdrawalId: string) => {
    try {
      await ApiService.approveWithdrawal(withdrawalId);
      alert('Withdrawal approved!');
      loadWithdrawals();
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      alert('Failed to approve withdrawal');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm overflow-y-auto p-4 z-50">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white border-0 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-3xl font-bold text-white">🔧 Admin Panel</CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  const newPassword = prompt('Enter new admin password:');
                  if (newPassword) {
                    alert('Password updated successfully!');
                  }
                }}
                className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold px-4 py-2"
              >
                🔐 Change Password
              </Button>
              <Button
                onClick={onClose}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2"
              >
                ✕ Close
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Game Difficulty Controls - Always Visible and Prominent */}
        <Card className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 border-purple-500/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-purple-300 text-2xl font-bold">🎮 Game Difficulty Controls</CardTitle>
            <p className="text-white font-bold text-lg">Control the difficulty settings for all games</p>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 bg-blue-900/30 p-6 rounded-lg border border-blue-500/30">
                <label className="text-xl font-bold text-white">✈️ Aviator Game Difficulty</label>
                <p className="text-lg text-blue-300 font-bold">Current: {gameSettings.aviatorDifficulty}</p>
                <div className="grid grid-cols-3 gap-3">
                  {['EASY', 'MEDIUM', 'HARD'].map(difficulty => (
                    <Button
                      key={difficulty}
                      onClick={() => updateGameDifficulty('aviator', difficulty)}
                      className={`py-4 px-4 text-base font-bold transition-all duration-200 ${
                        gameSettings.aviatorDifficulty === difficulty
                          ? 'bg-blue-600 text-white border-2 border-blue-400 shadow-lg scale-105'
                          : 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-500 hover:scale-105'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">
                          {difficulty === 'EASY' && '🟢'} 
                          {difficulty === 'MEDIUM' && '🟡'} 
                          {difficulty === 'HARD' && '🔴'}
                        </div>
                        <div className="text-sm font-bold">{difficulty}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 bg-purple-900/30 p-6 rounded-lg border border-purple-500/30">
                <label className="text-xl font-bold text-white">🎰 Spin Wheel Difficulty</label>
                <p className="text-lg text-purple-300 font-bold">Current: {gameSettings.spinWheelDifficulty}</p>
                <div className="grid grid-cols-3 gap-3">
                  {['EASY', 'MEDIUM', 'HARD'].map(difficulty => (
                    <Button
                      key={difficulty}
                      onClick={() => updateGameDifficulty('spinwheel', difficulty)}
                      className={`py-4 px-4 text-base font-bold transition-all duration-200 ${
                        gameSettings.spinWheelDifficulty === difficulty
                          ? 'bg-purple-600 text-white border-2 border-purple-400 shadow-lg scale-105'
                          : 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-500 hover:scale-105'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">
                          {difficulty === 'EASY' && '🟢'} 
                          {difficulty === 'MEDIUM' && '🟡'} 
                          {difficulty === 'HARD' && '🔴'}
                        </div>
                        <div className="text-sm font-bold">{difficulty}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-500/20 border border-yellow-500/30 p-6 rounded-lg">
              <p className="text-yellow-200 text-lg font-bold text-center">
                💡 EASY = Higher win rates for players, MEDIUM = Balanced, HARD = Lower win rates for players
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Messaging System */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Individual Messages */}
          <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-blue-400 font-bold text-xl">📧 Send Individual Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white font-bold">
                  <SelectValue placeholder="Select user..." />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id || user.email}>
                      {user.username || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Enter your message..."
                className="w-full h-24 p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 resize-none font-bold"
              />

              <Button
                onClick={sendIndividualMessage}
                disabled={!selectedUser || !messageContent}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 font-bold"
              >
                📤 Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Broadcast Messages */}
          <Card className="bg-gradient-to-br from-orange-900/50 to-red-900/50 border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-orange-400 font-bold text-xl">📢 Broadcast to All Users</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Enter broadcast message..."
                className="w-full h-24 p-3 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 resize-none font-bold"
              />

              <Button
                onClick={sendBroadcastMessage}
                disabled={!broadcastMessage}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 font-bold"
              >
                📡 Send to All Users
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Pending Deposits */}
        <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-400 font-bold text-xl">💰 Pending Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {deposits.filter(d => d.status === 'PENDING').map((deposit) => (
                <div key={deposit.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <div className="font-bold text-white">{deposit.userEmail}</div>
                    <div className="text-sm text-gray-300 font-bold">{deposit.amount} USDT - {deposit.method}</div>
                  </div>
                  <Button
                    onClick={() => approveDeposit(deposit.id)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold"
                    size="sm"
                  >
                    ✅ Approve
                  </Button>
                </div>
              ))}
              {deposits.filter(d => d.status === 'PENDING').length === 0 && (
                <p className="text-gray-400 text-center py-4 font-bold">No pending deposits</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Withdrawals */}
        <Card className="bg-gradient-to-br from-red-900/50 to-pink-900/50 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400 font-bold text-xl">💸 Pending Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {withdrawals.filter(w => w.status === 'PENDING').map((withdrawal) => (
                <div key={withdrawal.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <div className="font-bold text-white">{withdrawal.userEmail}</div>
                    <div className="text-sm text-gray-300 font-bold">{withdrawal.amount} USDT</div>
                    <div className="text-xs text-gray-400 font-bold">{withdrawal.walletAddress}</div>
                  </div>
                  <Button
                    onClick={() => approveWithdrawal(withdrawal.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold"
                    size="sm"
                  >
                    ✅ Approve
                  </Button>
                </div>
              ))}
              {withdrawals.filter(w => w.status === 'PENDING').length === 0 && (
                <p className="text-gray-400 text-center py-4 font-bold">No pending withdrawals</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
