import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from '../routes';
import * as UserContext from '../contexts/UserContext';

vi.mock('../contexts/UserContext');
vi.mock('../pages/VisualizationPage', () => ({
  default: () => <div>VisualizationPage</div>,
}));

const mockedUserContext = vi.mocked(UserContext, true);

describe('AppRoutes', () => {
  it('redirects / to /home', () => {
    mockedUserContext.useUser.mockReturnValue({
      user: null,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText('LOG IN WITH SPOTIFY')).toBeInTheDocument();
  });

  it('redirects /visualization to / when not authenticated', () => {
    mockedUserContext.useUser.mockReturnValue({
      user: null,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/visualization']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.queryByText('VisualizationPage')).not.toBeInTheDocument();
  });

  it('renders visualization page when authenticated', () => {
    mockedUserContext.useUser.mockReturnValue({
      user: { spotifyId: 'user1', displayName: 'Test' },
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/visualization']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText('VisualizationPage')).toBeInTheDocument();
  });

  it('renders error page', () => {
    mockedUserContext.useUser.mockReturnValue({
      user: null,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/error/test%20error']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByText('test error')).toBeInTheDocument();
  });
});
