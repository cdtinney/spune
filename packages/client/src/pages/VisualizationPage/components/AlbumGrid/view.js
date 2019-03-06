///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

//////////////////////////
// Internal dependencies//
//////////////////////////

import AlbumImage from './components/AlbumImage';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -999,
    backgroundColor: theme.palette.background.paper,
  },
  albumRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  album: {

  },
});

function AlbumRow({
  classes,
  albums,
  albumSize,
}) {
  return (
    <div className={classes.albumRow}>
      {albums.map(album => (
        <AlbumImage
          key={album.id}
          src={album.images.fullSize}
          placeholder={album.images.thumbnail}
          alt={album.title}
          width={albumSize}
          height={albumSize}
        />
      ))}
    </div>
  );
}

function AlbumGrid(props) {
  const {
    classes,
    albums,
    ui: {
      albumSize,
    },
  } = props;

  if (!albums.length) {
    return null;
  }

  return (
    <div className={classes.root}>
      {albums.map(({ rowId, rowAlbums }) => {
        return (
          <AlbumRow
            key={rowId}
            classes={classes}
            albums={rowAlbums}
            albumSize={albumSize}
          />
        );
      })}
    </div>
  );
}

AlbumGrid.propTypes = {
  classes: PropTypes.object.isRequired,
  albums: PropTypes.arrayOf(
    PropTypes.shape({
      rowId: PropTypes.number.isRequired,
      rowAlbums: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        images: PropTypes.shape({
          fullSize: PropTypes.string.isRequired,
          thumbnail: PropTypes.string.isRequired,
        }).isRequired,
      })).isRequired,
    }).isRequired,
  ).isRequired,
  ui: PropTypes.shape({
    albumSize: PropTypes.number.isRequired,
  }).isRequired,
};

export default withStyles(styles)(AlbumGrid);
