export interface User {
  id: string;
  email: string;
  username: string;
  password?: string; // Add password field for demo purposes
  balance: number;
  referralCode: string;
  referralCount: number;
  plan: 'basic' | 'premium' | 'vip';
  lastClaim: string | null;
  totalEarned: number;
  registrationDate: string;
  pendingUpgrade?: {
    planId: string;
    amount: number;
    transactionHash?: string;
    status: 'pending' | 'confirmed' | 'rejected';
    requestDate: string;
  };
  lastSpinDate: string | null;
  stakingBalance: number;
  isAdmin?: boolean;
  hasRegistrationBonus?: boolean;
  referredBy?: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'referral' | 'claim' | 'spin_win' | 'spin_lose' | 'stake';
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
  description: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  dailyClaim: number;
  withdrawalMinimum: number;
  color: string;
  features: string[];
}

export interface UpgradeRequest {
  id: string;
  userId: string;
  username: string;
  email: string;
  planId: string;
  planName: string;
  amount: number;
  transactionHash?: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  responseDate?: string;
}
