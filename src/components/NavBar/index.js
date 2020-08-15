import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';

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
    <Link to="/" className="item">
      Personal
    </Link>
    <Link to="/rooms" className="item">
      Rooms
    </Link>
  </div>
);

class NavBar extends Component {
  render() {
    return (
      <Fragment>
        <div className="ui inverted fixed big menu">
          <div className="ui container">
            <Link to="/" className="item">
              uStudents
            </Link>
            {this.props.authenticated === true ? authLinks : guestLinks}
          </div>
        </div>
        <div className="ui hidden divider"></div>
        <div className="ui hidden divider"></div>
      </Fragment>
    );
  }
}

export default NavBar;
