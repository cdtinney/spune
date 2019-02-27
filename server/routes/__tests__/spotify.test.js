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

  describe('/currently-playing/related-albums', () => {
    it('returns with albums when given a user and song ID', (done) => {
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
