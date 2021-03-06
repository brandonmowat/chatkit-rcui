import React, { Component } from 'react'
import { ChatManager, TokenProvider } from '@pusher/chatkit'
import { ChatFeed, Message } from 'react-chat-ui'

const styles = {
  chatInput: {
    flex: 1,
  },
  inputStyle: {
    border: 'none',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: '#ddd',
    fontSize: 16,
    outline: 'none',
    paddingTop: 20,
    paddingBottom: 20,
    width: '100%',
  },
}

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tempUsername: '',
      currentUsername: '',
      messageToSend: '',
      messages: [],
    }

    this.onChange = this.onChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

    this.hooks = {
      onNewMessage: message => {
        this.setState({
          messages: [
            ...this.state.messages,
            new Message({
              id:
                message.senderId === this.state.currentUsername
                  ? 0
                  : message.senderId,
              message: message.text,
              senderName: message.senderId,
            }),
          ],
        })
      },
    }
  }

  componentDidMount() {
    if (this.state.currentUsername) {
      this.connectToChatManager(this.state.currentUsername)
    }
  }

  connectToChatManager(userId) {
    this.chatManager = new ChatManager({
      instanceLocator: 'v1:us1:cb86d714-ead7-42a2-aece-f1f647c3cd2c',
      userId,
      tokenProvider: new TokenProvider({
        url:
          'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/cb86d714-ead7-42a2-aece-f1f647c3cd2c/token',
      }),
    })

    this.chatManager
      .connect()
      .then(currentUser => {
        this.setState({ currentUser })
        this.joinRoom(currentUser)
      })
      .then(currentRoom => {
        this.setState({ currentRoom })
      })
      .catch(err => {
        console.log('Error on connection', err)
      })
  }

  // Create a user and update our currentUser state
  createUser(username) {
    fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    })
      .then(response => {
        this.setState({
          currentUsername: username,
        })
        this.connectToChatManager(username)
      })
      .catch(error => console.error('error', error))
  }

  joinRoom(currentUser) {
    // join a room
    currentUser.joinRoom({ roomId: 7591800 }).then(room => {
      this.setState({ room })
      currentUser.subscribeToRoom({
        roomId: room.id,
        messageLimit: 100,
        hooks: this.hooks,
      })
    })
  }

  onChange(e) {
    if (this.state.currentUsername) {
      this.setState({ messageToSend: e.target.value })
    } else {
      this.setState({ tempUsername: e.target.value })
    }
  }

  handleSubmit(e) {
    e.preventDefault()

    if (!this.state.currentUsername) {
      this.createUser(this.state.tempUsername)
    } else if (!this.state.messageToSend) {
      return
    } else {
      this.state.currentUser.sendMessage({
        text: this.state.messageToSend,
        roomId: this.state.room.id,
      })
      this.setState({ messageToSend: '' })
    }
  }

  render() {
    return (
      <div>
        <ChatFeed
          messages={this.state.messages} // Boolean: list of message objects
          hasInputField={false} // Boolean: use our input, or use your own
          showSenderName // show the name of the user who sent the message
          bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
          maxHeight={500}
        />
        <form onSubmit={this.handleSubmit} style={styles.chatInput}>
          <input
            style={styles.inputStyle}
            type="text"
            name={`${
              this.state.currentUsername ? 'message' : 'currentUsername'
            }`}
            placeholder={`${
              this.state.currentUsername
                ? 'Type a message...'
                : 'Please type your username...'
            }`}
            value={`${
              this.state.currentUsername
                ? this.state.messageToSend
                : this.state.tempUsername
            }`}
            onChange={this.onChange}
          />
        </form>
      </div>
    )
  }
}
