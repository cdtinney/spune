///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
import ProgressiveImage from 'react-progressive-image';
import PropTypes from 'prop-types';

function AlbumImage(props) {
  const {
    src,
    alt,
    className,
    width,
    height,
  } = props;

  return (
    <ProgressiveImage src={src}>
      {(src, loading) => {
        return (
          <img
            src={src}
            alt={alt}
            className={className}
            style={{
              height: `${height}px`,
              width: `${width}px`,
              opacity: loading ? 0 : '1',
              animation: loading ? '' : 'fadein 2s',
            }}
          />
        );
      }}
    </ProgressiveImage>
  );
}

AlbumImage.propTypes = {
  src: PropTypes.string.isRequired,
  className: PropTypes.string,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

AlbumImage.defaultProps = {
  className: undefined,
};

export default AlbumImage;
