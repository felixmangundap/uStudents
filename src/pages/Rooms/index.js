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

class Rooms extends Component {
  state = {
    chatMessage: '',
    chatHistory: [],
    userId: auth().currentUser.uid,
    name: '',
    fieldOfStudy: '',
    country: '',
    university: '',
    searchterm: '',
    user: {},
    userRooms: [],
    rooms: [],
    currentChatId: '',
    newRoomName: '',
    newRoomCountry: '',
    newRoomDescription: '',
    newRoomMajor: '',
    newRoomUniversity: '',
  };

  componentDidMount() {
    this.getChat();
    this.getUserRooms();
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
        console.log(err.toString());
      });
  };

  getUserRooms = async () => {
    const userId = auth().currentUser.uid;

    firestore
      .collection('users')
      .doc(userId)
      .get()
      .then(doc => {
        const userRooms =  doc.data().rooms;
        if (userRooms) {
          this.setState({ userRooms }, () => {
            this.getRooms(userId);
          });
        } else {
          this.setState({ rooms: [] });
        }
      });
  }

  getRooms = (userId) => {
    const { userRooms } = this.state;
    console.log(userRooms);
    firestore
      .collection('rooms')
      .where('id', 'in', userRooms)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const rooms = change.doc.data();
          if (change.type === 'added') {
            rooms.push(rooms);
          }
        });
      })
      .catch((err) => {
        console.log(err.toString());
      });
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
  };

  searchRooms = async () => {
    //TODO
  };

  createRooms = async () => {
    const {
      newRoomName,
      newRoomCountry,
      newRoomDescription,
      newRoomMajor,
      newRoomUniversity,
    } = this.setState;
    
    
    console.log(auth().currentUser.uid,);
    
    const timestamp = moment().valueOf();
    const chatId = uuidv4();
    const roomId = uuidv4();
    
    const userId = auth().currentUser.uid;
    
    const roomItem = {
      chatId,
      name: 'First test',
      country: 'Canada',
      description: 'TESTING',
      major: 'CS',
      university: 'Waterloo',
    }

    firestore
      .collection('chats')
      .doc(chatId)
      .collection(chatId)
      .doc(timestamp.toString())
      .set({})
      .then(() => {
        firestore.collection("rooms")
        .doc(roomId)
        .set(roomItem)
        .then(() => {
          firestore.collection("users")
          .doc(userId)
          .get()
          .then(doc => {
            if (doc.data().rooms) {
              const userRooms =  doc.data().rooms;
              const newUserRooms = [...userRooms, roomId];
              firestore.collection("users")
              .doc(userId)
              .update({
                rooms: newUserRooms,
              })
            } else {
              const userRooms = [roomId];
              firestore.collection("users")
              .doc(userId)
              .update({
                rooms: userRooms,
              })
            }
          });
        })
      })
      .catch((err) => {
        console.log(err.toString());
      });
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

  renderRooms = () => {
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
      <div className="ui segment">
        <div className="ui form" onSubmit={this.handlesubmit}>
          <h2>Explore Rooms</h2>
          <div className="ui field">
            <label>Room Name</label>
            <input
              type="text"
              name="name"
              placeholder="Room Name"
              onChange={this.handleChange}
            />
          </div>
          <div className="ui field">
            <div className="two fields">
              <div className="field">
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
            </div>
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
            Search Rooms
          </button>
          <div className="ui horizontal divider">Or</div>
          <button onClick={this.createRooms} className="ui fluid button">
            Create Room
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
          Based on your profile, here are some rooms that you may find useful.{' '}
        </h5>
        <div className="ui grid">
          <div className="ui two wide stretched column">
            <button className="ui icon left button" id="arrow">
              <i className="big icon angle left" />
            </button>
          </div>
          <div className="ui twelve wide stretched column">
            <div className="ui centered card">
              <div className="content">
                <div className="center aligned header">Room Name</div>
                <div className="center aligned description">
                  <p>Field of Study</p>
                  <p>Country</p>
                  <p>
                    <i className="ui icon group"></i>75 Members
                  </p>
                </div>
              </div>
              <div className="ui bottom attached button">
                <i className="add icon"></i>
                Join Room
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

  render() {
    const { chatMessage } = this.state;

    return (
      <div className="background-container">
        <div id="rooms" className={'ui container'}>
          <div className="ui grid">
            <div className="ui row">
              <div className="ui six wide stretched column">
                <div className="ui row">{this.renderSearchBox()}</div>
                <div className="ui row">{this.renderRecommendations()}</div>
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
                    {this.renderRooms()}
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

export default Rooms;
