import axios from 'axios'
import { ENDPOINT_CHANNEL, ENDPOINT_DIRECT_CHANNEL } from '../constants/Api'

export const CREATE_CHANNEL_START = 'CREATE_CHANNEL_START';
export const CREATE_CHANNEL_SUCCESS = 'CREATE_CHANNEL_SUCCESS';
export const CREATE_CHANNEL_FAILED = 'CREATE_CHANNEL_FAILED';
export const LIST_CHANNELS_START = 'LIST_CHANNELS_START';
export const LIST_CHANNELS_SUCCESS = 'LIST_CHANNELS_SUCCESS';
export const LIST_CHANNELS_FAILED = 'LIST_CHANNELS_FAILED';
export const RETRIEVE_CHANNEL_START = 'RETRIEVE_CHANNEL_START';
export const RETRIEVE_CHANNEL_SUCCESS = 'RETRIEVE_CHANNEL_SUCCESS';
export const RETRIEVE_CHANNEL_FAILED = 'RETRIEVE_CHANNEL_FAILED';
export const RETRIEVE_DIRECT_CHANNEL_START = 'RETRIEVE_DIRECT_CHANNEL_START';
export const RETRIEVE_DIRECT_CHANNEL_SUCCESS = 'RETRIEVE_DIRECT_CHANNEL_SUCCESS';
export const RETRIEVE_DIRECT_CHANNEL_FAILED = 'RETRIEVE_DIRECT_CHANNEL_FAILED';
export const UPDATE_CHANNEL_START = 'UPDATE_CHANNEL_START';
export const UPDATE_CHANNEL_SUCCESS = 'UPDATE_CHANNEL_SUCCESS';
export const UPDATE_CHANNEL_FAILED = 'UPDATE_CHANNEL_FAILED';
export const DELETE_CHANNEL_START = 'DELETE_CHANNEL_START';
export const DELETE_CHANNEL_SUCCESS = 'DELETE_CHANNEL_SUCCESS';
export const DELETE_CHANNEL_FAILED = 'DELETE_CHANNEL_FAILED';
export const UPDATE_CHANNEL_READ_START = 'UPDATE_CHANNEL_READ_START';
export const UPDATE_CHANNEL_READ_SUCCESS = 'UPDATE_CHANNEL_READ_SUCCESS';
export const UPDATE_CHANNEL_READ_FAILED = 'UPDATE_CHANNEL_READ_FAILED';
export const LIST_MORE_CHANNELS_START = 'LIST_MORE_CHANNELS_START';
export const LIST_MORE_CHANNELS_SUCCESS = 'LIST_MORE_CHANNELS_SUCCESS';
export const LIST_MORE_CHANNELS_FAILED = 'LIST_MORE_CHANNELS_FAILED';

export function createChannel(channel, attachments) {
    return dispatch => {
        dispatch(createChannelStart(channel));
        axios.post(ENDPOINT_CHANNEL, channel)
            .then(function(response) {
                dispatch(createChannelSuccess(response.data));
            }).catch(function(response) {
                dispatch(createChannelFailed(response.data));
            });
    }
}

export function createChannelStart(channel) {
    return {
        type: CREATE_CHANNEL_START,
        channel
    }
}

export function createChannelSuccess(channel) {
    return {
        type: CREATE_CHANNEL_SUCCESS,
        channel
    }
}

export function createChannelFailed(error) {
    return {
        type: CREATE_CHANNEL_FAILED,
        error
    }
}

export function listChannels(filter) {
    return dispatch => {
        dispatch(listChannelsStart(filter));
        axios.get(ENDPOINT_CHANNEL, {params: filter})
            .then(function(response) {
                dispatch(listChannelsSuccess(response.data))
            }).catch(function(response) {
                dispatch(listChannelsFailed(response.data))
            });
    }
}

export function listChannelsStart(filter) {
    return {
        type: LIST_CHANNELS_START,
        filter
    }
}

export function listChannelsSuccess(response) {
    return {
        type: LIST_CHANNELS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count
    }
}

export function listChannelsFailed(error) {
    return {
        type: LIST_CHANNELS_FAILED,
        error
    }
}

export function retrieveChannel(id) {
    return dispatch => {
        dispatch(retrieveChannelStart(id));
        axios.get(ENDPOINT_CHANNEL + id + '/')
            .then(function(response) {
                dispatch(retrieveChannelSuccess(response.data))
            }).catch(function(response) {
                dispatch(retrieveChannelFailed(response.data))
            });
    }
}

