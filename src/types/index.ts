export interface User {
  id: string;
  email: string;
  username: string;
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
  };
  lastSpinDate: string | null;
  stakingBalance: number;
  isAdmin?: boolean;
  hasRegistrationBonus?: boolean;
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
  color: string;
  features: string[];
}
