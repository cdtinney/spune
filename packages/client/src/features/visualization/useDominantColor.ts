import { useState, useEffect } from 'react';

function extractDominantColor(img: HTMLImageElement): string | null {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Sample at a small size for performance
    canvas.width = 10;
    canvas.height = 10;
    ctx.drawImage(img, 0, 0, 10, 10);

    const data = ctx.getImageData(0, 0, 10, 10).data;

    // Average all pixel colors
    let r = 0,
      g = 0,
      b = 0;
    const pixelCount = data.length / 4;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }

    r = Math.round(r / pixelCount);
    g = Math.round(g / pixelCount);
    b = Math.round(b / pixelCount);

    return `rgb(${r}, ${g}, ${b})`;
  } catch {
    return null;
  }
}

export default function useDominantColor(imageUrl: string | undefined): string | null {
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setColor(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    const onLoad = () => setColor(extractDominantColor(img));

    if (img.complete) {
      onLoad();
    } else {
      img.addEventListener('load', onLoad);
      return () => img.removeEventListener('load', onLoad);
    }
  }, [imageUrl]);

  return color;
}
