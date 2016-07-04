import { combineReducers } from 'redux'
import * as AuthActions from '../actions/AuthActions'
import * as ProfileActions from '../actions/ProfileActions'
import { running as runningProjects } from './ProjectReducers'
import { running as runningTasks } from './TaskReducers'
import { PATH_CHANGE } from '../actions/NavActions'

function user(state = {}, action) {
    switch (action.type) {
        case AuthActions.LOGIN_SUCCESS:
        case AuthActions.VERIFY_SUCCESS:
            return action.user;
        case ProfileActions.UPDATE_ACCOUNT_INFO_SUCCESS:
        case ProfileActions.UPDATE_AUTH_USER_SUCCESS:
            var user = action.user;
            return {...state, ...user};
        case AuthActions.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}

function application(state = {}, action) {
    switch (action.type) {
        case AuthActions.RETRIEVE_APPLICATION_SUCCESS:
            return action.application;
        case ProfileActions.RETRIEVE_PROFILE_START:
        case ProfileActions.RETRIEVE_PROFILE_FAILED:
        case PATH_CHANGE:
            return {};
        default:
            return state;
    }
}

function isAuthenticating(state = false, action) {
    switch (action.type) {
        case AuthActions.LOGIN_START:
        case AuthActions.LOGOUT_START:
            return true;
        case AuthActions.LOGIN_SUCCESS:
        case AuthActions.LOGOUT_SUCCESS:
        case AuthActions.LOGIN_FAILED:
        case AuthActions.LOGOUT_FAILED:
            return false;
        default:
            return state;
    }
}

function isVerifying(state = false, action) {
    switch (action.type) {
        case AuthActions.VERIFY_START:
            return true;
        case AuthActions.VERIFY_SUCCESS:
        case AuthActions.VERIFY_FAILED:
            return false;
        default:
            return state;
    }
}

function isAuthenticated(state = false, action) {
    switch (action.type) {
        case AuthActions.LOGIN_SUCCESS:
        case AuthActions.VERIFY_SUCCESS:
            return true;
        case AuthActions.LOGOUT_SUCCESS:
            return false;
        default:
            return state;
    }
}

function isRegistering(state = false, action) {
    switch (action.type) {
        case AuthActions.REGISTER_START:
            return true;
        case AuthActions.REGISTER_SUCCESS:
        case AuthActions.REGISTER_FAILED:
            return false;
        default:
            return state;
    }
}

function isRegistered(state = false, action) {
    switch (action.type) {
        case AuthActions.REGISTER_SUCCESS:
            return true;
        case AuthActions.REGISTER_START:
        case AuthActions.REGISTER_FAILED:
            return false;
        default:
            return state;
    }
}

function isApplying(state = false, action) {
    switch (action.type) {
        case AuthActions.APPLY_START:
            return true;
        case AuthActions.APPLY_SUCCESS:
        case AuthActions.APPLY_FAILED:
            return false;
        default:
            return state;
    }
}

function hasApplied(state = false, action) {
    switch (action.type) {
        case AuthActions.APPLY_SUCCESS:
            return true;
        case AuthActions.APPLY_START:
        case AuthActions.APPLY_FAILED:
            return false;
        default:
            return state;
    }
}

function isRetrievingApplication(state = false, action) {
    switch (action.type) {
        case AuthActions.APPLY_START:
            return true;
        case AuthActions.APPLY_SUCCESS:
        case AuthActions.APPLY_FAILED:
            return false;
        default:
            return state;
    }
}

function isResetting(state = false, action) {
    switch (action.type) {
        case AuthActions.RESET_PASSWORD_START:
            return true;
        case AuthActions.RESET_PASSWORD_SUCCESS:
        case AuthActions.RESET_PASSWORD_FAILED:
            return false;
        default:
            return state;
    }
}

function isReset(state = false, action) {
    switch (action.type) {
        case AuthActions.RESET_PASSWORD_SUCCESS:
        case AuthActions.RESET_PASSWORD_CONFIRM_SUCCESS:
            return true;
        case AuthActions.RESET_PASSWORD_START:
        case AuthActions.RESET_PASSWORD_FAILED:
        case AuthActions.RESET_PASSWORD_CONFIRM_START:
        case AuthActions.RESET_PASSWORD_CONFIRM_FAILED:
            return false;
        default:
            return state;
    }
}

function error(state = {}, action) {
    switch (action.type) {
        case AuthActions.LOGIN_FAILED:
            var error = action.error;
            if(error && error.non_field_errors == 'Unable to log in with provided credentials.') {
                error.non_field_errors = 'Wrong username or password';
            }
            return {...state, auth: error};
        case AuthActions.LOGIN_START:
        case AuthActions.LOGIN_SUCCESS:
            return {...state, auth: null};
        case AuthActions.REGISTER_FAILED:
            return {...state, register: action.error};
        case AuthActions.REGISTER_START:
        case AuthActions.REGISTER_SUCCESS:
            return {...state, register: null};
        case AuthActions.APPLY_FAILED:
            return {...state, apply: action.error};
        case AuthActions.APPLY_START:
        case AuthActions.APPLY_SUCCESS:
            return {...state, apply: null};
        case AuthActions.RESET_PASSWORD_FAILED:
            return {...state, reset: action.error};
        case AuthActions.RESET_PASSWORD_START:
        case AuthActions.RESET_PASSWORD_SUCCESS:
            return {...state, reset: null};
        case AuthActions.RESET_PASSWORD_CONFIRM_FAILED:
            return {...state, reset_confirm: action.error};
        case AuthActions.RESET_PASSWORD_CONFIRM_START:
        case AuthActions.RESET_PASSWORD_CONFIRM_SUCCESS:
            return {...state, reset_confirm: null};
        default:
            return state;
    }
}

function next(state = null, action) {
    switch (action.type) {
        case AuthActions.AUTH_REDIRECT:
            return action.path;
        case AuthActions.LOGOUT_SUCCESS:
            return null;
        default:
            return state;
    }
}

const running = combineReducers({
    projects: runningProjects,
    tasks: runningTasks
});

const Auth = combineReducers({
    user,
    application,
    isAuthenticating,
    isVerifying,
    isAuthenticated,
    isRegistering,
    isRegistered,
    isApplying,
    hasApplied,
    isRetrievingApplication,
    isResetting,
    isReset,
    error,
    next,
    running
});

export default Auth;
