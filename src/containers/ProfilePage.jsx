import React from 'react'
import { Link, IndexLink } from 'react-router'
import connect from '../utils/connectors/ProfileConnector'
import { PROFILE_COMPLETE_PATH } from '../constants/patterns'

class ProfilePage extends React.Component {

    renderChildren() {
        return React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {
                Auth: this.props.Auth,
                Profile: this.props.Profile,
                ProfileActions: this.props.ProfileActions
            });
        }.bind(this));
    }

    render() {
        const { Auth } = this.props;
        return (
            <div>
                {PROFILE_COMPLETE_PATH.test(this.props.location.pathname)?'':(
				<div>
					<h2 className="title">Profile</h2>
					<ul className="nav nav-pills nav-top-filter">
						<li role="presentation"><Link to="/profile/personal" activeClassName="active">Personal</Link></li>
                        {Auth.user.is_developer?(
                            [
                                <li role="presentation"><Link to="/profile/stack" activeClassName="active">{Auth.user.is_developer?'Experience':'Stack'}</Link></li>,
                                <li role="presentation"><Link to="/profile/payment" activeClassName="active">Payment</Link></li>
                            ]
                        ):null}
                        {/*<li role="presentation"><Link to="/profile/account" activeClassName="active">Account</Link></li>*/}
						<li role="presentation"><Link to="/profile/photo" activeClassName="active">Photo</Link></li>
						<li role="presentation"><Link to="/profile/security" activeClassName="active">Security</Link></li>
					</ul>
				</div>
                    )}
                {this.renderChildren()}
            </div>
        );
    }
}

export default connect(ProfilePage);
