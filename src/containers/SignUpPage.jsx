import React from 'react';
import Helmet from 'react-helmet';

import connect from '../utils/connectors/AuthConnector';

import Progress from '../components/status/Progress';
import Error from '../components/status/Error';
import Success from '../components/status/Success';
import FieldError from '../components/status/FieldError';
import SocialSignIn from '../components/SocialSignIn';
import ShowcaseContainer from './ShowcaseContainer';

import { USER_TYPE_DEVELOPER, USER_TYPE_PROJECT_OWNER } from '../constants/Api';

class SignUp extends React.Component {

    componentDidMount() {
        let confirmationKey = this.props.params.confirmationKey;
        if(confirmationKey) {
            this.props.AuthActions.retrieveApplication(confirmationKey);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.Auth.isRegistered && !prevProps.Auth.isRegistered) {
            this.refs.signup_form.reset();
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const { Auth } = this.props;
        const { application } = Auth;

        var key = this.props.params.confirmationKey;
        var username = this.refs.username.value.trim();
        var first_name = null;
        var last_name = null;
        var email = null;

        if(key) {
            first_name = application.first_name;
            last_name = application.last_name;
            email = application.email;
        } else {
            first_name = this.refs.first_name.value.trim();
            last_name = this.refs.last_name.value.trim();
            email = this.refs.email.value.trim();
        }
        var password1 = this.refs.password1.value.trim();
        var password2 = this.refs.password2.value.trim();
        var user_type = key?USER_TYPE_DEVELOPER:USER_TYPE_PROJECT_OWNER;

        this.props.AuthActions.register({
            username, email, password1, password2,
            first_name, last_name, type: user_type, key
        });
        return;
    }

    renderHeaderContent() {
        const { Auth } = this.props;
        const { application } = Auth;
        let confirmationKey = this.props.params.confirmationKey;
        let is_developer = confirmationKey?true:false;

        return (
            <div>
                <Helmet title="Tunga | Sign Up" />
                <h2 className="crt-acc-heading">Create your Tunga account as a {is_developer?'developer':'project owner'}</h2>

                {is_developer?null:(
                    <div>
                        <p className="crt-acc-signup-txt">Sign up with</p>

                        <SocialSignIn user_type={USER_TYPE_PROJECT_OWNER} action="register"/>

                        <p className="acct-type-or-txt">or</p>
                    </div>
                )}

                <div className="form-elements-container">
                    {Auth.isRetrievingApplication && is_developer?(
                        <Progress/>
                    ):(
                        <form onSubmit={this.handleSubmit.bind(this)} name="signup" role="form" ref="signup_form">

                            {Auth.isRegistering?(<Progress/>):null}

                            {Auth.isRegistered?
                                (<Success message="Your account has been created successfully. Please check your e-mail for further instructions."/>):null}

                            {Auth.error.register?
                                (<Error
                                    message={Auth.error.register.non_field_errors || 'Please correct the errors below'}/>):null}

                            {is_developer?(
                                <div style={{color: '#fff'}}>
                                    <p>Name: {application.display_name}</p>

                                    <p>Email: {application.email}</p>
                                </div>
                            ):null}

                            {(Auth.error.register && Auth.error.register.username) ?
                                (<FieldError message={Auth.error.register.username}/>):null}
                            <div className="form-group">
                                <input type="text" className="form-control" id="username" ref="username"
                                       required placeholder="Username"/>
                            </div>

                            {is_developer?null:(
                                <div>
                                    {(Auth.error.register && Auth.error.register.first_name) ?
                                        (<FieldError message={Auth.error.register.first_name}/>):null}
                                    <div className="form-group">
                                        <input type="text" className="form-control" id="fname" ref="first_name"
                                               required placeholder="First name"/>
                                    </div>

                                    {(Auth.error.register && Auth.error.register.last_name) ?
                                        (<FieldError message={Auth.error.register.last_name}/>):null}
                                    <div className="form-group">
                                        <input type="text" className="form-control" id="lname" ref="last_name"
                                               required placeholder="Last name"/>
                                    </div>

                                    {(Auth.error.register && Auth.error.register.email) ?
                                        (<FieldError message={Auth.error.register.email}/>):null}
                                    <div className="form-group">
                                        <input type="email" className="form-control" id="email" ref="email"
                                               required placeholder="Email"/>
                                    </div>
                                </div>
                            )}


                            {(Auth.error.register && Auth.error.register.password1) ?
                                (<FieldError message={Auth.error.register.password1}/>):null}
                            <div className="form-group">
                                <input type="password" className="form-control" id="pwd" ref="password1"
                                       required placeholder="Password"/>
                            </div>

                            {(Auth.error.register && Auth.error.register.password2) ?
                                (<FieldError message={Auth.error.register.password2}/>):null}
                            <div className="form-group">
                                <input type="password" className="form-control" id="pwd-confirm"
                                       ref="password2" required placeholder="Confirm Password"/>
                            </div>

                            <div className="form-group text-center">
                                <button type="submit" className="btn"
                                        disabled={Auth.isRegistering}>Sign up
                                </button>
                            </div>
                            <div className="clearfix"></div>
                        </form>
                    )}
                </div>

            </div>
        );
    }

    render() {

        return (
            <ShowcaseContainer className="auth-page" headerContent={this.renderHeaderContent()}/>
        );
    }
}

export default connect(SignUp);
