import { combineReducers } from 'redux'
import * as ReplyActions from '../actions/ReplyActions'
import { PATH_CHANGE } from '../actions/NavActions'

function reply(state = {}, action) {
    switch (action.type) {
        case ReplyActions.CREATE_REPLY_SUCCESS:
        case ReplyActions.RETRIEVE_REPLY_SUCCESS:
        case ReplyActions.UPDATE_REPLY_SUCCESS:
            return action.reply;
        case ReplyActions.DELETE_REPLY_SUCCESS:
            return {};
        default:
            return state;
    }
}

function replies(state = [], action) {
    switch (action.type) {
        case ReplyActions.LIST_REPLIES_SUCCESS:
            return [...action.items].reverse();
        case ReplyActions.LIST_MORE_REPLIES_SUCCESS:
            var old_replies = [...action.items].reverse();
            return [...old_replies, ...state];
        case ReplyActions.CREATE_REPLY_SUCCESS:
            return [...state, action.reply];
        default:
            return state;
    }
}

function next(state = [], action) {
    switch (action.type) {
        case ReplyActions.LIST_REPLIES_SUCCESS:
        case ReplyActions.LIST_MORE_REPLIES_SUCCESS:
            return action.next;
        default:
            return state;
    }
}

function previous(state = [], action) {
    switch (action.type) {
        case ReplyActions.LIST_REPLIES_SUCCESS:
        case ReplyActions.LIST_MORE_REPLIES_SUCCESS:
            return action.previous;
        default:
            return state;
    }
}

function isSaving(state = false, action) {
    switch (action.type) {
        case ReplyActions.CREATE_REPLY_START:
            return true;
        case ReplyActions.CREATE_REPLY_SUCCESS:
        case ReplyActions.CREATE_REPLY_FAILED:
            return false;
        default:
            return state;
    }
}

function isSaved(state = false, action) {
    switch (action.type) {
        case ReplyActions.CREATE_REPLY_SUCCESS:
            return true;
        case ReplyActions.CREATE_REPLY_START:
        case ReplyActions.CREATE_REPLY_FAILED:
        case PATH_CHANGE:
            return false;
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case ReplyActions.LIST_REPLIES_START:
            return true;
        case ReplyActions.LIST_REPLIES_SUCCESS:
        case ReplyActions.LIST_REPLIES_FAILED:
            return false;
        default:
            return state;
    }
}

function isFetchingMore(state = false, action) {
    switch (action.type) {
        case ReplyActions.LIST_MORE_REPLIES_START:
            return true;
        case ReplyActions.LIST_MORE_REPLIES_SUCCESS:
        case ReplyActions.LIST_MORE_REPLIES_FAILED:
            return false;
        default:
            return state;
    }
}

function isRetrieving(state = false, action) {
    switch (action.type) {
        case ReplyActions.RETRIEVE_REPLY_START:
            return true;
        case ReplyActions.RETRIEVE_REPLY_SUCCESS:
        case ReplyActions.RETRIEVE_REPLY_FAILED:
            return false;
        default:
            return state;
    }
}

function isDeleting(state = false, action) {
    switch (action.type) {
        case ReplyActions.DELETE_REPLY_START:
            return true;
        case ReplyActions.DELETE_REPLY_SUCCESS:
        case ReplyActions.DELETE_REPLY_FAILED:
            return false;
        default:
            return state;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case ReplyActions.CREATE_REPLY_FAILED:
            return {...state, create: action.error};
        case ReplyActions.CREATE_REPLY_START:
        case ReplyActions.CREATE_REPLY_SUCCESS:
            return {...state, create: null};
        default:
            return state;
    }
}

const detail = combineReducers({
    reply,
    isRetrieving,
    isSaving,
    isSaved,
    isDeleting,
    error
});

const list = combineReducers({
    replies,
    isFetching,
    isFetchingMore,
    next,
    previous
});

const Reply = combineReducers({
    detail,
    list
});

export default Reply;
