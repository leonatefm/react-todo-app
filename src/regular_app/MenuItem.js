import React from 'react';
import update from 'immutability-helper';
import PropTypes from 'prop-types';


class MenuItem extends React.PureComponent {

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

MenuItem.defaultProps = {
    isActive: false,
    mode: 'view'
}

MenuItem.propTypes = {
	list: PropTypes.shape({
		listId: PropTypes.string.isRequired,
        name: PropTypes.string,
        color: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.object)
    }).isRequired,
    switchList: PropTypes.func.isRequired,
    updateList: PropTypes.func.isRequired,
    isActive: PropTypes.bool,
    mode: PropTypes.oneOf(['view', 'edit']),
};

export default MenuItem;