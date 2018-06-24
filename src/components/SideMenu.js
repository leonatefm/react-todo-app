import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from './MenuItem.js';
import colorMap from '../data/colors.json';

class SideMenu extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			mode: 'view'
		}

		this.editLists = this.editLists.bind(this);
		this.addList = this.addList.bind(this);
	}

	editLists() {
		this.setState({
			mode: this.state.mode === "view" ? "edit" : "view"
		});
	}

	addList() {
		const colors = Object.keys(colorMap);
		const newList = {
			listId: (Date.now() + Math.random()).toString(36).substr(2),
			name: "New List",
			color: colors[Math.floor(Math.random() * colors.length)],
			items: [],
			isNew: true
		};

		this.props.updateList("add", newList.listId, newList);
	}

	render() {

		const todoListElems = this.props.todoLists.map((list) => {
			const isActive = list.listId === this.props.currentListId ? true : false;
			return <MenuItem key={list.listId} list={list} isActive={isActive} switchList={this.props.switchList} updateList={this.props.updateList} mode={this.state.mode}></MenuItem>
		});

		return (
			<div className={"side-menu " + this.state.mode + "-mode"}>
				<h3>Reactodo</h3>
				<div className="search-box"><input type="text" placeholder="Search" value={this.props.searchKeyword} onChange={(e) => { this.props.searchList(e.target.value) }} /></div>
				<ul className="todo-lists">
					{todoListElems}
				</ul>
				<div className="list-actions">
					<a className="add-btn" onClick={this.addList}>Add List</a>
					<a className="edit-btn" onClick={this.editLists}>{this.state.mode === "view" ? "Edit" : "Done"}</a>
				</div>
			</div>
		);
	}
};

SideMenu.propTypes = {
    todoLists: PropTypes.arrayOf(PropTypes.object).isRequired,
    currentListId: PropTypes.string.isRequired,
    switchList: PropTypes.func.isRequired,
    updateList: PropTypes.func.isRequired,
    searchList: PropTypes.func.isRequired,
    searchKeyword: PropTypes.string
};

export default SideMenu;