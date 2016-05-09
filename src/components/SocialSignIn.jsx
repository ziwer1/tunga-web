import React from 'react'
import { SOCIAL_LOGIN_URLS } from '../constants/Api'

export default class SocialSignIn extends React.Component {

    render() {
        return (
            <div className="social-login-widget">
                <h4>{this.props.title || 'Sign in with:'}</h4>

                <div className="social-login-provider-list">
                    <a rel="nofollow" href={ SOCIAL_LOGIN_URLS.facebook } className="facebook-button" title="Sign In with Facebook">
                        <i className="fa fa-facebook-square fa-3x"></i>
                    </a>
                    <a rel="nofollow" href={ SOCIAL_LOGIN_URLS.google  } className="google-plus-button" title="Sign In with Google">
                        <i className="fa fa-google-plus-square fa-3x"></i>
                    </a>
                    {/*<a rel="nofollow" href={ SOCIAL_LOGIN_URLS.linkedin } className="linkedin-button" title="Sign In with LinkedIn">
                        <i className="fa fa-linkedin-square fa-3x"></i>
                    </a>*/}
                    <a rel="nofollow" href={ SOCIAL_LOGIN_URLS.github } className="github-button" title="Sign In with GitHub">
                        <i className="fa fa-github-square fa-3x"></i>
                    </a>
                </div>
            </div>
        );
    }
}
