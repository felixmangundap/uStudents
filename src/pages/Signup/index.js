import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { signup, signUpWithGoogle } from '../../services/auth';
import './styles.css';

class Signup extends Component {
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
    this.setState({ error: '' });
    try {
      await signup(this.state.email, this.state.password, this.state.type);
    } catch (error) {
      this.setState({ error: error.message });
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
        <div className="background-container">
          <img
            src={require('../../data/img/astro1.svg')}
            className="topLeftAstro"
          />
          <img
            src={require('../../data/img/astro2.svg')}
            className="topRightAstro"
          />
          <img
            src={require('../../data/img/astro3.svg')}
            className="bottomLeftAstro"
          />
          <img
            src={require('../../data/img/astro4.svg')}
            className="bottomRightAstro"
          />
          <div className="ui centered stackable grid vertical-center">
            <div className="ui row">
              <div className="six wide column">
                <h1 className="form-title">Create Your Account</h1>
                <div className="ui segment signUpForm">
                  <form
                    className={`ui form ${this.state.error ? 'error' : ''}`}
                    onSubmit={this.handleSubmit}
                  >
                    <strong>
                      <label htmlFor="student">I am a:</label>
                    </strong>
                    <div
                      className="inline fields"
                      style={{ paddingTop: '5px' }}
                    >
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

                    <div className="field">
                      <div className="two fields">
                        <div className="field">
                          <label>First Name</label>
                          <input
                            type="text"
                            name="firstname"
                            placeholder="First Name"
                          />
                        </div>
                        <div className="field">
                          <label>Last Name</label>
                          <input
                            type="text"
                            name="lastname"
                            placeholder="Last Name"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="field">
                      <label>Country of Origin</label>
                      <input
                        type="text"
                        name="studentCountry"
                        placeholder="Select Country"
                      />
                    </div>

                    {this.state.error ? (
                      <div className="ui error message">
                        <p>{this.state.error}</p>
                      </div>
                    ) : null}
                    <button
                      type="submit"
                      className="ui fluid primary submit button buttonSignUp"
                    >
                      Sign Up
                    </button>
                  </form>
                  <div className="ui horizontal divider">Or</div>
                  <button
                    className="ui primary basic fluid submit button"
                    onClick={this.googleSignIn}
                  >
                    Register with Google
                  </button>
                </div>
                {/* <div className="ui message">
                  Already have an account? <Link to="/login">Login</Link>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;
