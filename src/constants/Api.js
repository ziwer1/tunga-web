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
export const ENDPOINT_LOGIN = API_ROOT + 'auth/login/';
export const ENDPOINT_LOGOUT = API_ROOT + 'auth/logout/';
export const ENDPOINT_VERIFY = API_ROOT + 'auth/verify/';
export const ENDPOINT_REGISTER = API_ROOT + 'auth/register/';
export const ENDPOINT_CHANGE_PASSWORD = API_ROOT + 'auth/password/change/';
export const ENDPOINT_RESET_PASSWORD = API_ROOT + 'auth/password/reset/';
export const ENDPOINT_RESET_PASSWORD_CONFIRM = API_ROOT + 'auth/password/reset/confirm/';
export const ENDPOINT_PROFILE = API_ROOT + 'me/profile/';
export const ENDPOINT_NOTIFICATION = API_ROOT + 'me/notification/';
export const ENDPOINT_ACCOUNT_INFO = API_ROOT + 'me/account/';
export const ENDPOINT_ACCOUNT_SETTINGS = API_ROOT + 'me/settings/';
export const ENDPOINT_USER_INFO = API_ROOT + 'me/user/';
export const ENDPOINT_TASK = API_ROOT + 'task/';
export const ENDPOINT_USER = API_ROOT + 'user/';
export const ENDPOINT_COMMENT = API_ROOT + 'comment/';
export const ENDPOINT_MESSAGE = API_ROOT + 'message/';
export const ENDPOINT_REPLY = API_ROOT + 'reply/';
export const ENDPOINT_CONNECTION = API_ROOT + 'connection/';
export const ENDPOINT_APPLICATION = API_ROOT + 'application/';
export const ENDPOINT_SAVED_TASK = API_ROOT + 'saved-task/';
export const ENDPOINT_SKILL = API_ROOT + 'skill/';
export const ENDPOINT_COUNTRIES = API_ROOT + 'countries/';
export const ENDPOINT_CONTACT_REQUEST = API_ROOT + 'contact-request/';

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
