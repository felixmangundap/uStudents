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
          <div className="ui centered stackable grid vertical-center">
            <div className="ui row">
              <div className="six wide column">
                <h1 className="form-title">Login</h1>
                <div className="ui segment ">
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
                    <button type="submit" className="ui fluid submit button">
                      Login
                    </button>
                  </form>
                  <div className="ui horizontal divider">Or</div>
                  <button
                    className="ui primary fluid submit button"
                    onClick={this.googleSignIn}
                  >
                    Log In with Google
                  </button>
                </div>
                <div className="ui message">
                  Don't have an account? <Link to="/signup">Sign Up</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form autoComplete="off" onSubmit={this.handleSubmit}>
          <h1>
            Login to
            <Link to="/">Chatty</Link>
          </h1>
          <p>Fill in the form below to login to your account.</p>
          <div>
            <input
              placeholder="Email"
              name="email"
              type="email"
              onChange={this.handleChange}
              value={this.state.email}
            />
          </div>
          <div>
            <input
              placeholder="Password"
              name="password"
              onChange={this.handleChange}
              value={this.state.password}
              type="password"
            />
          </div>
          <div>
            {this.state.error ? <p>{this.state.error}</p> : null}
            <button type="submit">Login</button>
          </div>
          <p>Or</p>
          <button onClick={this.googleSignIn} type="button">
            Sign up with Google
          </button>
          <hr />
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </form>
      </div>
    );
  }
}

export default Login;
