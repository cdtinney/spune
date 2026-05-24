import { describe, it, expect, vi } from 'vitest';
import runDiscovery from '../runDiscovery';
import type { DiscoveryContext, DiscoverySource } from '../types';

const mockContext = {} as DiscoveryContext;

function makeSource(name: string, priority: number, albums: { name: string }[]): DiscoverySource {
  return {
    name,
    priority,
    discover: vi.fn().mockResolvedValue(albums),
  };
}

describe('runDiscovery()', () => {
  it('returns albums sorted by source priority', async () => {
    const low = makeSource('low', 20, [{ name: 'C' }]);
    const high = makeSource('high', 5, [{ name: 'A' }]);
    const mid = makeSource('mid', 10, [{ name: 'B' }]);

    const albums = await runDiscovery([low, high, mid], mockContext);
    expect(albums.map((a) => a.name)).toEqual(['A', 'B', 'C']);
  });

  it('runs all sources in parallel', async () => {
    const s1 = makeSource('s1', 1, [{ name: 'X' }]);
    const s2 = makeSource('s2', 2, [{ name: 'Y' }]);

    await runDiscovery([s1, s2], mockContext);
    expect(s1.discover).toHaveBeenCalledWith(mockContext);
    expect(s2.discover).toHaveBeenCalledWith(mockContext);
  });

  it('returns empty albums when a source throws', async () => {
    const failing: DiscoverySource = {
      name: 'failing',
      priority: 1,
      discover: vi.fn().mockRejectedValue(new Error('boom')),
    };
    const working = makeSource('working', 2, [{ name: 'ok' }]);

    const albums = await runDiscovery([failing, working], mockContext);
    expect(albums.map((a) => a.name)).toEqual(['ok']);
  });

  it('returns empty array when no sources provided', async () => {
    const albums = await runDiscovery([], mockContext);
    expect(albums).toEqual([]);
  });
});
