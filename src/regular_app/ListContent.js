import React from 'react';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import TodoItem from './TodoItem.js';
import colorMap from '../data/colors.json';

class ListContent extends React.PureComponent {

	constructor(props) {
		super(props);

		this.addItem = this.addItem.bind(this);
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
		let listContent;

		//Generate list content based on context
		if (!list.isSearchResults) {
			listContent = <ListSection list={list} updateList={this.props.updateList}></ListSection>
		} else {
			listContent = list.items.map((section) => {
				return <ListSection key={section.listId} list={section} updateList={this.props.updateList} hasSectionTitle></ListSection>
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

ListContent.propTypes = {
	list: PropTypes.shape({
		listId: PropTypes.string,
        name: PropTypes.string,
        color: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.object),
        isSearchResults: PropTypes.bool
	}).isRequired,
	updateList: PropTypes.func.isRequired
};

class ListSection extends React.PureComponent {
	constructor(props) {
		super(props);

		this.editItem = this.editItem.bind(this);
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

	render() {

		const list = this.props.list;

		const todoItems = list.items.map((item) => <TodoItem key={item.itemId} item={item} editItem={this.editItem} color={list.color}></TodoItem>);

		const titleStyle = {
			color: colorMap[list.color] ? colorMap[list.color] : "#000000"
		}

		return (
			<section className="list-section">
				{this.props.hasSectionTitle && <h5 style={titleStyle}>{list.name}</h5>}
				<ul className="list-items">{todoItems}</ul>
			</section>
		)
	}
}

ListSection.propTypes = {
	list: PropTypes.shape({
		listId: PropTypes.string.isRequired,
        name: PropTypes.string,
        color: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.object)
	}).isRequired,
	updateList: PropTypes.func.isRequired,
	hasSectionTitle: PropTypes.bool
};

export default ListContent;