
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboard from "./pages/AdminDashboard";
import GameDifficultySettings from "./pages/GameDifficultySettings";
import GamesPage from "./pages/GamesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/betting" element={<div className="p-8 text-center text-white"><h1 className="text-2xl">⚽ Sports Betting - Coming Soon</h1></div>} />
              <Route path="/deposits" element={<div className="p-8 text-center text-white"><h1 className="text-2xl">💰 Deposits - Coming Soon</h1></div>} />
              <Route path="/withdrawals" element={<div className="p-8 text-center text-white"><h1 className="text-2xl">🚀 Withdrawals - Coming Soon</h1></div>} />
              <Route path="/referrals" element={<div className="p-8 text-center text-white"><h1 className="text-2xl">👥 Referrals - Coming Soon</h1></div>} />
              <Route path="/messages" element={<div className="p-8 text-center text-white"><h1 className="text-2xl">💬 Messages - Coming Soon</h1></div>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute adminOnly><div className="p-8 text-center text-white"><h1 className="text-2xl">👥 Admin Users - Coming Soon</h1></div></ProtectedRoute>} />
              <Route path="/admin/withdrawals" element={<ProtectedRoute adminOnly><div className="p-8 text-center text-white"><h1 className="text-2xl">🚀 Admin Withdrawals - Coming Soon</h1></div></ProtectedRoute>} />
              <Route path="/admin/deposits" element={<ProtectedRoute adminOnly><div className="p-8 text-center text-white"><h1 className="text-2xl">💰 Admin Deposits - Coming Soon</h1></div></ProtectedRoute>} />
              <Route path="/admin/matches" element={<ProtectedRoute adminOnly><div className="p-8 text-center text-white"><h1 className="text-2xl">⚽ Admin Matches - Coming Soon</h1></div></ProtectedRoute>} />
              <Route path="/admin/game-settings" element={<ProtectedRoute adminOnly><GameDifficultySettings /></ProtectedRoute>} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
