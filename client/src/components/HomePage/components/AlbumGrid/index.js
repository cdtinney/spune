///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import StackGrid from "react-stack-grid";
import sizeMe from 'react-sizeme'
import { withStyles } from '@material-ui/core/styles';

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
});

function AlbumGrid(props) {
  const {
    albums,
    classes,
    size: {
      width: windowWidth,
    },
  } = props;

  if (!albums.length) {
    return null;
  }

  const numAlbums = albums.length;
  const maxColumns = 10;
  const numColumns = Math.min(maxColumns, numAlbums);

  // We need to round down to ensure there is no overflow.
  const columnWidth = Math.floor(windowWidth / numColumns);

  return (
    <div className={classes.root}>
      <StackGrid
        columnWidth={columnWidth}
        gutterWidth={0}
        gutterHeight={0}
        duration={100}
        appearDelay={50}
        monitorImagesLoaded={true}
      >
        {albums.map(album => (
          <img
            key={album.imageUrl}
            src={album.imageUrl}
            alt={album.title}
            className={classes.img}
            style={{
              width: `${columnWidth}px`,
            }}
          />
        ))}
      </StackGrid>
    </div>
  );
}

AlbumGrid.propTypes = {
  albums: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
  })).isRequired,
  classes: PropTypes.object.isRequired,
};

const AlbumGridWithSize = sizeMe()(AlbumGrid);
export default withStyles(styles)(AlbumGridWithSize);
