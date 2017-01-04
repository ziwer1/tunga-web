import React from 'react';
import {SOCIAL_LOGIN_URLS} from '../constants/Api';
import {objectToQueryString} from '../utils/html';

import {USER_TYPE_PROJECT_OWNER} from '../constants/Api';
import {
    sendGAEvent,
    sendTwitterSignUpEvent,
    GA_EVENT_CATEGORIES,
    AUTH_METHODS,
    USER_TYPES,
    getUserTypeTwitter,
    getUserType
} from '../utils/tracking';

export default class SocialSignIn extends React.Component {

    getParams() {
        let query_params = objectToQueryString({user_type: this.props.user_type, action: this.props.action});
        if (query_params) {
            return '?' + query_params;
        }
        return '';
    }

    trackSignUp(method, e) {
        // TODO: Track Social Sign In/ Sign Up with GA
        sendTwitterSignUpEvent({user_type: getUserTypeTwitter(this.props.user_type), method});
    }

    render() {
        return (
            <div className={"social-auth-options " + this.props.className}>
                <ul>
                    <li>
                        <a rel="nofollow"
                           href={ SOCIAL_LOGIN_URLS.facebook + this.getParams() }
                           className="facebook-button" title="Sign In with Facebook"
                           onClick={this.trackSignUp.bind(this, AUTH_METHODS.FACEBOOK)}>
                            <i className="fa fa-facebook-square" aria-hidden="true"></i>
                        </a>
                    </li>

                    <li>
                        <a rel="nofollow"
                           href={ SOCIAL_LOGIN_URLS.google + this.getParams() }
                           className="google-plus-button" title="Sign In with Google"
                           onClick={this.trackSignUp.bind(this, AUTH_METHODS.GOOGLE)}>
                            <i className="fa fa-google-plus-square" aria-hidden="true"></i>
                        </a>
                    </li>

                    <li>
                        <a rel="nofollow"
                           href={ SOCIAL_LOGIN_URLS.github + this.getParams() }
                           className="github-button" title="Sign In with GitHub"
                           onClick={this.trackSignUp.bind(this, AUTH_METHODS.GITHUB)}>
                            <i className="fa fa-github-square" aria-hidden="true"></i>
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}

SocialSignIn.propTypes = {
    user_type: React.PropTypes.number,
    action: React.PropTypes.string
};
