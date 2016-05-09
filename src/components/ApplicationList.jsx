import React from 'react'
import { Link } from 'react-router'
import Progress from './status/Progress'
import TaskHead from './TaskHead'
import UserCardProfile from './UserCardProfile'

export default class ApplicationList extends React.Component {

    componentDidMount() {
        const { TaskActions, Task } = this.props;
        TaskActions.listApplications({task: Task.detail.task.id, responded: 'False'});
    }

    handleApplicationResponse(application, accepted=false) {
        const { TaskActions, task } = this.props;
        if(accepted) {
            var assignee = null;
            if(!task.assignee) {
                assignee = application.user;
            }
            TaskActions.updateTask(application.task, {assignee, participants: [application.user], confirmed_participants: [application.user]});
        }
        TaskActions.updateApplication(application.id, {accepted, responded: true});
    }

    render() {
        const { Task } = this.props;
        const { applications } =  Task.detail;

        return (
            <div>
                {Task.detail.isRetrieving || Task.detail.applications.isRetrieving?
                    (<Progress/>)
                    :
                    (<div>
                        <div className="row">
                            {applications.ids.map((id) => {
                                const application = applications.items[id];
                                const user = application.details.user;
                                return(
                                <div className="col-md-4" key={id}>
                                    <div className="well card">
                                        <UserCardProfile user={user}/>
                                        {application.responded?null:(
                                        <div className="actions">
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <Link to={`/member/${user.id}/`} className="btn btn-block btn-default">View full profile</Link>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6">
                                                    <button type=
                                                                "button" className="btn btn-block btn-default"
                                                            onClick={this.handleApplicationResponse.bind(this, application, true)}>Accept</button>
                                                </div>
                                                <div className="col-sm-6">
                                                    <button type="button" className="btn btn-block btn-default"
                                                            onClick={this.handleApplicationResponse.bind(this, application, false)}>Decline</button>
                                                </div>
                                            </div>
                                        </div>
                                            )}
                                    </div>
                                </div>
                                    )
                                })}
                        </div>
                        {applications.ids.length?'':(
                        <div className="alert alert-info">No applications</div>
                            )}
                    </div>)
                    }
            </div>
        );
    }
}
