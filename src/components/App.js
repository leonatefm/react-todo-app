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

class App extends Component {
	render() {
		console.log(data);
		return (
			<div className="react-todo-app">
				<SideMenu></SideMenu>
				<ListDetails></ListDetails>
			</div>
		);
	}
}

class SideMenu extends Component {
	render() {

		const todoLists = data.map((list) => {
			if(list.listId === "1"){
				return <li className="active" key={list.listId}>{list.name}</li>;
			}else{
				return <li key={list.listId}>{list.name}</li>
			}
		});

		return (
			<div className="side-menu">
				<h3>Reactodo</h3>
				<div className="search-box"><input type="text" placeholder="Search" /></div>
				<ul className="todo-lists">
					{todoLists}
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
		
		const list = data[0];
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

export default App;
