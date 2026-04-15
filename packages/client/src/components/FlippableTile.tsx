import { useState, useEffect, useRef } from 'react';
import './FlippableTile.css';

interface FlippableTileProps {
  frontSrc: string | undefined;
  frontAlt: string;
  extraImages: string[];
  flipInterval: number; // ms between flips, 0 = never flip
}

export default function FlippableTile({
  frontSrc,
  frontAlt,
  extraImages,
  flipInterval,
}: FlippableTileProps) {
  const [flipped, setFlipped] = useState(false);
  const [currentFrontSrc, setCurrentFrontSrc] = useState(frontSrc);
  const [currentBackSrc, setCurrentBackSrc] = useState(frontSrc);
  const imageIndexRef = useRef(0);

  useEffect(() => {
    setCurrentFrontSrc(frontSrc);
    setCurrentBackSrc(frontSrc);
  }, [frontSrc]);

  useEffect(() => {
    if (flipInterval === 0 || extraImages.length === 0) return;

    const timer = setInterval(() => {
      // Pick the next image from the pool
      const nextSrc = extraImages[imageIndexRef.current % extraImages.length];
      imageIndexRef.current++;

      // Set the next image on the hidden face, then flip
      if (flipped) {
        setCurrentFrontSrc(nextSrc);
      } else {
        setCurrentBackSrc(nextSrc);
      }

      // Small delay to let the src update before flipping
      requestAnimationFrame(() => {
        setFlipped((f) => !f);
      });
    }, flipInterval);

    return () => clearInterval(timer);
  }, [flipInterval, extraImages, flipped]);

  return (
    <div className={`flippable-tile ${flipped ? 'flippable-tile--flipped' : ''}`}>
      <div className="flippable-tile__face flippable-tile__front">
        <img src={currentFrontSrc} alt={frontAlt} loading="lazy" />
      </div>
      <div className="flippable-tile__face flippable-tile__back">
        <img src={currentBackSrc} alt={frontAlt} loading="lazy" />
      </div>
    </div>
  );
}
