import React from 'react'
import { SOCIAL_LOGIN_URLS } from '../constants/Api'
import { objectToQueryString } from '../utils/html'

export default class SocialSignIn extends React.Component {

    getParams() {
        let query_params = objectToQueryString({user_type: this.props.user_type, action: this.props.action});
        if(query_params) {
            return '?' + query_params;
        }
        return '';
    }

    render() {
        return (
            <div className={this.props.className}>
              <ul>
                <li>
                  <a rel="nofollow" href={ SOCIAL_LOGIN_URLS.facebook + this.getParams() } className="facebook-button" title="Sign In with Facebook">
                    <i className="fa fa-facebook-square" aria-hidden="true"></i>
                  </a>
                </li>

                <li>
                  <a rel="nofollow" href={ SOCIAL_LOGIN_URLS.google + this.getParams() } className="google-plus-button" title="Sign In with Google">
                    <i className="fa fa-google-plus-square" aria-hidden="true"></i>
                  </a>
                </li>

                <li>
                  <a rel="nofollow" href={ SOCIAL_LOGIN_URLS.github + this.getParams() } className="github-button" title="Sign In with GitHub">
                    <i className="fa fa-github-square" aria-hidden="true"></i>
                  </a>
                </li>
              </ul>
            </div>
        );
    }
}
