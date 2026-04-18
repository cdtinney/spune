import type { ReactNode } from 'react';
import CoverOverlay from './CoverOverlay';
import SongCard from './SongCard';
import AlbumGrid from './AlbumGrid';
import ProgressBar from './ProgressBar';
import type { Album, NowPlaying } from '../../types';

type NowPlayingDisplay = Pick<
  NowPlaying,
  | 'songId'
  | 'songTitle'
  | 'artistName'
  | 'albumName'
  | 'albumImageUrl'
  | 'progressMs'
  | 'durationMs'
  | 'isPlaying'
>;

interface VisualizationLayoutProps {
  dominantColor: string | null;
  nowPlaying: NowPlayingDisplay | null;
  tiles: Album[];
  gridCols: number;
  gridRows: number;
  tileSize: number;
  songPlaying: boolean;
  loadingContent?: ReactNode;
  emptyContent?: ReactNode;
  errorContent?: ReactNode;
  controls?: ReactNode;
}

export default function VisualizationLayout({
  dominantColor,
  nowPlaying,
  tiles,
  gridCols,
  gridRows,
  tileSize,
  songPlaying,
  loadingContent,
  emptyContent,
  errorContent,
  controls,
}: VisualizationLayoutProps) {
  return (
    <div className="visualization">
      <CoverOverlay dominantColor={dominantColor} />

      {controls}

      {songPlaying && nowPlaying && (
        <SongCard
          songId={nowPlaying.songId}
          artistName={nowPlaying.artistName}
          songTitle={nowPlaying.songTitle}
          albumName={nowPlaying.albumName}
          albumImageUrl={nowPlaying.albumImageUrl}
          dominantColor={dominantColor}
        />
      )}

      <div className="visualization__content">
        {loadingContent}

        {emptyContent}

        {songPlaying && (
          <AlbumGrid tiles={tiles} gridCols={gridCols} gridRows={gridRows} tileSize={tileSize} />
        )}
      </div>

      {songPlaying && nowPlaying && (
        <ProgressBar
          progressMs={nowPlaying.progressMs}
          durationMs={nowPlaying.durationMs}
          isPlaying={nowPlaying.isPlaying}
        />
      )}

      {errorContent}

      <div className="visualization__bottom-gradient" />
    </div>
  );
}
