import type { SpotifyApi } from '@spotify/web-api-ts-sdk';
import logger from '../../../../logger';
import errorMessage from '../../../../utils/errorMessage';
import { genreArtistsCache } from '../../../../cache';
import { fetchAlbumsForIds } from '../fetchAlbumsForArtists';
import type { DiscoverySource } from '../types';

const MAX_GENRE_ARTISTS = 20;
const MAX_ALBUMS = 200;

async function getGenreArtistIds(spotifyApi: SpotifyApi, artistId: string): Promise<string[]> {
  const cached = genreArtistsCache.get(artistId);
  if (cached) {
    return cached;
  }

  const artist = await spotifyApi.artists.get(artistId);
  const genres = artist.genres;

  if (!genres || genres.length === 0) {
    logger.info(`No genres found for artist ${artistId}`);
    return [];
  }

  const genreQuery = genres
    .slice(0, 2)
    .map((g) => `genre:"${g}"`)
    .join(' ');
  const results = await spotifyApi.search(genreQuery, ['artist'], undefined, MAX_GENRE_ARTISTS);
  const ids = (results.artists?.items || []).map((a) => a.id).filter((id) => id !== artistId);

  logger.info(`Genre search: ${ids.length} artists for genres [${genres.slice(0, 2).join(', ')}]`);
  genreArtistsCache.set(artistId, ids);
  return ids;
}

export const genreSource: DiscoverySource = {
  name: 'genre',
  priority: 20,

  async discover(context) {
    const { spotifyApi, songArtists, trackArtistIdSet } = context;
    const primaryArtistId = songArtists[0]?.id;

    if (!primaryArtistId) {
      return [];
    }

    try {
      const genreArtistIds = await getGenreArtistIds(spotifyApi, primaryArtistId);
      const newIds = genreArtistIds.filter((id) => !trackArtistIdSet.has(id));
      return fetchAlbumsForIds(spotifyApi, newIds, MAX_ALBUMS);
    } catch (error) {
      logger.warn(`Genre discovery failed: ${errorMessage(error)}`);
      return [];
    }
  },
};
