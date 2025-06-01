
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Bell, Menu, X, LogOut, User, Settings } from 'lucide-react';

const Layout: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠', show: true },
    { name: 'Games', path: '/games', icon: '🎮', show: true },
    { name: 'Sports Betting', path: '/betting', icon: '⚽', show: true },
    { name: 'Deposits', path: '/deposits', icon: '💰', show: true },
    { name: 'Withdrawals', path: '/withdrawals', icon: '🚀', show: true },
    { name: 'Referrals', path: '/referrals', icon: '👥', show: true },
    { name: 'Messages', path: '/messages', icon: '💬', show: true },
    { name: 'Admin Dashboard', path: '/admin', icon: '👑', show: isAdmin },
    { name: 'User Management', path: '/admin/users', icon: '👤', show: isAdmin },
    { name: 'Game Settings', path: '/admin/game-settings', icon: '⚙️', show: isAdmin },
    { name: 'Admin Withdrawals', path: '/admin/withdrawals', icon: '💸', show: isAdmin },
    { name: 'Admin Deposits', path: '/admin/deposits', icon: '💰', show: isAdmin },
    { name: 'Match Management', path: '/admin/matches', icon: '⚽', show: isAdmin },
  ].filter(item => item.show);

  return (
    <div className="min-h-screen">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 glass-effect transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/20">
          <h1 className="text-2xl font-bold text-yellow-400">
            💎 BigWin
          </h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:bg-white/10"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="mt-6 space-y-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors ${
                location.pathname === item.path ? 'bg-white/20 text-white border-l-4 border-yellow-400' : ''
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top navigation */}
        <header className="glass-effect h-16 border-b border-white/20">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden mr-2 text-white hover:bg-white/10"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold text-white">
                Welcome back, {user?.username || user?.email || 'User'}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              {/* Balance */}
              <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg">
                <span className="text-sm font-medium">Balance:</span>
                <span className="font-bold">${user?.balance?.toFixed(2) || '0.00'}</span>
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Bell className="h-4 w-4" />
              </Button>

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-yellow-500 text-black">
                        {(user?.username || user?.email || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-800 border-gray-600" align="end" forceMount>
                  <DropdownMenuItem className="flex items-center text-white hover:bg-gray-700">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center text-white hover:bg-gray-700">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center text-white hover:bg-gray-700" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
