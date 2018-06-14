import React, { Component } from 'react';
import '../css/app.css';
import data from '../data/data.json';

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
	constructor(props){
		super(props);
		this.state = {
			todoLists: data,
			currentListId: "1"
		}

		this.switchList = this.switchList.bind(this);
		this.updateList = this.updateList.bind(this);
	}

	switchList(listId){
		this.setState({
			currentListId: listId
		});
	}

	updateList(action, listId, list){
		const todoLists = this.state.todoLists;
		const index = todoLists.findIndex(item => item.listId === listId);
		let newCurrentListId = this.state.currentListId;

		if(action === "update"){
			todoLists[index] = list;
		}else if(action === "delete" && todoLists.length>1){
			todoLists.splice(index, 1);	
			//Reset current list to the first list when it gets deleted
			if(this.state.currentListId === listId){
				newCurrentListId = todoLists[0].listId;
			}
		}

		this.setState({
			todoLists: todoLists,
			currentListId: newCurrentListId
		});
	}

	render() {
		const currentList = this.state.todoLists.find(item => item.listId === this.state.currentListId);  
		
		return (
			<div className="react-todo-app">
				<SideMenu todoLists={this.state.todoLists} currentListId={this.state.currentListId} switchList={this.switchList} updateList={this.updateList}></SideMenu>
				<ListDetails list={currentList} updateList={this.updateList}></ListDetails>
			</div>
		);
	}
};

class SideMenu extends Component {

	constructor(props){
		super(props);
		this.state = {
			mode: 'view'
		}

		this.editLists = this.editLists.bind(this);
	}

	editLists(){
		this.setState({
			mode: this.state.mode === "view" ? "edit" : "view"
		});
	}

	render() {

		const todoListElems = this.props.todoLists.map((list) => {
			const isActive = list.listId === this.props.currentListId ? true : false;
			return <ListItem key={list.listId} list={list} isActive={isActive} switchList={this.props.switchList} updateList={this.props.updateList} mode={this.state.mode}></ListItem>
		});

		return (
			<div className={"side-menu " + this.state.mode + "-mode"}>
				<h3>Reactodo</h3>
				<div className="search-box"><input type="text" placeholder="Search" /></div>
				<ul className="todo-lists">
					{todoListElems}
				</ul>
				<div className="list-actions">
					<a className="add-btn">Add List</a>
					<a className="edit-btn" onClick={this.editLists}>{this.state.mode === "view" ? "Edit" : "Done"}</a>
				</div>
			</div>
		);
	}
};

class ListItem extends Component {

	constructor(props){
		super(props);

		this.handleListChange = this.handleListChange.bind(this);
	}

	handleListChange(e){
		const list = this.props.list;

		if(e.type === "change"){
			list.name = e.target.value;
			this.props.updateList('update', list.listId, list);
		}else if(e.type === "click"){
			this.props.updateList('delete', list.listId);
			e.stopPropagation();
		}
	}


	render() {
		
		const list = this.props.list;
		const listClass = this.props.isActive ? 'active' : '';

		return (
			<li className={listClass} onClick={()=>{if(this.props.mode==='edit') return; this.props.switchList(list.listId)}}>
				<input className="list-name" type="text" value={list.name} disabled={this.props.mode === "view" ? true : false} onChange={this.handleListChange}/>
				<span className="list-number">{this.props.mode === "view" ? list.items.length : <ion-icon name="close" onClick={this.handleListChange}></ion-icon>}</span>
			</li>
		);
	}
};

class ListDetails extends Component {

	constructor(props){
		super(props);

		this.editItem = this.editItem.bind(this);
		this.addItem = this.addItem.bind(this);
	}

	editItem(action, itemId, item){
		const list = this.props.list;
		const index = this.props.list.items.findIndex(item => item.itemId === itemId);

		if(action === "update"){
			list.items[index] = item;
		}else if(action === "delete"){
			list.items.splice(index, 1);	
		}

		this.props.updateList('update', list.listId, list);
	}

	addItem(){
		const newItem = {
			itemId: (Date.now() + Math.random()).toString(36).substr(2),
			title: "",
			isComplete: false,
			isNew: true
		};
		const list = this.props.list;

		list.items.push(newItem);

		this.props.updateList('update', list.listId, list);
	}

	render() {
		
		const list = this.props.list;
		const todoItems = list.items.map((item) => <TodoItem key={item.itemId} item={item} editItem={this.editItem} color={list.color}></TodoItem>)
		const titleStyle = {
			color: colorMap[list.color] ? colorMap[list.color] : "#000000" 
		}

		return (
			<div className="list-details">
				<div className="list-header" style={titleStyle}>
					<h1 className="list-name">{list.name}</h1>
					<a className="add-btn" onClick={this.addItem}><ion-icon name="add-circle-outline"></ion-icon></a>
				</div>
				<ul className="list-items">
					{todoItems}
				</ul>
			</div>
		);
	}
};

class TodoItem extends Component {

	constructor(props){
		super(props);
		this.textInput = React.createRef();
		this.handleItemChange = this.handleItemChange.bind(this);
		this.handleItemDelete = this.handleItemDelete.bind(this);
		this.handleItemOnBlur = this.handleItemOnBlur.bind(this);
	}

	componentDidMount(){
		//Autofocus on new todo item
		if(this.props.item.isNew){
			this.textInput.current.focus();
		}
	}

	handleItemOnBlur(e){
		
		const item = this.props.item;

		if(!item.isNew) return;

		if(item.title.length === 0){
			this.props.editItem("delete", item.itemId);
		}else{
			delete item.isNew;
			this.props.editItem("update", item.itemId, item);
		}
	}

	handleItemChange(e){
	
		const item = this.props.item;

		if(e.type === "change"){
			item.title = e.target.value;
		}else if(e.type === "click"){
			item.isComplete = !item.isComplete;
		}

		this.props.editItem("update", item.itemId, item);
	}

	handleItemDelete(e){

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
				<input className="todo-content" ref={this.textInput} type="text" value={this.props.item.title} onChange={this.handleItemChange} onBlur={this.handleItemOnBlur}/>
				<a className="delete-btn" onClick={this.handleItemDelete}><ion-icon name="close"></ion-icon></a>
			</li>
		)	
	}
};

export default TodoApp;
