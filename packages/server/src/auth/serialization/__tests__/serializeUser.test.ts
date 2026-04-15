import { describe, it, expect, vi } from 'vitest';
import serializeUser from '../serializeUser';

describe('serializeUser()', () => {
  it('serializes spotifyId and calls done() when given a valid user object', () => {
    const mockDone = vi.fn();
    serializeUser(
      {
        spotifyId: 'foo',
      },
      mockDone,
    );
    expect(mockDone).toHaveBeenCalledWith(null, 'foo'); // First arg is error
  });
});
