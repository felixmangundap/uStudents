/* eslint-disable no-loop-func */
import React, { Component, Fragment } from 'react';
import _ from 'lodash';

import StudentInfo from './student';
import MentorInfo from './mentor';

import { auth, firestore } from '../../services/firebase';
import './styles.css';
import user from '../../reducers/user';

class InfoSetup extends Component {
  state = {
    userId: auth().currentUser.uid,
    userType: 'student',
    isLoading: true,
  };
  
  componentDidMount() {
    const { userId } = this.state;
    firestore
      .collection('users')
      .doc(userId)
      .get()
      .then(doc => {
        const userType =  doc.data().type;
        this.setState({ userType }, () => {
          this.setState({
            isLoading: false,
          });
        });
      });
  }

  render() {
    const { isLoading, userType } = this.state;

    return isLoading ? (
      <h2>Loading...</h2>
    ) : userType === 'student' ? (
      <StudentInfo />
    ) : (
      <MentorInfo />
    )
  }
}

export default InfoSetup;
