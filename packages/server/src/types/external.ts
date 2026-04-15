export interface LastFmSimilarArtist {
  name: string;
  match: string;
  url: string;
}

export interface LastFmResponse {
  similarartists?: {
    artist?: LastFmSimilarArtist[];
  };
}

export interface ListenBrainzTrack {
  creator?: string;
  title?: string;
}

export interface ListenBrainzResponse {
  payload?: {
    jspf?: {
      playlist?: {
        track?: ListenBrainzTrack[];
      };
    };
  };
}

export interface MusicBrainzArtist {
  id?: string;
  name?: string;
}

export interface MusicBrainzResponse {
  artists?: MusicBrainzArtist[];
}