export function retrieveChannelStart(id) {
    return {
        type: RETRIEVE_CHANNEL_START,
        id
    }
}

export function retrieveChannelSuccess(channel) {
    return {
        type: RETRIEVE_CHANNEL_SUCCESS,
        channel
    }
}

export function retrieveChannelFailed(error) {
    return {
        type: RETRIEVE_CHANNEL_FAILED,
        error
    }
}

export function retrieveDirectChannel(user_id) {
    return dispatch => {
        dispatch(retrieveDirectChannelStart(user_id));
        axios.get(ENDPOINT_DIRECT_DIRECT_CHANNEL)
            .then(function(response) {
                dispatch(retrieveDirectChannelSuccess(response.data))
            }).catch(function(response) {
            dispatch(retrieveDirectChannelFailed(response.data))
        });
    }
}

export function retrieveDirectChannelStart(id) {
    return {
        type: RETRIEVE_DIRECT_CHANNEL_START,
        id
    }
}

export function retrieveDirectChannelSuccess(channel) {
    return {
        type: RETRIEVE_DIRECT_CHANNEL_SUCCESS,
        channel
    }
}

export function retrieveDirectChannelFailed(error) {
    return {
        type: RETRIEVE_DIRECT_CHANNEL_FAILED,
        error
    }
}

export function updateChannel(id, data) {
    return dispatch => {
        dispatch(updateChannelStart(id));
        axios.patch(ENDPOINT_CHANNEL + id + '/', data)
            .then(function(response) {
                dispatch(updateChannelSuccess(response.data))
            }).catch(function(response) {
                dispatch(updateChannelFailed(response.data))
            });
    }
}

export function updateChannelStart(id) {
    return {
        type: UPDATE_CHANNEL_START,
        id
    }
}

export function updateChannelSuccess(channel) {
    return {
        type: UPDATE_CHANNEL_SUCCESS,
        channel
    }
}

export function updateChannelFailed(error) {
    return {
        type: UPDATE_CHANNEL_FAILED,
        error
    }
}


export function deleteChannel(id) {
    return dispatch => {
        dispatch(deleteChannelStart(id));
        axios.delete(ENDPOINT_CHANNEL + id + '/')
            .then(function() {
                dispatch(deleteChannelSuccess(id))
            }).catch(function(response) {
                dispatch(deleteChannelFailed(response.data))
            });
    }
}

export function deleteChannelStart(id) {
    return {
        type: DELETE_CHANNEL_START,
        id
    }
}

export function deleteChannelSuccess(id) {
    return {
        type: DELETE_CHANNEL_SUCCESS,
        id
    }
}

export function deleteChannelFailed(error) {
    return {
        type: DELETE_CHANNEL_FAILED,
        error
    }
}

export function updateChannelRead(id, data) {
    return dispatch => {
        dispatch(updateChannelReadStart(id));
        axios.post(ENDPOINT_CHANNEL + id + '/read/', data)
            .then(function(response) {
                dispatch(updateChannelReadSuccess(response.data));
            }).catch(function(response) {
                dispatch(updateChannelReadFailed(response.data));
            });
    }
}

export function updateChannelReadStart(id) {
    return {
        type: UPDATE_CHANNEL_READ_START,
        id
    }
}

export function updateChannelReadSuccess(response) {
    return {
        type: UPDATE_CHANNEL_READ_SUCCESS,
        channel: response.channel
    }
}

export function updateChannelReadFailed(error) {
    return {
        type: UPDATE_CHANNEL_READ_FAILED,
        error
    }
}

export function listMoreChannels(url) {
    return dispatch => {
        dispatch(listMoreChannelsStart(url));
        axios.get(url)
            .then(function(response) {
                dispatch(listMoreChannelsSuccess(response.data))
            }).catch(function(response) {
                dispatch(listMoreChannelsFailed(response.data))
            });
    }
}

export function listMoreChannelsStart(url) {
    return {
        type: LIST_MORE_CHANNELS_START,
        url
    }
}

export function listMoreChannelsSuccess(response) {
    return {
        type: LIST_MORE_CHANNELS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next,
        count: response.count
    }
}

export function listMoreChannelsFailed(error) {
    return {
        type: LIST_MORE_CHANNELS_FAILED,
        error
    }
}
