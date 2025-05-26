
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, UpgradeRequest } from '@/types';
import { StorageService } from '@/services/storageService';
import { LogOut } from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  onUserUpdate: (user: User) => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onUserUpdate, onLogout }) => {
  const [upgradeRequests, setUpgradeRequests] = useState<UpgradeRequest[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadUpgradeRequests();
  }, [refreshKey]);

  const loadUpgradeRequests = () => {
    const requests = StorageService.getAllUpgradeRequests();
    setUpgradeRequests(requests.sort((a, b) => 
      new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
    ));
  };

  const handleApprove = (requestId: string) => {
    StorageService.approveUpgradeRequest(requestId);
    setRefreshKey(prev => prev + 1);
    alert('Upgrade request approved successfully!');
  };

  const handleReject = (requestId: string) => {
    StorageService.rejectUpgradeRequest(requestId);
    setRefreshKey(prev => prev + 1);
    alert('Upgrade request rejected.');
  };

  const pendingRequests = upgradeRequests.filter(r => r.status === 'pending');
  const processedRequests = upgradeRequests.filter(r => r.status !== 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="crypto-card text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold neon-text">
                👑 Admin Dashboard
              </CardTitle>
              <p className="text-gray-300">Manage user upgrade requests</p>
            </div>
            <Button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white"
              size="sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-yellow-600 text-white border-0">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg">⏳ Pending</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold">{pendingRequests.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-green-600 text-white border-0">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg">✅ Approved</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold">
                {upgradeRequests.filter(r => r.status === 'approved').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-600 text-white border-0">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg">❌ Rejected</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold">
                {upgradeRequests.filter(r => r.status === 'rejected').length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-600 text-white border-0">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg">📊 Total</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold">{upgradeRequests.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        <Card className="crypto-card text-white border-0">
          <CardHeader>
            <CardTitle className="text-2xl text-yellow-400">⏳ Pending Upgrade Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No pending upgrade requests
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="bg-gray-800/50 p-4 rounded border border-gray-600">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="font-bold text-white">{request.username}</div>
                          <div className="text-xs bg-yellow-600 px-2 py-1 rounded text-white">
                            {request.status.toUpperCase()}
                          </div>
                        </div>
                        <div className="text-sm text-gray-300 space-y-1">
                          <div>Email: {request.email}</div>
                          <div>Plan: {request.planName} | Amount: {request.amount} USDT</div>
                          <div>Requested: {new Date(request.requestDate).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApprove(request.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          size="sm"
                        >
                          ✅ Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(request.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
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

        {/* Processed Requests */}
        {processedRequests.length > 0 && (
          <Card className="crypto-card text-white border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-400">📋 Recent Processed Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {processedRequests.slice(0, 10).map((request) => (
                  <div key={request.id} className="bg-gray-800/30 p-3 rounded border border-gray-700">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-semibold text-white text-sm">{request.username}</div>
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
