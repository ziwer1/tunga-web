import { combineReducers } from 'redux'
import * as TaskActions from '../actions/TaskActions'
import { CREATE_COMMENT_SUCCESS } from '../actions/CommentActions'
import { PATH_CHANGE } from '../actions/NavActions'


function activity(state = [], action) {
    switch (action.type) {
        case TaskActions.LIST_TASK_ACTIVITY_SUCCESS:
            return [...action.items].reverse();
        case TaskActions.LIST_MORE_TASK_ACTIVITY_SUCCESS:
            var old_activity = [...action.items].reverse();
            return [...old_activity, ...state];
        case CREATE_COMMENT_SUCCESS:
            return [...state, {action: 'comment', activity_type: 'comment', activity: action.comment}];
        case TaskActions.LIST_TASK_ACTIVITY_START:
        case TaskActions.LIST_TASK_ACTIVITY_FAILED:
            return [];
        default:
            return state;
    }
}

function next(state = null, action) {
    switch (action.type) {
        case TaskActions.LIST_TASK_ACTIVITY_SUCCESS:
        case TaskActions.LIST_MORE_TASK_ACTIVITY_SUCCESS:
            return action.next;
        default:
            return state;
    }
}

function previous(state = null, action) {
    switch (action.type) {
        case TaskActions.LIST_TASK_ACTIVITY_SUCCESS:
        case TaskActions.LIST_MORE_TASK_ACTIVITY_SUCCESS:
            return action.previous;
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case TaskActions.LIST_TASK_ACTIVITY_START:
            return true;
        case TaskActions.LIST_TASK_ACTIVITY_SUCCESS:
        case TaskActions.LIST_TASK_ACTIVITY_FAILED:
            return false;
        default:
            return state;
    }
}

function isFetchingMore(state = false, action) {
    switch (action.type) {
        case TaskActions.LIST_MORE_TASK_ACTIVITY_START:
            return true;
        case TaskActions.LIST_MORE_TASK_ACTIVITY_SUCCESS:
        case TaskActions.LIST_MORE_TASK_ACTIVITY_FAILED:
            return false;
        default:
            return state;
    }
}

const Activity = combineReducers({
    items: activity,
    isFetching,
    isFetchingMore,
    next,
    previous
});

export default Activity;
