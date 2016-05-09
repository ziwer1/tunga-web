import { combineReducers } from 'redux'
import * as MessageActions from '../actions/MessageActions'
import { PATH_CHANGE } from '../actions/NavActions'

function message(state = {}, action) {
    switch (action.type) {
        case MessageActions.CREATE_MESSAGE_SUCCESS:
        case MessageActions.RETRIEVE_MESSAGE_SUCCESS:
        case MessageActions.UPDATE_MESSAGE_SUCCESS:
            return action.message;
        case MessageActions.DELETE_MESSAGE_SUCCESS:
            return {};
        default:
            return state;
    }
}

function messages(state = [], action) {
    switch (action.type) {
        case MessageActions.LIST_MESSAGES_SUCCESS:
            return action.items;
        case MessageActions.LIST_MORE_MESSAGES_SUCCESS:
            return [...state, ...action.items];
        case MessageActions.CREATE_MESSAGE_SUCCESS:
            return [action.message, ...state];
        default:
            return state;
    }
}

function next(state = [], action) {
    switch (action.type) {
        case MessageActions.LIST_MESSAGES_SUCCESS:
        case MessageActions.LIST_MORE_MESSAGES_SUCCESS:
            return action.next;
        default:
            return state;
    }
}

function previous(state = [], action) {
    switch (action.type) {
        case MessageActions.LIST_MESSAGES_SUCCESS:
        case MessageActions.LIST_MORE_MESSAGES_SUCCESS:
            return action.previous;
        default:
            return state;
    }
}

function isSaving(state = false, action) {
    switch (action.type) {
        case MessageActions.CREATE_MESSAGE_START:
            return true;
        case MessageActions.CREATE_MESSAGE_SUCCESS:
        case MessageActions.CREATE_MESSAGE_FAILED:
            return false;
        default:
            return state;
    }
}

function isSaved(state = false, action) {
    switch (action.type) {
        case MessageActions.CREATE_MESSAGE_SUCCESS:
            return true;
        case MessageActions.CREATE_MESSAGE_START:
        case MessageActions.CREATE_MESSAGE_FAILED:
        case PATH_CHANGE:
            return false;
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case MessageActions.LIST_MESSAGES_START:
            return true;
        case MessageActions.LIST_MESSAGES_SUCCESS:
        case MessageActions.LIST_MESSAGES_FAILED:
            return false;
        default:
            return state;
    }
}

function isFetchingMore(state = false, action) {
    switch (action.type) {
        case MessageActions.LIST_MORE_MESSAGES_START:
            return true;
        case MessageActions.LIST_MORE_MESSAGES_SUCCESS:
        case MessageActions.LIST_MORE_MESSAGES_FAILED:
            return false;
        default:
            return state;
    }
}


function isRetrieving(state = false, action) {
    switch (action.type) {
        case MessageActions.RETRIEVE_MESSAGE_START:
            return true;
        case MessageActions.RETRIEVE_MESSAGE_SUCCESS:
        case MessageActions.RETRIEVE_MESSAGE_FAILED:
            return false;
        default:
            return state;
    }
}

function isDeleting(state = false, action) {
    switch (action.type) {
        case MessageActions.DELETE_MESSAGE_START:
            return true;
        case MessageActions.DELETE_MESSAGE_SUCCESS:
        case MessageActions.DELETE_MESSAGE_FAILED:
            return false;
        default:
            return false;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case MessageActions.CREATE_MESSAGE_FAILED:
            return {...state, create: action.error};
        case MessageActions.CREATE_MESSAGE_START:
        case MessageActions.CREATE_MESSAGE_SUCCESS:
            return {...state, create: null};
        default:
            return state;
    }
}

const detail = combineReducers({
    message,
    isRetrieving,
    isSaving,
    isSaved,
    isDeleting,
    error
});

const list = combineReducers({
    messages,
    isFetching,
    isFetchingMore,
    next,
    previous
});

const Message = combineReducers({
    detail,
    list
});

export default Message;
