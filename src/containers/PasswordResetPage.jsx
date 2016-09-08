import React from 'react';
import Progress from '../components/status/Progress';
import Error from '../components/status/Error';
import Success from '../components/status/Success';
import connect from '../utils/connectors/AuthConnector';

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
          <section className="signup-lp">
            <div className="container">
              <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12">
                  <div className="login-form-container">

                    <div className="form-elements-container">
                      <form onSubmit={this.handleSubmit} name="reset-form" role="form" ref="reset_form">

                        <p className="account-reset-txt">Reset Password</p>

                        {Auth.isResetting? (<Progress/>) :null}

                        {Auth.isReset?
                            (<Success message="Instructions for resetting your password have been sent to your email."/>) :null}

                        {Auth.error.reset?
                            (<Error message={Auth.error.reset.non_field_errors || "Sorry, we couldn't reset your password. Please try again."}/>) :null}

                        <div className="form-group">
                          <label htmlFor="email">Email:</label>
                          <input type="email" className="form-control" ref="email" required placeholder="Email" />
                        </div>

                        <div className="row">
                          <div className="col-md-6 col-sm-6 col-xs-6 pull-right">
                            <button type="submit" className="btn pull-right" disabled={Auth.isResetting}>Reset Password</button>
                          </div>
                        </div>

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

export default connect(PasswordReset);
