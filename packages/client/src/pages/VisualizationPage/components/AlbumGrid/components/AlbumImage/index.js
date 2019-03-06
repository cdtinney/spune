///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import ProgressiveImage from 'react-progressive-image';

function AlbumImage(props) {
  const {
    src,
    placeholder,
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
            placeholder={placeholder}
            className={className}
            style={{
              height: `${height}px`,
              width: `${width}px`,
              opacity: loading ? 0.25 : 1,
            }}
          />
        );
      }}
    </ProgressiveImage>
  );
}

AlbumImage.propTypes = {
  src: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

AlbumImage.defaultProps = {
  placeholder: undefined,
  className: undefined,
};

export default AlbumImage;
