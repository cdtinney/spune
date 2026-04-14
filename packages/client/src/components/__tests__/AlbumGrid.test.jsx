import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import AlbumGrid from '../AlbumGrid';

const mockTiles = [
  { id: 'a1_0_0', title: 'Album 1', imageUrl: 'http://img/1.jpg', col: 1, row: 1, span: 2 },
  { id: 'a2_0_1', title: 'Album 2', imageUrl: 'http://img/2.jpg', col: 3, row: 1, span: 1 },
];

describe('AlbumGrid', () => {
  it('renders images for each tile', () => {
    const { container } = render(
      <AlbumGrid tiles={mockTiles} gridCols={6} gridRows={6} base={120} />,
    );
    const images = container.querySelectorAll('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('alt', 'Album 1');
    expect(images[1]).toHaveAttribute('alt', 'Album 2');
  });

  it('returns null when tiles is empty', () => {
    const { container } = render(
      <AlbumGrid tiles={[]} gridCols={6} gridRows={6} base={120} />,
    );
    expect(container.innerHTML).toBe('');
  });
});
