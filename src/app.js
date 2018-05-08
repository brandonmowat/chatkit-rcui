import React, { Component } from 'react';
import { ChatManager, TokenProvider } from '@pusher/chatkit'
import { ChatFeed, Message } from 'react-chat-ui'

export default class App extends Component {

	constructor(props) {
		super(props)

		this.state = {
			messages: [
				new Message({
		      id: 1,
		      message: "I'm the recipient! (The person you're talking to)",
		    })
			]
		}

		this.chatManager = new ChatManager({
		 	instanceLocator: 'v1:us1:cb86d714-ead7-42a2-aece-f1f647c3cd2c',
		  userId: 'Brandon',
		  tokenProvider: new TokenProvider({ url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/:instance_id' })
		})
	}

	componentDidMount() {

	}

	render() {
		return (<ChatFeed
      messages={this.state.messages} // Boolean: list of message objects
      hasInputField={false} // Boolean: use our input, or use your own
      showSenderName // show the name of the user who sent the message
      bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
    />)
	}

}