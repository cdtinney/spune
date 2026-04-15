import { useState, useEffect } from 'react';
import './FlippableTile.css';

interface FlippableTileProps {
  src: string | undefined;
  alt: string;
  flipToSrc: string | null;
  flipKey: number; // increment to trigger a flip
  entranceDelay?: number;
}

export default function FlippableTile({
  src,
  alt,
  flipToSrc,
  flipKey,
  entranceDelay = 0,
}: FlippableTileProps) {
  const [flipped, setFlipped] = useState(false);
  const [frontSrc, setFrontSrc] = useState(src);
  const [backSrc, setBackSrc] = useState(src);
  const [entered, setEntered] = useState(entranceDelay === 0);

  useEffect(() => {
    if (entered) return;
    const timer = setTimeout(() => setEntered(true), entranceDelay);
    return () => clearTimeout(timer);
  }, [entranceDelay, entered]);

  useEffect(() => {
    if (flipKey === 0 || !flipToSrc) return;

    if (flipped) {
      setFrontSrc(flipToSrc);
    } else {
      setBackSrc(flipToSrc);
    }

    requestAnimationFrame(() => {
      setFlipped((f) => !f);
    });
  }, [flipKey]);

  return (
    <div
      className={`flippable-tile${flipped ? ' flippable-tile--flipped' : ''}${entered ? ' flippable-tile--entered' : ''}`}
    >
      <div className="flippable-tile__face flippable-tile__front">
        <img src={frontSrc} alt={alt} loading="lazy" />
      </div>
      <div className="flippable-tile__face flippable-tile__back">
        <img src={backSrc} alt={alt} loading="lazy" />
      </div>
    </div>
  );
}
