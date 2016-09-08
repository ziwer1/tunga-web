import { USER_TYPE_PROJECT_OWNER, USER_TYPE_DEVELOPER } from '../constants/Api';

export const TWITTER_SIGNUP_EVENT_CODE = 'nve6f';

export const AUTH_METHODS = {
    EMAIL: "Email",
    FACEBOOK: "Facebook",
    GOOGLE: "Google",
    GITHUB: "GitHub"
};

export const USER_TYPES = {
    CLIENT: "client",
    DEVELOPER: "developer"
};

export const GA_COMMANDS = {
    SEND: "send"
};

export const GA_HIT = {
    PAGE_VIEW: "pageview",
    EVENT: "event"
};

export const GA_EVENT_CATEGORIES = {
    SIGN_UP: "SignUp",
    SIGN_IN: "SignIn"
};

export function getUserTypeString(type) {
    switch (type) {
        case USER_TYPE_PROJECT_OWNER:
            return "client";
        case USER_TYPE_DEVELOPER:
            return "developer";
        default:
            return null;
    }
}

export function sendGAEvent(category, action, label) {
    window.ga(GA_COMMANDS.SEND, GA_HIT.EVENT, category, action, label);
}

export function sendTwitterSignUpEvent(data) {
    window.twttr.conversion.trackPid(TWITTER_SIGNUP_EVENT_CODE, data);
}
