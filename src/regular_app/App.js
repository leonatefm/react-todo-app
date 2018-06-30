import React, { Component } from 'react';
import '../css/app.css';
import data from '../data/data.json';
import SideMenu from './SideMenu.js';
import ListContent from './ListContent.js';

class TodoApp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			todoLists: data,
			currentListId: "1",
			searchKeyword: ""
		}

		this.switchList = this.switchList.bind(this);
		this.updateList = this.updateList.bind(this);
		this.searchList = this.searchList.bind(this);
	}

	switchList(listId) {
		this.setState({
			currentListId: listId,
			searchKeyword: ""
		});
	}

	updateList(action, listId, list) {
		const todoLists = this.state.todoLists;
		const index = todoLists.findIndex(item => item.listId === listId);
		let newCurrentListId = this.state.currentListId;

		if (action === "update") {
			todoLists[index] = list;
		} else if (action === "delete" && todoLists.length > 1) {
			todoLists.splice(index, 1);
			//Reset current list to the first list when it gets deleted
			if (this.state.currentListId === listId) {
				newCurrentListId = todoLists[0].listId;
			}
		} else if (action === "add") {
			todoLists.push(list);
			newCurrentListId = listId;
		}

		this.setState({
			todoLists: todoLists,
			currentListId: newCurrentListId
		});
	}

	searchList(keyword) {
		if (keyword.length > 0) {
			this.setState({
				currentListId: "",
				searchKeyword: keyword
			});
		} else {
			this.setState({
				currentListId: this.state.todoLists[0].listId,
				searchKeyword: ""
			});
		}
	}

	render() {

		let currentList;
		const searchKeyword = this.state.searchKeyword;

		if (searchKeyword && searchKeyword.length > 0) {
			let searchResults = [];
			this.state.todoLists.forEach(function (list, index) {
				let MenuItem = [];
				list.items.forEach(function (item) {
					if (item.title.toLowerCase().includes(searchKeyword.toLowerCase())) MenuItem.push(item);
				})
				if (MenuItem.length > 0) {
					searchResults.push({ listId: list.listId, name: list.name, color: list.color, items: MenuItem });
				}
			});
			currentList = { name: 'Results for "' + searchKeyword + '"', items: searchResults, isSearchResults: true };
		} else {
			currentList = this.state.todoLists.find(list => list.listId === this.state.currentListId);
		}

		return (
			<div className="react-todo-app">
				<SideMenu todoLists={this.state.todoLists} currentListId={this.state.currentListId} switchList={this.switchList} updateList={this.updateList} searchList={this.searchList} searchKeyword={this.state.searchKeyword}></SideMenu>
				<ListContent list={currentList} updateList={this.updateList}></ListContent>
			</div>
		);
	}
};

export default TodoApp;
