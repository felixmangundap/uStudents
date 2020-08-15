import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { Dropdown } from 'semantic-ui-react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane,
  faPaperclip,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

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
    name: '',
    fieldOfStudy: '',
    country: '',
    university: '',
    searchterm: '',
  };

  componentDidMount() {
    this.getAllUsers();
    this.getChat();
    this.getPersonal();
  }

  componentDidUpdate() {}

  sendChat = async (e) => {
    const { chatMessage: message, userId } = this.state;

    const timestamp = moment().valueOf();

    if (message.trim() === '') return;

    const chatItem = {
      message,
      senderId: userId,
      senderName: 'First Last',
      timestamp,
    };

    firestore
      .collection('chats')
      .doc('7Ps1m0Cc0eO4km8JrG2Q')
      .collection('7Ps1m0Cc0eO4km8JrG2Q')
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
    });
  }

  getChats = (chats) => {
    console.log(this.state.chatList[0])
  }

  getChat = () => {
    const { chatHistory } = this.state;
      
    firestore
      .collection('chats')
      .doc('7Ps1m0Cc0eO4km8JrG2Q')
      .collection('7Ps1m0Cc0eO4km8JrG2Q')
      .onSnapshot(
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              chatHistory.push(change.doc.data());
            }
          });
          this.setState({
            ...this.state,
            isLoading: false,
          });
        },
        (err) => {
          console.log(err.toString());
        }
      );
  };

  getPersonal = async () => {
    const snapshot = await firestore.collection('personal').get()
    const collection = {};
    snapshot.forEach(doc => {
        collection[doc.id] = doc.data();
    });

    const personalChat = []
    
    await firestore
    .collection('users')
    .doc(this.state.userId)
    .onSnapshot(
      (snapshot) => {
          snapshot.data().personal.forEach(id => personalChat.push(collection[id]))
      }
    )

    this.setState({
      ...this.state,
      chatList: personalChat
    }, () => {
      this.getChats(this.state.chatList)
    })

  };

  searchRooms = async () => {
    //TODO
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

    return (
      <div className={'chatList'}>
        <div className="ui segment chatListItem">
          <div className="ui comments">
            <div className="ui comment">
              <a className="avatar">
                <img src="https://avatar.oxro.io/avatar.svg?name=John+Doe&background=000000&color=e5c296" />
              </a>
              <div className="content">
                <a className="author">Stevie Feliciano</a>
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
              //TODO change options
              options={countryOptions}
              onChange={(e, { value }) => {
                this.setState({ country: value });
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
                this.setState({ country: value });
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
              //TODO change options
              options={countryOptions}
              onChange={(e, { value }) => {
                this.setState({ country: value });
              }}
              required
            />
          </div>
          <button
            onClick={this.searchRooms}
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
                      <strong>John Doe</strong>
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
