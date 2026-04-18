import { useState, useEffect, useCallback, useRef } from 'react';
import AlbumGrid from '../../components/AlbumGrid';
import CoverOverlay from '../../components/CoverOverlay';
import SongCard from '../../components/SongCard';
import ProgressBar from '../../components/ProgressBar';
import LoadingScreen from '../../components/LoadingScreen';
import useDominantColor from '../../hooks/useDominantColor';
import useWindowSize from '../../hooks/useWindowSize';
import useAlbumGrid from '../../hooks/useAlbumGrid';
import type { CastMessage, CastNowPlaying } from '../types';
import type { RelatedAlbums, SpotifyAlbum } from '../../types';
import { CAST_NAMESPACE } from '../types';
import '../../index.css';
import '../../App.css';
import '../../pages/VisualizationContent.css';

function buildRelatedAlbums(imageUrls: string[]): RelatedAlbums {
  const byAlbumId: Record<string, SpotifyAlbum> = {};
  const allAlbumIds: string[] = [];

  imageUrls.forEach((url, i) => {
    const id = `cast_${i}`;
    byAlbumId[id] = {
      id,
      name: `Album ${i}`,
      images: [{ url }, { url }],
      artists: [],
    } as SpotifyAlbum;
    allAlbumIds.push(id);
  });

  return { byAlbumId, allAlbumIds };
}

export default function ReceiverApp() {
  const [nowPlaying, setNowPlaying] = useState<CastNowPlaying | null>(null);
  const [relatedAlbums, setRelatedAlbums] = useState<RelatedAlbums>({
    byAlbumId: {},
    allAlbumIds: [],
  });
  const [connected, setConnected] = useState(false);
  const contextRef = useRef<cast.framework.CastReceiverContext | null>(null);

  const dominantColor = useDominantColor(nowPlaying?.albumImageUrl);
  const windowSize = useWindowSize();
  const { tiles, gridCols, gridRows, tileSize } = useAlbumGrid(relatedAlbums, windowSize);

  const handleMessage = useCallback((event: cast.framework.system.Event) => {
    try {
      const messageEvent = event as cast.framework.system.MessageEvent;
      // CAF v3 automatically deserializes JSON strings, so data is already an object
      const raw = messageEvent.data;
      const data = (typeof raw === 'string' ? JSON.parse(raw) : raw) as CastMessage;

      if (data.type === 'UPDATE_PLAYBACK') {
        setNowPlaying(data.nowPlaying);
        if (data.albumImageUrls.length > 0) {
          setRelatedAlbums(buildRelatedAlbums(data.albumImageUrls));
        }
      }
    } catch (err) {
      console.error('[Receiver] Failed to parse message:', err);
    }
  }, []);

  useEffect(() => {
    // Initialize the Cast Receiver SDK
    const context = cast.framework.CastReceiverContext.getInstance();
    contextRef.current = context;

    context.addCustomMessageListener(CAST_NAMESPACE, handleMessage);

    context.addEventListener(cast.framework.system.EventType.SENDER_CONNECTED, () =>
      setConnected(true),
    );

    context.addEventListener(cast.framework.system.EventType.SENDER_DISCONNECTED, () =>
      setConnected(false),
    );

    const options = new cast.framework.CastReceiverOptions();
    options.disableIdleTimeout = true;

    context.start(options);

    return () => {
      context.stop();
    };
  }, [handleMessage]);

  const songPlaying = nowPlaying?.artistName && nowPlaying?.songTitle;

  return (
    <div className="app">
      <div className="app__content">
        <div className="visualization">
          <CoverOverlay dominantColor={dominantColor} />

          {songPlaying && (
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
            {!connected && !songPlaying && <LoadingScreen className="visualization__loading" />}

            {connected && !songPlaying && (
              <div className="visualization__empty">
                <p>Waiting for playback data...</p>
              </div>
            )}

            {songPlaying && (
              <AlbumGrid
                tiles={tiles}
                gridCols={gridCols}
                gridRows={gridRows}
                tileSize={tileSize}
              />
            )}
          </div>

          {songPlaying && (
            <ProgressBar
              progressMs={nowPlaying.progressMs}
              durationMs={nowPlaying.durationMs}
              isPlaying={nowPlaying.isPlaying}
            />
          )}

          <div className="visualization__bottom-gradient" />
        </div>
      </div>
    </div>
  );
}
