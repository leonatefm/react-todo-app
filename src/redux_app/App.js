import React, { Component } from 'react';
import { createStore } from 'redux'
import reducers from './reducers.js'
import { addTodo, editTodo, toggleTodo, deleteTodo } from './actions.js';
import '../css/app.css';


const store = createStore(reducers);
console.log(store.getState())

const unsubscribe = store.subscribe(() =>
    console.log(store.getState())
)

store.dispatch(editTodo("1", 'updated'));
store.dispatch(toggleTodo("1"));
store.dispatch(addTodo("1", {
    itemId: (Date.now() + Math.random()).toString(36).substr(2),
    title: "",
    isComplete: false
}));
store.dispatch(deleteTodo("1", "2"));

unsubscribe();

class TodoApp extends Component {

    render() {
        return (
            <div className="react-todo-app">
                Create a new todo app using redux.
			</div>
        );
    }
};

export default TodoApp;
