import { HashRouter } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import AppRoutes from './routes';
import './App.css';

export default function App() {
  return (
    <HashRouter>
      <UserProvider>
        <div className="app">
          <div className="app__content">
            <AppRoutes />
          </div>
        </div>
      </UserProvider>
    </HashRouter>
  );
}
