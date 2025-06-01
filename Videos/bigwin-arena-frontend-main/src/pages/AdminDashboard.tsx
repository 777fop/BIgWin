
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import StatCard from '../components/StatCard';
import { AdminStats, UpgradeRequest } from '../types';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    pendingUpgrades: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0
  });
  const [pendingUpgrades, setPendingUpgrades] = useState<UpgradeRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'upgrades' | 'deposits' | 'withdrawals' | 'passwords'>('upgrades');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      // TODO: Connect to backend - Get admin dashboard stats
      const adminStats = await apiService.getAdminDashboard();
      setStats(adminStats);

      // TODO: Connect to backend - Get pending upgrade requests
      const upgrades = await apiService.getAllUpgrades();
      setPendingUpgrades(upgrades.filter(u => u.status === 'PENDING'));
    } catch (error) {
      console.error('Failed to load admin data:', error);
    }
  };

  const handleApproveUpgrade = async (id: number) => {
    try {
      // TODO: Connect to backend - Approve upgrade request
      await apiService.approveUpgrade(id);
      toast({
        title: "Success",
        description: "Upgrade request approved successfully",
      });
      loadAdminData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve upgrade request",
        variant: "destructive",
      });
    }
  };

  const handleRejectUpgrade = async (id: number) => {
    try {
      // TODO: Connect to backend - Reject upgrade request
      await apiService.rejectUpgrade(id);
      toast({
        title: "Success",
        description: "Upgrade request rejected",
      });
      loadAdminData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject upgrade request",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-green-400">👑 Admin Dashboard</h1>
            <p className="text-gray-300">Manage user requests and accounts</p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              💬 Messages
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              👥 View Users
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              🔓 Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="👥 Total Users"
          value={stats.totalUsers}
          icon="👥"
          colorClass="card-green"
        />
        <StatCard
          title="⚡ Upgrades"
          value={stats.pendingUpgrades}
          icon="⚡"
          colorClass="card-orange"
        />
        <StatCard
          title="💰 Deposits"
          value={stats.pendingDeposits}
          icon="💰"
          colorClass="card-teal"
        />
        <StatCard
          title="🚀 Withdrawals"
          value={stats.pendingWithdrawals}
          icon="🚀"
          colorClass="card-red"
        />
        <StatCard
          title="🔑 Passwords"
          value={0}
          icon="🔑"
          colorClass="card-blue"
        />
        <StatCard
          title="📊 Total Requests"
          value={stats.pendingUpgrades + stats.pendingDeposits + stats.pendingWithdrawals}
          icon="📊"
          colorClass="card-purple"
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <Button
          onClick={() => setActiveTab('upgrades')}
          className={`${activeTab === 'upgrades' ? 'bg-blue-600' : 'bg-gray-700'} text-white hover:bg-blue-700`}
        >
          ⚡ Upgrades ({stats.pendingUpgrades})
        </Button>
        <Button
          onClick={() => setActiveTab('deposits')}
          className={`${activeTab === 'deposits' ? 'bg-blue-600' : 'bg-gray-700'} text-white hover:bg-blue-700`}
        >
          💰 Deposits ({stats.pendingDeposits})
        </Button>
        <Button
          onClick={() => setActiveTab('withdrawals')}
          className={`${activeTab === 'withdrawals' ? 'bg-blue-600' : 'bg-gray-700'} text-white hover:bg-blue-700`}
        >
          🚀 Withdrawals ({stats.pendingWithdrawals})
        </Button>
        <Button
          onClick={() => setActiveTab('passwords')}
          className={`${activeTab === 'passwords' ? 'bg-blue-600' : 'bg-gray-700'} text-white hover:bg-blue-700`}
        >
          🔑 Passwords (0)
        </Button>
      </div>

      {/* Content Based on Active Tab */}
      <div className="glass-effect rounded-2xl p-6">
        {activeTab === 'upgrades' && (
          <>
            <h2 className="text-xl font-bold text-orange-400 mb-4">⚡ Pending Upgrade Requests</h2>
            {pendingUpgrades.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-300">User ID</TableHead>
                      <TableHead className="text-gray-300">Plan ID</TableHead>
                      <TableHead className="text-gray-300">Requested At</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingUpgrades.map((upgrade) => (
                      <TableRow key={upgrade.id}>
                        <TableCell className="text-white">{upgrade.userId}</TableCell>
                        <TableCell className="text-white">{upgrade.planId}</TableCell>
                        <TableCell className="text-white">
                          {new Date(upgrade.requestedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleApproveUpgrade(upgrade.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                              size="sm"
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleRejectUpgrade(upgrade.id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                              size="sm"
                            >
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No pending upgrade requests
              </div>
            )}
          </>
        )}

        {activeTab === 'deposits' && (
          <div className="text-center py-8 text-gray-400">
            Deposits management coming soon...
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <div className="text-center py-8 text-gray-400">
            Withdrawals management coming soon...
          </div>
        )}

        {activeTab === 'passwords' && (
          <div className="text-center py-8 text-gray-400">
            Password management coming soon...
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
