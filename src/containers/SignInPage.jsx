import React from 'react'
import { Link } from 'react-router'
import Progress from '../components/status/Progress'
import Error from '../components/status/Error'
import SocialSignIn from '../components/SocialSignIn'
import connect from '../utils/connectors/AuthConnector'

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
            <section className="signup-lp">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12">
                            <div className="login-form-container">

                                <div className="form-elements-container">
                                    <form onSubmit={this.handleSubmit} name="signin" role="signin">

                                        <p className="account-login-txt">Sign in with</p>

                                        <SocialSignIn className={'social-media-section social-media-section-login'} />

                                        <div className="row">
                                            <div className="col-md-5 col-sm-5 col-xs-5">
                                                <hr />
                                            </div>

                                            <div className="col-md-2 col-sm-2 col-xs-2">
                                                <p className="login_alternative">or</p>
                                            </div>

                                            <div className="col-md-5 col-sm-5 col-xs-5">
                                                <hr />
                                            </div>
                                        </div>

                                        {Auth.isAuthenticating? (<Progress/>) :''}
                                        {Auth.error.auth?
                                        (<Error message={Auth.error.auth.non_field_errors || "Sorry, we couldn't log you in. Please try again."}/>) :''}

                                        <div className="form-group">
                                            <label for="username">Username</label>
                                            <input type="text" className="form-control" name="username" ref="username" required placeholder="Username" />
                                        </div>

                                        <div className="form-group">
                                            <label for="pwd">Password</label>
                                            <input type="password" className="form-control" name="pwd" ref="password" required placeholder="Password" />
                                        </div>

                                        <Link to="/reset-password" className="forgot_passwd">Forgot Password?</Link>

                                        <button type="submit" className="btn pull-right" disabled={Auth.isAuthenticating}>Sign In</button>

                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default connect(SignIn);
