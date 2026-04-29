import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from '../routes';
import { mockUseUser } from './helpers/mockUserContext';

vi.mock('../features/auth/UserContext');
vi.mock('../pages/VisualizationPage', () => ({
  default: () => <div>VisualizationPage</div>,
}));
vi.mock('../pages/AdminPage', () => ({
  default: () => <div>AdminPage</div>,
}));

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('AppRoutes', () => {
  it('redirects / to /home', () => {
    mockUseUser();
    renderAt('/');
    expect(screen.getByText('LOG IN WITH SPOTIFY')).toBeInTheDocument();
  });

  it('redirects /visualization to / when not authenticated', () => {
    mockUseUser();
    renderAt('/visualization');
    expect(screen.queryByText('VisualizationPage')).not.toBeInTheDocument();
  });

  it('renders visualization page when authenticated', () => {
    mockUseUser({ user: { spotifyId: 'user1', displayName: 'Test' } });
    renderAt('/visualization');
    expect(screen.getByText('VisualizationPage')).toBeInTheDocument();
  });

  it('redirects /admin to / when not authenticated', () => {
    mockUseUser();
    renderAt('/admin');
    expect(screen.queryByText('AdminPage')).not.toBeInTheDocument();
  });

  it('redirects /admin to /visualization when authenticated but not admin', () => {
    mockUseUser({ user: { spotifyId: 'user1', displayName: 'Test', isAdmin: false } });
    renderAt('/admin');
    expect(screen.queryByText('AdminPage')).not.toBeInTheDocument();
    expect(screen.getByText('VisualizationPage')).toBeInTheDocument();
  });

  it('renders admin page when user is admin', () => {
    mockUseUser({ user: { spotifyId: 'user1', displayName: 'Test', isAdmin: true } });
    renderAt('/admin');
    expect(screen.getByText('AdminPage')).toBeInTheDocument();
  });

  it('renders error page', () => {
    mockUseUser();
    renderAt('/error/test%20error');
    expect(screen.getByText('test error')).toBeInTheDocument();
  });
});
