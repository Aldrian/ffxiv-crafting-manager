import React, {Component} from 'react';
import styled, {css} from 'react-emotion';
import {Mutation} from 'react-apollo';
import {gray20} from '../../utils/content';
import {UPDATE_ITEM_PRICE, UPDATE_ITEM_STOCK} from '../../utils/mutations';
import {GET_ITEMS} from '../../utils/queries';
import InlineEditable from '../InlineEditable';

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
	padding: 5px 10px;
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
	padding-right: 16px;
	margin-top: 0;
`;

const ItemInfos = styled('div')`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
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

const ChestIcon = styled('img')`
	height: 25px;
	width: auto;
	margin-right: 5px;
`;

const InfoLabel = styled('p')`
	display: inline-block;
	margin: 0;
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

class Item extends Component {
	editItemPrice = (soldPrice, updateItem) => {
		updateItem({
			variables: {id: this.props.item.id, soldPrice},
			update: (cache, {data: {updateItem}}) => {
				const data = cache.readQuery({
					query: GET_ITEMS,
				});
				const updatedItem = data.allItems.find(
					e => e.id === updatedItem.id,
				);

				updatedItem = {...updatedItem};
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

	render() {
		const {item} = this.props;

		return (
			<ItemMain type={item.type}>
				{(item.type === 'FINAL' || item.type === 'CRAFTABLE') && (
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
				{(item.type === 'FINAL' || item.type === 'CRAFTABLE') && (
					<ItemInfos>
						<ItemInfo>
							<PriceLabel>Prix de revient: </PriceLabel>
						</ItemInfo>
						<ItemInfo>
							<GilIcon
								src="http://garlandtools.org/files/icons/item/1.png"
								alt="gil"
							/>
							<Price>{item.soldPrice}</Price>
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
						<Price>{item.stock}</Price>
					</ItemInfo>
				</ItemInfos>
			</ItemMain>
		);
	}
}

export default Item;
