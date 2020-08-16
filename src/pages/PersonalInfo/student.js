/* eslint-disable no-loop-func */
import React, { Component, Fragment } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { Dropdown } from 'semantic-ui-react';

import { auth, firestore } from '../../services/firebase';
import './styles.css';
import majorOptions from '../../data/majors.json';

const countryOptions = [
  { key: 'au', value: 'australia', flag: 'au', text: 'Australia' },
  { key: 'ca', value: 'canada', flag: 'ca', text: 'Canada' },
  { key: 'cn', value: 'china', flag: 'cn', text: 'China' },
  { key: 'dk', value: 'denmark', flag: 'dk', text: 'Denmark' },
  { key: 'fi', value: 'finland', flag: 'fi', text: 'Finland' },
  { key: 'de', value: 'germany', flag: 'de', text: 'Germany' },
  { key: 'hk', value: 'hongkong', flag: 'hk', text: 'Hong Kong' },
  { key: 'in', value: 'india', flag: 'in', text: 'India' },
  { key: 'id', value: 'indonesia', flag: 'id', text: 'Indonesia' },
  { key: 'it', value: 'italy', flag: 'it', text: 'Italy' },
  { key: 'jp', value: 'japan', flag: 'jp', text: 'Japan' },
  { key: 'my', value: 'malaysia', flag: 'my', text: 'Malaysia' },
  { key: 'nl', value: 'netherlands', flag: 'nl', text: 'Netherlands' },
  { key: 'nz', value: 'newzealand', flag: 'nz', text: 'New Zealand' },
  { key: 'ph', value: 'philippines', flag: 'ph', text: 'Philippines' },
  { key: 'sg', value: 'singapore', flag: 'sg', text: 'Singapore' },
  { key: 'za', value: 'southafrica', flag: 'za', text: 'South Africa' },
  { key: 'es', value: 'spain', flag: 'es', text: 'Spain' },
  { key: 'ch', value: 'switzerland', flag: 'ch', text: 'Switzerland' },
  { key: 'tw', value: 'taiwan', flag: 'tw', text: 'Taiwan' },
  { key: 'th', value: 'thailand', flag: 'th', text: 'Thailand' },
  { key: 'us', value: 'unitedstates', flag: 'us', text: 'United States' },
  { key: 'vn', value: 'vietnam', flag: 'vn', text: 'Vietnam' },
];

class StudentInfo extends Component {
  state = {
    error: null,
    title: [
      'Personal Information',
      'When Do You Plan On Starting Your Study?',
      'What Do You Want To Study?',
      'Where Do You Want To Study?',
      'Select A University You Plan On Going To',
    ],
    subtitle: [
      '',
      '',
      'Pick a maximum of 3',
      'Pick a maximum of 3',
      'Pick a maximum of 3 (Optional)',
    ],
    page: 0,
    uniList: [],
    uniOptions: [],
    firstname: '',
    lastname: '',
    country: '',
    studentStart: '',
    studentInterest: '',
    studentCountry: [],
    studentUniversity: [],
    userId: auth().currentUser.uid,
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

    const {
      userId: uid,
      firstname,
      lastname,
      country,
      studentStart,
      studentCountry,
      studentInterest,
      studentUniversity,
    } = this.state;

    const userObject = {
      firstname,
      lastname,
      country,
      studentCountry,
      studentInterest,
      studentStart,
      studentUniversity,
      infoSetup: true,
    };

    await firestore.collection('users').doc(uid).update(userObject);
  };

  updateUniversity = async () => {
    let uniList = [];
    this.setState({ uniOptions: [] });
    for (const country of this.state.studentCountry) {
      const path = `assets/university/${country}.json`;
      await axios.get(path).then((response) => {
        uniList = [...uniList, ...response.data];
      });
    }

    const uniqueUni = _.orderBy(_.uniqBy(uniList, 'name'), ['name'], ['asc']);
    this.setState({
      uniOptions: uniqueUni.map((uni) => ({
        ...uni,
        text: uni.name,
        key: uni.name,
        value: uni.name,
      })),
    });
  };

  nextPage = (e) => {
    e.preventDefault();
    this.setState({ page: this.state.page + 1 });
    console.log('next');
    console.log(this.state);
  };

  prevPage = (e) => {
    e.preventDefault();
    this.setState({ page: this.state.page - 1 });
    console.log('prev');
  };

