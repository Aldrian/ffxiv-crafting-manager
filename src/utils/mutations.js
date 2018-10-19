import gql from 'graphql-tag';

export const CREATE_ITEM = gql`
	mutation createItem(
		$itemId: String!
		$type: ItemType!
		$name: String!
		$job: Int
	) {
		createItem(itemId: $itemId, name: $name, type: $type, job: $job) {
			id
			itemId
			name
			type
			job
			stock
			soldPrice
			recipe {
				amount
				ingredient {
					id
					itemId
					stock
					job
					name
					soldPrice
				}
				usedIn {
					id
					itemId
					stock
					job
					name
					soldPrice
				}
			}
		}
	}
`;

export const UPDATE_ITEM_STOCK = gql`
	mutation updateItem($id: ID!, $stock: Int) {
		updateItem(id: $id, stock: $stock) {
			id
			itemId
			name
			type
			job
			stock
			soldPrice
			recipe {
				amount
				ingredient {
					id
					itemId
					stock
					job
					name
					soldPrice
				}
				usedIn {
					id
					itemId
					stock
					job
					name
					soldPrice
				}
			}
		}
	}
`;

export const UPDATE_ITEM_PRICE = gql`
	mutation updateItem($id: ID!, $soldPrice: Int) {
		updateItem(id: $id, soldPrice: $soldPrice) {
			id
			itemId
			name
			type
			job
			stock
			soldPrice
			recipe {
				amount
				ingredient {
					id
					itemId
					stock
					job
					name
					soldPrice
				}
				usedIn {
					id
					itemId
					stock
					job
					name
					soldPrice
				}
			}
		}
	}
`;

export const CREATE_RECIPE = gql`
	mutation createRecipeItem(
		$amount: Int!
		$ingredientId: ID!
		$usedInId: ID!
	) {
		createRecipeItem(
			amount: $amount
			ingredientId: $ingredientId
			usedInId: $usedInId
		) {
			amount
			ingredient {
				id
				itemId
				job
				stock
				name
				soldPrice
			}
			usedIn {
				id
				job
				itemId
				stock
				name
				soldPrice
			}
		}
	}
`;
