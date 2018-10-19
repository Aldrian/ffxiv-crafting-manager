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
	margin-top: 50px;
`;

const Loading = styled('div')`
	font-size: 70px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

class App extends Component {
	render() {
		return (
			<Query query={GET_ITEMS}>
				{({
					loading, error, data, refetch,
				}) => {
					if (loading) return <Loading>Chargement...</Loading>;
					if (error) return <p>Error!: ${error.toString()}</p>;
					const {allItems} = data;
					const finals = allItems.filter(
						item => item.type === 'FINAL',
					);
					const craftables = allItems.filter(
						item => item.type === 'CRAFTABLE',
					);
					const timeables = allItems.filter(
						item => item.type === 'TIMEABLE',
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

					console.log(finals);
					console.log(timeables);

					return (
						<AppMain>
							<ItemSearch
								storedItems={allItems}
								refetch={refetch}
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
								<br />
								{timeables
									&& timeables.map(item => <Item item={item} />)}
								<br />
								{gatherables
									&& gatherables.map(item => (
										<Item item={item} />
									))}
								<br />
								{lootables
									&& lootables.map(item => <Item item={item} />)}
								<br />
								{buyables
									&& buyables.map(item => <Item item={item} />)}
								<br />
							</ItemList>
						</AppMain>
					);
				}}
			</Query>
		);
	}
}

export default App;
