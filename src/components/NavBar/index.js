import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css'

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

const authLinks = (
  <div className="right menu ">
    <Link to="/personal" className="item no-border">
      Personal
    </Link>
    <Link to="/rooms" className="item no-border">
      Rooms
    </Link>
  </div>
);

class NavBar extends Component {
  render() {
    return (
      <Fragment>
        <div id='menubar' className="ui inverted fixed big menu">
          <div className="ui container">
            <Link to="/" className="item no-border">
              uStudents
            </Link>
            {this.props.authenticated === true ? authLinks : guestLinks}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default NavBar;
