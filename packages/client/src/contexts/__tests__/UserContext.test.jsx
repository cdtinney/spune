import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProvider, useUser } from '../UserContext';
import * as api from '../../api/spotify';

vi.mock('../../api/spotify');

function TestConsumer() {
  const { user, loading, error, login, logout } = useUser();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? user.spotifyId : 'null'}</span>
      <span data-testid="error">{error || 'null'}</span>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('UserContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete window.location;
    window.location = { assign: vi.fn() };
  });

  it('fetches user on mount and provides profile', async () => {
    api.getAuthUser.mockResolvedValue({ spotifyId: 'user1' });

    render(
      <UserProvider>
        <TestConsumer />
      </UserProvider>,
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('true');

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    expect(screen.getByTestId('user')).toHaveTextContent('user1');
  });

  it('sets error when auth check fails', async () => {
    api.getAuthUser.mockRejectedValue({ message: 'Network error' });

    render(
      <UserProvider>
        <TestConsumer />
      </UserProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    expect(screen.getByTestId('error')).toHaveTextContent('Network error');
  });

  it('login navigates to auth endpoint', async () => {
    api.getAuthUser.mockResolvedValue(null);

    render(
      <UserProvider>
        <TestConsumer />
      </UserProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    await userEvent.click(screen.getByText('Login'));
    expect(window.location.assign).toHaveBeenCalledWith('api/auth/spotify');
  });

  it('logout navigates to logout endpoint', async () => {
    api.getAuthUser.mockResolvedValue({ spotifyId: 'user1' });

    render(
      <UserProvider>
        <TestConsumer />
      </UserProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    await userEvent.click(screen.getByText('Logout'));
    expect(window.location.assign).toHaveBeenCalledWith('/api/auth/user/logout');
  });
});
