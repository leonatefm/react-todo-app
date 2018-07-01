import React from 'react';
import PropTypes from 'prop-types';
import colorMap from '../data/colors.json';
import { connect } from 'react-redux';

import { toggleTodo, editTodo, deleteTodo } from './actions.js';

class TodoItem extends React.PureComponent {

	constructor(props) {
		super(props);
		this.textInput = React.createRef();
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
		if (item.isNew) this.props.editTodo(item.itemId, e.target.value, true);
	}

	render() {
		const status = this.props.item.isComplete ? "complete" : "pending";
		const bgStyle = this.props.item.isComplete ? {
			backgroundColor: colorMap[this.props.color] ? colorMap[this.props.color] : "#B5B5B5"
		} : {};

		return (
			<li className={status}>
				<span className="todo-status" onClick={()=>{this.props.toggleTodo(this.props.itemId)}}><span className="fill" style={bgStyle}></span></span>
				<input className="todo-content" ref={this.textInput} type="text" value={this.props.item.title} onChange={(e)=>{this.props.editTodo(this.props.itemId, e.target.value )}} onBlur={this.handleItemOnBlur} />
				<a className="delete-btn" onClick={()=>{this.props.deleteTodo(this.props.listId, this.props.itemId)}}><ion-icon name="close"></ion-icon></a>
			</li>
		)
	}
};

TodoItem.defaultProps = {
	color: 'gray'
};

TodoItem.propTypes = {
	itemId: PropTypes.string.isRequired,
	listId: PropTypes.string.isRequired,
	item: PropTypes.shape({
		itemId: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
        isComplete: PropTypes.bool,
        isNew: PropTypes.bool
	}).isRequired,
	color: PropTypes.string,
	editTodo: PropTypes.func.isRequired,
	toggleTodo: PropTypes.func.isRequired,
	deleteTodo: PropTypes.func.isRequired
};

//Create container component to connect store

const mapStateToProps = (state, ownProps) => {
	return {
		item: state.todos[ownProps.itemId]
	};
};

const mapDispatchToProps = dispatch => {
	return {
		editTodo: (itemId, name, removeNewFlag) => {
			dispatch(editTodo(itemId, name, removeNewFlag));
		},
		toggleTodo: (itemId) => {
			dispatch(toggleTodo(itemId));
		},
		deleteTodo: (listId, itemId) => {
			dispatch(deleteTodo(listId, itemId));
		}
	};
};

const TodoItemContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TodoItem);

export default TodoItemContainer;
