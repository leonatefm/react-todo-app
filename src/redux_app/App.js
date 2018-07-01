import React, { Component } from 'react';
import SideMenuContainer from './SideMenu.js';
import '../css/app.css';


class TodoApp extends Component {

    render() {
        return (
            <div className="react-todo-app">
                <SideMenuContainer />    
			</div>
        );
    }
};

export default TodoApp;
