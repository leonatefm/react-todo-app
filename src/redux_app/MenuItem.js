import React from 'react';
import PropTypes from 'prop-types';


class MenuItem extends React.PureComponent {

	constructor(props) {
		super(props);
		this.textInput = React.createRef();
		this.handleListOnBlur = this.handleListOnBlur.bind(this);
	}

	componentDidMount() {
		//Autofocus on new todo item
		if (this.props.list.isNew) {
			this.textInput.current.focus();
			this.textInput.current.select();
		}
	}

	handleListOnBlur(e) {
		const list = this.props.list;
		if (list.isNew) this.props.editList(list.listId, e.target.value, true);
	}

	render() {

		const list = this.props.list;
		const listClass = this.props.isActive ? 'active' : '';
		const isDisabled = (this.props.mode === "view" && !this.props.list.isNew) ? true : false;

		return (
			<li className={listClass} onClick={() => { if (this.props.mode === 'edit') return; this.props.switchList(list.listId) }}>
				<input className="list-name" ref={this.textInput} type="text" value={list.name} disabled={isDisabled} onChange={(e)=>{this.props.editList(list.listId, e.target.value);}} onBlur={this.handleListOnBlur} />
				<span className="list-number">{this.props.mode === "view" ? list.todos.length : <ion-icon name="close" onClick={(e)=>{this.props.deleteList(list.listId)}}></ion-icon>}</span>
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
	editList: PropTypes.func.isRequired,
	deleteList: PropTypes.func.isRequired,
    isActive: PropTypes.bool,
    mode: PropTypes.oneOf(['view', 'edit']),
};

export default MenuItem;