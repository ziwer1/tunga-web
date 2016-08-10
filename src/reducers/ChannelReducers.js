import { combineReducers } from 'redux';
import * as ChannelActions from '../actions/ChannelActions';
import * as MessageActions from '../actions/MessageActions';
import { PATH_CHANGE } from '../actions/NavActions';

import Activity from './ActivityReducers';

function channel(state = {}, action) {
    switch (action.type) {
        case ChannelActions.CREATE_CHANNEL_SUCCESS:
        case ChannelActions.RETRIEVE_CHANNEL_SUCCESS:
        case ChannelActions.UPDATE_CHANNEL_SUCCESS:
        case ChannelActions.RETRIEVE_DIRECT_CHANNEL_SUCCESS:
        case ChannelActions.UPDATE_CHANNEL_READ_SUCCESS:
            return action.channel;
        case ChannelActions.DELETE_CHANNEL_SUCCESS:
        case ChannelActions.CREATE_CHANNEL_START:
        case ChannelActions.CREATE_CHANNEL_FAILED:
        case ChannelActions.RETRIEVE_CHANNEL_START:
        case ChannelActions.RETRIEVE_CHANNEL_FAILED:
            return {};
        case MessageActions.LIST_MESSAGES_SUCCESS:
            if(action.filter && action.filter.channel == state.id) {
                return {...state, new: 0};
            }
            return state;
        default:
            return state;
    }
}

function attachments(state = [], action) {
    switch (action.type) {
        case ChannelActions.CREATE_CHANNEL_SUCCESS:
        case ChannelActions.RETRIEVE_CHANNEL_SUCCESS:
        case ChannelActions.UPDATE_CHANNEL_SUCCESS:
        case ChannelActions.RETRIEVE_DIRECT_CHANNEL_SUCCESS:
            return action.channel.attachments;
        case MessageActions.CREATE_MESSAGE_SUCCESS:
            return [...action.message.attachments, ...state];
        case MessageActions.LIST_NEW_MESSAGES_SUCCESS:
            var new_attachments = [];
            action.items.forEach((message) => {
                new_attachments = [...new_attachments, ...message.attachments];
            });
            return [...new_attachments, ...state];
        case ChannelActions.DELETE_CHANNEL_SUCCESS:
        case ChannelActions.CREATE_CHANNEL_START:
        case ChannelActions.CREATE_CHANNEL_FAILED:
        case ChannelActions.RETRIEVE_CHANNEL_START:
        case ChannelActions.RETRIEVE_CHANNEL_FAILED:
            return [];
        default:
            return state;
    }
}

function last_read(state = 0, action) {
    switch (action.type) {
        case ChannelActions.CREATE_CHANNEL_SUCCESS:
        case ChannelActions.RETRIEVE_CHANNEL_SUCCESS:
        case ChannelActions.UPDATE_CHANNEL_SUCCESS:
        case ChannelActions.RETRIEVE_DIRECT_CHANNEL_SUCCESS:
            return action.channel.last_read;
        case ChannelActions.DELETE_CHANNEL_SUCCESS:
            return 0;
        default:
            return state;
    }
}

function channels(state = {}, action) {
    switch (action.type) {
        case ChannelActions.LIST_CHANNELS_SUCCESS:
        case ChannelActions.LIST_MORE_CHANNELS_SUCCESS:
            var all_channels = {};
            action.items.forEach((channel) => {
                all_channels[channel.id] = channel;
            });
            return {...state, ...all_channels};
        case ChannelActions.LIST_CHANNELS_START:
        case ChannelActions.LIST_CHANNELS_FAILED:
            return {};
        case ChannelActions.CREATE_CHANNEL_SUCCESS:
        case ChannelActions.UPDATE_CHANNEL_READ_SUCCESS:
            var new_channel = {};
            new_channel[action.channel.id] = action.channel;
            return {...state, ...new_channel};
        default:
            return state;
    }
}

function ids(state = [], action) {
    switch (action.type) {
        case ChannelActions.LIST_CHANNELS_SUCCESS:
            return action.items.map((channel) => {
                return channel.id;
            });
        case ChannelActions.LIST_MORE_CHANNELS_SUCCESS:
            var new_channels = action.items.map((channel) => {
                return channel.id;
            });
            return [...state, ...new_channels];
        case ChannelActions.LIST_CHANNELS_START:
        case ChannelActions.LIST_CHANNELS_FAILED:
            return [];
        case ChannelActions.CREATE_CHANNEL_SUCCESS:
            if(state.indexOf(action.channel.id) == -1) {
                return [action.channel.id, ...state]
            }
            return state;
        default:
            return state;
    }
}

