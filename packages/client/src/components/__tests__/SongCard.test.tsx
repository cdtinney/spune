import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SongCard from '../SongCard';

describe('SongCard', () => {
  it('renders song info', () => {
    render(
      <SongCard
        artistName="Test Artist"
        songTitle="Test Song"
        albumName="Test Album"
        albumImageUrl="http://img/cover.jpg"
      />,
    );

    expect(screen.getByText('TEST ARTIST')).toBeInTheDocument();
    expect(screen.getByText('TEST ALBUM')).toBeInTheDocument();
    expect(screen.getByText('Test Song')).toBeInTheDocument();
  });
});
