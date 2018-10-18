import gql from 'graphql-tag';

/** ******** APP QUERIES ********* */
export const GET_NETWORK_STATUS = gql`
	query getNetworkStatus {
		networkStatus @client {
			isConnected
		}
	}
`;

export const GET_ITEMS = gql`
	query getItems {
		template @client {
			items
		}
	}
`;

/** ******** USER QUERIES ********* */
export const CHECK_LOGIN_USER = gql`
	query loggedInUserQuery {
		me {
			id
		}
	}
`;

export const GET_USER_CUSTOMERS = gql`
	query userCustomersQuery {
		me {
			id
			company {
				id
				customers {
					id
					name
					email
					address {
						street
						city
						postalCode
						country
					}
					phone
					siret
					rcs
					rm
					vat
				}
			}
		}
	}
`;

export const GET_USER_INFOS = gql`
	query userInfosQuery {
		me {
			id
			email
			firstName
			lastName
			company {
				id
				name
				email
				address {
					street
					city
					postalCode
					country
				}
				phone
				siret
				rcs
				rm
				vat
			}
		}
	}
`;

/** ******** QUOTE QUERIES ********* */

export const GET_ALL_QUOTES = gql`
	query getAllQuotesQuery {
		me {
			id
			company {
				quotes {
					id
					customer {
						name
					}
					issuedAt
					createdAt
					status
				}
			}
		}
	}
`;
export const GET_QUOTE_DATA = gql`
	query getQuoteData($quoteId: ID!) {
		quote(id: $quoteId) {
			id
			template
			name
			options {
				id
				name
				proposal
				sections {
					id
					name
					items {
						id
						name
						unitPrice
						unit
						vatRate
					}
				}
			}
		}
	}
`;