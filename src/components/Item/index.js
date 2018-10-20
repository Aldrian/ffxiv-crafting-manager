import React, {Component} from 'react';
import styled, {css} from 'react-emotion';
import {Mutation} from 'react-apollo';
import {
	gray20,
	signalGreen,
	signalOrange,
	signalRed,
} from '../../utils/content';
import {UPDATE_ITEM_PRICE, UPDATE_ITEM_STOCK} from '../../utils/mutations';
import {GET_ITEMS} from '../../utils/queries';
import InlineEditable from '../InlineEditable';

import Confirm from './confirm.svg';
import Cancel from './cancel.svg';

const BorderStyle = (props) => {
	switch (props.type) {
	case 'FINAL':
		return css`
				border-bottom: 3px solid #8e7cc3;
			`;
	case 'CRAFTABLE':
		return css`
				border-bottom: 3px solid #6fa8dc;
			`;
	case 'TIMEABLE':
		return css`
				border-bottom: 3px solid #f6b26b;
			`;
	case 'GATHERABLE':
		return css`
				border-bottom: 3px solid #93c47d;
			`;
	case 'LOOTABLE':
		return css`
				border-bottom: 3px solid #bbb;
			`;
	case 'BUYABLE':
		return css`
				border-bottom: 3px solid #e06666;
			`;
	default:
		return css`
				border-bottom: 3px solid transparent;
			`;
	}
};

const MarginBackground = (props) => {
	if (props.margin > 200000) {
		return css`
			background: ${signalGreen};
		`;
	}
	if (props.margin < 0) {
		return css`
			background: ${signalRed};
		`;
	}
	return css`
		background: ${signalOrange};
	`;
};

const IdToJob = {
	9: 'BSM',
	13: 'WVR',
	12: 'LTW',
	10: 'ARM',
	11: 'GSM',
	15: 'CUL',
	14: 'ALC',
	8: 'CRP',
};

const ItemMain = styled('div')`
	border-left: 2px solid ${gray20};
	border-right: 2px solid ${gray20};
	border-top: 2px solid ${gray20};
	margin-right: 5px;
	margin-bottom: 5px;
	${BorderStyle};
	display: inline-block;
	min-width: 150px;
	position: relative;
`;

const ItemTitle = styled('p')`
	font-size: 12px;
	width: 100%;
	margin-top: 0;
	padding: 5px 10px;
	padding-right: 22px;
`;

const ItemInfos = styled('div')`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 0px 10px;
`;

const ItemInfo = styled('div')`
	font-size: 10px;
`;

const JobIcon = styled('img')`
	height: 18px;
	width: auto;
	position: absolute;
	top: 2px;
	right: 2px;
`;

const GilIcon = styled('img')`
	height: 20px;
	width: auto;
	margin-right: 5px;
`;

const Price = styled('p')`
	display: inline-block;
	margin: 0;
	transform: translateY(-5px);
`;

const PriceLabel = styled('p')`
	display: inline-block;
	margin: 0;
	transform: translateY(3px);
`;

const ItemMargin = styled(ItemInfos)`
	justify-content: space-between;
	padding: 4px 10px;
	${MarginBackground};
`;

const ActionIcon = styled('img')`
	width: auto;
	cursor: pointer;
	height: 20px;
	margin-right: 5px;
`;

class Item extends Component {
	editItemPrice = (soldPrice, updateItem) => {
		updateItem({
			variables: {id: this.props.item.id, soldPrice},
			update: (cache, {data: {updateItem}}) => {
				const data = cache.readQuery({
					query: GET_ITEMS,
				});
				const updatedItem = data.allItems.find(
					e => e.id === updateItem.id,
				);

				updatedItem.soldPrice = updateItem.soldPrice;
				try {
					cache.writeQuery({
						query: GET_ITEMS,
						data,
					});
				}
				catch (e) {
					console.log(e);
				}
			},
		});
	};

	editItemStock = (stock, updateItem, itemId) => {
		updateItem({
			variables: {id: itemId || this.props.item.id, stock},
			update: (cache, {data: {updateItem}}) => {
				const data = cache.readQuery({
					query: GET_ITEMS,
				});
				const updatedItem = data.allItems.find(
					e => e.id === updateItem.id,
				);

				updatedItem.stock = updateItem.stock;
				try {
					cache.writeQuery({
						query: GET_ITEMS,
						data,
					});
				}
				catch (e) {
					console.log(e);
				}
			},
		});
	};

