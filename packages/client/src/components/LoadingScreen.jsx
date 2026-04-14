import './LoadingScreen.css';

export default function LoadingScreen({ className = '' }) {
  return (
    <div className={`loading-screen ${className}`}>
      <div className="loading-spinner" />
    </div>
  );
}