  render() {
    const pageZero = (
      <form
        className={`ui form ${this.state.error ? 'error' : ''}`}
        onSubmit={this.nextPage}
      >
        <div className="field">
          <div className="two fields">
            <div className="field">
              <label>First Name</label>
              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                onChange={this.handleChange}
                value={this.state.firstname}
                required
              />
            </div>
            <div className="field">
              <label>Last Name</label>
              <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                onChange={this.handleChange}
                value={this.state.lastname}
                required
              />
            </div>
          </div>
        </div>
        <div className="field">
          <label>Country of Origin</label>
          <Dropdown
            placeholder="Select Country"
            fluid
            search
            selection
            options={countryOptions}
            onChange={(e, { value }) => {
              this.setState({ country: value });
            }}
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
          className="ui fluid primary submit button buttonForm"
          style={{
            backgroundImage: 'linear-gradient(to right, #0083b0, #00b4db)',
          }}
        >
          Continue
        </button>
      </form>
    );

    const pageOne = (
      <form className="ui form" onSubmit={this.nextPage}>
        <div className="ui field">
          <input
            type="date"
            name="studentStart"
            value={this.state.studentStart}
            onChange={this.handleChange}
          />
        </div>
        <button
          type="submit"
          className="circular ui right floated inverted icon button"
        >
          <i className="icon arrow right"></i>
        </button>
      </form>
    );
    const pageTwo = (
      <Fragment>
        <form className="ui form" onSubmit={this.nextPage}>
          <div className="ui field">
            <Dropdown
              placeholder="Select Your Interest"
              fluid
              search
              selection
              options={majorOptions}
              value={this.state.studentInterest}
              onChange={(e, { value }) => {
                this.setState({ studentInterest: value });
              }}
              required
            />
          </div>
          <button
            onClick={this.prevPage}
            className="circular ui left floated inverted icon button"
          >
            <i className="icon arrow left"></i>
          </button>
          <button
            type="submit"
            className="circular ui right floated inverted icon button"
          >
            <i className="icon arrow right"></i>
          </button>
        </form>
      </Fragment>
    );
    const pageThree = (
      <Fragment>
        <h4 className="form-title">{this.state.subtitle[3]}</h4>
        <form className="ui form" onSubmit={this.nextPage}>
          <div className="ui field">
            <Dropdown
              placeholder="Select Country"
              fluid
              search
              selection
              multiple
              options={countryOptions}
              value={this.state.studentCountry}
              onChange={(e, { value }) => {
                this.setState({ studentCountry: value }, () => {
                  this.updateUniversity();
                });
              }}
              disabled={this.state.studentCountry.length >= 3}
              required
            />
          </div>
          <button
            onClick={this.prevPage}
            className="circular ui left floated inverted icon button"
          >
            <i className="icon arrow left"></i>
          </button>
          <button
            type="submit"
            className="circular ui right floated inverted icon button"
          >
            <i className="icon arrow right"></i>
          </button>
        </form>
      </Fragment>
    );

    const pageFour = (
      <Fragment>
        <h4 className="form-title">{this.state.subtitle[4]}</h4>
        <form className="ui form" onSubmit={this.handleSubmit}>
          <div className="ui field">
            <Dropdown
              placeholder="Select University"
              fluid
              search
              selection
              multiple
              options={this.state.uniOptions}
              value={this.state.studentUniversity}
              onChange={(e, { value }) =>
                this.setState({ studentUniversity: value })
              }
              disabled={this.state.studentUniversity.length >= 3}
              required
            />
          </div>
          <button
            onClick={this.prevPage}
            className="circular ui left floated inverted icon button"
          >
            <i className="icon arrow left"></i>
          </button>
          <button
            type="submit"
            className=" ui right floated inverted button"
            style={{ color: '#01b4db' }}
          >
            Get Started
          </button>
        </form>
      </Fragment>
    );

    return (
      <div>
        <div className="background-container" style={{ position: 'relative' }}>
          <img
            src={require('../../data/img/welcome.svg')}
            className="welcomeImage"
          />
          <div className="ui centered stackable grid formContainer">
            <div className="ui row">
              <div className="six wide column">
                <h1 className="form-title">
                  {this.state.title[this.state.page]}
                </h1>
                {this.state.page === 0 ? (
                  <div className="ui segment ">{pageZero}</div>
                ) : this.state.page === 1 ? (
                  pageOne
                ) : this.state.page === 2 ? (
                  pageTwo
                ) : this.state.page === 3 ? (
                  pageThree
                ) : (
                  pageFour
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StudentInfo;
