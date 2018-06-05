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
	}

	switchList(listId){
		this.setState({
			currentListId: listId
		});
	}

	render() {
		const currentList = this.state.todoLists.find((item) => { return item.listId === this.state.currentListId});  
		
		return (
			<div className="react-todo-app">
				<SideMenu todoLists={this.state.todoLists} currentListId={this.state.currentListId} switchList={this.switchList}></SideMenu>
				<ListDetails list={currentList}></ListDetails>
			</div>
		);
	}
}

class SideMenu extends Component {
	render() {

		const todoListElems = this.props.todoLists.map((list) => {
			if(list.listId === this.props.currentListId){
				return <li className="active" key={list.listId} onClick={()=>{this.props.switchList(list.listId)}}>{list.name}</li>;
			}else{
				return <li key={list.listId} onClick={()=>{this.props.switchList(list.listId)}}>{list.name}</li>
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
	render() {
		
		const list = this.props.list;
		const todoItems = list.items.map((item) => <TodoItem key={item.itemId} item={item}></TodoItem>)
		const style = {
			color: colorMap[list.color] ? colorMap[list.color] : "#000000" 
		}

		return (
			<div className="list-details">
				<div className="list-header" style={style}>
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
	render() {
		return (
			<li>
				<span className="todo-status"></span>
				<input className="todo-content" type="text" value={this.props.item.title} />
			</li>
		)	
	}
}

export default TodoApp;
