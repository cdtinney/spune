import axios from 'axios';
import type { UserProfile } from '../../types';

export async function getAuthUser(): Promise<UserProfile | null> {
  const response = await axios.get<{ user: UserProfile | null }>('/api/auth/user');
  return response.data.user || null;
}
