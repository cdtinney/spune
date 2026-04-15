import { useState, useEffect } from 'react';
import type { WindowSize } from '../types';

const RESIZE_DEBOUNCE_MS = 300;

export default function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = (): void => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      }, RESIZE_DEBOUNCE_MS);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return size;
}
