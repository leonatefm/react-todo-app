/*
 * action creators
 */

export const addTodo = (listId, item) => {
	return {type: "ADD_TODO", listId, item };
}

export const editTodo = (itemId, title) => {
	return { type: "EDIT_TODO", itemId, title };
}

export const toggleTodo = (itemId) => {
	return { type: "TOGGLE_TODO", itemId }
}

export const deleteTodo = (listId, itemId) => {
	return { type: "DELETE_TODO", listId, itemId }
}