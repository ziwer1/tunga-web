import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';

export default class UserCard extends React.Component {
    static propTypes = {
        user: PropTypes.object
    };

    render() {
        const {user} = this.props;

        return (
            user?(
                <div className="user-card">
                    <Link to={`/network/${user.username}`}>{user.display_name}</Link>
                </div>
            ):null
        );
    }
}
