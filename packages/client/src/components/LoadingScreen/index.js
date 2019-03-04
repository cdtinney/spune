import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from "@material-ui/core";

const styles = {};

export function LoadingScreen({ className }) {
  return (
    <CircularProgress
      classes={{
        root: className,
      }}
      color="primary"
    />
  );
}

LoadingScreen.propTypes = {
  className: PropTypes.string,
};

export default withStyles(styles)(LoadingScreen);
