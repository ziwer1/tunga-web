import axios from 'axios'
import { ENDPOINT_MESSAGE } from '../constants/Api'

export const CREATE_MESSAGE_START = 'CREATE_MESSAGE_START';
export const CREATE_MESSAGE_SUCCESS = 'CREATE_MESSAGE_SUCCESS';
export const CREATE_MESSAGE_FAILED = 'CREATE_MESSAGE_FAILED';
export const LIST_MESSAGES_START = 'LIST_MESSAGES_START';
export const LIST_MESSAGES_SUCCESS = 'LIST_MESSAGES_SUCCESS';
export const LIST_MESSAGES_FAILED = 'LIST_MESSAGES_FAILED';
export const RETRIEVE_MESSAGE_START = 'RETRIEVE_MESSAGE_START';
export const RETRIEVE_MESSAGE_SUCCESS = 'RETRIEVE_MESSAGE_SUCCESS';
export const RETRIEVE_MESSAGE_FAILED = 'RETRIEVE_MESSAGE_FAILED';
export const UPDATE_MESSAGE_START = 'UPDATE_MESSAGE_START';
export const UPDATE_MESSAGE_SUCCESS = 'UPDATE_MESSAGE_SUCCESS';
export const UPDATE_MESSAGE_FAILED = 'UPDATE_MESSAGE_FAILED';
export const DELETE_MESSAGE_START = 'DELETE_MESSAGE_START';
export const DELETE_MESSAGE_SUCCESS = 'DELETE_MESSAGE_SUCCESS';
export const DELETE_MESSAGE_FAILED = 'DELETE_MESSAGE_FAILED';
export const UPDATE_MESSAGE_READ_START = 'UPDATE_MESSAGE_READ_START';
export const UPDATE_MESSAGE_READ_SUCCESS = 'UPDATE_MESSAGE_READ_SUCCESS';
export const UPDATE_MESSAGE_READ_FAILED = 'UPDATE_MESSAGE_READ_FAILED';
export const LIST_MORE_MESSAGES_START = 'LIST_MORE_MESSAGES_START';
export const LIST_MORE_MESSAGES_SUCCESS = 'LIST_MORE_MESSAGES_SUCCESS';
export const LIST_MORE_MESSAGES_FAILED = 'LIST_MORE_MESSAGES_FAILED';

export function createMessage(message, attachments) {
    return dispatch => {
        dispatch(createMessageStart(message));
        if(attachments.length) {
            var data = new FormData();
            Object.keys(message).map((key, idx) => {
                if(!Array.isArray(message[key]) || message[key].length) {
                    data.append(key, message[key]);
                }
            });

            attachments.map((file, idx) => {
                data.append('file' + idx, file);
            });

            $.ajax({
                url: ENDPOINT_MESSAGE,
                type: "POST",
                data: data,
                processData: false,
                contentType: false
            }).then(function (data) {
                dispatch(createMessageSuccess(data))
            }, function (data) {
                dispatch(createMessageFailed(data));
            });
        } else {
            axios.post(ENDPOINT_MESSAGE, message)
                .then(function(response) {
                    dispatch(createMessageSuccess(response.data));
                }).catch(function(response) {
                    dispatch(createMessageFailed(response.data));
                });
        }
    }
}

export function createMessageStart(message) {
    return {
        type: CREATE_MESSAGE_START,
        message
    }
}

export function createMessageSuccess(message) {
    return {
        type: CREATE_MESSAGE_SUCCESS,
        message
    }
}

export function createMessageFailed(error) {
    return {
        type: CREATE_MESSAGE_FAILED,
        error
    }
}

export function listMessages(filter) {
    return dispatch => {
        dispatch(listMessagesStart(filter));
        axios.get(ENDPOINT_MESSAGE, {params: filter})
            .then(function(response) {
                dispatch(listMessagesSuccess(response.data))
            }).catch(function(response) {
                dispatch(listMessagesFailed(response.data))
            });
    }
}

