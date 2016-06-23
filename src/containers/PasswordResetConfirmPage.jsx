import React from 'react'
import Progress from '../components/status/Progress'
import FormStatus from '../components/status/FormStatus'
import Error from '../components/status/Error'
import FieldError from '../components/status/FieldError'
import SocialSignIn from '../components/SocialSignIn'
import connect from '../utils/connectors/AuthConnector'

class PasswordResetConfirm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.Auth.isReset && !prevProps.Auth.isReset) {
            this.refs.reset_confirm_form.reset();
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        var uid = this.props.params.uid;
        var token = this.props.params.token;
        var new_password1 = this.refs.new_password1.value.trim();
        var new_password2 = this.refs.new_password2.value.trim();
        if (!new_password1 || !new_password2) {
            return;
        }

        this.props.AuthActions.resetPasswordConfirm({uid, token, new_password1, new_password2});
        return;
    }

    render() {
        const { Auth } = this.props;

        return (
            <div className="auth-form-wrapper">
                <form onSubmit={this.handleSubmit} name="reset-confirm-confirm" role="form" className="well" ref="reset_confirm_form">
                    <h2>Reset Password</h2>

                    {(Auth.error.reset_confirm && Auth.error.reset_confirm.token)?(
                    <Error message="Invalid token"/>
                        ):(
                    <FormStatus loading={Auth.isResetting}
                                success={Auth.isReset}
                                message={'Password changed'}
                                error={Auth.error.reset_confirm}/>
                        )}

                    {(Auth.error.reset_confirm && Auth.error.reset_confirm.new_password1)?
                        (<FieldError message={Auth.error.reset_confirm.new_password1}/>):''}
                    <div className="form-group">
                        <label className="control-label">New Password</label>
                        <div><input type="password" className="form-control" ref="new_password1" required placeholder="New Password"/></div>
                    </div>

                    {(Auth.error.reset_confirm && Auth.error.reset_confirm.new_password2)?
                        (<FieldError message={Auth.error.reset_confirm.new_password2}/>):''}
                    <div className="form-group">
                        <label className="control-label">Confirm New Password</label>
                        <div><input type="password" className="form-control" ref="new_password2" required placeholder="Confirm New Password"/></div>
                    </div>

                    <button type="submit" className="btn btn-default pull-right" disabled={Auth.isResetting}>Change Password</button>

                    <div className="clearfix"></div>
                </form>
            </div>

        );
    }
}

export default connect(PasswordResetConfirm);
