import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import TagList from './TagList'
import Progress from './status/Progress'
import CommentSection from '../containers/CommentSection'
import TaskHead from './TaskHead'
import LargeModal from './ModalLarge'
import ApplicationForm from './ApplicationForm'
import ComponentWithModal from './ComponentWithModal'

export default class TaskDetail extends ComponentWithModal {

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

        return (
            <div>
                {Task.detail.isRetrieving?
                    (<Progress/>)
                    :(
                <div>
                    <LargeModal title={<div>Apply for Task: <Link to={`/task/${task.id}/`}>{task.title}</Link></div>} show={this.state.showModal} onHide={this.close.bind(this)}>
                        <ApplicationForm Auth={Auth} Task={Task} TaskActions={TaskActions} task={task}/>
                    </LargeModal>
                    <TaskHead task={task}/>
                    <h4 className="title">{task.currency} {task.fee}</h4>
                    {task.deadline?(
                    <div>
                        <strong>Deadline</strong>
                        <span>{moment.utc(task.deadline).local().format('Do, MMMM YYYY, h:mm a')}</span>
                    </div>
                        ):null}
                    <div dangerouslySetInnerHTML={{__html: task.description}}/>
                    {task.can_apply?(
                    <button type="button" className="btn btn-default"
                            onClick={this.handleApplication.bind(this)}>Apply for this task</button>
                        ):null}
                    {task.can_save?(
                    <button type="button" className="btn btn-default"
                            onClick={this.handleSaveTask.bind(this)}>Save Task</button>
                        ):null}
                </div>
                    )}
            </div>

        );
    }
}
