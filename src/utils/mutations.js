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
					name
					soldPrice
				}
				usedIn {
					id
					itemId
					stock
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
				stock
				name
				soldPrice
			}
			usedIn {
				id
				itemId
				stock
				name
				soldPrice
			}
		}
	}
`;
