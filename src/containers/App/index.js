import React, {Component} from 'react';
import {Query} from 'react-apollo';
import styled from 'react-emotion';

import ItemSearch from '../../components/ItemSearch';
import {GET_ITEMS} from '../../utils/queries';

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
			<Query query={GET_ITEMS}>
				{({loading, error, data}) => {
					if (loading) return <p>Loading</p>;
					if (error) return <p>Error!: ${error.toString()}</p>;
					console.log(data);
					const {allItems} = data;

					return (
						<AppMain>
							<ItemSearch storedItems={allItems} />
						</AppMain>
					);
				}}
			</Query>
		);
	}
}

export default App;
