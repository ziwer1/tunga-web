import { combineReducers } from 'redux'
import * as UtilityActions from '../actions/UtilityActions'


function isSending(state = false, action) {
    switch (action.type) {
        case UtilityActions.SEND_CONTACT_REQUEST_START:
            return true;
        case UtilityActions.SEND_CONTACT_REQUEST_SUCCESS:
        case UtilityActions.SEND_CONTACT_REQUEST_FAILED:
            return false;
        default:
            return state;
    }
}

function isSent(state = false, action) {
    switch (action.type) {
        case UtilityActions.SEND_CONTACT_REQUEST_SUCCESS:
            return true;
        case UtilityActions.SEND_CONTACT_REQUEST_START:
        case UtilityActions.SEND_CONTACT_REQUEST_FAILED:
            return false;
        default:
            return state;
    }
}

function error(state = null, action) {
    switch (action.type) {
        case UtilityActions.SEND_CONTACT_REQUEST_FAILED:
            return action.error;
        case UtilityActions.SEND_CONTACT_REQUEST_START:
        case UtilityActions.SEND_CONTACT_REQUEST_SUCCESS:
            return null;
        default:
            return state;
    }
}

const contact = combineReducers({
    isSending,
    isSent,
    error
});

const Utility = combineReducers({
    contact
});

export default Utility;
