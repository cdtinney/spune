export const mockGetMe = jest.fn();
export const mockGetCurrentlyPlayingRelatedAlbums = jest.fn();
export const mockGetMyCurrentPlaybackState = jest.fn();

const mockClass = jest.fn().mockImplementation(() => {
  return {
    getMe: mockGetMe,
    getCurrentlyPlayingRelatedAlbums: mockGetCurrentlyPlayingRelatedAlbums,
    getMyCurrentPlaybackState: mockGetMyCurrentPlaybackState,
  };
});

export default mockClass;
