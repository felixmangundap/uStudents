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

class MentorInfo extends Component {
  state = {
    error: null,
    title: [
      'Personal Information',
      'Where Are You Currently Studying?',
      'Which University Are You Currently Attending',
      'What\'s Your Major?',
    ],
    subtitle: [
      '',
      '',
      '',
      '',
      '',
    ],
    page: 0,
    uniList: [],
    uniOptions: [],
    firstname: '',
    lastname: '',
    country: '',
    mentorCountry: '',
    mentorUniversity: '',
    mentorMajor: '',
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
      mentorCountry,
      mentorInterest,
      mentorUniversity,
    } = this.state;

    const userObject = {
      infoSetup: true,
      firstname,
      lastname,
      country,
      mentorCountry,
      mentorInterest,
      mentorUniversity,
    }

    await firestore
      .collection("users")
      .doc(uid)
      .update(userObject)
  };

  updateUniversity = async () => {
    let uniList = [];
    this.setState({ uniOptions: [] });
    const path = `assets/university/${this.state.mentorCountry}.json`;
    await axios.get(path).then(response => {
      uniList = [...uniList, ...response.data];
    });

    const uniqueUni =  _.orderBy(_.uniqBy(uniList, 'name'), ['name'], ['asc']);
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
        <button type="submit" className="ui fluid submit button">
          Continue
        </button>
      </form>
    );

    const pageOne = (
      <Fragment>
        <form className="ui form" onSubmit={this.nextPage}>
          <div className="ui field">
            <Dropdown
              placeholder="Select Your Country"
              fluid
              search
              selection
              options={countryOptions}
              value={this.state.mentorCountry}
              onChange={(e, { value }) => {
                this.setState({ mentorCountry: value }, () => { this.updateUniversity() })
              }}
              required
            />
          </div>
          <button
            onClick={this.prevPage}
            className="circular ui left floated icon button"
          >
            <i className="icon arrow left"></i>
          </button>
          <button
            type="submit"
            className="circular ui right floated icon button"
          >
            <i className="icon arrow right"></i>
          </button>
        </form>
      </Fragment>
    );

    const pageTwo = (
      <Fragment>
        <form className="ui form" onSubmit={this.nextPage}>
          <div className="ui field">
            <Dropdown
              placeholder="Select Your University"
              fluid
              search
              selection
              options={this.state.uniOptions}
              value={this.state.mentorUniversity}
              onChange={(e, { value }) =>
                this.setState({ mentorUniversity: value })
              }
              required
            />
          </div>
          <button
            onClick={this.prevPage}
            className="circular ui left floated icon button"
          >
            <i className="icon arrow left"></i>
          </button>
          <button
            type="submit"
            className="circular ui right floated icon button"
          >
            <i className="icon arrow right"></i>
          </button>
        </form>
      </Fragment>
    );

    const pageThree = (
      <Fragment>
        <form className="ui form" onSubmit={this.handleSubmit}>
          <div className="ui field">
            <Dropdown
              placeholder="Select Your Major"
              fluid
              search
              selection
              options={majorOptions}
              value={this.state.mentorInterest}
              onChange={(e, { value }) => {
                this.setState({ mentorInterest: value })
              }}
              required
            />
          </div>
          <button
            onClick={this.prevPage}
            className="circular ui left floated icon button"
          >
            <i className="icon arrow left"></i>
          </button>
          <button type="submit" className=" ui right floated  button">
            Get Started
          </button>
        </form>
      </Fragment>
    );

    return (
      <div>
        <div className="background-container">
          <div className="ui centered stackable grid vertical-center">
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
                ) : (
                  pageThree
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MentorInfo;
