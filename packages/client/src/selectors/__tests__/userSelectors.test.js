import * as userSelectors from '../userSelectors';

describe('userSelectors', () => {
  describe('userSelectors.userAuthenticated', () => {
    function mockState({
      errored = false,
      lastUpdated = null,
      id = null,
    }) {
      return {
        spotify: {
          user: {
            request: {
              errored,
              lastUpdated,
            },
            info: {
              id,
            },
          },
        },
      };
    }
    
    describe('when given valid input objects', () => {
      it('returns true when errored is false and lastUpdated and id are not null', () => {
        expect(userSelectors.userAuthenticated(mockState({
          lastUpdated: 123,
          id: 123,
        }))).toBeTruthy();
      });
      
      it('returns false when errored is true and lastUpdated and id are not null', () => {
        expect(userSelectors.userAuthenticated(mockState({
          errored: true,
          lastUpdated: 123,
          id: 123,
        }))).toBeFalsy();
      });

      it('returns false when errored is false and lastUpdated is null and id is not null', () => {
        expect(userSelectors.userAuthenticated(mockState({
          id: 123,
        }))).toBeFalsy();
      });

      it('returns false when errored is false, lastUpdated is not null, and id is null', () => {
        expect(userSelectors.userAuthenticated(mockState({
          lastUpdated: 123,
        }))).toBeFalsy();
      });

      it('returns false when errored is true and lastUpdated and id are null', () => {
        expect(userSelectors.userAuthenticated(mockState({
          errored: true,
        }))).toBeFalsy();
      });

      it('returns false when errored is false, lastUpdated is null, and id is null', () => {
        expect(userSelectors.userAuthenticated(mockState({}))).toBeFalsy();
      });
    });
  });
});
