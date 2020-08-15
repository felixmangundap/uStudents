import React, { Component } from 'react';
import { signout } from "../../services/auth";

class Chat extends Component {
  state = {
  }

  componentDidMount() {}

  onSignout = async (e) => {
    e.preventDefault();
    try {
      await signout();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.onSignout}>Logout</button>
      </div>
    )
  }
}

export default Chat;
