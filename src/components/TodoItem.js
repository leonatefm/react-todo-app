import React from 'react';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import colorMap from '../data/colors.json';

class TodoItem extends React.PureComponent {

	constructor(props) {
		super(props);
		this.textInput = React.createRef();
		this.handleItemChange = this.handleItemChange.bind(this);
		this.handleItemDelete = this.handleItemDelete.bind(this);
		this.handleItemOnBlur = this.handleItemOnBlur.bind(this);
	}

	componentDidMount() {
		//Autofocus on new todo item
		if (this.props.item.isNew) {
			this.textInput.current.focus();
		}
	}

	handleItemOnBlur(e) {

		const item = this.props.item;

		if (!item.isNew) return;

		let newItem;

		if (item.title.length === 0) {
			this.props.editItem("delete", item.itemId);
		} else {
			newItem = update(item, { $unset: ["isNew"] });
			this.props.editItem("update", item.itemId, newItem);
		}
	}

	handleItemChange(e) {

		const item = this.props.item;
		let newItem;

		if (e.type === "change") {
			newItem = update(item, { title: { $set: e.target.value } });
		} else if (e.type === "click") {
			newItem = update(item, { isComplete: { $apply: function (value) { return !value } } });
		}

		this.props.editItem("update", item.itemId, newItem);
	}

	handleItemDelete(e) {

		const item = this.props.item;

		this.props.editItem("delete", item.itemId);
	}

	render() {

		const status = this.props.item.isComplete ? "complete" : "pending";
		const bgStyle = this.props.item.isComplete ? {
			backgroundColor: colorMap[this.props.color] ? colorMap[this.props.color] : "#B5B5B5"
		} : {};

		return (
			<li className={status}>
				<span className="todo-status" onClick={this.handleItemChange}><span className="fill" style={bgStyle}></span></span>
				<input className="todo-content" ref={this.textInput} type="text" value={this.props.item.title} onChange={this.handleItemChange} onBlur={this.handleItemOnBlur} />
				<a className="delete-btn" onClick={this.handleItemDelete}><ion-icon name="close"></ion-icon></a>
			</li>
		)
	}
};

TodoItem.defaultProps = {
	color: 'gray'
};

TodoItem.propTypes = {
	item: PropTypes.shape({
		itemId: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
        isComplete: PropTypes.bool,
        isNew: PropTypes.bool
	}).isRequired,
	color: PropTypes.string,
	editItem: PropTypes.func.isRequired
};

export default TodoItem;