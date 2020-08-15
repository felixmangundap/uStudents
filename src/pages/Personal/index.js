import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { Dropdown } from 'semantic-ui-react';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane,
  faPaperclip,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

import majorOptions from '../../data/majors.json'

import './styles.css';

import { auth, firestore } from '../../services/firebase';

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

class Personal extends Component {
  state = {
    chatMessage: '',
    chatHistory: [],
    chatList: [],
    users: {},
    userId: auth().currentUser.uid,
    uniOptions: [],
    major: '',
    country: '',
    university: '',
    currPersonalId: '',
    currChatId : '',
    chatName: 'Chat',
  };

  componentDidMount() {
    this.getAllUsers();
    this.getPersonal();
  }

  componentDidUpdate() {}

  updateUniversity = async () => {
    let uniList = [];
    this.setState({ uniOptions: [] });
    const path = `assets/university/${this.state.country}.json`;
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

  sendChat = async (e) => {
    const { chatMessage: message, userId, currChatId } = this.state;

    const timestamp = moment().valueOf();

    if (message.trim() === '') return;

    let senderName = '';
    await firestore.collection('users').doc(userId).get().then(doc => senderName = `${doc.data().firstname} ${doc.data().lastname}`)

    const chatItem = {
      message,
      senderId: userId,
      senderName,
      timestamp,
    };

    if (currChatId) {
      firestore
        .collection('chats')
        .doc(currChatId)
        .collection(currChatId)
        .doc(timestamp.toString())
        .set(chatItem)
        .then(() => {
          this.setState({
            chatMessage: '',
          });
        })
        .catch((err) => {
          console.log("TEST = " +err.toString());
        });
    }

  };

  getAllUsers = async () => {
    const snapshot = await firestore.collection('users').get()
    const collection = {};
    snapshot.forEach(doc => {
        collection[doc.id] = doc.data();
    });
    this.setState({
      ...this.state,
      users: collection
    }, () => console.log(this.state.users));
  }

  getChat = () => {
    const { chatHistory, currChatId } = this.state;
      
    if (currChatId) {
      console.log('YES')
      firestore
        .collection('chats')
        .doc(currChatId)
        .collection(currChatId)
        .onSnapshot(
          (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === 'added') {
                console.log(change.doc.data());
                chatHistory.push(change.doc.data());
              }
            });
            this.setState({
              isLoading: false,
            });
          },
          (err) => {
            console.log(err.toString());
          }
        );
    }
  };

  getPersonal = async () => {
    const snapshot = await firestore.collection('personal').get()
    const collection = {};
    snapshot.forEach(doc => {
        collection[doc.id] = doc.data();
    });

    
    const func = async () => {
      const personalChat = []
      await firestore
      .collection('users')
      .doc(this.state.userId)
      .onSnapshot(
        (snapshot) => {
          if (snapshot.data().personal) {
            snapshot.data().personal.forEach(id => personalChat.push(collection[id]))
          }
        }
      )
      return personalChat
    }

    this.setState({
      ...this.state,
      chatList: await func()
    }, () => {
      console.log(this.state.chatList)
    })

  };

  connectStudent = async () => {
    const {
      major,
      country,
      university,
    } = this.state;

    firestore
    .collection('users')
    .where('type', '==', 'mentor')
    .where('mentorInterest', '==', major)
    .where('mentorCountry', '==', country)
    .where('mentorUniversity', '==', university)
    .get()
    .then(querySnapshot => {
      const mentorList = []
      querySnapshot.forEach(function(doc) {
          mentorList.push(doc.data());
      });

      if (mentorList.length > 0) {
        const orderedUser = mentorList.sort(function(a, b) {
          if (a.personal && b.personal) return a.personal.length - b.personal.length;
          return 1;
        });
        const chosenMentor = orderedUser[0];

        const timestamp = moment().valueOf();
        const chatId = uuidv4();
        const personalId = uuidv4();
        
        const chatUsers = [auth().currentUser.uid, chosenMentor.uid];

        const personalItem = {
          chatId,
          timestamp,
          userA: auth().currentUser.uid,
          userB: chosenMentor.uid,
        }

        firestore
        .collection('chats')
        .doc(chatId)
        .collection(chatId)
        .doc(timestamp.toString())
        .set({})
        .then(() => {
          firestore.collection("personal")
          .doc(personalId)
          .set(personalItem)
          .then(() => {
            this.setState({ currPersonalId: personalId }, () => this.updateChatName());
            this.setState({ currChatId: chatId });
            firestore.collection("users")
            .doc(chatUsers[0])
            .get()
            .then(doc => {
              if (doc.data().personal) {
                const userPersonal =  doc.data().personal;
                const newUserPersonal = [...userPersonal, personalId];
                firestore.collection("users")
                .doc(chatUsers[0])
                .update({
                  personal: newUserPersonal,
                })
              } else {
                const userPersonal = [personalId];
                firestore.collection("users")
                .doc(chatUsers[0])
                .update({
                  personal: userPersonal,
                })
              }
            });
            firestore.collection("users")
            .doc(chatUsers[1])
            .get()
            .then(doc => {
              if (doc.data().personal) {
                const userPersonal =  doc.data().personal;
                const newUserPersonal = [...userPersonal, personalId];
                firestore.collection("users")
                .doc(chatUsers[1])
                .update({
                  personal: newUserPersonal,
                })
              } else {
                const userPersonal = [personalId];
                firestore.collection("users")
                .doc(chatUsers[1])
                .update({
                  personal: userPersonal,
                })
              }
            });
          })
        })
        .catch((err) => {
          console.log(err.toString());
        });
      }
    })
  };

  createRooms = async () => {
    //TODO
  };

  onChatMessageChange = (e) => {
    const chatMessage = e.target.value;
    this.setState({ chatMessage });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  renderChat = () => {
    const { chatHistory, userId } = this.state;
    let lastSenderId = '';

    return (
      <div className={'chatBox'}>
        {chatHistory.map((chatItem) => {
          const senderId = chatItem.senderId;
          const isSender = senderId === userId;
          const sameSender = senderId === lastSenderId;
          lastSenderId = chatItem.senderId;
          return (
            <div className={`chatEntry ${!isSender ? 'left' : 'right'}`}>
              {!isSender && !sameSender ? (
                <div>{chatItem.senderName}</div>
              ) : null}
              <div className={'chatItem'}>
                <div className={'chatTime'}>
                  {moment(chatItem.timestamp).format('hh:mm A')}
                </div>
                <div className={'chatBubble'}>{chatItem.message}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  renderPersonal = () => {

    return this.state.chatList.length > 0 && (
      <div className={'chatList'}>
      {this.state.chatList.length > 0 && this.state.chatList.map((chat) => (
        <div className="ui segment chatListItem">
          <div className="ui comments">
            <div className="ui comment">
              <a className="avatar">
                <img src="https://avatar.oxro.io/avatar.svg?name=John+Doe&background=000000&color=e5c296" />
              </a>
              <div className="content">
                <a className="author">{this.state.userId == chat.userA ? this.state.users[chat.userA].firstname : this.state.users[chat.userB].firstname} </a>
                <div className="right floated metadata">
                  <div className="date">5 mins ago</div>
                </div>
                <div
                  className="text"
                  style={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                  >
                  Hey guys, I hope this example comment is helping you read this
                  documentation.
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
        <div className="ui segment chatListItem readChat">
          <div className="ui comments">
            <div className="ui comment">
              <a className="avatar">
                <img src="https://avatar.oxro.io/avatar.svg?name=John+Doe&background=000000&color=e5c296" />
              </a>
              <div className="content">
                <a className="author">John Doe</a>
                <div className="metadata">
                  <div className="date">5 mins ago</div>
                </div>
                <div className="text">
                  Hey guys, I hope this example comment is helping you read this
                  documentation.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  updateChatName = () => {
    const { currPersonalId } = this.state;

    console.log(currPersonalId);

    if (!currPersonalId) return;

    firestore.collection('personal')
    .doc(currPersonalId)
    .get()
    .then(doc => {
      firestore.collection("users")
      .doc(doc.data().userB)
      .get()
      .then(doc => {
        console.log(doc.data());
        this.setState({ chatName: `${doc.data().firstname} ${doc.data().lastname}` });
      })
    })
  }

  renderSearchBox = () => {
    return (
      <div className="ui stretched segment " style={{ height: '95%' }}>
        <div className="ui form" onSubmit={this.handlesubmit}>
          <h2>Connect</h2>
          <h5>
            Connect with a mentor to find out more about your dream
            major/university.{' '}
          </h5>
          <div className="ui hidden divider"></div>
          <div className="field">
            <label>Field of Study</label>
            <Dropdown
              placeholder="Field of Study"
              fluid
              search
              selection
              options={majorOptions}
              onChange={(e, { value }) => {
                this.setState({ major: value });
              }}
              required
            />
          </div>
          <div className="ui field">
            <label>Country</label>
            <Dropdown
              placeholder="Country"
              fluid
              search
              selection
              options={countryOptions}
              onChange={(e, { value }) => {
                this.setState({ country: value }, () => { this.updateUniversity() })
              }}
              required
            />
          </div>
          <div className="ui field">
            <label>University</label>
            <Dropdown
              placeholder="University"
              fluid
              search
              selection
              options={this.state.uniOptions}
              onChange={(e, { value }) => {
                this.setState({ university: value });
              }}
              required
            />
          </div>
          <button
            onClick={this.connectStudent}
            className="ui fluid primary button"
          >
            Connect
          </button>
        </div>
      </div>
    );
  };

  renderRecommendations = () => {
    return (
      <div className="ui stretched segment" style={{ height: '100%' }}>
        <h2>For You</h2>
        <h5>
          Based on your profile, here are some mentors that can help you.{' '}
        </h5>
        <div className="ui grid">
          <div className="ui two wide stretched column">
            <button className="ui icon left button" id="arrow">
              <i className="big icon angle left" />
            </button>
          </div>
          <div className="ui twelve wide stretched column">
            <div>
              <div className="ui tiny rounded left floated image vertical-center">
                <img src="https://avatar.oxro.io/avatar.svg?name=Leia+Louie&background=000000&color=e5c296" />
              </div>
              <div className="vertical-center">
                <strong>Mentor Name</strong>
                <div>Major</div>
                <div style={{ color: 'grey' }}>University, Country</div>
              </div>
            </div>
          </div>
          <div className="ui two wide stretched column">
            <button className="ui icon right button" id="arrow">
              <i className="big icon angle right" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  renderActivity = () => {
    return (
      <div className="ui segment" style={{ height: '95%' }}>
        <h2>Your Activity</h2>
        <div className="ui cards">
          <div className="card">
            <div className="content">
              <img
                className="left floated mini ui rounded image"
                src="https://avatar.oxro.io/avatar.svg?name=Elliot+Fu&background=000000&color=e5c296"
              />
              <div className="header">Elliot Fu</div>
              <div className="meta">5 minutes ago</div>
              <div className="description">
                Elliot Fu is now connected with you
              </div>
            </div>
          </div>
          <div className="card">
            <div className="content">
              <img
                className="left floated mini ui rounded image"
                src="https://avatar.oxro.io/avatar.svg?name=Elliot+Fu&background=000000&color=e5c296"
              />
              <div className="header">Elliot Fu</div>
              <div className="meta">5 minutes ago</div>
              <div className="description">
                Elliot Fu is now connected with you
              </div>
            </div>
          </div>
          <div className="card">
            <div className="content">
              <img
                className="left floated mini ui rounded image"
                src="https://avatar.oxro.io/avatar.svg?name=Elliot+Fu&background=000000&color=e5c296"
              />
              <div className="header">Elliot Fu</div>
              <div className="meta">5 minutes ago</div>
              <div className="description">
                Elliot Fu is now connected with you
              </div>
            </div>
          </div>
          <div className="card">
            <div className="content">
              <img
                className="left floated mini ui rounded image"
                src="https://avatar.oxro.io/avatar.svg?name=Elliot+Fu&background=000000&color=e5c296"
              />
              <div className="header">Elliot Fu</div>
              <div className="meta">5 minutes ago</div>
              <div className="description">
                Elliot Fu is now connected with you
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderStatistics = () => {
    return (
      <div
        className="ui stretched segment"
        style={{ bottom: '0', height: '15vh', position: 'absolute' }}
      >
        <div className="ui two column grid">
          <div className="column ">
            <div className="ui tiny statistic vertical-center">
              <div className="value">This Month</div>
            </div>
          </div>
          <div className="column">
            <div className="ui statistic vertical-center">
              <div className="value">16</div>
              <div className="label">Connections</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { chatMessage } = this.state;

    return (
      <div className="background-container">
        <div id="rooms" className={'ui container'}>
          <div className="ui grid">
            <div className="ui row">
              <div className="ui six wide stretched column">
                {/* Student Personal */}
                <div className="ui row">{this.renderSearchBox()}</div>
                <div className="ui row">{this.renderRecommendations()}</div>

                {/* Mentor Personal */}
                {/* <div className="ui row">{this.renderActivity()}</div>
                <div className="ui row">{this.renderStatistics()}</div> */}
              </div>
              <div className="ui ten wide stretched column">
                <div className={'conversationContainer'}>
                  <div className={'roomList'}>
                    <div className={'searchBar'}>
                      <input
                        className={'searchInput'}
                        type="text"
                        value={this.state.searchterm}
                        onChange={this.handleChange}
                        placeholder="Search"
                      />
                      <a>
                        <FontAwesomeIcon
                          className={'roomSearch'}
                          icon={faSearch}
                        />
                      </a>
                    </div>
                    {this.renderPersonal()}
                  </div>
                  <div className={'chatContainer'}>
                    <div className={'chatTitle'}>
                      <strong>{this.state.chatName}</strong>
                    </div>
                    {this.renderChat()}
                    <div className={'chatInputContainer'}>
                      <a onClick={() => {}}>
                        <FontAwesomeIcon
                          className={'chatSend'}
                          icon={faPaperclip}
                        />
                      </a>
                      <input
                        className={'chatInput'}
                        type="text"
                        value={chatMessage}
                        onChange={this.onChatMessageChange}
                      />
                      <a onClick={this.sendChat}>
                        <FontAwesomeIcon
                          className={'chatSend'}
                          icon={faPaperPlane}
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Personal;
