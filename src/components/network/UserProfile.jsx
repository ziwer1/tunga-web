import PropTypes from 'prop-types';
import React from 'react';

export default class UserProfile extends React.Component {
    static propTypes = {
        user: PropTypes.object
    };

    render() {
        const {user} = this.props;

        return (
            user?(
                <div className="user-profile">
                    {user.display_name}
                </div>
            ):null
        );
    }
}
