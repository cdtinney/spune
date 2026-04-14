import { useState } from 'react';

export default function AlbumImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      style={{
        opacity: loaded ? 1 : 0,
        transition: 'opacity 1s ease-in',
      }}
    />
  );
}
