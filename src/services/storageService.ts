
import { User } from '@/types';

const API_BASE_URL = '/api';

export class StorageService {
  static async login(email: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
    
    const data = await response.json();
    const user = data.user || data;
    
    // Store token if provided
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    this.setCurrentUser(user);
    return user;
  }

  static async register(email: string, username: string, password: string, referralCode?: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        username,
        password,
        referralCode,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    
    const data = await response.json();
    const user = data.user || data;
    
    // Store token if provided
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    this.setCurrentUser(user);
    return user;
  }

  static setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  static getCurrentUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  static clearCurrentUser(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }

  static logout(): void {
    this.clearCurrentUser();
  }
}
