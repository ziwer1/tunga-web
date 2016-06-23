import React from 'react'
import { Link, IndexLink } from 'react-router'
import { Modal } from 'react-bootstrap'
import moment from 'moment'
import Rating from 'react-rating'
import TagList from './TagList'
import Progress from './status/Progress'
import CommentSection from '../containers/CommentSection'
import TaskHead from './TaskHead'
import Avatar from './Avatar'
import ApplicationList from './ApplicationList'
import TaskForm from './TaskForm'
import LargeModal from './ModalLarge'
import ComponentWithModal from './ComponentWithModal'
import Timeline from './Timeline'
import { parse_task_status } from '../utils/tasks'

export default class TaskWorflow extends ComponentWithModal {

    constructor(props) {
        super(props);
        this.state = {showModal: false, modalContent: null, modalTitle: ''};
    }

    componentDidMount() {
        const { Auth, Task, TaskActions } = this.props;
        const { task } = Task.detail;
        if(this.props.params.section == 'applications' && (Auth.id == task.user || Auth.user.is_staff)) {
            this.handleViewApplications();
        }
    }

    handleEdit() {
        const { TaskActions, Task } = this.props;
        const { task } = Task.detail;
        this.setState({modalContent: 'edit', modalTitle: 'Edit'});
        this.open();
    }

    handleCloseApplications() {
        const { TaskActions, Task } = this.props;
        if(confirm('Confirm close applications')) {
            TaskActions.updateTask(Task.detail.task.id, {apply: false, apply_closed_at: moment.utc().format()});
        }
    }

    handleOpenApplications() {
        const { TaskActions, Task } = this.props;
        TaskActions.updateTask(Task.detail.task.id, {apply: true, apply_closed_at: null});
    }

    handleCloseTask() {
        const { TaskActions, Task } = this.props;
        if(confirm('Confirm close task')) {
            TaskActions.updateTask(Task.detail.task.id, {closed: true, closed_at: moment.utc().format()});
        }
    }

    handleOpenTask() {
        const { TaskActions, Task } = this.props;
        TaskActions.updateTask(Task.detail.task.id, {closed: false, closed_at: null});
    }

    handleRating(rating) {
        const { TaskActions, Task } = this.props;
        console.log(rating);
        TaskActions.updateTask(Task.detail.task.id, {satisfaction: rating});
    }

    handleMarkPaid() {
        const { TaskActions, Task } = this.props;
        if(confirm('Confirm mark as paid')) {
            TaskActions.updateTask(Task.detail.task.id, {paid: true, paid_at: moment.utc().format()});
        }
    }

    handleDeleteTask() {
        const { TaskActions, Task } = this.props;
        if(confirm('Confirm delete Task')) {
            TaskActions.deleteTask(Task.detail.task.id);
        }
    }

    handleAcceptTask() {
        const { TaskActions, Task, Auth } = this.props;
        TaskActions.updateTask(Task.detail.task.id, {participants: [Auth.user.id], confirmed_participants: [Auth.user.id]});
    }

    handleRejectTask() {
        const { TaskActions, Task, Auth } = this.props;
        if(confirm('Confirm reject task')) {
            TaskActions.updateTask(Task.detail.task.id, {participants: [Auth.user.id], rejected_participants: [Auth.user.id]});
        }
    }

    handleMakePayment() {
        const { TaskActions, Task } = this.props;
        mobbr.setLightboxUrl('/lightbox/#');
        mobbr.makePayment(document.location.href);
    }

    handleViewApplications() {
        const { TaskActions, Task } = this.props;
        const { task } = Task.detail;
        this.setState({modalContent: 'applications', modalTitle: 'Applications'});
        this.open();
    }

