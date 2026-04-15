import type { User } from '../../../types';
interface ApiRequestWithRefreshArgs<T> {
  user: User;
  apiFn: (accessToken: string) => Promise<T>;
}
export default function apiRequestWithRefresh<T>({
  user,
  apiFn,
}: ApiRequestWithRefreshArgs<T>): Promise<T>;
export {};
