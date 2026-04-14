import { useState } from 'react';

export default function AlbumImage({ src, alt, width, height }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        opacity: loaded ? 1 : 0,
        animation: loaded ? 'fadein 2s' : 'none',
        display: 'block',
      }}
    />
  );
}
