import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import styled from 'react-emotion';
import {Body} from '../../utils/content';
import App from '../App';

const BodyMain = styled(Body)`
	nav {
		a {
			color: #61dafb;
			margin-right: 10px;
		}
	}
`;

class Root extends Component {
	render() {
		return (
			<BodyMain>
				<main>
					<Switch>
						<Route exact path="/" component={App} />
					</Switch>
				</main>
			</BodyMain>
		);
	}
}

export default Root;
