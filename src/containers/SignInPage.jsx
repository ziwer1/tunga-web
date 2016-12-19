import React from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

import Progress from '../components/status/Progress';
import Error from '../components/status/Error';
import SocialSignIn from '../components/SocialSignIn';
import connect from '../utils/connectors/AuthConnector';

import ShowcaseContainer from './ShowcaseContainer';

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        var username = this.refs.username.value.trim();
        var password = this.refs.password.value.trim();
        if (!password || !username) {
            return;
        }

        this.props.AuthActions.authenticate({
            username, password
        });
        return;
    }

    renderHeaderContent() {
        const { Auth } = this.props;

        return (
            <div>
                <Helmet title="Tunga | Sign In" />
                <form onSubmit={this.handleSubmit} name="signin" role="signin">
                    <p className="text-center">Sign in with</p>

                    <SocialSignIn />

                    <p className="text-center">or</p>

                    {Auth.isAuthenticating? (<Progress/>) :''}
                    {Auth.error.auth?
                        (<Error message={Auth.error.auth.non_field_errors || "Sorry, we couldn't log you in. Please try again."}/>) :''}

                    <div className="form-group">
                        <label className="control-label" htmlFor="username">Username</label>
                        <input type="text" className="form-control" name="username" ref="username" required placeholder="Username" />
                    </div>

                    <div className="form-group">
                        <label className="control-label" htmlFor="pwd">Password</label>
                        <input type="password" className="form-control" name="pwd" ref="password" required placeholder="Password" />
                    </div>

                    <Link to="/reset-password" className="forgot_passwd">Forgot Password?</Link>

                    <button type="submit" className="btn pull-right" disabled={Auth.isAuthenticating}>Sign In</button>

                </form>
            </div>
        );
    }

    render() {

        return (
            <ShowcaseContainer className="auth-page" headerContent={this.renderHeaderContent()}/>
        );
    }
}

export default connect(SignIn);
