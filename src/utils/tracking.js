import { USER_TYPE_PROJECT_OWNER, USER_TYPE_DEVELOPER } from '../constants/Api';

export const TWITTER_SIGNUP_EVENT_CODE = __PRODUCTION___?'nve6f':null;

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
    AUTH: 'Authentication',
    REGISTRATION: 'Registration',
    TASK: 'Task',
    CONTACT: 'Contact',
    VIDEO:'Video'
};

export const GA_EVENT_ACTIONS = {
    SIGN_IN: 'Sign In',
    SIGN_UP: 'Sign Up',
    BROWSE_DEVS: 'Browse Developers',
    LOG_OUT: 'Log Out',
    RECOVER_PASSWORD: 'Recover Password',
    DEV_APPLY: 'Developer Apply',
    DEV_INVITE: 'Invite Developer',
    PLAY: 'Play',
    CREATE: 'Create',
    APPLY: 'Apply',
    SCHEDULE_CALL: 'Schedule Call',
    REQUEST_OFFER: 'Request Offer'
};

export const GA_EVENT_LABELS = {
    DEVELOPER: 'Developer',
    CLIENT: 'Client',
    ADMIN: 'Admin',
    ANONYMOUS: 'Anonymous',
    INTRO_VIDEO: 'Intro Video'
};

export function getUserTypeTwitter(type) {
    switch (type) {
        case USER_TYPE_PROJECT_OWNER:
            return "client";
        case USER_TYPE_DEVELOPER:
            return "developer";
        default:
            return null;
    }
}

export function getGAUserType(user) {
    if (user) {
        if(user.is_staff || user.is_superuser) {
            return "Admin";
        }
        switch (user.type) {
            case USER_TYPE_PROJECT_OWNER:
                return "Client";
            case USER_TYPE_DEVELOPER:
                return "Developer";
            default:
                return "Unknown";
        }
    } else {
        return "Anonymous";
    }
}

export function sendGAEvent(category, action, label) {
    if(__PRODUCTION___) {
        window.ga(GA_COMMANDS.SEND, GA_HIT.EVENT, category || null, action || null, label || null);
    }
}

export function sendTwitterSignUpEvent(data) {
    if(__PRODUCTION___) {
        window.twttr.conversion.trackPid(TWITTER_SIGNUP_EVENT_CODE, data);
    }
}
