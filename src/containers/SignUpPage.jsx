import React from 'react'
import Progress from '../components/status/Progress'
import Error from '../components/status/Error'
import Success from '../components/status/Success'
import FieldError from '../components/status/FieldError'
import SocialSignIn from '../components/SocialSignIn'
import connect from '../utils/AuthConnector';

import { USER_TYPE_CHOICES } from '../constants/Api'

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
        var type = this.refs.user_type.value.trim();
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
            <div className="auth-form-wrapper">
                <form onSubmit={this.handleSubmit} name="signup" role="signup" className="well" ref="signup_form">
                    <SocialSignIn title={'Sign up with:'}/>
                    <h4>Sign Up with e-mail</h4>
                    {Auth.isRegistering?
                        (<Progress/>)
                        : ''
                        }
                    {Auth.isRegistered?
                        (<Success message="Your account has been created successfully.
                        Please check your e-mail for further instructions."/>)
                        : ''
                        }
                    {Auth.error.register?
                        (<Error
                            message={Auth.error.register.non_field_errors || 'Please correct the errors below'}/>)
                        : ''
                        }

                    {(Auth.error.register && Auth.error.register.username)?
                        (<FieldError message={Auth.error.register.username}/>):''}
                    <div className="form-group">
                        <div><input type="text" className="form-control" ref="username" required placeholder="Username"/></div>
                    </div>

                    {(Auth.error.register && Auth.error.register.email)?
                        (<FieldError message={Auth.error.register.email}/>):''}
                    <div className="form-group">
                        <div><input type="email" className="form-control" ref="email" required placeholder="Email"/></div>
                    </div>

                    {(Auth.error.register && Auth.error.register.password1)?
                        (<FieldError message={Auth.error.register.password1}/>):''}
                    <div className="form-group">
                        <div><input type="password" className="form-control" ref="password1" required placeholder="Password"/></div>
                    </div>

                    {(Auth.error.register && Auth.error.register.password2)?
                        (<FieldError message={Auth.error.register.password2}/>):''}
                    <div className="form-group">
                        <div><input type="password" className="form-control" ref="password2" required placeholder="Confirm Password"/></div>
                    </div>

                    {(Auth.error.register && Auth.error.register.first_name)?
                        (<FieldError message={Auth.error.register.first_name}/>):''}
                    <div className="form-group">
                        <div><input type="text" className="form-control" ref="first_name" required placeholder="First Name"/></div>
                    </div>

                    {(Auth.error.register && Auth.error.register.last_name)?
                        (<FieldError message={Auth.error.register.last_name}/>):''}
                    <div className="form-group">
                        <div><input type="text" className="form-control" ref="last_name" required placeholder="Last Name"/></div>
                    </div>

                    {(Auth.error.register && Auth.error.register.user_type)?
                        (<FieldError message={Auth.error.register.user_type}/>):''}
                    <div className="form-group">
                        <select className="form-control" ref="user_type" required>
                            <option value=""> I am a ... </option>
                            {USER_TYPE_CHOICES.map(user_type => {
                                return <option key={user_type.id} value={user_type.id}>{user_type.name}</option>
                                })}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-default pull-right" disabled={Auth.isRegistering}>Sign Up</button>
                    <div className="clearfix"></div>
                </form>
            </div>

        );
    }
}

export default connect(SignUp);
