import type { SpotifyApi } from '@spotify/web-api-ts-sdk';
import getArtistAlbums from './getArtistAlbums';
import uniqueAlbums from '../../utils/uniqueAlbums';
import combineTrackArtists from '../../utils/combineTrackArtists';
import runDiscovery from '../discovery/runDiscovery';
import { relatedArtistsSource } from '../discovery/sources/relatedArtistsSource';
import { genreSource } from '../discovery/sources/genreSource';
import { twoHopSource } from '../discovery/sources/twoHopSource';
import logger from '../../../logger';
import { discoveryResultCache } from '../../../cache';
import type { SpotifyAlbum, SpotifyArtist } from '../../../types';
import type { DiscoverySource } from '../discovery/types';

interface CurrentlyPlayingItem {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: {
    artists: SpotifyArtist[];
  };
}

interface CurrentlyPlayingResponse {
  item: CurrentlyPlayingItem;
}

const DISCOVERY_SOURCES: DiscoverySource[] = [relatedArtistsSource, genreSource, twoHopSource];

export default async function getCurrentlyPlayingRelatedAlbums(
  spotifyApi: SpotifyApi,
  songId: string,
): Promise<SpotifyAlbum[]> {
  const cachedResult = discoveryResultCache.get(songId);
  if (cachedResult) {
    logger.info(`Discovery cache hit for songId=${songId} (${cachedResult.length} albums)`);
    return cachedResult;
  }

  const response =
    (await spotifyApi.player.getCurrentlyPlayingTrack()) as unknown as CurrentlyPlayingResponse;
  const {
    item: {
      id,
      artists: songArtists,
      album: { artists: albumArtists },
    },
  } = response;

  logger.info(
    `Currently playing: "${response.item.name}" by ${songArtists.map((a) => a.name).join(', ')} (songId=${id})`,
  );

  if (songId !== id) {
    return Promise.reject(
      new Error(`Song ID mismatch (currently playing = ${id}, query = ${songId})`),
    );
  }

  const trackArtistIds = combineTrackArtists({ songArtists, albumArtists });
  const trackArtistIdSet = new Set(trackArtistIds);

  const artistAlbumResults = await Promise.all(
    trackArtistIds.map((artistId) => getArtistAlbums(spotifyApi, artistId)),
  );
  const artistAlbums = artistAlbumResults.reduce<SpotifyAlbum[]>(
    (arr, curr) => arr.concat(curr.albums),
    [],
  );
  logger.info(`Artist albums: ${artistAlbums.length} from ${trackArtistIds.length} artist(s)`);

  const sourceAlbums = await runDiscovery(DISCOVERY_SOURCES, {
    spotifyApi,
    trackId: id,
    songArtists,
    albumArtists,
    trackArtistIdSet,
  });

  // Artist albums first (priority), then source albums (already priority-sorted)
  const combined = uniqueAlbums([...artistAlbums, ...sourceAlbums]);
  logger.info(`Combined unique albums: ${combined.length}`);

  discoveryResultCache.set(songId, combined);
  return combined;
}
