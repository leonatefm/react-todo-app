/*
 * action creators
 */

//List actions

export const switchList = (listId) => {
	return { type: "SWITCH_LIST", listId };
}

export const addList = (list) => {
	return { type: "ADD_LIST", list };
}

export const editList = (listId, name, removeNewFlag) => {
	return { type: "EDIT_LIST", listId, name, removeNewFlag };
}

export const deleteList = (listId) => {
	return { type: "DELETE_LIST", listId };
}

export const searchList = (keyword) => {
	return { type: "SEARCH_LIST", keyword };
}

//Todo actions

export const addTodo = (listId, item) => {
	return { type: "ADD_TODO", listId, item };
}

export const editTodo = (itemId, title, removeNewFlag) => {
	return { type: "EDIT_TODO", itemId, title, removeNewFlag };
}

export const toggleTodo = (itemId) => {
	return { type: "TOGGLE_TODO", itemId };
}

export const deleteTodo = (listId, itemId) => {
	return { type: "DELETE_TODO", listId, itemId };
}