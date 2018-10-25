///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
import PropTypes from 'prop-types';

export default function AlbumImage(props) {
  const {
    src,
    alt,
    className,
    width,
    height,
  } = props;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{
        height: `${height}px`,
        width: `${width}px`,
      }}
    />
  );
}

AlbumImage.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};
