import React, {Component} from 'react';
import Autocomplete from 'react-autocomplete';
import {Mutation} from 'react-apollo';
import styled from 'react-emotion';
import {
	Input,
	Label,
	signalRed,
	primaryNavyBlue,
	ErrorInput,
} from '../../utils/content';
import {GET_ITEMS} from '../../utils/queries';
import {CREATE_ITEM, CREATE_RECIPE} from '../../utils/mutations';

const ItemSearchMain = styled('div')`
	width: fill-available;
	input {
		width: 550px;
	}
`;
const AutocompleteMain = styled('div')`
	width: 600px;
	margin-left: auto;
	margin-right: auto;
	margin-top: 30px;
`;
const Loading = styled('div')`
	font-size: 70px;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

class ItemSearch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchData: [],
			searchString: '',
			searchError: false,
			addingItem: false,
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

	getItemData = async (item, createItem, createRecipeItem) => {
		// Utils
		const searchItemById = id => `https://www.garlandtools.org/db/doc/item/fr/3/${id}.json`;
		const getType = (e, searchData) => {
			if (
				e.reducedFrom
				|| (e.nodes
					&& searchData.partials.find(
						i => i.id === String(e.nodes[0]),
					)
					&& searchData.partials.find(i => i.id === String(e.nodes[0]))
						.obj.ti)
			) return 'TIMEABLE';
			if (e.nodes || e.fishingSpots) return 'GATHERABLE';
			if (e.drops) return 'LOOTABLE';
			if (e.craft) return 'CRAFTABLE';
			return 'BUYABLE';
		};

		const {storedItems} = this.props;

		// Do not move forwards if the item is already stored
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

		try {
			// Get item data
			const search = await fetch(searchItemById(item.id));
			const searchData = await search.json();
			const {ingredients} = searchData;

			console.log(searchData);

			// Check if the item is craftable
			if (!ingredients) {
				this.setState({
					errors: {
						...this.state.errors,
						notCraftable: true,
						addingItem: false,
					},
				});
				return;
			}
			// Get item list
			const items = ingredients.map(e => ({
				name: e.name,
				itemId: String(e.id),
				type: getType(e, searchData),
				job: e.craft && e.craft[0].job,
			}));

			// Filter items already added
			const itemsToStore = items.filter(
				item => !storedItems.find(
					storedItem => storedItem.itemId === item.itemId,
				),
			);
			// Add them in the store
			const addedItems = await Promise.all(
				itemsToStore.map(item => createItem({
					variables: item,
				})),
			);

			addedItems.forEach(item => storedItems.push(item.data.createItem));

			// List craftable ingredients

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
					itemId: String(e.id),
				}));

			// Add unknown recipes to the store
			// Fill with the store id
			const recipesToAdd = [];

			craftableIngredients.forEach((ingredient) => {
				if (
					storedItems.find(
						e => e.itemId === String(ingredient.itemId),
					).recipe
					&& storedItems.find(
						e => e.itemId === String(ingredient.itemId),
					).recipe.length === 0
				) {
					// No recipe for this ingredient, add it
					ingredient.craft.forEach((craftItem) => {
						recipesToAdd.push({
							ingredientId: storedItems.find(
								e => e.itemId === String(craftItem.id),
							).id,
							usedInId: storedItems.find(
								e => e.itemId === ingredient.itemId,
							).id,
							amount: craftItem.amount,
						});
					});
				}
			});

			// Create recipes if non existent
			const addedRecipes = await Promise.all(
				recipesToAdd.map(recipe => createRecipeItem({
					variables: recipe,
				})),
			);
			// Create final item data
			const itemData = {
				name: searchData.item.name,
				itemId: String(searchData.item.id),
				type: 'FINAL',
				job: searchData.item.craft[0].job,
			};

			// Add them in the store
			const addedFinalItem = await createItem({
				variables: itemData,
			});
			const finalRecipe = [];

			searchData.item.craft[0].ingredients.forEach((ingredient) => {
				if (storedItems.find(e => e.itemId === String(ingredient.id))) {
					finalRecipe.push({
						ingredientId: storedItems.find(
							e => e.itemId === String(ingredient.id),
						).id,
						usedInId: addedFinalItem.data.createItem.id,
						amount: ingredient.amount,
					});
				}
			});

			// Create recipes if non existent
			const addedFinalRecipes = await Promise.all(
				finalRecipe.map(recipe => createRecipeItem({
					variables: recipe,
				})),
			);
		}
		catch (e) {
			console.log(e);
			this.setState({
				errors: {
					...this.state.errors,
					notFound: true,
					addingItem: false,
				},
			});
		}
		finally {
			this.props.refetch();
			this.setState({
				searchData: [],
				searchString: '',
				searchError: false,
				errors: {
					search: false,
					notCraftable: false,
					notFound: false,
					alreadyAdded: false,
					addingItem: false,
				},
			});
		}
	};

	render() {
		const {
			searchData, searchString, searchError, errors,
		} = this.state;

		if (this.state.addingItem) return <Loading>Ajout de l'item...</Loading>;
		return (
			<ItemSearchMain>
				<Mutation mutation={CREATE_ITEM}>
					{createItem => (
						<Mutation mutation={CREATE_RECIPE}>
							{createRecipeItem => (
								<AutocompleteMain>
									<Label>Recherche d'objet craftable</Label>
									<Autocomplete
										getItemValue={item => item.obj.n}
										items={this.state.searchData}
										renderItem={(item, isHighlighted) => (
											<div
												style={{
													background: isHighlighted
														? 'lightgray'
														: 'white',
													paddingTop: '4px',
													paddingBottom: '4px',
												}}
											>
												{item.obj.n}
											</div>
										)}
										menuStyle={{
											borderRadius: '3px',
											boxShadow:
												'0 2px 12px rgba(0, 0, 0, 0.1)',
											background: 'white',
											padding: '2px 0',
											fontSize: '90%',
											position: 'fixed',
											overflow: 'auto',
											maxHeight: '50%', // TODO: don't cheat, let it flow to the bottom
											zIndex: 10000,
										}}
										value={searchString}
										onChange={(e) => {
											this.setState({
												searchString: e.target.value,
											});
											if (e.target.value.length > 3) {
												this.getSearchData(
													e.target.value,
												);
											}
										}}
										onSelect={(val, item) => {
											this.setState({
												searchString: val,
											});
											this.getItemData(
												item,
												createItem,
												createRecipeItem,
											);
										}}
										inputProps={{
											style: {
												border: `1px solid ${
													searchError
														? signalRed
														: primaryNavyBlue
												}`,
												color: primaryNavyBlue,
												fontSize: '22px',
												padding: '14px 18px',
												fontFamily: 'Ligne',
											},
										}}
									/>
									{errors
										&& errors.search && (
										<ErrorInput>
												Erreur de recherche
										</ErrorInput>
									)}
									{errors
										&& errors.notCraftable && (
										<ErrorInput>
												Impossible de craft cet objet
										</ErrorInput>
									)}
									{errors
										&& errors.notFound && (
										<ErrorInput>
												Item non trouvé
										</ErrorInput>
									)}
									{errors
										&& errors.alreadyAdded && (
										<ErrorInput>
												Item déjà ajouté
										</ErrorInput>
									)}
								</AutocompleteMain>
							)}
						</Mutation>
					)}
				</Mutation>
			</ItemSearchMain>
		);
	}
}

export default ItemSearch;
