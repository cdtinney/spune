const combineTrackArtists = require('../combineTrackArtists');

describe('combineTrackArtists', () => {
  it('returns a combined array of artist IDs', () => {
    expect(combineTrackArtists({
      songArtists: [{
        id: 'foo1',
      }, {
        id: 'foo2',
      }],
      albumArtists: [{
        id: 'bar1',
      }, {
        id: 'bar2',
      }],
    })).toEqual([
      'foo1', 'foo2', 'bar1', 'bar2',
    ]);
  });

  it('removes duplicate artist IDs', () => {
    expect(combineTrackArtists({
      songArtists: [{
        id: 'foo1',
      }, {
        id: 'foo2',
      }],
      albumArtists: [{
        id: 'foo1',
      }, {
        id: 'foo2',
      }],
    })).toEqual([
      'foo1', 'foo2'
    ]);
  });
});
