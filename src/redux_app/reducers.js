import { combineReducers } from 'redux';
import data from '../data/data_redux.json';
import update from 'immutability-helper';

const todoReducer = (state = data.todos, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return update(state, { [action.item.itemId]: { $set: action.item } });
        case 'EDIT_TODO':
            return update(state, { [action.itemId]: { title: { $set: action.title } } });
        case 'TOGGLE_TODO':
            return update(state, { [action.itemId]: { $toggle: ['isComplete'] } });
        case 'DELETE_TODO':
            return update(state, { $unset: [action.itemId] });
        default:
            return state;
    }
};

const listReducer = (state = data.lists, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return update(state, { [action.listId]: { todos: { $push: [action.item.itemId] } } });
        case 'DELETE_TODO':
            const index = state[action.listId].todos.indexOf(action.itemId);
            return update(state, { [action.listId]: { todos: { $splice: [[index, 1]] } } });
        case 'ADD_LIST':
            return state;
        case 'EDIT_LIST':
            return state;
        case 'DELETE_LIST':
            return state;
        default:
            return state;
    }
};

const reducers = combineReducers({
    lists: listReducer,
    todos: todoReducer
});

export default reducers;