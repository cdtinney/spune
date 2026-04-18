import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../HomePage';
import { mockUseUser } from '../../__tests__/helpers/mockUserContext';

vi.mock('../../features/auth/UserContext');

describe('HomePage', () => {
  it('shows loading screen while auth is pending', () => {
    mockUseUser({ loading: true });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(document.querySelector('.loading-spinner')).toBeInTheDocument();
  });

  it('shows login button when not authenticated', () => {
    mockUseUser();

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByText('LOG IN WITH SPOTIFY')).toBeInTheDocument();
  });

  it('shows error message when auth check fails', () => {
    mockUseUser({ error: 'Unauthorized' });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Failed to load/)).toBeInTheDocument();
    expect(screen.getByText(/Unauthorized/)).toBeInTheDocument();
  });

  it('redirects to visualization when authenticated', () => {
    mockUseUser({ user: { spotifyId: 'user1', displayName: 'Test' } });

    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(container.querySelector('.home-page')).not.toBeInTheDocument();
  });
});
