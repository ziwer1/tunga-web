import React from 'react'
import Progress from '../components/status/Progress'
import Error from '../components/status/Error'
import Success from '../components/status/Success'
import FieldError from '../components/status/FieldError'
import SocialSignIn from '../components/SocialSignIn'
import connect from '../utils/AuthConnector';

import { SOCIAL_LOGIN_URLS } from '../constants/Api'

class SignUp extends React.Component {

    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
      if(this.props.Auth.isRegistered && !prevProps.Auth.isRegistered) {
        this.refs.signup_form.reset();
      }
    }

    handleSubmit(e) {
      e.preventDefault();
      var username = this.refs.username.value.trim();
      var email = this.refs.email.value.trim();
      var password1 = this.refs.password1.value.trim();
      var password2 = this.refs.password2.value.trim();
      var first_name = this.refs.first_name.value.trim();
      var last_name = this.refs.last_name.value.trim();
      // var type = this.refs.user_type.value.trim();
      var type = this.props.userType;
      if ((!username || !first_name || !last_name || !email) || (!password1 || !password2)) {
          return;
      }

      this.props.AuthActions.register({
        username, email, password1, password2,
        first_name, last_name, type
      });
      return;
    }

    render() {
        const { Auth } = this.props;
        return (
          <section className="signup-lp">
            <div className="container">
              <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12">
                  <div className="acct-type-container">

                    <h2 className="crt-acc-heading">Create your Tunga account</h2>
                    <p className="crt-acc-signup-txt">Sign up with</p>

                    <div className="social-media-section">
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

                    <p className="acct-type-or-txt">or</p>
                    
                    <div className="form-elements-container">
                      <form onSubmit={this.handleSubmit} name="signup" role="form" ref="signup_form">

                        {Auth.isRegistering? (<Progress/>) : '' }

                        {Auth.isRegistered?
                          (<Success message="Your account has been created successfully.
                            Please check your e-mail for further instructions."/>) : '' }

                        {Auth.error.register?
                          (<Error
                            message={Auth.error.register.non_field_errors || 'Please correct the errors below'}/>) : '' }

                        {(Auth.error.register && Auth.error.register.username)?
                          (<FieldError message={Auth.error.register.username}/>) : ''}
                        <div className="form-group">
                          <input type="text" className="form-control" id="username" ref="username" required placeholder="Username" />
                        </div>

                        {(Auth.error.register && Auth.error.register.first_name)?
                          (<FieldError message={Auth.error.register.first_name}/>):''}
                        <div className="form-group">
                          <input type="text" className="form-control" id="fname" ref="first_name" required placeholder="First name" />
                        </div>

                        {(Auth.error.register && Auth.error.register.last_name)?
                          (<FieldError message={Auth.error.register.last_name}/>):''}
                        <div className="form-group">
                          <input type="text" className="form-control" id="lname" ref="last_name" required placeholder="Last name" />
                        </div>

                        {(Auth.error.register && Auth.error.register.email)?
                          (<FieldError message={Auth.error.register.email}/>):''}
                        <div className="form-group">
                          <input type="email" className="form-control" id="email" ref="email" required placeholder="Email" />
                        </div>

                        {(Auth.error.register && Auth.error.register.password1)?
                          (<FieldError message={Auth.error.register.password1}/>):''}
                        <div className="form-group">
                          <input type="password" className="form-control" id="pwd" ref="password1" required placeholder="Password" />
                        </div>

                        {(Auth.error.register && Auth.error.register.password2)?
                          (<FieldError message={Auth.error.register.password2}/>):''}
                        <div className="form-group">
                          <input type="password" className="form-control" id="pwd-confirm" ref="password2" required placeholder="Confirm Password" />
                        </div>

                        <div className="form-group">
                          <button type="submit" className="btn btn-default signup-btn" disabled={Auth.isRegistering}>Sign up</button>
                        </div>
                      </form>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div className="footer navbar-fixed-bottom"></div>
          </section>
        );
    }
}

export default connect(SignUp);
