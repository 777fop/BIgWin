import { User } from '@/types';

class ApiService {
  static BASE_URL = 'http://localhost:8080';

  private static getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  }

  private static async handleResponse(response: Response) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    return data;
  }

  // Authentication & Profile
  static async register(userData: { username: string; email: string; password: string; referralCode?: string }) {
    const response = await fetch(`${this.BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  static async login(credentials: { email: string; password: string }) {
    const response = await fetch(`${this.BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data = await this.handleResponse(response);
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  }

  static async logout() {
    const response = await fetch(`${this.BASE_URL}/api/auth/logout`, {
      headers: this.getAuthHeaders(),
    });
    localStorage.removeItem('token');
    return this.handleResponse(response);
  }

  static async fetchUserProfile() {
    const response = await fetch(`${this.BASE_URL}/api/users/me`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async updateUserProfile(updates: Partial<User>) {
    const response = await fetch(`${this.BASE_URL}/api/users/me`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return this.handleResponse(response);
  }

  // User Management (Admin)
  static async getAllUsers(params?: { page?: number; size?: number; sort?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    
    const response = await fetch(`${this.BASE_URL}/api/users?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async approveUser(userId: string) {
    const response = await fetch(`${this.BASE_URL}/api/users/${userId}/approve`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ approved: true }),
    });
    return this.handleResponse(response);
  }

  static async enableUser(userId: string, enabled: boolean) {
    const response = await fetch(`${this.BASE_URL}/api/users/${userId}/enable`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ enabled }),
    });
    return this.handleResponse(response);
  }

  // Deposits
  static async requestDeposit(amount: number, transactionId: string, paymentMethod: string) {
    const response = await fetch(`${this.BASE_URL}/api/deposits`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ amount, transactionId, paymentMethod }),
    });
    return this.handleResponse(response);
  }

  static async getUserDeposits() {
    const response = await fetch(`${this.BASE_URL}/api/deposits/me`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async getDepositRequests(params?: { page?: number; size?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());
    
    const response = await fetch(`${this.BASE_URL}/api/deposits?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async approveDepositRequest(id: string) {
    const response = await fetch(`${this.BASE_URL}/api/deposits/${id}/approve`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status: 'APPROVED' }),
    });
    return this.handleResponse(response);
  }

  static async rejectDepositRequest(id: string) {
    const response = await fetch(`${this.BASE_URL}/api/deposits/${id}/reject`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status: 'REJECTED' }),
    });
    return this.handleResponse(response);
  }

  // Withdrawals
  static async requestWithdrawal(amount: number, walletAddress: string) {
    const response = await fetch(`${this.BASE_URL}/api/withdrawals`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ amount, walletAddress }),
    });
    return this.handleResponse(response);
  }

  static async getUserWithdrawals() {
    const response = await fetch(`${this.BASE_URL}/api/withdrawals/me`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async getWithdrawalRequests(params?: { page?: number; size?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());
    
    const response = await fetch(`${this.BASE_URL}/api/withdrawals?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async approveWithdrawalRequest(id: string) {
    const response = await fetch(`${this.BASE_URL}/api/withdrawals/${id}/approve`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status: 'APPROVED' }),
    });
    return this.handleResponse(response);
  }

  static async rejectWithdrawalRequest(id: string) {
    const response = await fetch(`${this.BASE_URL}/api/withdrawals/${id}/reject`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status: 'REJECTED' }),
    });
    return this.handleResponse(response);
  }

  // Plans & Upgrades
  static async getPlans() {
    const response = await fetch(`${this.BASE_URL}/api/plans`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async requestUpgrade(planId: string) {
    const response = await fetch(`${this.BASE_URL}/api/upgrades`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ planId }),
    });
    return this.handleResponse(response);
  }

  static async getUserUpgrades() {
    const response = await fetch(`${this.BASE_URL}/api/upgrades/me`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async getUpgradeRequests(params?: { page?: number; size?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());
    
    const response = await fetch(`${this.BASE_URL}/api/upgrades?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async approveUpgradeRequest(id: string) {
    const response = await fetch(`${this.BASE_URL}/api/upgrades/${id}/approve`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status: 'APPROVED' }),
    });
    return this.handleResponse(response);
  }

  static async rejectUpgradeRequest(id: string) {
    const response = await fetch(`${this.BASE_URL}/api/upgrades/${id}/reject`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status: 'REJECTED' }),
    });
    return this.handleResponse(response);
  }

  // Daily Rewards
  static async checkDailyReward() {
    const response = await fetch(`${this.BASE_URL}/api/rewards/daily`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async claimDailyReward() {
    const response = await fetch(`${this.BASE_URL}/api/rewards/daily`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Games
  static async playSpinWheel(userId: string) {
    const response = await fetch(`${this.BASE_URL}/api/games/spinwheel/play/${userId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async getSpinWheelHistory(userId?: string) {
    const endpoint = userId 
      ? `${this.BASE_URL}/api/games/spinwheel/history/${userId}`
      : `${this.BASE_URL}/api/games/spinwheel/history`;
    const response = await fetch(endpoint, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async playAviator(userId: string, betAmount: number) {
    const response = await fetch(`${this.BASE_URL}/api/games/aviator/play/${userId}?betAmount=${betAmount}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async getAviatorHistory(userId?: string) {
    const endpoint = userId 
      ? `${this.BASE_URL}/api/games/aviator/history/${userId}`
      : `${this.BASE_URL}/api/games/aviator/history`;
    const response = await fetch(endpoint, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Admin Game Difficulty Settings
  static async getGameDifficulty() {
    const response = await fetch(`${this.BASE_URL}/api/admin/settings/difficulty`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async setGameDifficulty(difficulty: 'EASY' | 'MEDIUM' | 'HARD') {
    const response = await fetch(`${this.BASE_URL}/api/admin/settings/difficulty?difficulty=${difficulty}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Football Betting
  static async getFootballMatches(params?: { page?: number; size?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());
    
    const response = await fetch(`${this.BASE_URL}/api/football/matches?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async placeFootballBet(matchId: string, betOption: string, amount: number) {
    const response = await fetch(`${this.BASE_URL}/api/football/bets`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ matchId, betOption, amount }),
    });
    return this.handleResponse(response);
  }

  static async getUserFootballBets() {
    const response = await fetch(`${this.BASE_URL}/api/football/bets/me`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async getAllFootballBets(params?: { page?: number; size?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());
    
    const response = await fetch(`${this.BASE_URL}/api/football/bets?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Messaging & Notifications
  static async getNotifications() {
    const response = await fetch(`${this.BASE_URL}/api/notifications/me`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async sendMessage(toUserId: string, content: string) {
    const response = await fetch(`${this.BASE_URL}/api/messages`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ toUserId, content }),
    });
    return this.handleResponse(response);
  }

  static async sendBroadcastMessage(content: string) {
    const response = await fetch(`${this.BASE_URL}/api/messages`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ content, broadcast: true }),
    });
    return this.handleResponse(response);
  }

  static async getUserMessages() {
    const response = await fetch(`${this.BASE_URL}/api/messages/me`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async getAllMessages(params?: { page?: number; size?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.size) queryParams.append('size', params.size.toString());
    
    const response = await fetch(`${this.BASE_URL}/api/messages?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async replyToMessage(messageId: string, content: string) {
    const response = await fetch(`${this.BASE_URL}/api/messages/${messageId}/reply`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ content }),
    });
    return this.handleResponse(response);
  }

  // Referrals
  static async getUserReferrals() {
    const response = await fetch(`${this.BASE_URL}/api/referrals/me`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async claimReferralBonus() {
    const response = await fetch(`${this.BASE_URL}/api/referrals/claim`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Admin
  static async adminLogin(username: string, password: string) {
    const response = await fetch(`${this.BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await this.handleResponse(response);
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  }

  static async getAdminDashboard() {
    const response = await fetch(`${this.BASE_URL}/api/admin/dashboard`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  static async changeUserRole(userId: string, role: 'ADMIN' | 'USER') {
    const response = await fetch(`${this.BASE_URL}/api/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ role }),
    });
    return this.handleResponse(response);
  }

  // Deprecated - keeping for backward compatibility
  static async getGameSettings() {
    return this.getGameDifficulty();
  }

  static async updateGameSettings(settings: any) {
    return this.setGameDifficulty(settings.difficulty || 'MEDIUM');
  }
}

export default ApiService;
