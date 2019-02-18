///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20px',
    boxShadow: '4px 4px 5px 0px rgba(0,0,0,0.29)',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    width: '250px',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
    height: 151,
  },
};

export function SongCard(props) {
  const {
    artistName,
    songTitle,
    albumName,
    albumImageUrl,
    classes,
  } = props;

  // TODO Handle undefined album cover
  
  return (
    <Card className={classes.card}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography variant="headline">
            {songTitle}
          </Typography>
          <Typography variant="subheading" color="textSecondary">
            {artistName}
          </Typography>
        </CardContent>
      </div>
      <CardMedia
        className={classes.cover}
        image={albumImageUrl}
        title={albumName}
      />
    </Card>
  );
}

SongCard.ropTypes = {
  artistName: PropTypes.string.isRequired,
  songTitle: PropTypes.string.isRequired,
  albumName: PropTypes.string,
  albumImageUrl: PropTypes.string,
};

export default withStyles(styles)(SongCard);
