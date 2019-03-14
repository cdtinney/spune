///////////////////////////
// External dependencies //
///////////////////////////

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const styles = (theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginLeft: '15px',
    color: theme.palette.text.primary,
    '&:hover': {
      color: theme.palette.text.secondary,
    },
  },
  menu: {
    marginTop: '10px',
    boxShadow: theme.shadows[6],
  },
  menuList: {
    padding: '5px 0',
  },
  menuItem: {
    padding: '0 10px',
    fontSize: '0.8rem',
  },
});

class UserMenu extends PureComponent {
  static propTypes = {
    handlers: PropTypes.shape({
      onLogout: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    anchorElem: null,
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleClick(event) {
    this.setState({
      anchorElem: event.currentTarget,
    });
  }

  handleClose() {
    this.setState({
      anchorElem: null,
    });
  }

  handleLogout() {
    this.props.handlers.onLogout();
  }

  render () {
    const {
      anchorElem,
    } = this.state;

    const {
      classes,
    } = this.props;

    return (
      <div className={classes.root}>
        <FontAwesomeIcon
          icon={faCaretDown}
          className={classes.icon}
          inverse
          size="1x"
          aria-owns={anchorElem ? 'user-menu' : undefined}
          aria-haspopup="true"
          title="Menu"
          onClick={this.handleClick}
        />
        <Menu
          id="user-menu"
          anchorEl={anchorElem}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={Boolean(anchorElem)}
          disableAutoFocusItem
          onClose={this.handleClose}
          classes={{
            paper: classes.menu,
          }}
          MenuListProps={{
            classes: {
              root: classes.menuList,
            },
          }}
        >
          <MenuItem
            onClick={this.handleLogout}
            className={classes.menuItem}
          >
            {'Log Out'}
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default withStyles(styles)(UserMenu);
