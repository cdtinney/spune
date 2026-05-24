import getRelatedArtists from '../../helpers/getRelatedArtists';
import { fetchAlbumsForNames } from '../fetchAlbumsForArtists';
import type { DiscoverySource } from '../types';

const MAX_ALBUMS = 200;

export const relatedArtistsSource: DiscoverySource = {
  name: 'related-artists',
  priority: 10,

  async discover(context) {
    const { spotifyApi, songArtists, trackArtistIdSet } = context;

    const artistNames = [...new Set(songArtists.map((a) => a.name))];
    const nameArrays = await Promise.all(artistNames.map((name) => getRelatedArtists(name)));

    const seen = new Set<string>();
    const relatedNames: string[] = [];
    for (const names of nameArrays) {
      for (const name of names) {
        const key = name.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          relatedNames.push(name);
        }
      }
    }

    return fetchAlbumsForNames(spotifyApi, relatedNames, trackArtistIdSet, MAX_ALBUMS);
  },
};
