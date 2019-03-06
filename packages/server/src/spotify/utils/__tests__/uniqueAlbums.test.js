const uniqueAlbums = require('../uniqueAlbums');

describe('baseAlbumName()', () => {
  it('strips out suffixes in normal braces', () => {
    uniqueAlbums.typesWithSuffixes.forEach((entry) => {
      expect(uniqueAlbums.baseAlbumName(`foo (${entry})`)).toEqual('foo');
    });
  });

  it('strips out suffixes in square braces', () => {
    uniqueAlbums.typesWithSuffixes.forEach((entry) => {
      expect(uniqueAlbums.baseAlbumName(`foo [${entry}]`)).toEqual('foo');
    });
  });
});

describe('uniqueAlbums()', () => {
  it('removes all duplicates with the same base album name', () => {
    const originalAlbum = {
      name: 'foo',
    };
    const duplicates = uniqueAlbums.typesWithSuffixes.map(entry => ({ name: `foo (${entry})` }));

    expect(uniqueAlbums([
      originalAlbum,
      ...duplicates,
    ])).toEqual([{
      name: 'foo',
    }]);
  });
});
