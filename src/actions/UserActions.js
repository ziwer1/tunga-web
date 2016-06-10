import axios from 'axios'
import { ENDPOINT_USER } from '../constants/Api'

export const LIST_USERS_START = 'LIST_USERS_START';
export const LIST_USERS_SUCCESS = 'LIST_USERS_SUCCESS';
export const LIST_USERS_FAILED = 'LIST_USERS_FAILED';
export const RETRIEVE_USER_START = 'RETRIEVE_USER_START';
export const RETRIEVE_USER_SUCCESS = 'RETRIEVE_USER_SUCCESS';
export const RETRIEVE_USER_FAILED = 'RETRIEVE_USER_FAILED';
export const LIST_MORE_USERS_START = 'LIST_MORE_USERS_START';
export const LIST_MORE_USERS_SUCCESS = 'LIST_MORE_USERS_SUCCESS';
export const LIST_MORE_USERS_FAILED = 'LIST_MORE_USERS_FAILED';

export function listUsers(filter) {
    return dispatch => {
        dispatch(listUsersStart(filter));
        axios.get(ENDPOINT_USER, {params: filter})
            .then(function(response) {
                dispatch(listUsersSuccess(response.data))
            }).catch(function(response) {
                dispatch(listUsersFailed(response.data))
            });
    }
}

export function listUsersStart(filter) {
    return {
        type: LIST_USERS_START,
        filter
    }
}

export function listUsersSuccess(response) {
    return {
        type: LIST_USERS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next
    }
}

export function listUsersFailed(error) {
    return {
        type: LIST_USERS_FAILED,
        error
    }
}

export function retrieveUser(id) {
    return dispatch => {
        dispatch(retrieveUserStart(id));
        axios.get(ENDPOINT_USER + id + '/')
            .then(function(response) {
                dispatch(retrieveUserSuccess(response.data))
            }).catch(function(response) {
                dispatch(retrieveUserFailed(response.data))
            });
    }
}

export function retrieveUserStart(id) {
    return {
        type: RETRIEVE_USER_START,
        id
    }
}

export function retrieveUserSuccess(user) {
    return {
        type: RETRIEVE_USER_SUCCESS,
        user
    }
}

export function retrieveUserFailed(error) {
    return {
        type: RETRIEVE_USER_FAILED,
        error
    }
}

export function listMoreUsers(url) {
    return dispatch => {
        dispatch(listMoreUsersStart(url));
        axios.get(url)
            .then(function(response) {
                dispatch(listMoreUsersSuccess(response.data))
            }).catch(function(response) {
                dispatch(listMoreUsersFailed(response.data))
            });
    }
}

export function listMoreUsersStart(url) {
    return {
        type: LIST_MORE_USERS_START,
        url
    }
}

export function listMoreUsersSuccess(response) {
    return {
        type: LIST_MORE_USERS_SUCCESS,
        items: response.results,
        previous: response.previous,
        next: response.next
    }
}

export function listMoreUsersFailed(error) {
    return {
        type: LIST_MORE_USERS_FAILED,
        error
    }
}
