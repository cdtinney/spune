import { vi } from 'vitest';
import type { UserProfile } from '../../types';
import * as UserContext from '../../features/auth/UserContext';

export function mockUseUser(
  overrides: Partial<{
    user: UserProfile | null;
    loading: boolean;
    error: string | null;
    login: () => void;
    logout: () => void;
  }> = {},
) {
  const mockedUserContext = vi.mocked(UserContext, true);
  mockedUserContext.useUser.mockReturnValue({
    user: null,
    loading: false,
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  });
}