    renderModalContent() {
        const { TaskActions, Task, Auth } = this.props;
        const { task } = Task.detail;
        const title = <div>{this.state.modalTitle}: <Link to={`/task/${task.id}/`}>{task.title}</Link></div>;
        return (
            <div>
                <LargeModal title={title} show={this.state.showModal} onHide={this.close.bind(this)}>
                    {this.state.modalContent == 'applications'?(
                    <ApplicationList Task={Task} TaskActions={TaskActions} task={task} />
                        ):null}
                    {this.state.modalContent == 'edit'?(
                    <TaskForm Auth={Auth} Task={Task} TaskActions={TaskActions} task={task} />
                        ):null}
                </LargeModal>
            </div>
        );
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
                <div>
                    {this.renderModalContent()}
                    <div className="workflow-head clearfix">
                        {(Auth.user.id == task.user || Auth.user.is_staff)?(
                        <div className="pull-right" style={{marginTop: '20px'}}>
                            <div className="btn-group btn-choices select" role="group" aria-label="update preference">
                                <IndexLink to={`/task/${task.id}/`}
                                           className="btn btn-default" activeClassName="active">Task page</IndexLink>
                                <Link to={`/task/${task.id}/applications/`}
                                      className="btn btn-default" activeClassName="active">Go to applications</Link>
                            </div>
                        </div>
                            ):null}
                        <h3><Link to={`/task/${task.id}/`}>{task.title}</Link></h3>
                        {!task.closed && task.is_participant && task.my_participation && !task.my_participation.responded?(
                        <div className="workflow-actions pull-right">
                            <button type="button" className="btn btn-primary" onClick={this.handleAcceptTask.bind(this)}>Accept task</button>
                            <button type="button" className="btn btn-primary" onClick={this.handleRejectTask.bind(this)}>Reject task</button>
                        </div>
                            ):null}
                        <div>
                            <div className="dropdown" style={{display: 'inline-block'}}>
                                <button type="button" className="btn dropdown-toggle" data-toggle="dropdown">
                                    <span className="task-status"><i className={"fa fa-circle " + task_status.css}/></span> {task_status.message} <span className="caret"></span>
                                </button>
                                {(Auth.user.id == task.user || Auth.user.is_staff)?(
                                <div className="dropdown-menu workflow-actions">
                                    {task.closed?(
                                    <div>
                                        {/* Actions for closed tasks*/}
                                        <button type="button" className="btn btn-primary" onClick={this.handleOpenTask.bind(this)}>Open task</button>
                                        {!task.paid?(
                                        <button type="button" className="btn btn-primary" onClick={this.handleMakePayment.bind(this)}>Make payment</button>
                                            ):null}
                                        {!task.paid && Auth.user.is_staff?(
                                        <button type="button" className="btn btn-primary" onClick={this.handleMarkPaid.bind(this)}>Mark as paid</button>
                                            ):null}
                                        <div>
                                            <hr/>
                                            <div>Rate Developers</div>
                                            <Rating start={0} stop={10} step={2} fractions={2} initialRate={task.satisfaction}
                                                    empty={'fa fa-star-o fa-lg rating'} full={'fa fa-star fa-lg rating'}
                                                    onChange={this.handleRating.bind(this)}/>
                                        </div>
                                    </div>
                                        ):(
                                    <div>
                                        {/* Actions for open tasks*/}
                                        <button type="button" className="btn btn-primary" onClick={this.handleCloseTask.bind(this)}>Close task</button>
                                        {task.apply?(
                                        <button type="button" className="btn btn-primary" onClick={this.handleCloseApplications.bind(this)}>Close applications</button>
                                            ):(
                                        <button type="button" className="btn btn-primary" onClick={this.handleOpenApplications.bind(this)}>Open applications</button>
                                            )}
                                        <button type="button" className="btn btn-primary" onClick={this.handleEdit.bind(this)}>Edit</button>
                                        <button type="button" className="btn btn-primary" onClick={this.handleDeleteTask.bind(this)}>Delete</button>
                                    </div>)}
                                </div>):null}
                            </div>
                        </div>
                        <Timeline start={task.created_at} end={task.deadline} events={task.progress_events}/>
                    </div>
                </div>
                    )}
            </div>

        );
    }
}
