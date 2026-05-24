import getRelatedArtists from '../../helpers/getRelatedArtists';
import { fetchAlbumsForNames } from '../fetchAlbumsForArtists';
import type { DiscoverySource } from '../types';

const TWO_HOP_COUNT = 5;
const MAX_ALBUMS = 100;

export const twoHopSource: DiscoverySource = {
  name: 'two-hop',
  priority: 30,

  async discover(context) {
    const { spotifyApi, songArtists, trackArtistIdSet } = context;
    const primaryArtistName = songArtists[0]?.name;

    if (!primaryArtistName) {
      return [];
    }

    const firstHopNames = await getRelatedArtists(primaryArtistName);
    const topRelated = firstHopNames.slice(0, TWO_HOP_COUNT);
    const secondHopArrays = await Promise.all(topRelated.map((name) => getRelatedArtists(name)));

    // Only keep 2nd-hop names that weren't already in the 1st hop
    const firstHopSet = new Set(firstHopNames.map((n) => n.toLowerCase()));
    const seen = new Set<string>();
    const twoHopNames: string[] = [];

    for (const names of secondHopArrays) {
      for (const name of names) {
        const key = name.toLowerCase();
        if (!firstHopSet.has(key) && !seen.has(key)) {
          seen.add(key);
          twoHopNames.push(name);
        }
      }
    }

    return fetchAlbumsForNames(spotifyApi, twoHopNames, trackArtistIdSet, MAX_ALBUMS);
  },
};
