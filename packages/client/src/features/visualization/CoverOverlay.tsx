import './CoverOverlay.css';

interface CoverOverlayProps {
  dominantColor?: string | null;
}

export default function CoverOverlay({ dominantColor }: CoverOverlayProps) {
  const overlayStyle = dominantColor
    ? {
        background: `radial-gradient(ellipse at center, ${dominantColor} 0%, transparent 70%)`,
        opacity: 0.4,
      }
    : undefined;

  return (
    <div className="cover-overlay" data-testid="cover-overlay">
      <div className="cover-overlay__gradient" />
      {dominantColor && <div className="cover-overlay__color" style={overlayStyle} />}
      <div className="cover-overlay__darken" />
    </div>
  );
}
