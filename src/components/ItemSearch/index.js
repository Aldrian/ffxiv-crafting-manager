import React, {Component} from 'react';
import Autocomplete from 'react-autocomplete';
import {Mutation} from 'react-apollo';
import {forEach} from 'async';
import {Input, signalRed, primaryNavyBlue} from '../../utils/content';
import {CREATE_ITEM} from '../../utils/mutations';

class ItemSearch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchData: [],
			searchString: '',
			searchError: false,
			errors: {
				search: false,
				notCraftable: false,
				notFound: false,
				alreadyAdded: false,
			},
		};
	}

	getSearchData = async (value) => {
		const search = await fetch(
			`https://garlandtools.org/api/search.php?type=item&lang=fr&craftable=1&text=${value}`,
		);
		const searchArray = await search.json();

		this.setState({
			searchData: searchArray,
			searchError: searchArray.length === 0,
		});
	};

	getItemData = async (item, createItem) => {
		const {storedItems} = this.props;

		console.log(storedItems);
		if (storedItems.find(e => e.itemId === item.id)) {
			console.log('already crafted');
			this.setState({
				errors: {
					...this.state.errors,
					alreadyAdded: true,
				},
			});
			return;
		}
		const searchItemById = id => `https://www.garlandtools.org/db/doc/item/fr/3/${id}.json`;
		const getType = (e) => {
			if (e.nodes || e.fishingSpots || e.reducedFrom) return 'GATHERABLE';
			if (e.tradeShops) return 'BUYABLE';
			if (e.drops) return 'LOOTABLE';
			if (e.craft) return 'CRAFTABLE';
		};

		try {
			const search = await fetch(searchItemById(item.id));
			const searchData = await search.json();

			console.log(searchData);
			const {ingredients} = searchData;

			if (!ingredients) {
				this.setState({
					errors: {
						...this.state.errors,
						notCraftable: true,
					},
				});
				return;
			}
			const items = ingredients.map(e => ({
				name: e.name,
				itemId: e.id,
				type: getType(e),
			}));
			const craftableIngredients = ingredients
				.filter(e => e.craft)
				.map(e => ({
					craft: e.craft[0].ingredients
						.filter(e => searchData.partials.find(
							p => p.id === String(e.id),
						))
						.map(e => ({
							amount: e.amount,
							name: searchData.partials.find(
								p => p.id === String(e.id),
							).obj.n,
							id: e.id,
						})),
					name: e.name,
					itemId: e.id,
				}));
			const itemData = {
				name: searchData.item.name,
				job: searchData.item.craft[0].job,
				craft: searchData.item.craft[0].ingredients
					.filter(e => searchData.partials.find(p => p.id === String(e.id)))
					.map(e => ({
						amount: e.amount,
						name: searchData.partials.find(
							p => p.id === String(e.id),
						).obj.n,
						id: e.id,
					})),
			};

			try {
				const addedItems = await Promise.all(
					items.map(item => createItem({
						variables: {
							itemId: String(item.itemId),
							type: item.type,
							name: item.name,
						},
					})),
				);

				console.log(addedItems);
			}
			finally {
				// query allItems
				// checker que l'item qu'on veut ne soit pas dans le store
				// Séparer ceux qui ne sont pas créés, les créés
				// Puis MAJ la query
				// Puis faire les liens de craft
				// puis ajouter l'objet final
				// puis maj le store
			}
		}
		catch (e) {
			console.log(e);
			this.setState({
				errors: {
					...this.state.errors,
					notFound: true,
				},
			});
		}
	};

	render() {
		const {searchData, searchString, searchError} = this.state;

		return (
			<Mutation mutation={CREATE_ITEM}>
				{createItem => (
					<Autocomplete
						getItemValue={item => item.obj.n}
						items={this.state.searchData}
						renderItem={(item, isHighlighted) => (
							<div
								style={{
									background: isHighlighted
										? 'lightgray'
										: 'white',
								}}
							>
								{item.obj.n}
							</div>
						)}
						value={searchString}
						onChange={(e) => {
							this.setState({searchString: e.target.value});
							if (e.target.value.length > 3) {
								this.getSearchData(e.target.value);
							}
						}}
						onSelect={(val, item) => {
							this.setState({searchString: val});
							this.getItemData(item, createItem);
						}}
						inputProps={{
							style: {
								border: `1px solid ${
									searchError ? signalRed : primaryNavyBlue
								}`,
								color: primaryNavyBlue,
								fontSize: '22px',
								padding: '14px 18px',
								fontFamily: 'Ligne',
							},
						}}
					/>
				)}
			</Mutation>
		);
	}
}

export default ItemSearch;
