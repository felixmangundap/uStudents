import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { signup, signUpWithGoogle } from '../../services/auth';
import './styles.css';

class Home extends Component {
  state = {
    error: null,
    email: '',
    password: '',
    password2: '',
    type: 'student',
  };

  componentDidMount() {}

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if (this.state.password !== this.state.password2) {
      this.setState({ error: 'Passwords do not match' });
    } else {
      this.setState({ error: '' });
      try {
        await signup(this.state.email, this.state.password, this.state.type);
      } catch (error) {
        this.setState({ error: error.message });
      }
    }
  };

  googleSignIn = async () => {
    try {
      await signUpWithGoogle(this.state.type);
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  render() {
    return (
      <div>
        <div className="top-container">
          <div className="ui centered stackable grid">
            <div className="ui row home-top">
              <div className="ui five wide column">
                <div className="vertical-center header-text">
                  <h1>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </h1>
                  <h5>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </h5>
                </div>
              </div>
              <div className="ui one wide column"></div>
              <div className="ui six wide column">
                <div className="ui segment">
                  <form
                    className={`ui form ${this.state.error ? 'error' : ''}`}
                    onSubmit={this.handleSubmit}
                  >
                    <strong>
                      <label htmlFor="student">I am a:</label>
                    </strong>
                    <div className="inline fields">
                      <div className="field">
                        <div className="ui radio checkbox">
                          <input
                            type="radio"
                            name="student"
                            checked={this.state.type === 'student'}
                            tabIndex="0"
                            value={this.state.type === 'student'}
                            onChange={() => this.setState({ type: 'student' })}
                          />
                          <label>Highschool Student</label>
                        </div>
                      </div>
                      <div className="right floated field">
                        <div className="ui radio checkbox">
                          <input
                            type="radio"
                            name="mentor"
                            checked={this.state.type === 'mentor'}
                            tabIndex="0"
                            value={this.state.type === 'mentor'}
                            onChange={(e) => this.setState({ type: 'mentor' })}
                          />
                          <label>University Student</label>
                        </div>
                      </div>
                    </div>
                    <div className="field">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        onChange={this.handleChange}
                        value={this.state.email}
                        required
                      />
                    </div>
                    <div className="field">
                      <label>Password</label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={this.handleChange}
                        value={this.state.password}
                        required
                        pattern="(?=.*\d)(?=.*[a-zA-Z]).{8,}"
                        title="Password must be a combination of number and letters, and at least 8 or more characters"
                      />
                    </div>
                    <div className="field">
                      <label>Confirm Password</label>
                      <input
                        type="password"
                        name="password2"
                        placeholder="Confirm Password"
                        onChange={this.handleChange}
                        value={this.state.password2}
                        required
                        pattern="(?=.*\d)(?=.*[a-zA-Z]).{8,}"
                        title="Password must be a combination of number and letters, and at least 8 or more characters"
                      />
                    </div>
                    {this.state.error ? (
                      <div className="ui error message">
                        <p>{this.state.error}</p>
                      </div>
                    ) : null}

                    <button type="submit" className="ui fluid submit button">
                      Sign Up
                    </button>
                  </form>

                  <div className="ui horizontal divider">Or</div>
                  <button
                    className="ui primary fluid submit button"
                    onClick={this.googleSignIn}
                  >
                    Register with Google
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
