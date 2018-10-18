import gql from 'graphql-tag';

export const GET_ITEMS = gql`
	query {
		allItems {
			id
			itemId
			name
			soldPrice
			recipe {
				amount
				item {
					id
					itemId
					name
					soldPrice
					recipe {
						amount
						item {
							id
							itemId
							name
							soldPrice
						}
					}
				}
			}
		}
	}
`;
