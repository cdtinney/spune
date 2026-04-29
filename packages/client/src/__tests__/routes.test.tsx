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

describe('AppRoutes', () => {
  it('redirects / to /home', () => {
    mockUseUser();

    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText('LOG IN WITH SPOTIFY')).toBeInTheDocument();
  });

  it('redirects /visualization to / when not authenticated', () => {
    mockUseUser();

    render(
      <MemoryRouter initialEntries={['/visualization']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.queryByText('VisualizationPage')).not.toBeInTheDocument();
  });

  it('renders visualization page when authenticated', () => {
    mockUseUser({ user: { spotifyId: 'user1', displayName: 'Test' } });

    render(
      <MemoryRouter initialEntries={['/visualization']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText('VisualizationPage')).toBeInTheDocument();
  });

  it('redirects /admin to / when not authenticated', () => {
    mockUseUser();

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.queryByText('AdminPage')).not.toBeInTheDocument();
  });

  it('redirects /admin to /visualization when authenticated but not admin', () => {
    mockUseUser({ user: { spotifyId: 'user1', displayName: 'Test', isAdmin: false } });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.queryByText('AdminPage')).not.toBeInTheDocument();
    expect(screen.getByText('VisualizationPage')).toBeInTheDocument();
  });

  it('renders admin page when user is admin', () => {
    mockUseUser({ user: { spotifyId: 'user1', displayName: 'Test', isAdmin: true } });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText('AdminPage')).toBeInTheDocument();
  });

  it('renders error page', () => {
    mockUseUser();

    render(
      <MemoryRouter initialEntries={['/error/test%20error']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText('test error')).toBeInTheDocument();
  });
});
