import React, { Component } from 'react';
import SideMenuContainer from './components/SideMenu.js';
import ListContentContainer from './components/ListContent.js';
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
