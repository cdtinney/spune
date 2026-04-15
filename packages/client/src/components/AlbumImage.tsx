import { useState } from 'react';

interface AlbumImageProps {
  src: string | undefined;
  alt: string;
}

export default function AlbumImage({ src, alt }: AlbumImageProps) {
  const [loaded, setLoaded] = useState<boolean>(false);

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
