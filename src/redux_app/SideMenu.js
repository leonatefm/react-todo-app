import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from './MenuItem.js';
import colorMap from '../data/colors.json';
import { connect } from 'react-redux';

import { switchList, addList, editList, deleteList, searchList } from './actions.js';

class SideMenu extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			mode: 'view'
		}
		this.switchMode = this.switchMode.bind(this);
	}

	switchMode() {
		this.setState({
			mode: this.state.mode === "view" ? "edit" : "view"
		});
	}

	render() {
		const todoListElems = Object.keys(this.props.lists).map((listId) => {
			const list = this.props.lists[listId];
			const isActive = list.listId === this.props.currentListId ? true : false;
			return <MenuItem key={list.listId} list={list} isActive={isActive} switchList={this.props.switchList} editList={this.props.editList} deleteList={this.props.deleteList} mode={this.state.mode}></MenuItem>
		});

		return (
			<div className={"side-menu " + this.state.mode + "-mode"}>
				<h3>Reactodo</h3>
				<div className="search-box"><input type="text" placeholder="Search" value={this.props.searchKeyword} onChange={(e) => { this.props.searchList(e.target.value) }} /></div>
				<ul className="todo-lists">
					{todoListElems}
				</ul>
				<div className="list-actions">
					<a className="add-btn" onClick={this.props.addList}>Add List</a>
					<a className="edit-btn" onClick={this.switchMode}>{this.state.mode === "view" ? "Edit" : "Done"}</a>
				</div>
			</div>
		);
	}
};

SideMenu.propTypes = {
    lists: PropTypes.object.isRequired,
    currentListId: PropTypes.string.isRequired,
    switchList: PropTypes.func.isRequired,
    editList: PropTypes.func.isRequired,
    searchList: PropTypes.func.isRequired,
    searchKeyword: PropTypes.string
};

//Create container component to connect store

const mapStateToProps = state => {
	return {
		lists: state.lists,
		currentListId: state.todoApp.currentListId,
		searchKeyword: state.todoApp.searchKeyword
	};
};

const mapDispatchToProps = dispatch => {
	return {
		switchList: listId => {
			dispatch(switchList(listId));
		},
		addList: () => {
			const colors = Object.keys(colorMap);
			const newList = {
				listId: (Date.now() + Math.random()).toString(36).substr(2),
				name: "New List",
				color: colors[Math.floor(Math.random() * colors.length)],
				todos: [],
				isNew: true
			};
			dispatch(addList(newList));
		},
		editList: (listId, name, removeNewFlag) => {
			dispatch(editList(listId, name, removeNewFlag));
		},
		deleteList: (listId) => {
			dispatch(deleteList(listId));
		},
		searchList: (keyword) => {
			dispatch(searchList(keyword));
		}
	};
};

const SideMenuContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SideMenu);

export default SideMenuContainer;