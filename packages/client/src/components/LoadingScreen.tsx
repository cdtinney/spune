import './LoadingScreen.css';

interface LoadingScreenProps {
  className?: string;
}

export default function LoadingScreen({ className = '' }: LoadingScreenProps) {
  return (
    <div className={`loading-screen ${className}`}>
      <div className="loading-spinner" />
    </div>
  );
}
