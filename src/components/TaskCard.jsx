import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import TimeAgo from 'react-timeago'
import Progress from './status/Progress'
import TagList from './TagList'
import Avatar from './Avatar'

export default class TaskCard extends React.Component {

    handleApplication() {
        const { TaskActions, task } = this.props;
        TaskActions.createApplication({task: task.id});
    }

    handleSaveTask() {
        const { TaskActions, task } = this.props;
        TaskActions.createSavedTask({task: task.id});
    }

    handleSendTask() {
        //TODO: Handle send task
    }

    render() {
        const { Auth, task } = this.props;

        return (
            <div className="well card task">
                <h3 className="title"><Link to={`/task/${task.id}/`}>{task.title}</Link></h3>
                <div>
                    <Avatar src={task.details.user.avatar_url}/> <Link to={`/member/${task.user}/`}>{task.details.user.display_name}</Link>
                    {task.details.user.company?(
                        <span>, {task.details.user.company}</span>
                        ):''}
                </div>
                <div className="pledge">{task.display_fee}</div>
                <div>
                    Posted <TimeAgo date={moment.utc(task.created_at).local().format()} />
                </div>
                {task.deadline?(
                <div>
                    Deadline {moment.utc(task.deadline).local().format('Do, MMMM YYYY')}
                </div>
                    ):''}
                <TagList tags={task.details.skills} max={3} link={`/task/${task.id}/`}/>
                <p className="description">{task.description}</p>
                <div className="actions">
                    {Auth.user.is_developer?(
                    <div className="actions">
                        {task.can_apply?(
                        <div className="row">
                            <div className="col-sm-12">
                                <button type="button" className="btn btn-block btn-default"
                                        onClick={this.handleApplication.bind(this)}>Apply for this task</button>
                            </div>
                        </div>
                            ):''}
                        <div className="row">
                            {task.can_save?(
                            <div className="col-sm-6">
                                <button type="button" className="btn btn-block btn-default"
                                        onClick={this.handleSaveTask.bind(this)}>Save</button>
                            </div>
                                ):''}
                            <div className={"col-sm-"+(task.can_save?'6':'12')}>
                                <button type="button" className="btn btn-block btn-default"
                                        onClick={this.handleSendTask.bind(this)}>Send this task</button>
                            </div>
                        </div>
                    </div>
                        ):''}
                </div>
            </div>
        );
    }
}
