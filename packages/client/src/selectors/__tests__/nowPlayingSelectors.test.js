import * as nowPlayingSelectors from '../nowPlayingSelectors';

describe('nowPlayingSelectors', () => {
  describe('nowPlayingInfoSelector()', () => {
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

  describe('nowPlayingRelatedAlbumsByAlbumId()', () => {
    describe('when given valid input', () => {
      it('returns the `state.spotify.nowPlaying.relatedAlbums.byAlbumId` property', () => {
        expect(nowPlayingSelectors.nowPlayingRelatedAlbumsByAlbumId({
          spotify: {
            nowPlaying: {
              relatedAlbums: {
                byAlbumId: {
                  'foo': {
                    id: 'foo',
                  },
                },
              },
            },
          },
        })).toEqual({
          'foo': {
            id: 'foo',
          },
        });
      });
    });
  });

  describe('nowPlayingArtistNamesSelector()', () => {
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

  describe('relatedAlbumImagesSelector()', () => {
    describe('when given valid input', () => {
      it('should return displayed album objects with title and images', () => {
        const selectorFunc =
          nowPlayingSelectors.relatedAlbumImagesSelector.resultFunc;
        expect(selectorFunc({
          'foo': {
            id: 'fooId',
            name: 'foo',
            images: [{
              url: 'fooFullSize',
            }, {
              url: 'fooThumbnail',
            }],
          },
          'bar': {
            id: 'barId',
            name: 'bar',
            images: [{
              url: 'barFullSize',
            }, {
              url: 'barThumbnail',
            }],
          },
        }, [ 'bar', 'foo' ])).toEqual([{
          id: 'barId_0',
          title: 'bar',
          images: {
            fullSize: 'barFullSize',
            thumbnail: 'barThumbnail',
          },
        }, {
          id: 'fooId_1',
          title: 'foo',
          images: {
            fullSize: 'fooFullSize',
            thumbnail: 'fooThumbnail',
          },
        }]);
      });
    });
  });
});
