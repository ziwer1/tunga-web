import axios from 'axios'

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        function csrfSafeMethod(method) {
            // these HTTP methods do not require CSRF protection
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        }

        if (!csrfSafeMethod(settings.type)) {
            xhr.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken'));
        }
    },
    xhrFields: {
        withCredentials: true
    }
});

var BACKEND_PATH = '/';
var API_PATH = 'api/';
var SOCIAL_LOGIN_PATH = 'accounts/';
if(__DEV__) {
    BACKEND_PATH = 'http://localhost:8000/';
} else if(__PRERELEASE__) {
    BACKEND_PATH = 'http://test.tunga.io/';
}

const API_ROOT = BACKEND_PATH + API_PATH;
export default API_ROOT;

export const SOCIAL_LOGIN_PREFIX = BACKEND_PATH + SOCIAL_LOGIN_PATH;
export const SOCIAL_LOGIN_SUFFIX = '/login/';

function createSocialLoginUrl(provider) {
    return SOCIAL_LOGIN_PREFIX + provider + SOCIAL_LOGIN_SUFFIX;
}

export const SOCIAL_LOGIN_URLS = {
    facebook: createSocialLoginUrl('facebook'),
    google: createSocialLoginUrl('google'),
    linkedin: createSocialLoginUrl('linkedin_oauth2'),
    github: createSocialLoginUrl('github')
};

function getEndpointUrl(path) {
    return API_ROOT + path;
}

export const ENDPOINT_LOGIN = getEndpointUrl('auth/login/');
export const ENDPOINT_LOGOUT = getEndpointUrl('auth/logout/');
export const ENDPOINT_VERIFY = getEndpointUrl('auth/verify/');
export const ENDPOINT_REGISTER = getEndpointUrl('auth/register/');
export const ENDPOINT_CHANGE_PASSWORD = getEndpointUrl('auth/password/change/');
export const ENDPOINT_RESET_PASSWORD = getEndpointUrl('auth/password/reset/');
export const ENDPOINT_RESET_PASSWORD_CONFIRM = getEndpointUrl('auth/password/reset/confirm/');
export const ENDPOINT_PROFILE = getEndpointUrl('me/profile/');
export const ENDPOINT_NOTIFICATION = getEndpointUrl('me/notification/');
export const ENDPOINT_ACCOUNT_INFO = getEndpointUrl('me/account/');
export const ENDPOINT_ACCOUNT_SETTINGS = getEndpointUrl('me/settings/');
export const ENDPOINT_USER_INFO = getEndpointUrl('me/user/');
export const ENDPOINT_USER_EDUCATION = getEndpointUrl('me/education/');
export const ENDPOINT_USER_WORK = getEndpointUrl('me/work/');
export const ENDPOINT_TASK = getEndpointUrl('task/');
export const ENDPOINT_USER = getEndpointUrl('user/');
export const ENDPOINT_COMMENT = getEndpointUrl('comment/');
export const ENDPOINT_MESSAGE = getEndpointUrl('message/');
export const ENDPOINT_REPLY = getEndpointUrl('reply/');
export const ENDPOINT_CONNECTION = getEndpointUrl('connection/');
export const ENDPOINT_APPLICATION = getEndpointUrl('application/');
export const ENDPOINT_SAVED_TASK = getEndpointUrl('saved-task/');
export const ENDPOINT_SKILL = getEndpointUrl('skill/');
export const ENDPOINT_COUNTRIES = getEndpointUrl('countries/');
export const ENDPOINT_CONTACT_REQUEST = getEndpointUrl('contact-request/');

export const USER_TYPE_DEVELOPER = 1;
export const USER_TYPE_PROJECT_OWNER = 2;

export const USER_TYPE_CHOICES = [
    {id: USER_TYPE_DEVELOPER, name: 'Developer'},
    {id: USER_TYPE_PROJECT_OWNER, name: 'Project Owner'}
];

export const VISIBILITY_DEVELOPERS = 1;
export const VISIBILITY_MY_TEAM = 2;
export const VISIBILITY_CUSTOM = 3;
export const VISIBILITY_ONLY_ME = 4;

export const TASK_VISIBILITY_CHOICES = [
    {id: VISIBILITY_DEVELOPERS, name: 'All Coders'},
    {id: VISIBILITY_MY_TEAM, name: 'My Team'},
    {id: VISIBILITY_CUSTOM, name: 'Select developers'}
];

export const SETTINGS_VISIBILITY_CHOICES = [
    {id: VISIBILITY_DEVELOPERS, name: 'All developers'},
    {id: VISIBILITY_MY_TEAM, name: 'My team only'},
    {id: VISIBILITY_ONLY_ME, name: 'Only me'}
];

export const UPDATE_INTERVAL_UNIT_HOURLY = 1
export const UPDATE_INTERVAL_UNIT_DAILY = 2
export const UPDATE_INTERVAL_UNIT_WEEKLY = 3
export const UPDATE_INTERVAL_UNIT_MONTHLY = 4
export const UPDATE_INTERVAL_UNIT_QUATERLY = 5
export const UPDATE_INTERVAL_UNIT_ANNUALLY = 6

export const UPDATE_SCHEDULE_CHOICES = [
    {number: 1, unit: UPDATE_INTERVAL_UNIT_DAILY, name: 'Daily'},
    {number: 2, unit: UPDATE_INTERVAL_UNIT_DAILY, name: 'Every 2 Days'},
    {number: 3, unit: UPDATE_INTERVAL_UNIT_DAILY, name: 'Every 3 Days'},
    {number: 4, unit: UPDATE_INTERVAL_UNIT_DAILY, name: 'Every 4 Days'},
    {number: 1, unit: UPDATE_INTERVAL_UNIT_WEEKLY, name: 'Weekly'},
]
