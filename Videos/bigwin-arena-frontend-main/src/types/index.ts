
export interface User {
  id: number;
  email: string;
  username?: string;
  role: 'USER' | 'ADMIN';
  balance: number;
  approved: boolean;
  enabled: boolean;
  referralCode?: string;
  createdAt: string;
  plan?: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username?: string;
  email: string;
  password: string;
  referralCode?: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface Plan {
  id: number;
  name: string;
  dailyClaim: number;
  minWithdrawal: number;
  price: number;
  features: string[];
}

export interface Withdrawal {
  id: number;
  amount: number;
  walletAddress: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  processedAt?: string;
  userId: number;
}

export interface Deposit {
  id: number;
  amount: number;
  transactionId: string;
  paymentMethod: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  processedAt?: string;
  userId: number;
}

export interface UpgradeRequest {
  id: number;
  planId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  processedAt?: string;
  userId: number;
}

export interface SpinResult {
  id: number;
  reward: number;
  difficultyLevel: 'EASY' | 'MEDIUM' | 'HARD';
  timestamp: string;
  userId: number;
}

export interface AviatorGame {
  id: number;
  betAmount: number;
  multiplier: number;
  winAmount: number;
  difficultyLevel: 'EASY' | 'MEDIUM' | 'HARD';
  playedAt: string;
  userId: number;
}

export interface FootballMatch {
  id: number;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  status: 'UPCOMING' | 'LIVE' | 'FINISHED';
  result?: {
    homeScore: number;
    awayScore: number;
  };
}

export interface Bet {
  id: number;
  matchId: number;
  betOption: 'HOME' | 'DRAW' | 'AWAY';
  amount: number;
  odds: number;
  status: 'PENDING' | 'WON' | 'LOST';
  placedAt: string;
  match: FootballMatch;
}

export interface Notification {
  id: number;
  message: string;
  read: boolean;
  createdAt: string;
  userId: number;
}

export interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: string;
  userId: number;
}

export interface DailyReward {
  id: number;
  amount: number;
  claimedAt: string;
  userId: number;
}

export interface Referral {
  id: number;
  referredUserId: number;
  referredUser: User;
  bonus: number;
  createdAt: string;
}

export interface GameDifficulty {
  id: number;
  gameType: 'SPIN' | 'AVIATOR';
  level: 'EASY' | 'MEDIUM' | 'HARD';
  multiplier: number;
  description: string;
  isActive: boolean;
}

export interface AdminStats {
  totalUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  pendingUpgrades: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
