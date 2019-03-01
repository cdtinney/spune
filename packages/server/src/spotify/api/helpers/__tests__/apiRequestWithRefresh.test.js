/* eslint-disable prefer-promise-reject-errors */

const refreshToken = require('../../../auth/refreshToken');
const apiRequestWithRefresh = require('../apiRequestWithRefresh');

jest.mock('../../../auth/refreshToken');

describe('apiRequestWithRefresh', () => {
  it('calls handleSuccess when the user has a token and the API function succeeds', (done) => {
    apiRequestWithRefresh({
      user: {
        spotifyAccessToken: 'foo',
      },
      handleSuccess: (response) => {
        expect(response).toEqual('success');
        done();
      },
      apiFn: () => Promise.resolve('success'),
    });
  });

  it('refreshes the token and retries when an API request returns 401', (done) => {
    const user = {
      spotifyAccessToken: 'fooAccess',
      spotifyRefreshToken: 'barRefresh',
    };

    refreshToken.mockImplementation(() => Promise.resolve(user));

    let apiCallCount = 0;
    apiRequestWithRefresh({
      user,
      handleSuccess: (response) => {
        expect(refreshToken).toHaveBeenCalledWith('barRefresh');
        expect(response).toEqual('success');
        done();
      },
      apiFn: () => {
        if (apiCallCount === 0) {
          apiCallCount += 1;
          return Promise.reject({
            statusCode: 401,
          });
        }

        return Promise.resolve('success');
      },
    });
  });

  it('calls handleAuthFailure when the user has an expired token and the request fails three times', (done) => {
    const user = {
      spotifyAccessToken: 'fooAccess',
      spotifyRefreshToken: 'barRefresh',
    };

    refreshToken.mockImplementation(() => Promise.resolve(user));

    apiRequestWithRefresh({
      user,
      handleAuthFailure: (error) => {
        expect(error).toEqual('Retries exceeded');
        done();
      },
      apiFn: () => Promise.reject({
        statusCode: 401,
      }),
    });
  });

  it('calls handleError when the user does not have a token', () => {
    const user = {
      spotifyAccessToken: undefined,
    };

    const mockHandleError = jest.fn();
    apiRequestWithRefresh({
      user,
      handleError: error => mockHandleError(error),
    });

    expect(mockHandleError).toHaveBeenCalled();
  });

  it('calls handleError when refreshing throws errors', (done) => {
    const user = {
      spotifyAccessToken: 'foo',
      spotifyRefreshToken: 'bar',
    };

    refreshToken.mockImplementation(() => Promise.reject('error'));

    const mockHandleError = jest.fn().mockImplementation((error) => {
      expect(error).toEqual('error');
      done();
    });

    apiRequestWithRefresh({
      user,
      apiFn: () => Promise.reject({
        statusCode: 401,
      }),
      handleError: error => mockHandleError(error),
    });
  });
});
