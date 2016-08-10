import React from 'react';
import { Link } from 'react-router';
import Avatar from './Avatar';

export default class UserCardProfile extends React.Component {

    render() {
        const { user } = this.props;

        return (
            <div className="media">
                <div className="media-left">
                    <Avatar src={user.avatar_url} size="large"/>
                </div>
                <div className="media-body">
                    <Link to={`/people/${user.username}/`}>{user.display_name}</Link>
                    {user.is_project_owner?(
                    <p>{user.company}</p>
                        ):null}
                    {user.profile?(
                    <div>{user.profile.city}, {user.profile.country_name}</div>
                        ):null}
                    {!user.is_developer && user.tasks_created?(
                    <div>{user.tasks_created} task{user.tasks_created==1?'':'s'} created</div>
                        ):null}
                    {user.is_developer && user.tasks_completed?(
                    <div>{user.tasks_completed} task{user.tasks_completed==1?'':'s'} completed</div>
                        ):null}
                    {user.is_developer && user.satisfaction?(
                    <div>{user.satisfaction} satisfaction score</div>
                        ):null}
                </div>
            </div>
        );
    }
}
