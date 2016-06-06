import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import TimeAgo from 'react-timeago'
import Progress from './status/Progress'
import TagList from './TagList'
import Avatar from './Avatar'
import LargeModal from './ModalLarge'
import ApplicationForm from './ApplicationForm'
import ComponentWithModal from './ComponentWithModal'
import { render_excerpt } from '../utils/html'

export default class TaskCard extends ComponentWithModal {

    handleApplication() {
        this.open();
    }

    handleSaveTask() {
        const { TaskActions, task } = this.props;
        TaskActions.createSavedTask({task: task.id});
    }

    render() {
        const { Auth, Task, TaskActions, task } = this.props;
        var task_status = {message: 'This task is open', css: 'open'};
        if(task.closed) {
            task_status.message = 'This task is closed';
            task_status.css = 'closed';
        } else if(!task.apply) {
            task_status.message =  'This task is in progress';
            task_status.css = 'in-progress';
        }

        return (
            <div className="well card task">
                <LargeModal title={<div>Apply for Task: <Link to={`/task/${task.id}/`}>{task.title}</Link></div>} show={this.state.showModal} onHide={this.close.bind(this)}>
                    <ApplicationForm Auth={Auth} Task={Task} TaskActions={TaskActions} task={task}/>
                </LargeModal>
                <div className="top">
                    <h3 className="title"><Link to={`/task/${task.id}/`}>{task.title}</Link></h3>
                    <div className="status"><i className={"fa fa-circle " + task_status.css}/> {task_status.message}</div>
                    <div>
                        Posted <TimeAgo date={moment.utc(task.created_at).local().format()} /> by
                    </div>
                    <div>
                        <Avatar src={task.details.user.avatar_url}/> <Link to={`/member/${task.user}/`}>{task.details.user.display_name}</Link>
                        {task.details.user.company?(
                        <span>, {task.details.user.company}</span>
                            ):null}
                    </div>
                    <div className="pledge">{task.display_fee}</div>
                    <div>
                        {task.deadline?"Deadline "+moment.utc(task.deadline).local().format('Do, MMMM YYYY'):<span dangerouslySetInnerHTML={{__html: '&nbsp;'}}/>}
                    </div>
                </div>
                <div className="middle">
                    {task.details.skills.length?(
                    <TagList tags={task.details.skills} max={3} link={`/task/${task.id}/`}/>
                        ):(
                    <div style={{height: '20px'}}></div>
                        )}
                </div>
                <div className="bottom">
                    <div className="description" dangerouslySetInnerHTML={{__html: render_excerpt(task.excerpt)}}/>
                    <div className="actions">
                        {Auth.user.is_developer?(
                        <div className="row">
                            <div className="col-sm-12">
                                {task.can_apply?(
                                <button type="button" className="btn btn-block btn-default"
                                        onClick={this.handleApplication.bind(this)}>Apply for this task</button>
                                    ):(task.closed || !task.apply?(
                                <div className="btn btn-block btn-default">Applications are closed for this task</div>
                                    ):(
                                <div className="btn btn-block" style={{visibility: 'hidden'}}></div>
                                    ))}
                            </div>
                        </div>
                            ):null}
                        <div className="row">
                            <div className="col-sm-12">
                                <Link to={`/task/${task.id}/`} className="btn btn-block btn-default">View detailed page</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
