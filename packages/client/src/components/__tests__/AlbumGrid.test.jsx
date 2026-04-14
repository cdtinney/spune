import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import AlbumGrid from '../AlbumGrid';

const mockAlbums = [
  { id: 'a1', title: 'Album 1', images: { fullSize: 'http://img/1.jpg', thumbnail: 'http://img/1s.jpg' } },
  { id: 'a2', title: 'Album 2', images: { fullSize: 'http://img/2.jpg', thumbnail: 'http://img/2s.jpg' } },
];

describe('AlbumGrid', () => {
  it('renders images for each album', () => {
    const { container } = render(<AlbumGrid albums={mockAlbums} imageSize={100} />);
    const images = container.querySelectorAll('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('alt', 'Album 1');
    expect(images[1]).toHaveAttribute('alt', 'Album 2');
  });

  it('returns null when albums is empty', () => {
    const { container } = render(<AlbumGrid albums={[]} imageSize={100} />);
    expect(container.innerHTML).toBe('');
  });
});
