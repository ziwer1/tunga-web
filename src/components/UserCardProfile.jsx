import React from 'react';
import { Link } from 'react-router';
import Rating from 'react-rating';
import Avatar from './Avatar';

export default class UserCardProfile extends React.Component {

    render() {
        const { user, avatarSize, profileLink } = this.props;

        return (
            <div className="media">
                <div className="media-left">
                    <Avatar src={user.avatar_url} size={avatarSize || "large"}/>
                </div>
                <div className="media-body">
                    {profileLink?(
                        <Link to={`/people/${user.username}/`}>{user.display_name}</Link>
                    ):(
                        <h4 className="title">{user.display_name}</h4>
                    )}

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
                    {user.is_developer?(
                        user.ratings && user.ratings.avg?(
                            <div>
                                <div className="rating">
                                    <Rating start={0} stop={10} step={2} fractions={2} initialRate={user.ratings.avg}
                                            empty={'fa fa-star-o'} full={'fa fa-star'} readonly={true}/>
                                </div> ({user.ratings.display_avg} rating)
                            </div>
                        ):(
                            <div className="secondary">No ratings yet!</div>
                        )
                    ):null}
                </div>
            </div>
        );
    }
}

UserCardProfile.propTypes = {
    user: React.PropTypes.object.required,
    avatarSize: React.PropTypes.string,
    profileLink: React.PropTypes.bool
};

UserCardProfile.defaultProps = {
    profileLink: true
};
