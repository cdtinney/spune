import logger from '../../../logger';
import refreshToken from '../../auth/refreshToken';
import type { User } from '../../../types';

function tokenExpired(tokenUpdated: number, expiresIn: number): boolean {
  return tokenUpdated + expiresIn <= Date.now();
}

async function getValidAccessToken(user: User | undefined): Promise<string> {
  if (!user || !user.spotifyAccessToken) {
    throw new Error('Request has no user or access token');
  }

  const requiresRefresh = tokenExpired(user.tokenUpdated, user.expiresIn);
  if (!requiresRefresh) {
    return user.spotifyAccessToken;
  }

  logger.info('Refreshing user access token...');
  const updatedUser = await refreshToken(user.spotifyRefreshToken);
  logger.info('Sucessfully updated user access token.');
  return updatedUser.spotifyAccessToken;
}

interface ApiRequestWithRefreshArgs<T> {
  user: User | undefined;
  apiFn: (accessToken: string) => Promise<T>;
}

export default async function apiRequestWithRefresh<T>({
  user,
  apiFn,
}: ApiRequestWithRefreshArgs<T>): Promise<T> {
  return apiFn(await getValidAccessToken(user));
}
