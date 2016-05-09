import React from 'react'
import { Link } from 'react-router'
import Progress from '../components/status/Progress'
import Error from '../components/status/Error'
import SocialSignIn from '../components/SocialSignIn'
import connect from '../utils/AuthConnector'

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

    render() {
        const {Auth} = this.props;
        return (
            <div className="auth-form-wrapper">
                <form onSubmit={this.handleSubmit} name="signin" role="signin" className="well">
                    {Auth.isAuthenticating?
                        (<Progress/>)
                        :''}
                    {Auth.error.auth?
                        (<Error message={Auth.error.auth.non_field_errors || "Sorry, we couldn't log you in. Please try again."}/>)
                        :''}

                    <div className="form-group">
                        <label className="control-label">Username</label>
                        <div><input type="text" className="form-control" ref="username" required placeholder="Username"/></div>
                    </div>
                    <div className="form-group">
                        <label className="control-label">Password</label>
                        <div><input type="password" className="form-control" ref="password" required placeholder="Password"/></div>
                    </div>
                    <Link to="/reset-password">Forgot Password?</Link>
                    <button type="submit" className="btn btn-default pull-right" disabled={Auth.isAuthenticating}>Sign In</button>

                    <div className="clearfix"></div>
                    <SocialSignIn />
                </form>
            </div>

        );
    }
}

export default connect(SignIn);
