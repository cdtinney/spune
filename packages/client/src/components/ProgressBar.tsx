import './ProgressBar.css';

interface ProgressBarProps {
  progressMs: number;
  durationMs: number;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function ProgressBar({ progressMs, durationMs }: ProgressBarProps) {
  const percent = durationMs > 0 ? (progressMs / durationMs) * 100 : 0;

  return (
    <div className="progress-bar">
      <span className="progress-bar__time">{formatTime(progressMs)}</span>
      <div className="progress-bar__track">
        <div
          className="progress-bar__fill"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="progress-bar__time">{formatTime(durationMs)}</span>
    </div>
  );
}
