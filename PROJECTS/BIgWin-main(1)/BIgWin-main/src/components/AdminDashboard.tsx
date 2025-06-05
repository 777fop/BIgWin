import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, Users } from 'lucide-react';
import UserManagement from './UserManagement';

interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
}

interface UpgradeRequest {
  id: number;
  userId: number;
  plan: string;
  status: string;
}

interface DepositRequest {
  id: number;
  userId: number;
  amount: number;
  status: string;
}

interface WithdrawalRequest {
  id: number;
  userId: number;
  amount: number;
  status: string;
}

interface PasswordResetRequest {
  id: number;
  userId: number;
  username: string;
}

interface AdminDashboardProps {
  user: User;
  onUserUpdate: (user: User) => void;
  onLogout: () => void;
}

type GameDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

const API_BASE = 'http://localhost:8080/api/admin';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onUserUpdate, onLogout }) => {
  const [upgradeRequests, setUpgradeRequests] = useState<UpgradeRequest[]>([]);
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [passwordResetRequests, setPasswordResetRequests] = useState<PasswordResetRequest[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [activeTab, setActiveTab] = useState<'upgrades' | 'deposits' | 'withdrawals' | 'passwords'>('upgrades');
  const [loading, setLoading] = useState(false);
  const [gameDifficulty, setGameDifficulty] = useState<GameDifficulty>('EASY');
  const [savingDifficulty, setSavingDifficulty] = useState(false);

  useEffect(() => {
    loadAllData();
    fetchGameDifficulty();
  }, [refreshKey]);

  const fetchGameDifficulty = async () => {
    try {
      const res = await fetch(`${API_BASE}/settings/difficulty`);
      const difficulty: GameDifficulty = await res.json();
      setGameDifficulty(difficulty);
    } catch (error) {
      console.error('Failed to fetch game difficulty:', error);
    }
  };

  const updateGameDifficulty = async (newDifficulty: GameDifficulty) => {
    try {
      setSavingDifficulty(true);
      const res = await fetch(`${API_BASE}/settings/difficulty?difficulty=${newDifficulty}`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to update difficulty');
      setGameDifficulty(newDifficulty);
      alert(`Game difficulty updated to ${newDifficulty}`);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSavingDifficulty(false);
    }
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [
        upgradesRes,
        depositsRes,
        withdrawalsRes,
        resetRes,
        usersRes,
      ] = await Promise.all([
        fetch(`${API_BASE}/upgrade-requests`),
        fetch(`${API_BASE}/deposit-requests`),
        fetch(`${API_BASE}/withdrawal-requests`),
        fetch(`${API_BASE}/password-reset-requests`),
        fetch(`${API_BASE}/users`),
      ]);

      const upgrades = await upgradesRes.json();
      const deposits = await depositsRes.json();
      const withdrawals = await withdrawalsRes.json();
      const resets = await resetRes.json();
      const users = await usersRes.json();

      setUpgradeRequests(upgrades);
      setDepositRequests(deposits);
      setWithdrawalRequests(withdrawals);
      setPasswordResetRequests(resets);
      setAllUsers(users);
    } catch (error) {
      console.error('Error loading admin data', error);
    } finally {
      setLoading(false);
    }
  };

  const approveReset = async (id: number) => {
    try {
      await fetch(`${API_BASE}/password-reset-requests/${id}/approve`, { method: 'POST' });
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Failed to approve reset request:', error);
    }
  };

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
              <p className="text-gray-300 text-sm sm:text-base">Manage user requests and settings</p>
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

        {/* 🎮 Game Difficulty Controls */}
        <Card className="bg-slate-800 text-white border-0">
          <CardHeader>
            <CardTitle className="text-lg">🎮 Game Difficulty Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-gray-300">Current Difficulty: <strong>{gameDifficulty}</strong></p>
            <div className="flex gap-2">
              {(['EASY', 'MEDIUM', 'HARD'] as GameDifficulty[]).map(difficulty => (
                <Button
                  key={difficulty}
                  onClick={() => updateGameDifficulty(difficulty)}
                  disabled={savingDifficulty || gameDifficulty === difficulty}
                  className={`text-white ${gameDifficulty === difficulty ? 'bg-green-600' : 'bg-slate-600 hover:bg-slate-500'}`}
                >
                  {difficulty}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* You can place more cards here like upgradeRequests, depositRequests, etc. */}

        {showUserManagement && (
          <UserManagement
            users={allUsers}
            onClose={() => setShowUserManagement(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
