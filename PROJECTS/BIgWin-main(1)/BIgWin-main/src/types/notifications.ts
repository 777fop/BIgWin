
export interface Notification {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'upgrade' | 'general';
  title: string;
  message: string;
  date: string;
  read: boolean;
  relatedId?: string; // ID of related request (deposit, withdrawal, etc.)
}
