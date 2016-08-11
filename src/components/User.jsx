import React from 'react';
import TagList from './TagList';
import Rating from 'react-rating';
import Avatar from './Avatar';
import UserCardProfile from './UserCardProfile';
import { RATING_CRITERIA_CHOICES } from '../constants/Api';

export default class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = {ratings_map: null};
    }

    componentWillMount() {
        this.mapUserRatings(this.props);
    }

    componentDidMount() {
        this.props.UserActions.retrieveUser(this.props.params.userId);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.User.detail.user.ratings != this.props.User.detail.user.ratings) {
            this.mapUserRatings(nextProps);
        }
    }

    mapUserRatings(props) {
        const { Auth, User } = props;
        const { user } = User.detail;
        if(user && user.ratings && user.ratings.details && user.ratings.details.length) {
            var ratings_map = {};
            user.ratings.details.forEach(rating => {
                ratings_map[rating.criteria] = rating;
            });
            this.setState({ratings_map});
        }
    }

    render() {
        const { User } = this.props;
        const { user } = User.detail;

        return (
            <div className="profile-page">
                {User.list.isRetrieving?
                    (<Progress/>)
                    :(
                <div>
                    <UserCardProfile user={user} avatarSize="xl" profileLink={false}/>
                    <p/>
                    <div>
                        {user.profile?(
                        <div>
                            {user.profile.company || user.profile.country_name || user.profile.city?(
                            <div className="media">
                                <div className="media-left"><i className="tunga-icon-location fa-2x"/></div>
                                <div className="media-body">
                                    <div className="card">
                                        <div>{user.profile.company}</div>
                                        <div>{user.profile.plot_number} {user.profile.street}</div>
                                        <div>{user.profile.city}</div>
                                        <div>{user.profile.country_name}</div>
                                    </div>
                                </div>
                            </div>
                                ):null}
                            <p/>
                            {user.profile.bio?(
                            <div className="media">
                                <div className="media-left"><i className="tunga-icon-profile fa-2x"/></div>
                                <div className="media-body">
                                    <div className="card">
                                        <div dangerouslySetInnerHTML={{__html: user.profile.bio}}/>
                                    </div>
                                </div>
                            </div>
                                ):null}
                            {user.profile.website?(
                            <div className="media">
                                <div className="media-left"><i className="fa fa-globe fa-2x"/></div>
                                <div className="media-body">
                                    <div className="card">
                                        <a target="_blank" href={user.profile.website}>{user.profile.website}</a>
                                    </div>
                                </div>
                            </div>
                                ):null}
                            {user.profile.skills && user.profile.skills.length?(
                            <div className="media">
                                <div className="media-left"><i className="tunga-icon-tag fa-2x"/></div>
                                <div className="media-body">
                                    <TagList tags={user.profile.skills} linkPrefix="/people/skill/"/>
                                </div>
                            </div>
                                ):null}
                            {user.ratings && user.ratings.details && user.ratings.details.length?(
                                <div className="media">
                                    <div className="media-left"><i className="fa fa-star-o fa-2x"/></div>
                                    <div className="media-body">
                                        <div className="card">
                                            {RATING_CRITERIA_CHOICES.map(criteria => {
                                                let rating = this.state.ratings_map[criteria.id];
                                                return (
                                                    <div key={criteria.id} style={{margin: '5px 0'}}>
                                                        <div>{criteria.name}</div>
                                                        {this.state.ratings_map && this.state.ratings_map[criteria.id]?(
                                                            <div>
                                                                <div className="rating">
                                                                    <Rating start={0} stop={10} step={2} fractions={2}
                                                                            initialRate={rating.avg}
                                                                            empty={'fa fa-star-o'} full={'fa fa-star'}
                                                                            readonly={true}/>
                                                                </div> ({rating.display_avg} rating)
                                                            </div>
                                                        ):(
                                                            <div className="secondary">No ratings yet!</div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ):null}
                            {user.work.length?(
                            <div className="media">
                                <div className="media-left"><i className="tunga-icon-cv fa-2x"/></div>
                                <div className="media-body">
                                    {user.work.map(item => {
                                        return (
                                        <div key={item.id} className="card">
                                            <div>{item.position}</div>
                                            <div>{item.company}</div>
                                            <div>
                                                {item.start_month_display}/{item.start_year} - {item.end_year?`${item.start_month_display}/${item.start_year}`:'Present'}
                                            </div>
                                            <div dangerouslySetInnerHTML={{__html: item.details}} style={{margin: '5px 0'}}/>
                                        </div>
                                            )
                                        })}
                                </div>
                            </div>
                                ):null}
                            {user.education.length?(
                            <div className="media">
                                <div className="media-left"><i className="tunga-icon-education fa-2x"/></div>
                                <div className="media-body">
                                    {user.education.map(item => {
                                        return (
                                        <div key={item.id} className="card">
                                            <div>{item.institution}</div>
                                            <div>{item.award}</div>
                                            <div>
                                                {item.start_month_display}/{item.start_year} - {item.end_year?`${item.start_month_display}/${item.start_year}`:'Present'}
                                            </div>
                                            <div dangerouslySetInnerHTML={{__html: item.details}} style={{margin: '5px 0'}}/>
                                        </div>
                                            )
                                        })}
                                </div>
                            </div>
                                ):null}
                        </div>
                            ):null}
                    </div>
                </div>
                    )}
            </div>
        );
    }
}
