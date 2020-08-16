import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { signin, signInWithGoogle } from '../../services/auth';

class Login extends Component {
  state = {
    error: null,
    email: '',
    password: '',
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
      await signin(this.state.email, this.state.password);
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  googleSignIn = async () => {
    try {
      await signInWithGoogle();
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
                <h1 className="form-title">Login</h1>
                <div className="ui segment signUpForm ">
                  <form
                    autoComplete="off"
                    className={`ui form ${this.state.error ? 'error' : ''}`}
                    onSubmit={this.handleSubmit}
                  >
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
                      Login
                    </button>
                  </form>
                  <div className="ui horizontal divider">Or</div>
                  <button
                    className="ui primary basic fluid submit button"
                    onClick={this.googleSignIn}
                  >
                    Log In with Google
                  </button>
                </div>
                {/* <div className="ui message">
                  Don't have an account? <Link to="/signup">Sign Up</Link>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
