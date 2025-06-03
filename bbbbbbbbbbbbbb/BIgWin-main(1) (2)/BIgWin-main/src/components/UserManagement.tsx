
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User } from '@/types';
import { StorageService } from '@/services/storageService';
import { Trash2, Users, AlertTriangle } from 'lucide-react';

interface UserManagementProps {
  onClose: () => void;
  onRefresh: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onClose, onRefresh }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = StorageService.getAllUsers();
    // Sort by registration date, newest first
    const sortedUsers = allUsers.sort((a, b) => 
      new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
    );
    setUsers(sortedUsers);
  };

  const handleDeleteUser = (user: User) => {
    if (user.isAdmin) {
      alert('Cannot delete admin users!');
      return;
    }
    setUserToDelete(user);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      const success = StorageService.removeUser(userToDelete.id);
      if (success) {
        alert(`User ${userToDelete.username} has been removed successfully!`);
        loadUsers();
        onRefresh();
      } else {
        alert('Failed to remove user. Please try again.');
      }
      setUserToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-gray-500';
      case 'premium': return 'bg-blue-500';
      case 'vip': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <Card className="crypto-card text-white border-0 w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-blue-400" />
            <CardTitle className="text-xl sm:text-2xl neon-text">
              👥 User Management
            </CardTitle>
          </div>
          <Button
            onClick={onClose}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
            size="sm"
          >
            Close
          </Button>
        </CardHeader>
        
        <CardContent className="px-4 sm:px-6 pb-6">
          <div className="bg-blue-500/20 border border-blue-500/30 p-3 rounded mb-4">
            <p className="text-blue-300 text-sm">
              📊 Total Users: {users.length} | 
              Active Plans: Basic ({users.filter(u => u.plan === 'basic').length}), 
              Premium ({users.filter(u => u.plan === 'premium').length}), 
              VIP ({users.filter(u => u.plan === 'vip').length})
            </p>
          </div>

          <div className="overflow-auto max-h-[60vh]">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-600">
                  <TableHead className="text-gray-300 text-xs sm:text-sm">User</TableHead>
                  <TableHead className="text-gray-300 text-xs sm:text-sm">Email</TableHead>
                  <TableHead className="text-gray-300 text-xs sm:text-sm">Plan</TableHead>
                  <TableHead className="text-gray-300 text-xs sm:text-sm">Balance</TableHead>
                  <TableHead className="text-gray-300 text-xs sm:text-sm">Referrals</TableHead>
                  <TableHead className="text-gray-300 text-xs sm:text-sm">Registered</TableHead>
                  <TableHead className="text-gray-300 text-xs sm:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-gray-700 hover:bg-gray-800/50">
                    <TableCell className="text-white text-xs sm:text-sm">
                      <div>
                        <div className="font-medium">{user.username}</div>
                        {user.isAdmin && (
                          <span className="text-xs bg-yellow-600 px-1 py-0.5 rounded text-white">
                            ADMIN
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300 text-xs sm:text-sm">{user.email}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded text-white ${getPlanColor(user.plan)}`}>
                        {user.plan.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-green-400 text-xs sm:text-sm font-mono">
                      ${user.balance.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-blue-400 text-xs sm:text-sm">
                      {user.referralCount}
                    </TableCell>
                    <TableCell className="text-gray-400 text-xs">
                      {formatDate(user.registrationDate)}
                    </TableCell>
                    <TableCell>
                      {!user.isAdmin && (
                        <Button
                          onClick={() => handleDeleteUser(user)}
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white text-xs h-7 w-7 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No users found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-[60]">
          <Card className="bg-red-900/90 border border-red-500 text-white w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              <CardTitle className="text-red-400">Confirm User Deletion</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-200">
                Are you sure you want to permanently delete user:
              </p>
              <div className="bg-red-800/50 p-3 rounded border border-red-600">
                <div className="font-bold">{userToDelete.username}</div>
                <div className="text-sm text-gray-300">{userToDelete.email}</div>
                <div className="text-xs text-gray-400">
                  Registered: {formatDate(userToDelete.registrationDate)}
                </div>
              </div>
              <div className="bg-yellow-600/20 border border-yellow-500/30 p-2 rounded">
                <p className="text-yellow-300 text-xs">
                  ⚠️ This action cannot be undone! The user will be able to register again with the same email.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setUserToDelete(null)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-white hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDeleteUser}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete User
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
