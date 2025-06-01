import {
  AuthRequest,
  AuthResponse,
  RegisterRequest,
  User,
  Plan,
  Withdrawal,
  Deposit,
  UpgradeRequest,
  SpinResult,
  AviatorGame,
  FootballMatch,
  Bet,
  Notification,
  Message,
  DailyReward,
  Referral,
  GameDifficulty,
  AdminStats,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    console.log(`API Request: ${options.method || 'GET'} ${url}`);

    const response = await fetch(url, config);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} - ${errorText}`);
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    return response.status === 204 ? (undefined as T) : await response.json();
  }

  // Auth
  login(data: AuthRequest): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  register(data: RegisterRequest): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  logout(): Promise<void> {
    return this.makeRequest<void>('/api/auth/logout');
  }

  // User
  getUserProfile(): Promise<User> {
    return this.makeRequest<User>('/api/users/me');
  }

  updateUserProfile(data: Partial<User>): Promise<User> {
    return this.makeRequest<User>('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  getAllUsers(): Promise<User[]> {
    return this.makeRequest<User[]>('/api/users');
  }

  approveUser(id: number): Promise<User> {
    return this.makeRequest<User>(`/api/users/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ approved: true }),
    });
  }

  enableUser(id: number, enabled: boolean): Promise<User> {
    return this.makeRequest<User>(`/api/users/${id}/enable`, {
      method: 'PUT',
      body: JSON.stringify({ enabled }),
    });
  }

  changeUserRole(id: number, role: 'ADMIN' | 'USER'): Promise<User> {
    return this.makeRequest<User>(`/api/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  // Plans
  getPlans(): Promise<Plan[]> {
    return this.makeRequest<Plan[]>('/api/plans');
  }

  // Deposits
  requestDeposit(amount: number, transactionId: string, paymentMethod: string): Promise<Deposit> {
    return this.makeRequest<Deposit>('/api/deposits', {
      method: 'POST',
      body: JSON.stringify({ amount, transactionId, paymentMethod }),
    });
  }

  getMyDeposits(): Promise<Deposit[]> {
    return this.makeRequest<Deposit[]>('/api/deposits/me');
  }

  getAllDeposits(): Promise<Deposit[]> {
    return this.makeRequest<Deposit[]>('/api/deposits');
  }

  approveDeposit(id: number): Promise<Deposit> {
    return this.makeRequest<Deposit>(`/api/deposits/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'APPROVED' }),
    });
  }

  rejectDeposit(id: number): Promise<Deposit> {
    return this.makeRequest<Deposit>(`/api/deposits/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'REJECTED' }),
    });
  }

  // Withdrawals
  requestWithdrawal(amount: number, walletAddress: string): Promise<Withdrawal> {
    return this.makeRequest<Withdrawal>('/api/withdrawals', {
      method: 'POST',
      body: JSON.stringify({ amount, walletAddress }),
    });
  }

  getMyWithdrawals(): Promise<Withdrawal[]> {
    return this.makeRequest<Withdrawal[]>('/api/withdrawals/me');
  }

  getAllWithdrawals(): Promise<Withdrawal[]> {
    return this.makeRequest<Withdrawal[]>('/api/withdrawals');
  }

  approveWithdrawal(id: number): Promise<Withdrawal> {
    return this.makeRequest<Withdrawal>(`/api/withdrawals/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'APPROVED' }),
    });
  }

  rejectWithdrawal(id: number): Promise<Withdrawal> {
    return this.makeRequest<Withdrawal>(`/api/withdrawals/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'REJECTED' }),
    });
  }

  // Upgrades
  requestUpgrade(planId: number): Promise<UpgradeRequest> {
    return this.makeRequest<UpgradeRequest>('/api/upgrades', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
  }

  getMyUpgrades(): Promise<UpgradeRequest[]> {
    return this.makeRequest<UpgradeRequest[]>('/api/upgrades/me');
  }

  getAllUpgrades(): Promise<UpgradeRequest[]> {
    return this.makeRequest<UpgradeRequest[]>('/api/upgrades');
  }

  approveUpgrade(id: number): Promise<UpgradeRequest> {
    return this.makeRequest<UpgradeRequest>(`/api/upgrades/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'APPROVED' }),
    });
  }

  rejectUpgrade(id: number): Promise<UpgradeRequest> {
    return this.makeRequest<UpgradeRequest>(`/api/upgrades/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'REJECTED' }),
    });
  }

  // Rewards
  checkDailyReward(): Promise<{ canClaim: boolean; amount?: number }> {
    return this.makeRequest('/api/rewards/daily');
  }

  claimDailyReward(): Promise<DailyReward> {
    return this.makeRequest('/api/rewards/daily', { method: 'POST' });
  }

  // Spin
  playSpin(difficultyLevel: 'EASY' | 'MEDIUM' | 'HARD'): Promise<SpinResult> {
    return this.makeRequest('/api/games/spinwheel/play', {
      method: 'POST',
      body: JSON.stringify({ difficultyLevel }),
    });
  }

  getSpinHistory(): Promise<SpinResult[]> {
    return this.makeRequest('/api/games/spinwheel/history');
  }

  // Aviator
  playAviator(difficultyLevel: 'EASY' | 'MEDIUM' | 'HARD', betAmount: number): Promise<AviatorGame> {
    return this.makeRequest('/api/games/aviator/play', {
      method: 'POST',
      body: JSON.stringify({ difficultyLevel, betAmount }),
    });
  }

  getAviatorHistory(): Promise<AviatorGame[]> {
    return this.makeRequest('/api/games/aviator/history');
  }

  // Football
  getFootballMatches(): Promise<FootballMatch[]> {
    return this.makeRequest('/api/football/matches');
  }

  placeBet(matchId: number, betOption: 'HOME' | 'DRAW' | 'AWAY', amount: number): Promise<Bet> {
    return this.makeRequest('/api/football/bets', {
      method: 'POST',
      body: JSON.stringify({ matchId, betOption, amount }),
    });
  }

  getMyBets(): Promise<Bet[]> {
    return this.makeRequest('/api/football/bets/me');
  }

  getAllBets(): Promise<Bet[]> {
    return this.makeRequest('/api/football/bets');
  }

  // Notifications
  getMyNotifications(): Promise<Notification[]> {
    return this.makeRequest('/api/notifications/me');
  }

  // Messaging
  sendMessage(toUserId: number, content: string): Promise<Message> {
    return this.makeRequest('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ toUserId, content }),
    });
  }

  getMyMessages(): Promise<Message[]> {
    return this.makeRequest('/api/messages/me');
  }

  getAllMessages(): Promise<Message[]> {
    return this.makeRequest('/api/messages');
  }

  replyToMessage(messageId: number, content: string): Promise<Message> {
    return this.makeRequest(`/api/messages/${messageId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Referrals
  getMyReferrals(): Promise<Referral[]> {
    return this.makeRequest('/api/referrals/me');
  }

  claimReferralBonus(): Promise<{ bonus: number }> {
    return this.makeRequest('/api/referrals/claim', { method: 'POST' });
  }

  // Admin dashboard
  getAdminDashboard(): Promise<AdminStats> {
    return this.makeRequest('/api/admin/dashboard');
  }

  // Game difficulty (Admin)
  getGameDifficulties(): Promise<GameDifficulty[]> {
    return this.makeRequest('/api/admin/game-difficulties');
  }

  updateGameDifficulty(id: number, data: Partial<GameDifficulty>): Promise<GameDifficulty> {
    return this.makeRequest(`/api/admin/game-difficulties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  createGameDifficulty(data: Omit<GameDifficulty, 'id'>): Promise<GameDifficulty> {
    return this.makeRequest('/api/admin/game-difficulties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();
