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

  renderTopPage = () => {
    return (
      <div className="top-container">
        <img
          src={require('../../data/img/Wave.png')}
          style={{ position: 'absolute', bottom: '0px', width: '100%' }}
        />
        <div className="ui centered stackable grid">
          <div className="ui row home-top">
            <div className="ui five wide column">
              <div className="vertical-center header-text">
                <h1 className="hugeText">
                  Ask Questions.
                  <br />
                  Express Concerns.
                  <br />
                  Meet New Friends.
                </h1>
                <h3>
                  Connect with students from all around the world who has
                  similar interests with you.
                </h3>
              </div>
            </div>
            <div className="ui one wide column"></div>
            <div className="ui six wide column">
              <div className="ui segment registerFormHome">
                <form
                  className={`ui form ${this.state.error ? 'error' : ''}`}
                  onSubmit={this.handleSubmit}
                >
                  <strong>
                    <label htmlFor="student">I am a:</label>
                  </strong>
                  <div className="inline fields" style={{ paddingTop: '5px' }}>
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

                  <button
                    type="submit"
                    className="ui fluid primary submit button buttonHome"
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
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderAbout = () => {
    return (
      <div className="ui container aboutApp">
        <h1>About</h1>
        <div className="ui three column very relaxed grid">
          <div className="column">
            <img src={require('../../data/img/About1.svg')} />
            <h3>
              A lot of highschool students feel stressed out about entering
              university.
            </h3>
            <p>
              Highschool students are likely to feel unsure about their future—
              and it’s not their fault. University is a scary place to dive in
              without knowing what you’re up against. Worry no more, we’re here
              for you.
            </p>
          </div>
          <div className="column">
            <img src={require('../../data/img/About2.svg')} />
            <h3>
              Ustudents connects highschool students with current university
              students.
            </h3>
            <p>
              Highschool students can ask questions, express concerns, and
              ultimately establish a friendship with university students alike.
              Clear your doubts and clarify your future, all a click away.
            </p>
          </div>
          <div className="column">
            <img src={require('../../data/img/About3.svg')} />
            <h3>
              Meet new friends, join in a community— all before entering
              university.
            </h3>
            <p>
              The stress of not having any friends or knowledge when a student
              enters university is real. Well, up until now, that is. Now,
              there’s no need to stress anymore. Meet new friends and join in a
              community, all before you even attend university.
            </p>
          </div>
        </div>
      </div>
    );
  };

  renderHowItWorks = () => {
    return (
      <div className="ui container howItWorks">
        <h2>How It Works</h2>
        <div className="ui four column very relaxed grid">
          <div className="column">
            <div className="ui segment centerText">
              <img src={require('../../data/img/HiwHS.svg')} />
              <h3>Highschool students</h3>
            </div>
          </div>
          <div className="two wide column">
            <img src={require('../../data/img/About2.svg')} />
            <h3>
              We connect highschool students with current university students.
            </h3>
            <p>
              Highschool students can ask questions, express concerns, and
              ultimately establish a friendship with university students alike.
              This platform is run by students and students themselves. We
              eliminate the need for third party organisations.
            </p>
          </div>
          <div className="column">
            <div className="column">
              <div className="ui segment centerText">
                <img src={require('../../data/img/HiwUs.svg')} />
                <h3>University students</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderStatistics = () => {
    return (
      <div className="ui container statisticsContainer">
        <h3 className="blueText centerText">Dear Students: Worry Less.</h3>
        <h1 className="hugeText centerText" style={{ paddingBottom: '5vh' }}>
          Connect with anyone, <br /> anywhere, about anything.
        </h1>
        {/* <img src={require('../../data/img/Map.svg')} /> */}
        <div className="ui centered eight column grid mapBackground">
          <div className="four wide column">
            <div className="ui segment centerText vertical-center statisticItem">
              <div
                className="ui small statistic"
                style={{ paddingTop: '30px', paddingBottom: '30px' }}
              >
                <div
                  className="value blueText "
                  style={{ paddingBottom: '20px' }}
                >
                  5000+
                </div>
                <div className="label">Universities</div>
              </div>
            </div>
          </div>
          <div className="four wide column">
            <div className="ui segment centerText vertical-center statisticItem">
              <div
                className="ui small statistic"
                style={{ paddingTop: '30px', paddingBottom: '30px' }}
              >
                <div
                  className="value blueText "
                  style={{ paddingBottom: '20px' }}
                >
                  40+
                </div>
                <div className="label">Countries</div>
              </div>
            </div>
          </div>
          <div className="four wide column">
            <div className="ui segment centerText vertical-center statisticItem">
              <div
                className="ui small statistic"
                style={{ paddingTop: '30px', paddingBottom: '30px' }}
              >
                <div
                  className="value blueText "
                  style={{ paddingBottom: '20px' }}
                >
                  150+
                </div>
                <div className="label">Field of Studies</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderCreatedWithLove = () => {
    return (
      <div className="ui container createdWithLove">
        <img src={require('../../data/img/createdWithLove.svg')} />
      </div>
    );
  };

  render() {
    return (
      <div>
        {this.renderTopPage()}
        {this.renderAbout()}
        {/* {this.renderHowItWorks()} */}
        {this.renderStatistics()}
        {this.renderCreatedWithLove()}
      </div>
    );
  }
}

export default Home;
