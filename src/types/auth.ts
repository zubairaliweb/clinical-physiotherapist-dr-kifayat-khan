export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'owner' | 'staff';
}

export interface SessionRecord {
  token: string;
  userId: string;
  expiresAt: number;
}
