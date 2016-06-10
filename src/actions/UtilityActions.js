import axios from 'axios'
import { ENDPOINT_CONTACT_REQUEST } from '../constants/Api'

export const SEND_CONTACT_REQUEST_START = 'SEND_CONTACT_REQUEST_START';
export const SEND_CONTACT_REQUEST_SUCCESS = 'SEND_CONTACT_REQUEST_SUCCESS';
export const SEND_CONTACT_REQUEST_FAILED = 'SEND_CONTACT_REQUEST_FAILED';


export function sendContactRequest(email) {
    return dispatch => {
        dispatch(sendContactRequestStart(email));
        axios.post(ENDPOINT_CONTACT_REQUEST, email)
            .then(function(response) {
                dispatch(sendContactRequestSuccess(response.data))
            }).catch(function(response) {
                dispatch(sendContactRequestFailed(response.data))
            });
    }
}

export function sendContactRequestStart(email) {
    return {
        type: SEND_CONTACT_REQUEST_START,
        email
    }
}

export function sendContactRequestSuccess(email) {
    return {
        type: SEND_CONTACT_REQUEST_SUCCESS,
        email
    }
}

export function sendContactRequestFailed(error) {
    return {
        type: SEND_CONTACT_REQUEST_FAILED,
        error
    }
}
