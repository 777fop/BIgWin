
import { User, UpgradeRequest } from '@/types';

const USERS_KEY = 'bigwin_users';
const UPGRADE_REQUESTS_KEY = 'bigwin_upgrade_requests';
const CURRENT_USER_KEY = 'bigwin_current_user';

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
    // Simple password check - in real app this would be hashed
    if (email === 'robivine99@gmail.com' && password === 'BK-24') {
      return this.getUserByEmail(email) || this.createAdminUser(email);
    }
    
    // For demo purposes, any user can login with password "BK-24"
    if (password === 'BK-24') {
      return this.getUserByEmail(email);
    }
    
    return null;
  }

  static createAdminUser(email: string): User {
    const adminUser: User = {
      id: 'admin-user',
      email,
      username: 'Admin',
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

  static registerUser(email: string, username: string, referralCode?: string): User {
    const existingUser = this.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      username: username || email.split('@')[0],
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

    // Handle referral bonus
    if (referralCode) {
      this.handleReferralBonus(referralCode);
    }

    return newUser;
  }

  static handleReferralBonus(referralCode: string): void {
    const users = this.getAllUsers();
    const referrer = users.find(u => u.referralCode === referralCode);
    
    if (referrer) {
      referrer.balance += 5;
      referrer.totalEarned += 5;
      referrer.referralCount += 1;
      this.saveUser(referrer);
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

  static approveUpgradeRequest(requestId: string): void {
    const requests = this.getAllUpgradeRequests();
    const request = requests.find(r => r.id === requestId);
    
    if (request) {
      request.status = 'approved';
      request.responseDate = new Date().toISOString();
      this.saveUpgradeRequest(request);

      // Update user plan
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

      // Clear user pending upgrade
      const user = this.getUserByEmail(request.email);
      if (user) {
        user.pendingUpgrade = undefined;
        this.saveUser(user);
      }
    }
  }
}
