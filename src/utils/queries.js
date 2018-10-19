import gql from 'graphql-tag';

export const GET_ITEMS = gql`
	query {
		allItems {
			id
			itemId
			name
			type
			stock
			soldPrice
			recipe {
				amount
				ingredient {
					id
					itemId
					name
					stock
					soldPrice
				}
				usedIn {
					id
					itemId
					name
					stock
					soldPrice
				}
			}
		}
	}
`;
