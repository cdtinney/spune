///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import ProgressiveImage from 'react-progressive-image';

export default function AlbumImage(props) {
  const {
    src,
    placeholder,
    alt,
    className,
    width,
    height,
  } = props;

  return (
    <ProgressiveImage
      src={src}
      placeholder={placeholder}
      alt={alt}
      className={className}
      style={{
        height: `${height}px`,
        width: `${width}px`,
      }}
    >
      {(src, loading) => (
        <img
          src={src}
          alt={alt}
          className={className}
          style={{
            height: `${height}px`,
            width: `${width}px`,
            opacity: loading ? 0.25 : 1,
          }}
        />
      )}
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
