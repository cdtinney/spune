import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import AlbumGrid from '../AlbumGrid';

const mockColumns = [
  {
    width: 140,
    direction: 'up',
    duration: 70,
    tiles: [
      { id: 'a1_c0_t0', title: 'Album 1', imageUrl: 'http://img/1.jpg' },
      { id: 'a2_c0_t1', title: 'Album 2', imageUrl: 'http://img/2.jpg' },
    ],
  },
];

describe('AlbumGrid', () => {
  it('renders images for each album tile', () => {
    const { container } = render(<AlbumGrid columns={mockColumns} />);
    const images = container.querySelectorAll('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('alt', 'Album 1');
    expect(images[1]).toHaveAttribute('alt', 'Album 2');
  });

  it('returns null when columns is empty', () => {
    const { container } = render(<AlbumGrid columns={[]} />);
    expect(container.innerHTML).toBe('');
  });
});
