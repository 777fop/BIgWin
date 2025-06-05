import axios from 'axios';
import { User } from '@/types';

const API_BASE_URL = 'http://localhost:8080/api';  // <-- use relative path to leverage Vite proxy

export class StorageService {
  static async login(email: string, password: string): Promise<User> {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    const user = response.data;
    this.setCurrentUser(user);
    return user;
  }

  static async register(email: string, username: string, password: string, referralCode?: string): Promise<User> {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      email,
      username,
      password,
      referralCode,
    });
    const user = response.data;
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
  }

  static logout(): void {
    this.clearCurrentUser();
  }
}
