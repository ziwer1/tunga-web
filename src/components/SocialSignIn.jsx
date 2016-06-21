import React from 'react'
import { SOCIAL_LOGIN_URLS } from '../constants/Api'

export default class SocialSignIn extends React.Component {

    render() {
        return (
            <div className={this.props.SOCIAL_MEDIA_LINKS_CLASSES}>
              <ul>
                <li>
                  <a rel="nofollow" href={ SOCIAL_LOGIN_URLS.facebook } className="facebook-button" title="Sign In with Facebook">
                    <i className="fa fa-facebook-square" aria-hidden="true"></i>
                  </a>
                </li>

                <li>
                  <a rel="nofollow" href={ SOCIAL_LOGIN_URLS.google  } className="google-plus-button" title="Sign In with Google">
                    <i className="fa fa-google-plus-square" aria-hidden="true"></i>
                  </a>
                </li>

                <li>
                  <a rel="nofollow" href={ SOCIAL_LOGIN_URLS.github } className="github-button" title="Sign In with GitHub">
                    <i className="fa fa-github-square" aria-hidden="true"></i>
                  </a>
                </li>
              </ul>
            </div>
        );
    }
}
