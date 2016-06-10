import React from 'react'
import { Link } from 'react-router'
import Progress from './status/Progress'
import UserCardProfile from './UserCardProfile'

export default class UserCard extends React.Component {

    handleConnectRequest() {
        const { UserActions, user } = this.props;
        UserActions.createConnection({to_user: user.id});
    }

    handleConnectResponse(accepted=false) {
        const { UserActions, user } = this.props;
        UserActions.updateConnection(user.request, {accepted, responded: true});
    }

    render() {
        const { Auth, user } = this.props;
        var connection_msg = 'Send friend request';
        if(Auth.user.is_project_owner) {
            connection_msg = 'Add to my team';
        } else if(user.is_project_owner) {
            connection_msg = 'Send request to join team';
        }

        return (
            <div className="well card user">
                <UserCardProfile user={user}/>
                <div className="actions">
                    <div className="row">
                        <div className="col-sm-12">
                            <Link to={`/member/${user.id}/`} className="btn btn-block btn-default">View full profile</Link>
                        </div>
                    </div>

                    {user.can_connect?(
                    <div className="row">
                        <div className="col-sm-12">
                            <button type="button" className="btn btn-block btn-default"
                                    onClick={this.handleConnectRequest.bind(this)}>{connection_msg}</button>
                        </div>
                    </div>
                        ):(
                        user.request?(
                        <div className="row">
                            <div className="col-sm-6">
                                <button type="button" className="btn btn-block btn-default"
                                        onClick={this.handleConnectResponse.bind(this, true)}>Accept</button>
                            </div>
                            <div className="col-sm-6">
                                <button type="button" className="btn btn-block btn-default"
                                        onClick={this.handleConnectResponse.bind(this, false)}>Decline</button>
                            </div>
                        </div>
                            ):null)}
                </div>
            </div>
        );
    }
}
