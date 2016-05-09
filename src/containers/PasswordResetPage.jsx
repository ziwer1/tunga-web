import React from 'react'
import Progress from '../components/status/Progress'
import Error from '../components/status/Error'
import Success from '../components/status/Success'
import SocialSignIn from '../components/SocialSignIn'
import connect from '../utils/AuthConnector'

class PasswordReset extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.Auth.isReset && !prevProps.Auth.isReset) {
            this.refs.reset_form.reset();
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        var email = this.refs.email.value.trim();
        if (!email) {
            return;
        }

        this.props.AuthActions.resetPassword({email});
        return;
    }

    render() {
        const { Auth } = this.props;

        return (
            <div className="auth-form-wrapper">
                <form onSubmit={this.handleSubmit} name="reset-form" role="form" className="well" ref="reset_form">
                    <h2>Reset Password</h2>
                    {Auth.isResetting?
                        (<Progress/>)
                        :null}
                    {Auth.isReset?
                        (<Success message="Instructions for resetting your password have been sent to your email."/>)
                        :null}
                    {Auth.error.reset?
                        (<Error message={Auth.error.reset.non_field_errors || "Sorry, we couldn't reset your password. Please try again."}/>)
                        :null}

                    <div className="form-group">
                        <label className="control-label">Email:</label>
                        <div><input type="text" className="form-control" ref="email" required placeholder="Email"/></div>
                    </div>
                    <button type="submit" className="btn btn-default pull-right" disabled={Auth.isResetting}>Reset Password</button>

                    <div className="clearfix"></div>
                </form>
            </div>

        );
    }
}

export default connect(PasswordReset);
