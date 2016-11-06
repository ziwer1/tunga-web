import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import TimeAgo from 'react-timeago';
import Progress from './status/Progress';
import TagList from './TagList';
import Avatar from './Avatar';

import { parse_task_status } from '../utils/tasks';

export default class TaskDetail extends React.Component {

    handleApplication() {
        this.open();
    }

    handleSaveTask() {
        const { Task, TaskActions } = this.props;
        const { task } = Task.detail;
        TaskActions.createSavedTask({task: task.id});
    }

    render() {
        const { Auth, Task, TaskActions } = this.props;
        const { task } = Task.detail;
        var task_status = parse_task_status(task);

        return (
            <div>
                {Task.detail.isRetrieving?
                    (<Progress/>)
                    :(
                <div className="task-page">
                    {task.can_apply?(
                        <Link to={`/task/${task.id}/apply`} className="btn pull-right">Apply for this task</Link>
                    ):(Auth.user.can_contribute?null:(
                            <div style={{marginBottom: '20px'}}>
                                <div className="alert alert-info">You need to complete your profile before you can apply for tasks</div>
                                <div>
                                    <Link to="/profile"><i className="fa fa-arrow-right"/> Continue to your profile</Link>
                                </div>
                            </div>
                        )
                    )}

                    <h3 className="title pull-left"><Link to={`/task/${task.id}/`}>{task.title}</Link></h3>
                    <div className="time pull-left">
                        Posted <TimeAgo date={moment.utc(task.created_at).local().format()}/>
                    </div>
                    <div className="clearfix"></div>
                    <div className="pledge">{task.display_fee}</div>
                    <div className="task-status"><i className={"fa fa-circle " + task_status.css}/> {task_status.message}</div>

                    <Avatar src={task.user.avatar_url}/> <Link to={`/people/${task.user.username}/`}>{task.user.display_name}</Link>
                    {task.deadline?(
                        <div className="title">
                            <span>Deadline: </span>
                            <span>{moment.utc(task.deadline).local().format('Do, MMMM YYYY, h:mm a')}</span>
                        </div>
                    ):null}
                    {task.details?(
                        <TagList tags={task.details.skills} linkPrefix="/task/skill/"/>
                    ):null}
                    <div>
                        <strong>Created</strong> <span>{moment.utc(task.created_at).local().format('Do, MMMM YYYY, h:mm a')}</span>
                    </div>

                    {task.description?(
                        <div>
                            <h5>Task description</h5>
                            <div className="card" dangerouslySetInnerHTML={{__html: task.description}}/>
                        </div>
                    ):null}

                    {task.update_schedule_display?(
                        <div>
                            <h5>Update schedule for this task</h5>
                            <div className="card">As a developer for this task, you have to update the client {task.update_schedule_display.toLowerCase()}</div>
                        </div>
                    ):null}

                    {task.milestones.length?(
                        <div>
                            <strong>Milestones</strong>
                            <div className="card">
                                {task.milestones.map(milestone => {
                                    return (
                                        <p key={milestone.id}>
                                            <span style={{marginRight: '5px'}}>{moment.utc(milestone.due_at).local().format('Do MMM YY')}: </span>
                                            <span>{milestone.title}</span>
                                        </p>
                                    );
                                })}
                            </div>
                        </div>
                    ):null}

                    {task.uploads.length?(
                        <div>
                            <h5>Files</h5>
                            <div className="card">
                                {task.uploads.map(upload => {
                                    return (
                                        <div key={upload.id} className="file">
                                            <a href={upload.url}><i className="fa fa-download"/> {upload.name} <strong>[{upload.display_size}]</strong></a>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ):null}

                    {task.url?(
                        <div>
                            <h5>Code location</h5>
                            <div className="card">
                                <a href={task.url}>{task.url}</a>
                            </div>
                        </div>
                    ):null}

                    {task.remarks?(
                        <div>
                            <h5>Files {task.user.display_name} can provide</h5>
                            <div className="card" dangerouslySetInnerHTML={{__html: task.remarks}}/>
                        </div>
                    ):null}
                </div>
                    )}
            </div>

        );
    }
}
