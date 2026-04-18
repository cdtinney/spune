import { SpotifyProvider } from '../features/playback/SpotifyContext';
import VisualizationContent from './VisualizationContent';

export default function VisualizationPage() {
  return (
    <SpotifyProvider>
      <VisualizationContent />
    </SpotifyProvider>
  );
}
