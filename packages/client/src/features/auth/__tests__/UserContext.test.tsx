import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProvider, useUser } from '../UserContext';
import * as api from '../api';

vi.mock('../api');

const mockedApi = vi.mocked(api, true);

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

function renderWithProvider() {
  return render(
    <UserProvider>
      <TestConsumer />
    </UserProvider>,
  );
}

async function waitForLoaded() {
  await waitFor(() => {
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });
}

describe('UserContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'location', {
      value: { assign: vi.fn() },
      writable: true,
      configurable: true,
    });
  });

  it('fetches user on mount and provides profile', async () => {
    mockedApi.getAuthUser.mockResolvedValue({ spotifyId: 'user1' });

    renderWithProvider();

    expect(screen.getByTestId('loading')).toHaveTextContent('true');

    await waitForLoaded();
    expect(screen.getByTestId('user')).toHaveTextContent('user1');
  });

  it('sets error when auth check fails', async () => {
    mockedApi.getAuthUser.mockRejectedValue({ message: 'Network error' });

    renderWithProvider();

    await waitForLoaded();
    expect(screen.getByTestId('error')).toHaveTextContent('Network error');
  });

  it('login navigates to auth endpoint', async () => {
    mockedApi.getAuthUser.mockResolvedValue(null);

    renderWithProvider();

    await waitForLoaded();

    await userEvent.click(screen.getByText('Login'));
    expect(window.location.assign).toHaveBeenCalledWith('/api/auth/spotify');
  });

  it('logout navigates to logout endpoint', async () => {
    mockedApi.getAuthUser.mockResolvedValue({ spotifyId: 'user1' });

    renderWithProvider();

    await waitForLoaded();

    await userEvent.click(screen.getByText('Logout'));
    expect(window.location.assign).toHaveBeenCalledWith('/api/auth/user/logout');
  });
});
