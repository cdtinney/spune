import * as nowPlayingSelectors from '../nowPlayingSelectors';

describe('nowPlayingSelectors', () => {
  describe('nowPlayingInfoSelector', () => {
    describe('when given valid input', () => {
      it('returns the `state.spotify.nowPlaying.info` property', () => {
        expect(nowPlayingSelectors.nowPlayingInfoSelector({
          spotify: {
            nowPlaying: {
              info: 'foo',
            },
          },
        })).toEqual('foo');
      });
    });
  });

  describe('nowPlayingRelatedAlbumArtists', () => {
    describe('when given valid input', () => {
      it('returns the `state.spotify.nowPlaying.relatedAlbums.byArtist` property', () => {
        expect(nowPlayingSelectors.nowPlayingRelatedAlbumArtists({
          spotify: {
            nowPlaying: {
              relatedAlbums: {
                byArtist: 'foo',
              },
            },
          },
        })).toEqual('foo');
      });
    });
  });

  describe('nowPlayingArtistNamesSelector', () => {
    const selectorFunc =
      nowPlayingSelectors.nowPlayingArtistNamesSelector.resultFunc;

    describe('when given valid input', () => {
      it('should return artist names joined by a comma and space', () => {
        expect(selectorFunc({
          songArtists: [{
            name: 'foo',
          }, {
            name: 'bar',
          }, {
            name: 'baz',
          }],
        })).toEqual('foo, bar, baz');
      });

      it('should return an empty string when given null songArtists', () => {
        expect(selectorFunc({
          songArtists: null,
        })).toEqual('');
      });
    });
  });

  describe('relatedAlbumImagesSelector', () => {
    describe('when given valid input', () => {
      it('should return album objects with title and images', () => {
        const selectorFunc =
          nowPlayingSelectors.relatedAlbumImagesSelector.resultFunc;
        expect(selectorFunc({
          fooArtist: {
            albums: [{
              name: 'foo',
              images: [{
                url: 'fooFullSize',
              }, {
                url: 'fooThumbnail',
              }],
            }],
          },
          barArtist: {
            albums: [{
              name: 'bar',
              images: [{
                url: 'barFullSize',
              }, {
                url: 'barThumbnail',
              }],
            }],
          },
        })).toEqual([{
          title: 'foo',
          images: {
            fullSize: 'fooFullSize',
            thumbnail: 'fooThumbnail',
          },
        }, {
          title: 'bar',
          images: {
            fullSize: 'barFullSize',
            thumbnail: 'barThumbnail',
          },
        }]);
      });
    });
  });
});
