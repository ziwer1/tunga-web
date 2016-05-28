import React from 'react'
import TagList from './TagList'
import Avatar from './Avatar'

export default class User extends React.Component {

    componentDidMount() {
        this.props.UserActions.retrieveUser(this.props.params.id);
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
                    <div className="media">
                        <div className="media-left">
                            <Avatar src={user.avatar_url} size="large"/>
                        </div>
                        <div className="media-body">
                            <h4 className="title">{user.display_name}</h4>
                            {user.is_project_owner?(
                            <p>{user.company}</p>
                                ):null}
                            {user.profile?(
                            <div>{user.profile.city}, {user.profile.country_name}</div>
                                ):null}
                            {!user.is_developer && user.tasks_created?(
                            <div>{user.tasks_created} tasks created</div>
                                ):null}
                            {user.is_developer?(
                            <div>{user.tasks_completed} tasks completed</div>
                                ):null}
                        </div>
                    </div>
                    <p/>
                    <div>
                        {user.profile?(
                        <div>
                            {user.profile.company || user.profile.country_name || user.profile.city?(
                            <div className="media">
                                <div className="media-left"><i className="fa fa-map-marker fa-2x"/></div>
                                <div className="media-body">
                                    <div className="profile-field">
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
                                <div className="media-left"><i className="fa fa-user fa-2x"/></div>
                                <div className="media-body">
                                    <div className="profile-field">
                                        <div dangerouslySetInnerHTML={{__html: user.profile.bio}}/>
                                    </div>
                                </div>
                            </div>
                                ):null}
                            {user.profile.website?(
                            <div className="media">
                                <div className="media-left"><i className="fa fa-globe fa-2x"/></div>
                                <div className="media-body">
                                    <div className="profile-field">
                                        <a target="_blank" href={user.profile.website}>{user.profile.website}</a>
                                    </div>
                                </div>
                            </div>
                                ):null}
                            {user.profile.skills && user.profile.skills.length?(
                            <div className="media">
                                <div className="media-left"><i className="fa fa-tags fa-2x"/></div>
                                <div className="media-body">
                                    <TagList tags={user.profile.skills}/>
                                </div>
                            </div>
                                ):null}
                            {user.work.length?(
                            <div className="media">
                                <div className="media-left"><i className="fa fa-briefcase fa-2x"/></div>
                                <div className="media-body">
                                    {user.work.map(item => {
                                        return (
                                        <div key={item.id} className="well card" style={{margin: '5px 0', maxWidth: '500px'}}>
                                            <div><strong>Position: {item.position}</strong></div>
                                            <div><strong>Company: {item.company}</strong></div>
                                            <div>
                                                Period: {item.start_month_display}/{item.start_year} - {item.end_year?`${item.start_month_display}/${item.start_year}`:'Present'}
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
                                <div className="media-left"><i className="fa fa-graduation-cap fa-2x"/></div>
                                <div className="media-body">
                                    {user.education.map(item => {
                                        return (
                                        <div key={item.id} className="well card" style={{margin: '5px 0', maxWidth: '500px'}}>
                                            <div><strong>Institution: {item.institution}</strong></div>
                                            <div><strong>Award: {item.award}</strong></div>
                                            <div>
                                                Period: {item.start_month_display}/{item.start_year} - {item.end_year?`${item.start_month_display}/${item.start_year}`:'Present'}
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
