import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import styled from 'react-emotion';

const AppMain = styled('div')`
	nav {
		a {
			color: #61dafb;
			margin-right: 10px;
		}
	}
`;

class App extends Component {
	render() {
		return (
			<AppMain>
				Bonjour
			</AppMain>
		);
	}
}

export default App;
