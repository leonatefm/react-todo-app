import { combineReducers } from 'redux';
import data from '../data/data_redux.json';
import update from 'immutability-helper';

const todoReducer = (state = data.todos, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return update(state, { [action.item.itemId]: { $set: action.item } });
        case 'EDIT_TODO':
            if (action.removeNewFlag) {
                return update(state, { [action.itemId]: { title: { $set: action.title }, $unset: ['isNew'] } });
            } else {
                return update(state, { [action.itemId]: { title: { $set: action.title } } });
            }
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
            return update(state, { [action.list.listId]: { $set: action.list } });
        case 'EDIT_LIST':
            const newName = (action.name.length > 0) ? action.name : state[action.listId].name;
            if (action.removeNewFlag) {
                return update(state, { [action.listId]: { name: { $set: newName }, $unset: ['isNew'] } });
            } else {
                return update(state, { [action.listId]: { name: { $set: newName } } });
            }
        case 'DELETE_LIST':
            return update(state, { $unset: [action.listId] });
        default:
            return state;
    }
};

const todoAppReducer = (state = data.todoApp, action) => {
    let newCurrentListId;
    switch (action.type) {
        case 'SWITCH_LIST':
            return update(state, { currentListId: { $set: action.listId }, searchKeyword: { $set: "" } });
        case 'ADD_LIST':
            return update(state, { currentListId: { $set: action.list.listId }, lists: { $push: [action.list.listId] } });
        case 'DELETE_LIST':
            const index = state.lists.indexOf(action.listId);
            newCurrentListId = (state.currentListId === action.listId) ? ((index > 0) ? state.lists[0] : state.lists[1]) : state.currentListId;
            return update(state, { lists: { $splice: [[index, 1]] }, currentListId: { $set: newCurrentListId } });
        case 'SEARCH_LIST':
            newCurrentListId = (action.keyword.length > 0) ? "" : state.lists[0];
            return update(state, { searchKeyword: { $set: action.keyword }, currentListId: { $set: newCurrentListId } });
        default:
            return state;
    }
}

const reducers = combineReducers({
    todoApp: todoAppReducer,
    lists: listReducer,
    todos: todoReducer
});

export default reducers;