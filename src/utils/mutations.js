import gql from 'graphql-tag';

export const CREATE_ITEM = gql`
	mutation createItem($itemId: String!, $type: ItemType!, $name: String!) {
		createItem(itemId: $itemId, name: $name, type: $type) {
			id
			itemId
			type
		}
	}
`;
