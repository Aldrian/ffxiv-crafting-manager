import React, {Component} from 'react';
import styled, {css} from 'react-emotion';
import {gray20} from '../../utils/content';

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
	case 'GATHERABLE':
		return css`
				border-bottom: 3px solid #93c47d;
			`;
	case 'LOOTABLE':
		return css`
				border-bottom: 3px solid #f6b26b;
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
`;

const ItemTitle = styled('p')`
	font-size: 12px;
	width: 100%;
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

class Item extends Component {
	render() {
		const {item} = this.props;

		return (
			<ItemMain type={item.type}>
				<ItemTitle>{item.name}</ItemTitle>
				<ItemInfos>
					<ItemInfo>Stock: {item.stock}</ItemInfo>
					<ItemInfo>Vendu: {item.soldPrice}</ItemInfo>
				</ItemInfos>
			</ItemMain>
		);
	}
}

export default Item;
