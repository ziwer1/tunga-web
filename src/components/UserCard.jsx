import React from 'react'
import { Link } from 'react-router'
import Progress from './status/Progress'
import UserCardProfile from './UserCardProfile'
import TagList from './TagList'

export default class UserCard extends React.Component {

    handleConnectRequest() {
        const { UserActions, user } = this.props;
        UserActions.createConnection({to_user: user.id});
    }

    handleConnectResponse(accepted=false) {
        const { UserActions, user } = this.props;
        UserActions.updateConnection(user.request, {accepted, responded: true});
    }

    handleDeleteConnection() {
        const { UserActions, user, hideOnDisconnect } = this.props;
        if(user.connection) {
            UserActions.deleteConnection(user.connection.id, user, hideOnDisconnect);
        }
    }

    render() {
        const { Auth, user } = this.props;
        var connection_msg = 'Send friend request';
        var remove_msg = 'Remove friend';
        if(Auth.user.is_project_owner) {
            connection_msg = 'Add to my team';
            remove_msg = 'Remove from my team';
        } else if(user.is_project_owner) {
            connection_msg = 'Send request to join team';
            remove_msg = 'Leave team';
        }

        return (
            <div className="card user-card">
                <UserCardProfile user={user}/>
                {user.profile?(
                <div>
                    {user.profile.skills.length?(
                    <TagList tags={user.profile.skills} max={3} link={`/member/${user.id}/`}/>
                        ):(
                    <div style={{height: '20px'}}></div>
                        )}
                </div>
                    ):(
                <div style={{height: '20px'}}></div>
                    )}
                <div className="short-description">
                    {user.profile?(
                        <div dangerouslySetInnerHTML={{__html: user.profile.bio}}/>
                    ):null}
                </div>
                <div className="actions">
                    <div className="row">
                        <div className="col-sm-12">
                            <Link to={`/member/${user.id}/`} className="btn btn-block ">Go to profile</Link>
                        </div>
                    </div>

                    {user.can_connect?(
                    <div className="row">
                        <div className="col-sm-12">
                            <button type="button" className="btn btn-block "
                                    onClick={this.handleConnectRequest.bind(this)}>{connection_msg}</button>
                        </div>
                    </div>
                        ):(
                        user.request?(
                        <div className="row">
                            <div className="col-sm-6">
                                <button type="button" className="btn btn-block "
                                        onClick={this.handleConnectResponse.bind(this, true)}>Accept Request</button>
                            </div>
                            <div className="col-sm-6">
                                <button type="button" className="btn btn-block "
                                        onClick={this.handleConnectResponse.bind(this, false)}>Decline Request</button>
                            </div>
                        </div>
                            ):null)}
                    {user.connection && user.connection.accepted?(
                    <div className="row">
                        <div className="col-sm-12">
                            <button type="button" className="btn btn-block "
                                    onClick={this.handleDeleteConnection.bind(this)}>{remove_msg}</button>
                        </div>
                    </div>
                        ):null}
                </div>
            </div>
        );
    }
}
