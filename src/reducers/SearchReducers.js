import { combineReducers } from 'redux'
import * as SearchActions from '../actions/SearchActions'
import { PATH_CHANGE } from '../actions/NavActions'
import * as UserActions from '../actions/UserActions'
import * as TaskActions from '../actions/TaskActions'
import * as MessageActions from '../actions/MessageActions'


function query(state = null, action) {
    switch (action.type) {
        case SearchActions.SEARCH_START:
            return action.query;
        default:
            return state;
    }
}

function count(state = 0, action) {
    switch (action.type) {
        case UserActions.LIST_USERS_SUCCESS:
        case UserActions.LIST_MORE_USERS_SUCCESS:
        case TaskActions.LIST_TASKS_SUCCESS:
        case TaskActions.LIST_MORE_TASKS_SUCCESS:
        case MessageActions.LIST_MESSAGES_SUCCESS:
        case MessageActions.LIST_MORE_MESSAGES_SUCCESS:
            return action.count;
        case UserActions.LIST_USERS_START:
        case UserActions.LIST_USERS_FAILED:
        case TaskActions.LIST_TASKS_START:
        case TaskActions.LIST_TASKS_FAILED:
        case MessageActions.LIST_MESSAGES_START:
        case MessageActions.LIST_MESSAGES_FAILED:
            return 0;
        default:
            return state;
    }
}

const Search = combineReducers({
    query,
    count
});

export default Search;
