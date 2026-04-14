import axios from 'axios';

export async function getAuthUser() {
  const response = await axios.get('/api/auth/user');
  return response.data.user || null;
}

export async function getPlaybackState() {
  const response = await axios.get('/api/spotify/me/player');
  return response.data;
}

export async function getRelatedAlbums(songId) {
  const response = await axios.get('/api/spotify/currently-playing/related-albums', {
    params: { songId },
  });
  return response.data;
}
