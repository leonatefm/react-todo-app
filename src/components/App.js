import React, { Component } from 'react';
import '../css/app.css';
import data from '../data/data.json';
import update from 'immutability-helper';

const colorMap = {
	"red": "#ff3b30",
	"pink": "#ff2968",
	"orange": "#ff9500",
	"yellow": "#ffcc00",
	"green": "#4cd964",
	"blue": "#1badf8",
	"purple": "#cc73e1",
	"brown": "#a2845e",
	"gray": "#8e8e91"
};

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
				let listItem = [];
				list.items.forEach(function (item) {
					if (item.title.toLowerCase().includes(searchKeyword.toLowerCase())) listItem.push(item);
				})
				if (listItem.length > 0) {
					searchResults.push({ listId: list.listId, name: list.name, color: list.color, items: listItem });
				}
			});
			currentList = { name: 'Results for "' + searchKeyword + '"', items: searchResults, isSearchResults: true };
		} else {
			currentList = this.state.todoLists.find(list => list.listId === this.state.currentListId);
		}

		return (
			<div className="react-todo-app">
				<SideMenu todoLists={this.state.todoLists} currentListId={this.state.currentListId} switchList={this.switchList} updateList={this.updateList} searchList={this.searchList} searchKeyword={this.state.searchKeyword}></SideMenu>
				<ListDetails list={currentList} updateList={this.updateList}></ListDetails>
			</div>
		);
	}
};

class SideMenu extends Component {

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
			return <ListItem key={list.listId} list={list} isActive={isActive} switchList={this.props.switchList} updateList={this.props.updateList} mode={this.state.mode}></ListItem>
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

class ListItem extends React.PureComponent {

	constructor(props) {
		super(props);
		this.textInput = React.createRef();
		this.handleListChange = this.handleListChange.bind(this);
		this.handleListOnBlur = this.handleListOnBlur.bind(this);
	}

	componentDidMount() {
		//Autofocus on new todo item
		if (this.props.list.isNew) {
			this.textInput.current.focus();
			this.textInput.current.select();
		}
	}

	handleListChange(e) {
		const list = this.props.list;
		let newList;

		if (e.type === "change") {
			newList = update(list, { name: { $set: e.target.value } });
			this.props.updateList('update', list.listId, newList);
		} else if (e.type === "click") {
			this.props.updateList('delete', list.listId);
			e.stopPropagation();
		}
	}

	handleListOnBlur(e) {

		const list = this.props.list;

		if (!list.isNew) return;

		if (list.name.length === 0) {
			this.props.updateList("delete", list.listId);
		} else {
			delete list.isNew;
			this.props.updateList("update", list.listId, list);
		}
	}

	render() {

		const list = this.props.list;
		const listClass = this.props.isActive ? 'active' : '';

		return (
			<li className={listClass} onClick={() => { if (this.props.mode === 'edit') return; this.props.switchList(list.listId) }}>
				<input className="list-name" ref={this.textInput} type="text" value={list.name} disabled={(this.props.mode === "view" && !this.props.list.isNew) ? true : false} onChange={this.handleListChange} onBlur={this.handleListOnBlur} />
				<span className="list-number">{this.props.mode === "view" ? list.items.length : <ion-icon name="close" onClick={this.handleListChange}></ion-icon>}</span>
			</li>
		);
	}
};

class ListDetails extends React.PureComponent {

	constructor(props) {
		super(props);
	}

	render() {

		const list = this.props.list;
		let listContent;

		//Generate list content based on context
		if (!list.isSearchResults) {
			listContent = <ListSection list={list} updateList={this.props.updateList}></ListSection>
		} else {
			listContent = list.items.map((section) => {
				return <ListSection key={section.listId} list={section} updateList={this.props.updateList} sectionTitle="true"></ListSection>
			});
		}

		const titleStyle = {
			color: colorMap[list.color] ? colorMap[list.color] : "#000000"
		}

		return (
			<div className="list-details">
				<div className="list-header" style={titleStyle}>
					<h1 className="list-name">{list.name}</h1>
					{!list.isSearchResults && <a className="add-btn" onClick={this.addItem}><ion-icon name="add-circle-outline"></ion-icon></a>}
				</div>
				<div className="list-content">
					{listContent}
				</div>
			</div>
		);
	}
};

class ListSection extends React.PureComponent {
	constructor(props) {
		super(props);

		this.editItem = this.editItem.bind(this);
		this.addItem = this.addItem.bind(this);
	}

	editItem(action, itemId, item) {
		const list = this.props.list;
		const index = this.props.list.items.findIndex(item => item.itemId === itemId);
		let newList;

		if (action === "update") {
			newList = update(list, { items: { [index]: { $set: item } } });
		} else if (action === "delete") {
			newList = update(list, { items: { $splice: [[index, 1]] } });
		}

		this.props.updateList('update', list.listId, newList);
	}

	addItem() {
		const newItem = {
			itemId: (Date.now() + Math.random()).toString(36).substr(2),
			title: "",
			isComplete: false,
			isNew: true
		};
		const list = this.props.list;

		let newList = update(list, { items: { $push: [newItem] } })

		this.props.updateList('update', list.listId, newList);
	}

	render() {

		const list = this.props.list;

		const todoItems = list.items.map((item) => <TodoItem key={item.itemId} item={item} editItem={this.editItem} color={list.color}></TodoItem>);

		const titleStyle = {
			color: colorMap[list.color] ? colorMap[list.color] : "#000000"
		}

		return (
			<section className="list-section">
				{this.props.sectionTitle && <h5 style={titleStyle}>{list.name}</h5>}
				<ul className="list-items">{todoItems}</ul>
			</section>
		)
	}
}

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

export default TodoApp;
