import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../HomePage';
import * as UserContext from '../../contexts/UserContext';

vi.mock('../../contexts/UserContext');

const mockedUserContext = vi.mocked(UserContext, true);

describe('HomePage', () => {
  it('shows loading screen while auth is pending', () => {
    mockedUserContext.useUser.mockReturnValue({
      user: null,
      loading: true,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(document.querySelector('.loading-spinner')).toBeInTheDocument();
  });

  it('shows login button when not authenticated', () => {
    mockedUserContext.useUser.mockReturnValue({
      user: null,
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByText('LOG IN WITH SPOTIFY')).toBeInTheDocument();
  });

  it('shows error message when auth check fails', () => {
    mockedUserContext.useUser.mockReturnValue({
      user: null,
      loading: false,
      error: 'Unauthorized',
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Failed to load/)).toBeInTheDocument();
    expect(screen.getByText(/Unauthorized/)).toBeInTheDocument();
  });

  it('redirects to visualization when authenticated', () => {
    mockedUserContext.useUser.mockReturnValue({
      user: { spotifyId: 'user1', displayName: 'Test' },
      loading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(container.querySelector('.home-page')).not.toBeInTheDocument();
  });
});
