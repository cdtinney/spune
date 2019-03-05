import partitionAlbums from '../partitionAlbums';

describe('partitionAlbums()', () => {
  it('does not modify the original albums array', () => {
    const albums = [{
      id: 'foo',
    }, {
      id: 'bar',
    }];
    partitionAlbums({
      albums,
      numCols: 1,
    });
    expect(albums.length).toEqual(2);
  });

  it('partitions the array into 2D array of equal lengths when given a clean divisor', () => {
    const albums = [ 'foo', 'bar', 'bat', 'cat' ];
    expect(partitionAlbums({
      albums,
      numCols: 2,
    })).toEqual([{
      rowId: 4,
      rowAlbums: [ 'foo', 'bar' ],
    }, {
      rowId: 2,
      rowAlbums: [ 'bat', 'cat' ],
    }]);
  });

  it('places remaining albums in final partition when given a non-clean divisor', () => {
    const albums = [ 'foo', 'bar', 'bat', 'cat', 'caz' ];
    expect(partitionAlbums({
      albums,
      numCols: 2,
    })).toEqual([{
      rowId: 5,
      rowAlbums: [ 'foo', 'bar' ],
    }, {
      rowId: 3,
      rowAlbums: [ 'bat', 'cat' ],
    }, {
      rowId: 1,
      rowAlbums: [ 'caz' ],
    }]);
  });
});
