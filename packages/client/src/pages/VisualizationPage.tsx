import { SpotifyProvider } from '../contexts/SpotifyContext';
import VisualizationContent from './VisualizationContent';

export default function VisualizationPage() {
  return (
    <SpotifyProvider>
      <VisualizationContent />
    </SpotifyProvider>
  );
}
