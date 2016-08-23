import { combineReducers } from 'redux';
import * as TaskActions from '../actions/TaskActions';
import * as ChannelActions from '../actions/ChannelActions';
import { CREATE_COMMENT_SUCCESS } from '../actions/CommentActions';
import { CREATE_MESSAGE_SUCCESS } from '../actions/MessageActions';


function activity(state = [], action) {
    switch (action.type) {
        case TaskActions.LIST_TASK_ACTIVITY_SUCCESS:
        case ChannelActions.LIST_CHANNEL_ACTIVITY_SUCCESS:
            return [...action.items].reverse();
        case TaskActions.LIST_MORE_TASK_ACTIVITY_SUCCESS:
        case ChannelActions.LIST_MORE_CHANNEL_ACTIVITY_SUCCESS:
            var old_activity = [...action.items].reverse();
            return [...old_activity, ...state];
        case TaskActions.LIST_NEW_TASK_ACTIVITY_SUCCESS:
        case ChannelActions.LIST_NEW_CHANNEL_ACTIVITY_SUCCESS:
            var new_activity = [...action.items].reverse();
            var old_concrete_acitiviy = [];
            state.forEach(item => {
                if(item.id) {
                    old_concrete_acitiviy.push(item);
                }
            });
            return [...old_concrete_acitiviy, ...new_activity];
        case CREATE_COMMENT_SUCCESS:
            return [...state, {action: 'comment', activity_type: 'comment', activity: action.comment}];
        case CREATE_MESSAGE_SUCCESS:
            return [...state, {action: 'send', activity_type: 'message', activity: action.message}];
        case ChannelActions.SHARE_CHANNEL_UPLOAD_SUCCESS:
        case TaskActions.SHARE_TASK_UPLOAD_SUCCESS:
            var all_uploads = action.uploads.map(upload => {
                return {action: 'upload', activity_type: 'upload', activity: upload}
            });
            return [...state, ...all_uploads];
        case TaskActions.LIST_TASK_ACTIVITY_START:
        case TaskActions.LIST_TASK_ACTIVITY_FAILED:
        case ChannelActions.LIST_CHANNEL_ACTIVITY_START:
        case ChannelActions.LIST_CHANNEL_ACTIVITY_FAILED:
            return [];
        default:
            return state;
    }
}

function next(state = null, action) {
    switch (action.type) {
        case TaskActions.LIST_TASK_ACTIVITY_SUCCESS:
        case TaskActions.LIST_MORE_TASK_ACTIVITY_SUCCESS:
        case ChannelActions.LIST_CHANNEL_ACTIVITY_SUCCESS:
        case ChannelActions.LIST_MORE_CHANNEL_ACTIVITY_SUCCESS:
            return action.next;
        default:
            return state;
    }
}

function previous(state = null, action) {
    switch (action.type) {
        case TaskActions.LIST_TASK_ACTIVITY_SUCCESS:
        case TaskActions.LIST_MORE_TASK_ACTIVITY_SUCCESS:
        case ChannelActions.LIST_CHANNEL_ACTIVITY_SUCCESS:
        case ChannelActions.LIST_MORE_CHANNEL_ACTIVITY_SUCCESS:
            return action.previous;
        default:
            return state;
    }
}

function count(state = null, action) {
    switch (action.type) {
        case TaskActions.LIST_TASK_ACTIVITY_SUCCESS:
        case TaskActions.LIST_MORE_TASK_ACTIVITY_SUCCESS:
        case ChannelActions.LIST_CHANNEL_ACTIVITY_SUCCESS:
        case ChannelActions.LIST_MORE_CHANNEL_ACTIVITY_SUCCESS:
            return action.count;
        case TaskActions.LIST_TASK_ACTIVITY_START:
        case TaskActions.LIST_TASK_ACTIVITY_FAILED:
        case ChannelActions.LIST_CHANNEL_ACTIVITY_START:
        case ChannelActions.LIST_CHANNEL_ACTIVITY_FAILED:
            return 0;
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case TaskActions.LIST_TASK_ACTIVITY_START:
        case ChannelActions.LIST_CHANNEL_ACTIVITY_START:
            return true;
        case TaskActions.LIST_TASK_ACTIVITY_SUCCESS:
        case TaskActions.LIST_TASK_ACTIVITY_FAILED:
        case ChannelActions.LIST_CHANNEL_ACTIVITY_SUCCESS:
        case ChannelActions.LIST_CHANNEL_ACTIVITY_FAILED:
            return false;
        default:
            return state;
    }
}

function isFetchingMore(state = false, action) {
    switch (action.type) {
        case TaskActions.LIST_MORE_TASK_ACTIVITY_START:
        case ChannelActions.LIST_MORE_CHANNEL_ACTIVITY_START:
            return true;
        case TaskActions.LIST_MORE_TASK_ACTIVITY_SUCCESS:
        case TaskActions.LIST_MORE_TASK_ACTIVITY_FAILED:
        case ChannelActions.LIST_MORE_CHANNEL_ACTIVITY_SUCCESS:
        case ChannelActions.LIST_MORE_CHANNEL_ACTIVITY_FAILED:
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