	getItemStock = (item, required, stockItem) => {
		if (!stockItem.find(e => e.name === item.name) && item.stock) {
			if (item.stock >= required) {
				stockItem.push({
					name: item.name,
					amount: required,
					soldPrice: item.soldPrice,
					currentAmount: item.stock,
					id: item.id,
				});
				return;
			}
			stockItem.push({
				name: item.name,
				amount: item.stock,
				soldPrice: item.soldPrice,
				currentAmount: item.stock,
				id: item.id,
			});
		}

		if (item.job) {
			const fullItem = this.props.storedItems.find(
				e => e.name === item.name,
			);

			fullItem.recipe.forEach((item) => {
				this.getItemStock(item.ingredient, item.amount, stockItem);
			});
		}
	};

	craftItem = (updateItem) => {
		this.getAllRelatedItems().forEach((item) => {
			this.editItemStock(
				item.currentAmount - item.amount,
				updateItem,
				item.id,
			);
		});
	};

	getAllRelatedItems = () => {
		const stockItem = [];

		this.props.item.recipe.forEach(item => this.getItemStock(item.ingredient, item.amount, stockItem));
		return stockItem;
	};

	getMargin = item => (
		item.recipe.reduce(
			(sum, item) => sum + item.ingredient.soldPrice * item.amount,
			0,
		)
			- this.getAllRelatedItems().reduce(
				(sum, item) => sum + item.soldPrice * item.amount,
				0,
			)
			+ item.soldPrice
	);

	render() {
		const {item} = this.props;

		return (
			<Mutation mutation={UPDATE_ITEM_STOCK}>
				{updateItem => (
					<ItemMain type={item.type}>
						{(item.type === 'FINAL'
							|| item.type === 'CRAFTABLE') && (
							<JobIcon
								src={`http://garlandtools.org/db/images/${
									IdToJob[item.job]
								}.png`}
								alt="job"
							/>
						)}
						<ItemTitle>
							{String(item.name).replace(/<SoftHyphen\/>/gi, '')}
						</ItemTitle>
						{(item.type === 'FINAL'
							|| item.type === 'CRAFTABLE') && (
							<ItemInfos>
								<ItemInfo>
									<PriceLabel>Prix de revient: </PriceLabel>
								</ItemInfo>
								<ItemInfo>
									<GilIcon
										src="http://garlandtools.org/files/icons/item/1.png"
										alt="gil"
									/>
									<Price>
										{item.recipe.reduce(
											(sum, item) => sum
												+ item.ingredient.soldPrice
													* item.amount,
											0,
										)}
									</Price>
								</ItemInfo>
							</ItemInfos>
						)}
						<ItemInfos>
							<ItemInfo>
								<PriceLabel>Prix marché: </PriceLabel>
							</ItemInfo>
							<ItemInfo>
								<GilIcon
									src="http://garlandtools.org/files/icons/item/1.png"
									alt="gil"
								/>
								<Price value={item.soldPrice}>
									<Mutation mutation={UPDATE_ITEM_PRICE}>
										{updateItem => (
											<InlineEditable
												value={item.soldPrice}
												type="number"
												placeholder="0"
												onFocusOut={(value) => {
													this.editItemPrice(
														parseInt(value),
														updateItem,
													);
												}}
											/>
										)}
									</Mutation>
								</Price>
							</ItemInfo>
						</ItemInfos>
						<ItemInfos>
							<ItemInfo>
								<PriceLabel>En stock :</PriceLabel>
							</ItemInfo>
							<ItemInfo>
								<GilIcon
									src="http://garlandtools.org/db/images/Shop.png"
									alt="gil"
								/>
								<Price value={item.stock}>
									<InlineEditable
										value={item.stock}
										type="number"
										placeholder="0"
										onFocusOut={(value) => {
											this.editItemStock(
												parseInt(value),
												updateItem,
											);
										}}
									/>
								</Price>
							</ItemInfo>
						</ItemInfos>
						{(item.type === 'FINAL'
							|| item.type === 'CRAFTABLE') && (
							<ItemMargin margin={this.getMargin(item)}>
								<div>
									{item.type === 'FINAL' && (
										<ActionIcon src={Cancel} first />
									)}
									{item.type === 'FINAL' && (
										<ActionIcon
											src={Confirm}
											onClick={() => {
												this.craftItem(updateItem);
											}}
										/>
									)}
								</div>
								<ItemInfo>
									<GilIcon
										src="http://garlandtools.org/files/icons/item/1.png"
										alt="gil"
									/>
									<Price>{this.getMargin(item)}</Price>
								</ItemInfo>
							</ItemMargin>
						)}
					</ItemMain>
				)}
			</Mutation>
		);
	}
}

export default Item;
