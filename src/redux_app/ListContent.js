import React from 'react';
import PropTypes from 'prop-types';
import TodoItemContainer from './TodoItem.js';
import colorMap from '../data/colors.json';
import { connect } from 'react-redux';

import { addTodo } from './actions.js';

class ListContent extends React.PureComponent {
	render() {

		const titleStyle = {
			color: this.props.color
		}

		return (
			<div className="list-details">
				<div className="list-header" style={titleStyle}>
					<h1 className="list-name">{this.props.title}</h1>
					{!this.props.isSearchResults && <a className="add-btn" onClick={() => { this.props.addTodo(this.props.currentListId) }}><ion-icon name="add-circle-outline"></ion-icon></a>}
				</div>
				<div className="list-content">
					{this.props.lists.map(list =>
						<section className="list-section" key={list.listId}>
							{this.props.isSearchResults && <h5 style={{ color: colorMap[list.color] }}>{list.name}</h5>}
							<ul className="list-items">{list.todos.map(itemId => <TodoItemContainer key={itemId} itemId={itemId} listId={list.listId} color={list.color}></TodoItemContainer>)}</ul>
						</section>
					)}
				</div>
			</div>
		);
	}
};

ListContent.propTypes = {
	isSearchResults: PropTypes.bool.isRequired,
	currentListId: PropTypes.string,
	title: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired,
	lists: PropTypes.arrayOf(PropTypes.shape({
		listId: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		color: PropTypes.string.isRequired,
		todos: PropTypes.arrayOf(PropTypes.string).isRequired,
		isNew: PropTypes.bool
	})).isRequired,
	addTodo: PropTypes.func.isRequired
};

//Create container component to connect store

const getSearchResults = (lists, todos, keyword) => {
	//Find all the todos matching search keywords
	const filteredTodoIds = Object.keys(todos).filter(todoId => todos[todoId].title.toLowerCase().includes(keyword.toLowerCase()));
	//Generate searchResults based on the filteredTodoIds
	let searchResults = [];
	Object.keys(lists).forEach(listId => {
		const filteredTodos = lists[listId].todos.filter(todoId => filteredTodoIds.includes(todoId));
		if (filteredTodos.length > 0) searchResults.push({listId: listId, name: lists[listId].name, color: lists[listId].color, todos: filteredTodos});
	});
	return searchResults;
}

const mapStateToProps = state => {
	const isSearchResults = (state.todoApp.searchKeyword.length > 0);
	const listContentProps = { isSearchResults: isSearchResults, currentListId: state.todoApp.currentListId };
	if (isSearchResults) {
		listContentProps.title = 'Results for "' + state.todoApp.searchKeyword + '"';
		listContentProps.color = '#000000';
		listContentProps.lists = getSearchResults(state.lists, state.todos, state.todoApp.searchKeyword);
	} else {
		listContentProps.title = state.lists[state.todoApp.currentListId].name;
		listContentProps.color = colorMap[state.lists[state.todoApp.currentListId].color];
		listContentProps.lists = [state.lists[state.todoApp.currentListId]];
	};
	return listContentProps;
};

const mapDispatchToProps = (dispatch) => {
	return {
		addTodo: (listId) => {
			const newItem = {
				itemId: (Date.now() + Math.random()).toString(36).substr(2),
				title: "",
				isComplete: false,
				isNew: true
			};
			dispatch(addTodo(listId, newItem));
		}
	};
};

const ListContentContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ListContent);

export default ListContentContainer;