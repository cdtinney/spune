///////////////////////////
// External dependencies //
///////////////////////////

import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';

//////////////////////////
// Internal dependencies//
//////////////////////////

/**
 * Displays the user's profile image and display name.
 */
export default class User extends Component {
  static propTypes = {
    loadUser: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    displayName: PropTypes.string,
    avatarImageUrl: PropTypes.string,
  };

  //////////////////////
  // Lifecycle methods//
  //////////////////////

  componentDidMount() {
    this.props.loadUser();
  }

  ////////////////////
  // Render methods //
  ////////////////////

  render() {
    const {
      loading,
      displayName,
      avatarImageUrl,
    } = this.props;
    
    if (loading) {
      return <CircularProgress />;
    }

    return (
      <div className="user">
        <h2>{`Logged in as ${displayName || '... nobody?'}`}</h2>
        <div className="user__content">
          <img src={avatarImageUrl} alt="profile" />
        </div>
      </div>
    );
  }
}
