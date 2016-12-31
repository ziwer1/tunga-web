import React from 'react';
import Helmet from 'react-helmet';

import Progress from '../components/status/Progress';
import Error from '../components/status/Error';
import Success from '../components/status/Success';
import FieldError from '../components/status/FieldError';

import connect from '../utils/connectors/AuthConnector';

class InviteDeveloper extends React.Component {

    componentDidUpdate(prevProps, prevState) {
        if (this.props.Auth.hasInvited && !prevProps.Auth.hasInvited) {
            this.refs.invite_form.reset();
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        var first_name = this.refs.first_name.value.trim();
        var last_name = this.refs.last_name.value.trim();
        var email = this.refs.email.value.trim();

        this.props.AuthActions.invite({first_name, last_name, email});
        return;
    }

    render() {

        const { Auth, Profile } = this.props;

        return (
            <div>
                <Helmet title="Tunga | Invite Developer" />

                <div className="form-wrapper">
                    <form onSubmit={this.handleSubmit.bind(this)} name="invite" role="form" ref="invite_form">
                        <h2 className="title">Invite a developer</h2>

                        {Auth.isInviting?(<Progress/>):null}

                        {Auth.hasInvited?(
                            <Success message="An invitation email has been sent to the developer."/>
                        ):null}

                        {Auth.error.invite?(
                            <Error message={Auth.error.invite.non_field_errors || 'Please correct the errors below'}/>
                        ):null}


                        {(Auth.error.invite && Auth.error.invite.email)?
                            (<FieldError message={Auth.error.invite.email}/>):null}
                        <div className="form-group">
                            <label className="control-label">Email *</label>
                            <input type="email" className="form-control" id="email" ref="email" required
                                   placeholder="E-mail"/>
                        </div>

                        {(Auth.error.invite && Auth.error.invite.first_name)?(
                            <FieldError message={Auth.error.invite.first_name}/>
                        ):null}
                        <div className="form-group">
                            <label className="control-label">First name *</label>
                            <input type="text" className="form-control" id="fname" ref="first_name"
                                   required placeholder="First name"/>
                        </div>

                        {(Auth.error.invite && Auth.error.invite.last_name)?
                            (<FieldError message={Auth.error.invite.last_name}/>):null}
                        <div className="form-group">
                            <label className="control-label">Last name *</label>
                            <input type="text" className="form-control" id="lname" ref="last_name"
                                   required placeholder="Last name"/>
                        </div>

                        <div className="form-group text-center">
                            <button type="submit" className="btn"
                                    disabled={Auth.isInviting}>Invite
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        );
    }
}

export default connect(InviteDeveloper);

