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

	updateList(listId, list){
		const todoLists = this.state.todoLists;
		const index = todoLists.findIndex(item => item.listId === listId);
		todoLists[index] = list;
		this.setState({
			todoLists: todoLists
		});
	}

	render() {
		const currentList = this.state.todoLists.find(item => item.listId === this.state.currentListId);  
		
		return (
			<div className="react-todo-app">
				<SideMenu todoLists={this.state.todoLists} currentListId={this.state.currentListId} switchList={this.switchList}></SideMenu>
				<ListDetails list={currentList} updateList={this.updateList}></ListDetails>
			</div>
		);
	}
}

class SideMenu extends Component {
	render() {

		const todoListElems = this.props.todoLists.map((list) => {
			if(list.listId === this.props.currentListId){
				return <li className="active" key={list.listId} onClick={()=>{this.props.switchList(list.listId)}}><span>{list.name}</span><span>{list.items.length}</span></li>;
			}else{
				return <li key={list.listId} onClick={()=>{this.props.switchList(list.listId)}}><span>{list.name}</span><span>{list.items.length}</span></li>
			}
		});

		return (
			<div className="side-menu">
				<h3>Reactodo</h3>
				<div className="search-box"><input type="text" placeholder="Search" /></div>
				<ul className="todo-lists">
					{todoListElems}
				</ul>
				<div className="add-list">
					<a className="add-btn"><ion-icon class="add-icon" name="add-circle"></ion-icon>Add List</a>
				</div>
			</div>
		);
	}
}

class ListDetails extends Component {

	constructor(props){
		super(props);

		this.editItem = this.editItem.bind(this);
	}

	editItem(action, itemId, item){
		const list = this.props.list;
		const index = this.props.list.items.findIndex(item => item.itemId === itemId);

		if(action === "update"){
			list.items[index] = item;
		}else if(action === "delete"){
			list.items.splice(index, 1);	
		}

		this.props.updateList(list.listId, list);
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
					<a className="add-btn"><ion-icon name="add-circle-outline"></ion-icon></a>
				</div>
				<ul className="list-items">
					{todoItems}
				</ul>
			</div>
		);
	}
}

class TodoItem extends Component {

	constructor(props){
		super(props);

		this.handleItemChange = this.handleItemChange.bind(this);
		this.handleItemDelete = this.handleItemDelete.bind(this);
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
				<input className="todo-content" type="text" value={this.props.item.title} onChange={this.handleItemChange} />
				<a className="delete-btn" onClick={this.handleItemDelete}><ion-icon name="close"></ion-icon></a>
			</li>
		)	
	}
}

export default TodoApp;
