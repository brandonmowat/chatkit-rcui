import { Component } from 'react';
import { ChatManager, TokenProvider } from '@pusher/chatkit'
import { ChatFeed } from 'react-chat-ui'

export default class App extends Component {

	constructor() {
		const chatManager = new ChatManager({
		 	instanceLocator: 'v1:us1:cb86d714-ead7-42a2-aece-f1f647c3cd2c',
		  userId: 'sarah',
		  tokenProvider: new TokenProvider({ url: 'your.auth.url' })
		})
	}

	componentDidMount() {

	}

	render() {
		return <h1>hey</h1>
	}

}