import axios from 'axios'
import { ENDPOINT_LOGIN, ENDPOINT_LOGOUT, ENDPOINT_VERIFY, ENDPOINT_REGISTER, ENDPOINT_APPLY, ENDPOINT_RESET_PASSWORD, ENDPOINT_RESET_PASSWORD_CONFIRM } from '../constants/Api'
import { listRunningProjects } from './ProjectActions'
import { listRunningTasks } from './TaskActions'

export const LOGIN_START = 'LOGIN_START';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const VERIFY_START = 'VERIFY_START';
export const VERIFY_SUCCESS = 'VERIFY_SUCCESS';
export const VERIFY_FAILED = 'VERIFY_FAILED';
export const LOGOUT_START = 'LOGOUT_START';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILED = 'LOGOUT_FAILED';
export const REGISTER_START = 'REGISTER_START';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILED = 'REGISTER_FAILED';
export const APPLY_START = 'APPLY_START';
export const APPLY_SUCCESS = 'APPLY_SUCCESS';
export const APPLY_FAILED = 'APPLY_FAILED';
export const RETRIEVE_APPLICATION_START = 'RETRIEVE_APPLICATION_START';
export const RETRIEVE_APPLICATION_SUCCESS = 'RETRIEVE_APPLICATION_SUCCESS';
export const RETRIEVE_APPLICATION_FAILED = 'RETRIEVE_APPLICATION_FAILED';
export const RESET_PASSWORD_START = 'RESET_PASSWORD_START';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAILED = 'RESET_PASSWORD_FAILED';
export const RESET_PASSWORD_CONFIRM_START = 'RESET_PASSWORD_CONFIRM_START';
export const RESET_PASSWORD_CONFIRM_SUCCESS = 'RESET_PASSWORD_CONFIRM_SUCCESS';
export const RESET_PASSWORD_CONFIRM_FAILED = 'RESET_PASSWORD_CONFIRM_FAILED';
export const AUTH_REDIRECT = 'AUTH_REDIRECT';

export function authenticate(credentials) {
    return dispatch => {
        dispatch(authStart(credentials));
        axios.post(ENDPOINT_LOGIN, credentials)
            .then(function(response) {
                dispatch(authSuccess(response.data));
                dispatch(listRunningTasks());
                dispatch(listRunningProjects());
            }).catch(function(response) {
                dispatch(authFailed(response.data));
            });
    }
}

export function authStart(credentials) {
    return {
        type: LOGIN_START,
        credentials
    }
}

export function authSuccess(data) {
    return {
        type: LOGIN_SUCCESS,
        user: data.user
    }
}

export function authFailed(error) {
    return {
        type: LOGIN_FAILED,
        error
    }
}

export function verify() {
    return dispatch => {
        dispatch(verifyStart());
        axios.get(ENDPOINT_VERIFY)
            .then(function(response) {
                dispatch(verifySuccess(response.data));
                dispatch(listRunningTasks());
                dispatch(listRunningProjects());
            }).catch(function(response) {
                dispatch(verifyFailed(response.data))
            });
    }
}

export function verifyStart() {
    return {
        type: VERIFY_START
    }
}

export function verifySuccess(user) {
    return {
        type: VERIFY_SUCCESS,
        user
    }
}

export function verifyFailed(error) {
    return {
        type: VERIFY_FAILED,
        error
    }
}

export function logout() {
    return dispatch => {
        dispatch(logoutStart());
        axios.post(ENDPOINT_LOGOUT, {})
            .then(function() {
                dispatch(logoutSuccess())
            }).catch(function(response) {
                dispatch(logoutFailed(response.data))
            });
    }
}

export function logoutStart() {
    return {
        type: LOGOUT_START
    }
}

export function logoutSuccess() {
    return {
        type: LOGOUT_SUCCESS
    }
}

export function logoutFailed(error) {
    return {
        type: LOGOUT_FAILED,
        error
    }
}

export function register(details) {
    return dispatch => {
        dispatch(registerStart(details));
        axios.post(ENDPOINT_REGISTER, details)
            .then(function(response) {
                dispatch(registerSuccess(response.data))
            }).catch(function(response) {
                dispatch(registerFailed(response.data))
            });
    }
}

export function registerStart(details) {
    return {
        type: REGISTER_START,
        details
    }
}

export function registerSuccess(data) {
    return {
        type: REGISTER_SUCCESS,
        user: data.user
    }
}

export function registerFailed(error) {
    return {
        type: REGISTER_FAILED,
        error
    }
}

export function apply(details) {
    return dispatch => {
        dispatch(applyStart(details));
        axios.post(ENDPOINT_APPLY, details)
            .then(function(response) {
                dispatch(applySuccess(response.data))
            }).catch(function(response) {
                dispatch(applyFailed(response.data))
            });
    }
}

export function applyStart(details) {
    return {
        type: APPLY_START,
        details
    }
}

export function applySuccess(application) {
    return {
        type: APPLY_SUCCESS,
        application
    }
}

export function applyFailed(error) {
    return {
        type: APPLY_FAILED,
        error
    }
}

export function retrieveApplication(key) {
    return dispatch => {
        dispatch(retrieveApplicationStart(key));
        axios.get(ENDPOINT_APPLY + 'key/' + key + '/')
            .then(function(response) {
                dispatch(retrieveApplicationSuccess(response.data))
            }).catch(function(response) {
                dispatch(retrieveApplicationFailed(response.data))
            });
    }
}

export function retrieveApplicationStart(key) {
    return {
        type: RETRIEVE_APPLICATION_START,
        key
    }
}

export function retrieveApplicationSuccess(application) {
    return {
        type: RETRIEVE_APPLICATION_SUCCESS,
        application
    }
}

export function retrieveApplicationFailed(error) {
    return {
        type: RETRIEVE_APPLICATION_FAILED,
        error
    }
}

export function resetPassword(email) {
    return dispatch => {
        dispatch(resetPasswordStart(email));
        axios.post(ENDPOINT_RESET_PASSWORD, email)
            .then(function(response) {
                dispatch(resetPasswordSuccess(response.data))
            }).catch(function(response) {
                dispatch(resetPasswordFailed(response.data))
            });
    }
}

export function resetPasswordStart(email) {
    return {
        type: RESET_PASSWORD_START,
        email
    }
}

export function resetPasswordSuccess(response) {
    return {
        type: RESET_PASSWORD_SUCCESS,
        response
    }
}

export function resetPasswordFailed(error) {
    return {
        type: RESET_PASSWORD_FAILED,
        error
    }
}


export function resetPasswordConfirm(credentials) {
    return dispatch => {
        dispatch(resetPasswordConfirmStart(credentials));
        axios.post(ENDPOINT_RESET_PASSWORD_CONFIRM, credentials)
            .then(function(response) {
                dispatch(resetPasswordConfirmSuccess(response.data))
            }).catch(function(response) {
                dispatch(resetPasswordConfirmFailed(response.data))
            });
    }
}

export function resetPasswordConfirmStart(credentials) {
    return {
        type: RESET_PASSWORD_CONFIRM_START,
        credentials
    }
}

export function resetPasswordConfirmSuccess(response) {
    return {
        type: RESET_PASSWORD_CONFIRM_SUCCESS,
        response
    }
}

export function resetPasswordConfirmFailed(error) {
    return {
        type: RESET_PASSWORD_CONFIRM_FAILED,
        error
    }
}

export function authRedirect(path) {
    return {
        type: AUTH_REDIRECT,
        path
    }
}
