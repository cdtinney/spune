import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import AlbumGrid from '../AlbumGrid';

const mockBands = [
  {
    cols: 10,
    direction: 'left',
    duration: 70,
    tiles: [
      { id: 'a1_b0_t0', title: 'Album 1', span: 2, imageUrl: 'http://img/1.jpg' },
      { id: 'a2_b0_t1', title: 'Album 2', span: 1, imageUrl: 'http://img/2.jpg' },
    ],
  },
];

describe('AlbumGrid', () => {
  it('renders images for each album tile', () => {
    const { container } = render(<AlbumGrid bands={mockBands} base={80} bandRows={4} />);
    const images = container.querySelectorAll('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('alt', 'Album 1');
    expect(images[1]).toHaveAttribute('alt', 'Album 2');
  });

  it('returns null when bands is empty', () => {
    const { container } = render(<AlbumGrid bands={[]} base={80} bandRows={4} />);
    expect(container.innerHTML).toBe('');
  });
});
