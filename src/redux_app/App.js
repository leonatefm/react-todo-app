import React, { Component } from 'react';
import SideMenuContainer from './SideMenu.js';
import ListContentContainer from './ListContent.js';
import '../css/app.css';


class TodoApp extends Component {

    render() {
        return (
            <div className="react-todo-app">
                <SideMenuContainer />
                <ListContentContainer />    
			</div>
        );
    }
};

export default TodoApp;
