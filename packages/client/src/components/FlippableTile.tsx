import { useState, useEffect } from 'react';
import './FlippableTile.css';

interface FlippableTileProps {
  src: string | undefined;
  alt: string;
  flipToSrc: string | null; // when this changes to a new value, the tile flips
}

export default function FlippableTile({ src, alt, flipToSrc }: FlippableTileProps) {
  const [flipped, setFlipped] = useState(false);
  const [frontSrc, setFrontSrc] = useState(src);
  const [backSrc, setBackSrc] = useState(src);

  useEffect(() => {
    setFrontSrc(src);
    setFlipped(false);
  }, [src]);

  useEffect(() => {
    if (!flipToSrc) return;

    if (flipped) {
      setFrontSrc(flipToSrc);
    } else {
      setBackSrc(flipToSrc);
    }

    requestAnimationFrame(() => {
      setFlipped((f) => !f);
    });
  }, [flipToSrc]);

  return (
    <div className={`flippable-tile ${flipped ? 'flippable-tile--flipped' : ''}`}>
      <div className="flippable-tile__face flippable-tile__front">
        <img src={frontSrc} alt={alt} loading="lazy" />
      </div>
      <div className="flippable-tile__face flippable-tile__back">
        <img src={backSrc} alt={alt} loading="lazy" />
      </div>
    </div>
  );
}
