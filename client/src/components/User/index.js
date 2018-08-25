///////////////////////////
// External dependencies //
///////////////////////////

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

//////////////////////////
// Internal dependencies//
//////////////////////////

// TODO Add shared folders to resolve paths after ejecting
import * as spotifyActions from '../../actions/spotify';

/**
 * Displays the user's profile image and display name.
 */
class User extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        accessToken: PropTypes.string.isRequired,
        refreshToken: PropTypes.string.isRequired,
      }),
    }).isRequired,
  };

  //////////////////////
  // Lifecycle methods//
  //////////////////////

  componentDidMount() {
    const {
      dispatch,
      // Properties injected by react-router.
      match: {
        params: {
          accessToken,
          refreshToken,
        },
      },
    } = this.props;

    dispatch(spotifyActions.setTokens({ accessToken, refreshToken }));
    dispatch(spotifyActions.getMyInfo());
  }

  ////////////////////
  // Render methods //
  ////////////////////

  render() {
    const { user } = this.props;
    const {
      loading,
      updated,
      display_name,
      images,
    } = user;
    
    if (loading) {
      return <h2>Loading...</h2>;
    }

    if (!updated) {
      return null;
    }

    const imageUrl = images[0] ? images[0].url : '';
    return (
      <div className="user">
        <h2>{`Logged in as ${display_name}`}</h2>
        <div className="user__content">
          <img src={imageUrl} alt="profile" />
        </div>
      </div>
    );
  }
}

export default connect(state => state)(User);
