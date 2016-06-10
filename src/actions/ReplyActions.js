import axios from 'axios'
import { ENDPOINT_REPLY } from '../constants/Api'

export const CREATE_REPLY_START = 'CREATE_REPLY_START';
export const CREATE_REPLY_SUCCESS = 'CREATE_REPLY_SUCCESS';
export const CREATE_REPLY_FAILED = 'CREATE_REPLY_FAILED';
export const LIST_REPLIES_START = 'LIST_REPLIES_START';
export const LIST_REPLIES_SUCCESS = 'LIST_REPLIES_SUCCESS';
export const LIST_REPLIES_FAILED = 'LIST_REPLIES_FAILED';
export const RETRIEVE_REPLY_START = 'RETRIEVE_REPLY_START';
export const RETRIEVE_REPLY_SUCCESS = 'RETRIEVE_REPLY_SUCCESS';
export const RETRIEVE_REPLY_FAILED = 'RETRIEVE_REPLY_FAILED';
export const UPDATE_REPLY_START = 'UPDATE_REPLY_START';
export const UPDATE_REPLY_SUCCESS = 'UPDATE_REPLY_SUCCESS';
export const UPDATE_REPLY_FAILED = 'UPDATE_REPLY_FAILED';
export const DELETE_REPLY_START = 'DELETE_REPLY_START';
export const DELETE_REPLY_SUCCESS = 'DELETE_REPLY_SUCCESS';
export const DELETE_REPLY_FAILED = 'DELETE_REPLY_FAILED';
export const LIST_MORE_REPLIES_START = 'LIST_MORE_REPLIES_START';
export const LIST_MORE_REPLIES_SUCCESS = 'LIST_MORE_REPLIES_SUCCESS';
export const LIST_MORE_REPLIES_FAILED = 'LIST_MORE_REPLIES_FAILED';

export function createReply(reply, attachments) {
    return dispatch => {
        dispatch(createReplyStart(reply));

        if(attachments.length) {
            var data = new FormData();
            Object.keys(reply).map((key, idx) => {
                if(!Array.isArray(reply[key]) || reply[key].length) {
                    data.append(key, reply[key]);
                }
            });

            attachments.map((file, idx) => {
                data.append('file' + idx, file);
            });

            $.ajax({
                url: ENDPOINT_REPLY,
                type: "POST",
                data: data,
                processData: false,
                contentType: false
            }).then(function (data) {
                dispatch(createReplySuccess(data))
            }, function (data) {
                dispatch(createReplyFailed(data));
            });
        } else {
            axios.post(ENDPOINT_REPLY, reply)
                .then(function(response) {
                    dispatch(createReplySuccess(response.data))
                }).catch(function(response) {
                    dispatch(createReplyFailed(response.data))
                });
        }
    }
}

export function createReplyStart(reply) {
    return {
        type: CREATE_REPLY_START,
        reply
    }
}

export function createReplySuccess(reply) {
    return {
        type: CREATE_REPLY_SUCCESS,
        reply
    }
}

export function createReplyFailed(error) {
    return {
        type: CREATE_REPLY_FAILED,
        error
    }
}

export function listReplies(filter) {
    return dispatch => {
        dispatch(listRepliesStart(filter));
        axios.get(ENDPOINT_REPLY, {params: filter})
            .then(function(response) {
                dispatch(listRepliesSuccess(response.data))
            }).catch(function(response) {
                dispatch(listRepliesFailed(response.data))
            });
    }
}

export function listRepliesStart(filter) {
    return {
        type: LIST_REPLIES_START,
        filter
    }
}

export function listRepliesSuccess(response) {
    return {
        type: LIST_REPLIES_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next
    }
}

export function listRepliesFailed(error) {
    return {
        type: LIST_REPLIES_FAILED,
        error
    }
}

export function retrieveReply(id) {
    return dispatch => {
        dispatch(retrieveReplyStart(id));
        axios.get(ENDPOINT_REPLY + id + '/')
            .then(function(response) {
                dispatch(retrieveReplySuccess(response.data))
            }).catch(function(response) {
                dispatch(retrieveReplyFailed(response.data))
            });
    }
}

export function retrieveReplyStart(id) {
    return {
        type: RETRIEVE_REPLY_START,
        id
    }
}

export function retrieveReplySuccess(reply) {
    return {
        type: RETRIEVE_REPLY_SUCCESS,
        reply
    }
}

export function retrieveReplyFailed(error) {
    return {
        type: RETRIEVE_REPLY_FAILED,
        error
    }
}

export function updateReply(id, reply) {
    return dispatch => {
        dispatch(updateReplyStart(id));
        axios.patch(ENDPOINT_REPLY + id + '/', reply)
            .then(function(response) {
                dispatch(updateReplySuccess(response.data))
            }).catch(function(response) {
                dispatch(updateReplyFailed(response.data))
            });
    }
}

export function updateReplyStart(id) {
    return {
        type: UPDATE_REPLY_START,
        id
    }
}

export function updateReplySuccess(reply) {
    return {
        type: UPDATE_REPLY_SUCCESS,
        reply
    }
}

export function updateReplyFailed(error) {
    return {
        type: UPDATE_REPLY_FAILED,
        error
    }
}


export function deleteReply(id) {
    return dispatch => {
        dispatch(deleteReplyStart(id));
        axios.delete(ENDPOINT_REPLY + id + '/', {})
            .then(function() {
                dispatch(deleteReplySuccess(id))
            }).catch(function(response) {
                dispatch(deleteReplyFailed(response.data))
            });
    }
}

export function deleteReplyStart(id) {
    return {
        type: DELETE_REPLY_START,
        id
    }
}

export function deleteReplySuccess(id) {
    return {
        type: DELETE_REPLY_SUCCESS,
        id
    }
}

export function deleteReplyFailed(error) {
    return {
        type: DELETE_REPLY_FAILED,
        error
    }
}

export function listMoreReplies(url) {
    return dispatch => {
        dispatch(listMoreRepliesStart(url));
        axios.get(url)
            .then(function(response) {
                dispatch(listMoreRepliesSuccess(response.data))
            }).catch(function(response) {
                dispatch(listMoreRepliesFailed(response.data))
            });
    }
}

export function listMoreRepliesStart(url) {
    return {
        type: LIST_MORE_REPLIES_START,
        url
    }
}

export function listMoreRepliesSuccess(response) {
    return {
        type: LIST_MORE_REPLIES_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next
    }
}

export function listMoreRepliesFailed(error) {
    return {
        type: LIST_MORE_REPLIES_FAILED,
        error
    }
}
