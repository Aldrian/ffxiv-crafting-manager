import gql from 'graphql-tag';

export const GET_ITEMS = gql`
	query {
		allItems {
			id
			itemId
			name
			type
			stock
			job
			soldPrice
			recipe {
				amount
				ingredient {
					id
					itemId
					name
					stock
					job
					soldPrice
				}
				usedIn {
					id
					itemId
					name
					stock
					job
					soldPrice
				}
			}
		}
	}
`;
