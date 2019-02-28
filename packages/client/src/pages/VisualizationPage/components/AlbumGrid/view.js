///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import StackGrid from "react-stack-grid";
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
});

function AlbumGrid(props) {
  const {
    albums,
    classes,
  } = props;

  if (!albums.length) {
    return null;
  }

  const columnWidth = 150;
  const columnHeight = 150;

  return (
    <div className={classes.root}>
      <StackGrid
        columnWidth={columnWidth}
        gutterWidth={0}
        gutterHeight={0}
        duration={100}
        appearDelay={300}
      >
        {albums.map(album => (
          <AlbumImage
            key={album.images.fullSize}
            src={album.images.fullSize}
            placeholder={album.images.thumbnail}
            alt={album.title}
            width={columnWidth}
            height={columnHeight}
          />
        ))}
      </StackGrid>
    </div>
  );
}

AlbumGrid.propTypes = {
  albums: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    images: PropTypes.shape({
      fullSize: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired,
    }).isRequired,
  })).isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AlbumGrid);
