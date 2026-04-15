export interface WindowSize {
  width: number;
  height: number;
}

export interface Album {
  id: string;
  title: string;
  imageUrl: string | undefined;
  span: number;
  col: number;
  row: number;
}

export interface AlbumGridResult {
  tiles: Album[];
  gridCols: number;
  gridRows: number;
  base: number;
}

export interface UserProfile {
  spotifyId: string;
  displayName?: string;
  photos?: Array<string | { url?: string; value?: string }>;
}
