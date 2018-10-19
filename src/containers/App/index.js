import React, {Component} from 'react';
import {Query} from 'react-apollo';
import styled from 'react-emotion';

import Item from '../../components/Item';
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

const ItemList = styled('div')`
	max-width: 1600px;
	margin-left: auto;
	margin-right: auto;
	margin-top: 120px;
`;

class App extends Component {
	render() {
		return (
			<Query query={GET_ITEMS}>
				{({loading, error, data}) => {
					if (loading) return <p>Loading</p>;
					if (error) return <p>Error!: ${error.toString()}</p>;
					const {allItems} = data;
					const finals = allItems.filter(
						item => item.type === 'FINAL',
					);
					const craftables = allItems.filter(
						item => item.type === 'CRAFTABLE',
					);
					const gatherables = allItems.filter(
						item => item.type === 'GATHERABLE',
					);
					const lootables = allItems.filter(
						item => item.type === 'LOOTABLE',
					);
					const buyables = allItems.filter(
						item => item.type === 'BUYABLE',
					);

					return (
						<AppMain>
							<ItemSearch
								storedItems={allItems}
								refetch={() => {
									this.setState({shouldRefetch: true});
								}}
							/>
							<ItemList>
								{finals
									&& finals.map(item => (
										<Item item={item} />
									))}{' '}
								<br />
								<br />
								<hr />
								<br />
								{craftables
									&& craftables.map(item => (
										<Item item={item} />
									))}
								{gatherables
									&& gatherables.map(item => (
										<Item item={item} />
									))}
								{lootables
									&& lootables.map(item => <Item item={item} />)}
								{buyables
									&& buyables.map(item => <Item item={item} />)}
							</ItemList>
						</AppMain>
					);
				}}
			</Query>
		);
	}
}

export default App;
