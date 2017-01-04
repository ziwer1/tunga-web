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
    APPLY: 'Apply'
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

export function getUserType(type, user) {
    if (user && (user.is_staff || user.is_superuser)) {
        return "Admin";
    }
    switch (type) {
        case USER_TYPE_PROJECT_OWNER:
            return "Client";
        case USER_TYPE_DEVELOPER:
            return "Developer";
        default:
            return "Anonymous";
    }
}

export function sendGAEvent(category, action, label) {
    if(!__DEV__ && !__PRERELEASE__) {
        window.ga(GA_COMMANDS.SEND, GA_HIT.EVENT, category, action, label);
    }
}

export function sendTwitterSignUpEvent(data) {
    if(!__DEV__ && !__PRERELEASE__) {
        window.twttr.conversion.trackPid(TWITTER_SIGNUP_EVENT_CODE, data);
    }
}
