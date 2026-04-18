import { useState, useEffect, useRef } from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  progressMs: number;
  durationMs: number;
  isPlaying: boolean;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function ProgressBar({ progressMs, durationMs, isPlaying }: ProgressBarProps) {
  const [localProgress, setLocalProgress] = useState(progressMs);
  const lastSyncRef = useRef(Date.now());

  // Sync with server value when it changes
  useEffect(() => {
    setLocalProgress(progressMs);
    lastSyncRef.current = Date.now();
  }, [progressMs]);

  // Tick every second when playing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setLocalProgress((prev) => Math.min(prev + 1000, durationMs));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, durationMs]);

  const percent = durationMs > 0 ? (localProgress / durationMs) * 100 : 0;

  return (
    <div className="progress-bar" data-testid="progress-bar">
      <span className="progress-bar__time">{formatTime(localProgress)}</span>
      <div className="progress-bar__track">
        <div className="progress-bar__fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="progress-bar__time">{formatTime(durationMs)}</span>
    </div>
  );
}
