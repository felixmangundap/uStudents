import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';

import { signout } from '../../services/auth'

const guestLinks = (
  <div className="right menu ">
    <Link to="/login" className="item">
      Login
    </Link>
    <Link to="/signup" className="item">
      Sign Up
    </Link>
  </div>
);

const authLinks = (onSignout) => (
  <div className="right menu ">
    <Link to="/" className="item">
      Personal
    </Link>
    <Link to="/rooms" className="item">
      Rooms
    </Link>
    <Link onClick={onSignout} className="item">
      Log Out
    </Link>
  </div>
);

class NavBar extends Component {

  onSignout = async (e) => {
    e.preventDefault();
    try {
      await signout();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    return (
      <Fragment>
        <div className="ui inverted fixed big menu">
          <div className="ui container">
            <Link to="/" className="item">
              uStudents
            </Link>
            {this.props.authenticated === true ? authLinks(this.onSignout) : guestLinks}
          </div>
        </div>
        <div className="ui hidden divider"></div>
        <div className="ui hidden divider"></div>
      </Fragment>
    );
  }
}

export default NavBar;
