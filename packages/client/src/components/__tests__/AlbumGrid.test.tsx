import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import AlbumGrid from '../AlbumGrid';
import type { Album } from '../../types';

const mockTiles: Album[] = [
  { id: 'a1_0_0', title: 'Album 1', imageUrl: 'http://img/1.jpg', col: 1, row: 1, span: 2 },
  { id: 'a2_0_1', title: 'Album 2', imageUrl: 'http://img/2.jpg', col: 3, row: 1, span: 1 },
];

describe('AlbumGrid', () => {
  it('renders a tile for each album', () => {
    const { container } = render(
      <AlbumGrid tiles={mockTiles} gridCols={6} gridRows={6} base={120} />,
    );
    const tiles = container.querySelectorAll('.album-grid__tile');
    expect(tiles).toHaveLength(2);
    // Each FlippableTile has front and back faces with images
    const images = container.querySelectorAll('img[alt="Album 1"]');
    expect(images.length).toBeGreaterThanOrEqual(1);
  });

  it('returns null when tiles is empty', () => {
    const { container } = render(<AlbumGrid tiles={[]} gridCols={6} gridRows={6} base={120} />);
    expect(container.innerHTML).toBe('');
  });
});