export function listMessagesStart(filter) {
    return {
        type: LIST_MESSAGES_START,
        filter
    }
}

export function listMessagesSuccess(response) {
    return {
        type: LIST_MESSAGES_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next
    }
}

export function listMessagesFailed(error) {
    return {
        type: LIST_MESSAGES_FAILED,
        error
    }
}

export function retrieveMessage(id) {
    return dispatch => {
        dispatch(retrieveMessageStart(id));
        axios.get(ENDPOINT_MESSAGE + id + '/')
            .then(function(response) {
                dispatch(retrieveMessageSuccess(response.data))
            }).catch(function(response) {
                dispatch(retrieveMessageFailed(response.data))
            });
    }
}

export function retrieveMessageStart(id) {
    return {
        type: RETRIEVE_MESSAGE_START,
        id
    }
}

export function retrieveMessageSuccess(message) {
    return {
        type: RETRIEVE_MESSAGE_SUCCESS,
        message
    }
}

export function retrieveMessageFailed(error) {
    return {
        type: RETRIEVE_MESSAGE_FAILED,
        error
    }
}

export function updateMessage(id) {
    return dispatch => {
        dispatch(updateMessageStart(id));
        axios.patch(ENDPOINT_MESSAGE + id + '/')
            .then(function(response) {
                dispatch(updateMessageSuccess(response.data))
            }).catch(function(response) {
                dispatch(updateMessageFailed(response.data))
            });
    }
}

export function updateMessageStart(id) {
    return {
        type: UPDATE_MESSAGE_START,
        id
    }
}

export function updateMessageSuccess(message) {
    return {
        type: UPDATE_MESSAGE_SUCCESS,
        message
    }
}

export function updateMessageFailed(error) {
    return {
        type: UPDATE_MESSAGE_FAILED,
        error
    }
}


export function deleteMessage(id) {
    return dispatch => {
        dispatch(deleteMessageStart(id));
        axios.delete(ENDPOINT_MESSAGE + id + '/')
            .then(function() {
                dispatch(deleteMessageSuccess(id))
            }).catch(function(response) {
                dispatch(deleteMessageFailed(response.data))
            });
    }
}

export function deleteMessageStart(id) {
    return {
        type: DELETE_MESSAGE_START,
        id
    }
}

export function deleteMessageSuccess(id) {
    return {
        type: DELETE_MESSAGE_SUCCESS,
        id
    }
}

export function deleteMessageFailed(error) {
    return {
        type: DELETE_MESSAGE_FAILED,
        error
    }
}

export function updateMessageRead(id) {
    return dispatch => {
        dispatch(updateMessageReadStart(id));
        axios.post(ENDPOINT_MESSAGE + id + '/read/')
            .then(function(response) {
                dispatch(updateMessageReadSuccess(response.data))
            }).catch(function(response) {
                dispatch(updateMessageReadFailed(response.data))
            });
    }
}

export function updateMessageReadStart(id) {
    return {
        type: UPDATE_MESSAGE_READ_START,
        id
    }
}

export function updateMessageReadSuccess(response) {
    return {
        type: UPDATE_MESSAGE_READ_SUCCESS,
        message: response.message
    }
}

export function updateMessageReadFailed(error) {
    return {
        type: UPDATE_MESSAGE_READ_FAILED,
        error
    }
}

export function listMoreMessages(url) {
    return dispatch => {
        dispatch(listMoreMessagesStart(url));
        axios.get(url)
            .then(function(response) {
                dispatch(listMoreMessagesSuccess(response.data))
            }).catch(function(response) {
                dispatch(listMoreMessagesFailed(response.data))
            });
    }
}

export function listMoreMessagesStart(url) {
    return {
        type: LIST_MORE_MESSAGES_START,
        url
    }
}

export function listMoreMessagesSuccess(response) {
    return {
        type: LIST_MORE_MESSAGES_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next
    }
}

export function listMoreMessagesFailed(error) {
    return {
        type: LIST_MORE_MESSAGES_FAILED,
        error
    }
}
