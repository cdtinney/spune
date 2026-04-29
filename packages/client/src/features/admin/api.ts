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

export interface AdminCronJob {
  jobname: string;
  schedule: string;
  active: boolean;
}

export interface AdminCronRun {
  jobname: string;
  status: string;
  returnMessage: string | null;
  startTime: string | null;
  endTime: string | null;
}

export interface AdminKeepalive {
  lastPing: string | null;
  cronAvailable: boolean;
  jobs: AdminCronJob[];
  recentRuns: AdminCronRun[];
}

export interface AdminLogEntry {
  raw: string;
  parsed?: Record<string, unknown>;
}

export interface AdminLogs {
  file: string;
  limit: number;
  entries: AdminLogEntry[];
  note?: string;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await axios.get<{ users: AdminUser[] }>('/api/admin/users');
  return response.data.users;
}

export async function getAdminSessions(): Promise<AdminSession[]> {
  const response = await axios.get<{ sessions: AdminSession[] }>('/api/admin/sessions');
  return response.data.sessions;
}

export async function getAdminKeepalive(): Promise<AdminKeepalive> {
  const response = await axios.get<AdminKeepalive>('/api/admin/keepalive');
  return response.data;
}

export async function getAdminLogs(limit = 50): Promise<AdminLogs> {
  const response = await axios.get<AdminLogs>('/api/admin/logs', { params: { limit } });
  return response.data;
}
