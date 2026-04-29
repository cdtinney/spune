import axios from 'axios';

export interface AdminUser {
  id: number;
  spotifyId: string;
  displayName: string | null;
  tokenUpdated: number | null;
  expiresIn: number | null;
}

export interface AdminSession {
  sidPrefix: string;
  expire: string;
  spotifyId: string | null;
  displayName: string | null;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await axios.get<{ users: AdminUser[] }>('/api/admin/users');
  return response.data.users;
}

export async function getAdminSessions(): Promise<AdminSession[]> {
  const response = await axios.get<{ sessions: AdminSession[] }>('/api/admin/sessions');
  return response.data.sessions;
}
