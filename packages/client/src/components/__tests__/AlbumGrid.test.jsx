import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import AlbumGrid from '../AlbumGrid';

const mockAlbums = [
  { id: 'a1', title: 'Album 1', span: 2, imageUrl: 'http://img/1.jpg' },
  { id: 'a2', title: 'Album 2', span: 1, imageUrl: 'http://img/2.jpg' },
];

describe('AlbumGrid', () => {
  it('renders images for each album', () => {
    const { container } = render(<AlbumGrid albums={mockAlbums} baseUnit={80} cols={20} />);
    const images = container.querySelectorAll('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('alt', 'Album 1');
    expect(images[1]).toHaveAttribute('alt', 'Album 2');
  });

  it('returns null when albums is empty', () => {
    const { container } = render(<AlbumGrid albums={[]} baseUnit={80} cols={20} />);
    expect(container.innerHTML).toBe('');
  });
});
