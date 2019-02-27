let spotifyApiWithToken =
  require('../../spotify/api/SpotifyApi').spotifyApiWithToken;
const apiRequestWithRefresh =
  require('../../spotify/api/helpers/apiRequestWithRefresh');
const getCurrentlyPlayingRelatedAlbums =
  require('../../spotify/api/helpers/getCurrentlyPlayingRelatedAlbums');
const spotify = require('../spotify');

jest.mock('../../spotify/api/helpers/apiRequestWithRefresh');
jest.mock('../../spotify/api/helpers/getCurrentlyPlayingRelatedAlbums');
const mockResponse = {
  send: jest.fn(),
};

describe('/spotify', () => {
  it('initializes routes without errors when given a router', () => {
    const mockRouter = {
      get: jest.fn(),
    };

    spotify(mockRouter);
  });

  describe('/spotify/currently-playing/', () => {
    describe('/spotify/currently-playing/related-albums', () => {
      it('requests with albums for a song when given a user and song ID', (done) => {
        const request = {
          query: {
            songId: 'foo',
          },
          user: {
            accessToken: 'bar'
          },
        };

        mockResponse.send.mockImplementation(() => {
          done();
        });
        const mockNext = jest.fn().mockImplementation(done);

        apiRequestWithRefresh.mockImplementation((args) => {
          const {
            user,
            apiFn,
            handleSuccess,
          } = args;

          apiFn(user.accessToken);
          expect(getCurrentlyPlayingRelatedAlbums.mock.calls[0][1]).toEqual(request.query.songId);

          handleSuccess('success');
          expect(mockResponse.send).toHaveBeenCalledWith('success');

          done();
        });

        spotify.currentlyPlayingRelatedAlbums(request, mockResponse, mockNext);
      });

      it('returns with 401 when given a user without an access token', (done) => {
        const request = {
          query: {
            songId: 'foo',
          },
          user: {
            accessToken: undefined,
          },
        };

        const mockEnd = jest.fn();
        const mockJson = jest.fn().mockImplementation(() => ({
          end: mockEnd,
        }));
        const mockStatus = jest.fn().mockImplementation(() => ({
          json: mockJson,
        }));

        mockResponse.status = mockStatus;

        apiRequestWithRefresh.mockImplementation((args) => {
          const {
            handleAuthFailure,
          } = args;

          handleAuthFailure('foo');
          expect(mockStatus).toHaveBeenCalledWith(401);
          expect(mockJson).toHaveBeenCalledWith('foo');
          done();
        });

        spotify.currentlyPlayingRelatedAlbums(request, mockResponse, null);
      });

      it('calls next() when non-auth errors are thrown', (done) => {
        const request = {
          query: {
            songId: 'foo',
          },
          user: {
            accessToken: undefined,
          },
        };

        const mockNext = jest.fn();

        apiRequestWithRefresh.mockImplementation((args) => {
          const {
            handleError,
          } = args;

          handleError('foo');
          expect(mockNext).toHaveBeenCalledWith('foo');
          done();
        });

        spotify.currentlyPlayingRelatedAlbums(request, mockResponse, mockNext);
      });
    });
  });

  describe('/spotify/me', () => {
    it('requests the users profile when given a user', (done) => {
      const request = {
        user: {
          id: 'foo',
          accessToken: 'bar',
        },
      };

      mockResponse.send.mockImplementation(() => {
        done();
      });

      apiRequestWithRefresh.mockImplementation((args) => {
        const {
          handleSuccess,
        } = args;

        handleSuccess({
          body: 'success',
        });
        expect(mockResponse.send).toHaveBeenCalledWith('success');

        done();
      });

      spotify.me(request, mockResponse, jest.fn().mockImplementation(done));
    });

    it('returns with 401 when given a user without an access token', (done) => {
      const request = {
        query: {
          songId: 'foo',
        },
        user: {
          accessToken: undefined,
        },
      };

      const mockEnd = jest.fn();
      const mockJson = jest.fn().mockImplementation(() => ({
        end: mockEnd,
      }));
      const mockStatus = jest.fn().mockImplementation(() => ({
        json: mockJson,
      }));

      mockResponse.status = mockStatus;

      apiRequestWithRefresh.mockImplementation((args) => {
        const {
          handleAuthFailure,
        } = args;

        handleAuthFailure('foo');
        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith('foo');
        done();
      });

      spotify.me(request, mockResponse, null);
    });

    it('calls next() when non-auth errors are thrown', (done) => {
      const request = {
        query: {
          songId: 'foo',
        },
        user: {
          accessToken: undefined,
        },
      };

      const mockNext = jest.fn();

      apiRequestWithRefresh.mockImplementation((args) => {
        const {
          handleError,
        } = args;

        handleError('foo');
        expect(mockNext).toHaveBeenCalledWith('foo');
        done();
      });

      spotify.me(request, mockResponse, mockNext);
    });
  });

  describe('/spotify/me/player', () => {
    it('requests the users player when given a user', (done) => {
      const request = {
        user: {
          id: 'foo',
          accessToken: 'bar',
        },
      };

      mockResponse.send.mockImplementation(() => {
        done();
      });

      apiRequestWithRefresh.mockImplementation((args) => {
        const {
          handleSuccess,
        } = args;

        handleSuccess({
          body: 'success',
        });
        expect(mockResponse.send).toHaveBeenCalledWith('success');

        done();
      });

      spotify.mePlayer(request, mockResponse, jest.fn().mockImplementation(done));
    });

    it('returns with 401 when given a user without an access token', (done) => {
      const request = {
        query: {
          songId: 'foo',
        },
        user: {
          accessToken: undefined,
        },
      };

      const mockEnd = jest.fn();
      const mockJson = jest.fn().mockImplementation(() => ({
        end: mockEnd,
      }));
      const mockStatus = jest.fn().mockImplementation(() => ({
        json: mockJson,
      }));

      mockResponse.status = mockStatus;

      apiRequestWithRefresh.mockImplementation((args) => {
        const {
          handleAuthFailure,
        } = args;

        handleAuthFailure('foo');
        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith('foo');
        done();
      });

      spotify.mePlayer(request, mockResponse, null);
    });

    it('calls next() when non-auth errors are thrown', (done) => {
      const request = {
        query: {
          songId: 'foo',
        },
        user: {
          accessToken: undefined,
        },
      };

      const mockNext = jest.fn();

      apiRequestWithRefresh.mockImplementation((args) => {
        const {
          handleError,
        } = args;

        handleError('foo');
        expect(mockNext).toHaveBeenCalledWith('foo');
        done();
      });

      spotify.mePlayer(request, mockResponse, mockNext);
    });
  });
});
