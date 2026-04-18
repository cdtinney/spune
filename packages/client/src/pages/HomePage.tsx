import { Navigate } from 'react-router-dom';
import { useUser } from '../features/auth/UserContext';
import LoadingScreen from '../components/LoadingScreen';
import SpotifyLoginButton from '../features/auth/SpotifyLoginButton';
import spuneLogo from '../spune_logo.png';
import './HomePage.css';

export default function HomePage() {
  const { user, loading, error, login } = useUser();

  if (!loading && user) {
    return <Navigate to="/visualization" replace />;
  }

  return (
    <div className="home-page">
      <img alt="Spune Logo" src={spuneLogo} className="home-page__logo" />
      <div className="home-page__content">
        {loading && <LoadingScreen />}
        {!loading && error && (
          <p className="home-page__error">{`Failed to load (${error}). Try refreshing.`}</p>
        )}
        {!loading && !error && !user && <SpotifyLoginButton onClick={login} />}
      </div>
    </div>
  );
}