function next(state = null, action) {
    switch (action.type) {
        case ChannelActions.LIST_CHANNELS_SUCCESS:
        case ChannelActions.LIST_MORE_CHANNELS_SUCCESS:
            return action.next;
        default:
            return state;
    }
}

function previous(state = null, action) {
    switch (action.type) {
        case ChannelActions.LIST_CHANNELS_SUCCESS:
        case ChannelActions.LIST_MORE_CHANNELS_SUCCESS:
            return action.previous;
        default:
            return state;
    }
}

function count(state = null, action) {
    switch (action.type) {
        case ChannelActions.LIST_CHANNELS_SUCCESS:
            return action.count;
        case ChannelActions.LIST_CHANNELS_START:
        case ChannelActions.LIST_CHANNELS_FAILED:
            return 0;
        default:
            return state;
    }
}

function isSaving(state = false, action) {
    switch (action.type) {
        case ChannelActions.CREATE_CHANNEL_START:
        case ChannelActions.UPDATE_CHANNEL_START:
            return true;
        case ChannelActions.CREATE_CHANNEL_SUCCESS:
        case ChannelActions.CREATE_CHANNEL_FAILED:
        case ChannelActions.UPDATE_CHANNEL_SUCCESS:
        case ChannelActions.UPDATE_CHANNEL_FAILED:
            return false;
        default:
            return state;
    }
}

function isSaved(state = false, action) {
    switch (action.type) {
        case ChannelActions.CREATE_CHANNEL_SUCCESS:
        case ChannelActions.UPDATE_CHANNEL_SUCCESS:
            return true;
        case ChannelActions.CREATE_CHANNEL_START:
        case ChannelActions.CREATE_CHANNEL_FAILED:
        case ChannelActions.UPDATE_CHANNEL_START:
        case ChannelActions.UPDATE_CHANNEL_FAILED:
        case PATH_CHANGE:
            return false;
        default:
            return state;
    }
}

function isFetching(state = false, action) {
    switch (action.type) {
        case ChannelActions.LIST_CHANNELS_START:
            return true;
        case ChannelActions.LIST_CHANNELS_SUCCESS:
        case ChannelActions.LIST_CHANNELS_FAILED:
            return false;
        default:
            return state;
    }
}

function isFetchingMore(state = false, action) {
    switch (action.type) {
        case ChannelActions.LIST_MORE_CHANNELS_START:
            return true;
        case ChannelActions.LIST_MORE_CHANNELS_SUCCESS:
        case ChannelActions.LIST_MORE_CHANNELS_FAILED:
            return false;
        default:
            return state;
    }
}


function isRetrieving(state = false, action) {
    switch (action.type) {
        case ChannelActions.RETRIEVE_CHANNEL_START:
        case ChannelActions.RETRIEVE_DIRECT_CHANNEL_START:
            return true;
        case ChannelActions.RETRIEVE_CHANNEL_SUCCESS:
        case ChannelActions.RETRIEVE_CHANNEL_FAILED:
        case ChannelActions.RETRIEVE_DIRECT_CHANNEL_SUCCESS:
        case ChannelActions.RETRIEVE_DIRECT_CHANNEL_FAILED:
            return false;
        default:
            return state;
    }
}

function isDeleting(state = false, action) {
    switch (action.type) {
        case ChannelActions.DELETE_CHANNEL_START:
            return true;
        case ChannelActions.DELETE_CHANNEL_SUCCESS:
        case ChannelActions.DELETE_CHANNEL_FAILED:
            return false;
        default:
            return false;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case ChannelActions.CREATE_CHANNEL_FAILED:
            return {...state, create: action.error};
        case ChannelActions.CREATE_CHANNEL_START:
        case ChannelActions.CREATE_CHANNEL_SUCCESS:
            return {...state, create: null};
        default:
            return state;
    }
}

const detail = combineReducers({
    channel,
    attachments,
    last_read,
    isRetrieving,
    isSaving,
    isSaved,
    isDeleting,
    activity: Activity,
    error
});

const list = combineReducers({
    ids,
    channels,
    isFetching,
    isFetchingMore,
    next,
    previous,
    count
});

const Channel = combineReducers({
    detail,
    list
});

export default Channel;
