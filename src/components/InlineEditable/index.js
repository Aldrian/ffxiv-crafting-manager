import React, {Component} from 'react';
import styled from 'react-emotion';

class InlineEditable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isEditing: props.isEditing || false,
			value: props.value,
		};
	}

	handleFocus = () => {
		if (this.state.isEditing) {
			if (typeof this.props.onFocusOut === 'function') {
				this.props.onFocusOut(this.state.value);
			}
		}
		this.setState({
			isEditing: !this.state.isEditing,
		});
	};

	handleChange = (e) => {
		this.setState({
			value: e.target.value,
		});
	};

	componentWillReceiveProps(newProps) {
		if (newProps.value !== this.state.value) {
			this.setState({value: newProps.value});
		}
	}

	render() {
		const {isEditing, value} = this.state;
		const {type, placeholder} = this.props;

		return isEditing ? (
			<input
				style={{
					width: `${String(value).length * 6 + 17}px`,
					fontFamily: 'Ligne',
					fontSize: '10px',
				}}
				type={type}
				value={value}
				onChange={this.handleChange}
				onBlur={this.handleFocus}
				placeholder={placeholder}
				autoFocus
			/>
		) : (
			<span onClick={this.handleFocus}>{value}</span>
		);
	}
}

export default InlineEditable;
