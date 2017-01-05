import React from 'react';
import {Link, IndexLink} from 'react-router';
import moment from 'moment';
import {OverlayTrigger, Popover} from 'react-bootstrap';

import CommentSection from '../containers/CommentSection';
import Avatar from './Avatar';
import CommentForm from './CommentForm';
import ActivityList from './ActivityList';
import LargeModal from './ModalLarge';
import ComponentWithModal from './ComponentWithModal';
import Timeline from './Timeline';
import MilestonePage from '../containers/MilestonePage';
import Milestone from './Milestone';

import {parse_task_status} from '../utils/tasks';
import {getTaskKey} from '../utils/reducers';
import { SOCIAL_PROVIDERS } from '../constants/Api';

export function resizeOverviewBox() {
    var w_h = $(window).height();
    var nav_h = $('nav.navbar').height();
    var wf_h = $('.workflow-head').height();
    var t_h = nav_h + wf_h + 80;
    if (w_h > t_h) {
        $('.workflow-overview').css('height', (w_h - t_h) + 'px');
    }
}

export default class TaskWorflow extends ComponentWithModal {

    constructor(props) {
        super(props);
        this.state = {ratings_map: null, modalEvent: {}};
    }

    componentWillMount() {
        this.intervals = [];
        this.redirectToNextStep(this.props);

        if (this.props.params && this.props.params.eventId) {
            this.openMilestone(this.props.params.eventId);
        }
    }

    componentDidMount() {
        const {Auth, TaskActions, Task} = this.props;
        const {task} = Task.detail;

        TaskActions.listTaskActivity(task.id);

        resizeOverviewBox();
        $(window).resize(resizeOverviewBox);

        if (this.props.params.taskId) {
            this.setInterval(this.getNewActivity.bind(this), 5000);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params && nextProps.params.eventId != this.props.params.eventId) {
            this.openMilestone(nextProps.params.eventId);
        }

        if (nextProps.Task.detail.task.closed != this.props.Task.detail.task.closed) {
            this.redirectToNextStep(nextProps);
        }
    }

    componentWillUnmount() {
        this.intervals.map(clearInterval);
    }

    setInterval() {
        this.intervals.push(setInterval.apply(null, arguments));
    }

    redirectToNextStep(props) {
        const {Auth, Task} = props;
        const {task} = Task.detail;

        if (Auth.user.id == task.user.id && task.closed && (!this.props.location.query || !this.props.location.query.nr) && (!props.params || !props.params.eventId)) {
            const {router} = this.context;
            var next = null;
            if (task.paid) {
                next = `/task/${Task.detail.task.id}/rate`;
            } else {
                next = `/task/${Task.detail.task.id}/pay`;
            }

            if (next) {
                router.replace(next);
            }
        }

    }

    getNewActivity() {
        const {Task, TaskActions, search, filters} = this.props;
        let taskId = this.props.params.taskId;
        let task_key = getTaskKey(taskId);

        if (taskId && !Task.detail.activity.isFetching[task_key]) {
            var since = 0;
            const task_activity_items = Task.detail.activity.items[task_key];
            if (task_activity_items.length) {
                since = task_activity_items[task_activity_items.length - 1].id;
                if (since === undefined || since === null) {
                    [...task_activity_items].reverse().some(item => {
                        if (item.id) {
                            since = item.id;
                        }
                        return item.id;
                    });
                }
            }
            TaskActions.listTaskActivity(taskId, {since, ...filters, search});
        }
    }

    handleCloseApplications() {
        const {TaskActions, Task} = this.props;
        if (confirm('Confirm close applications')) {
            TaskActions.updateTask(Task.detail.task.id, {apply: false, apply_closed_at: moment.utc().format()});
        }
    }

    handleOpenApplications() {
        const {TaskActions, Task} = this.props;
        TaskActions.updateTask(Task.detail.task.id, {apply: true, apply_closed_at: null});
    }

    handleCloseTask() {
        const {TaskActions, Task} = this.props;
        if (confirm('Confirm close task')) {
            TaskActions.updateTask(Task.detail.task.id, {closed: true, closed_at: moment.utc().format()});
        }
    }

    handleOpenTask() {
        const {TaskActions, Task} = this.props;
        TaskActions.updateTask(Task.detail.task.id, {closed: false, closed_at: null});
    }

    handleMarkPaid() {
        const {TaskActions, Task} = this.props;
        if (confirm('Confirm mark as paid')) {
            TaskActions.updateTask(Task.detail.task.id, {paid: true, paid_at: moment.utc().format()});
        }
    }

    handleDeleteTask() {
        const {TaskActions, Task} = this.props;
        if (confirm('Confirm delete Task')) {
            TaskActions.deleteTask(Task.detail.task.id);
        }
    }

    handleAcceptTask() {
        const {TaskActions, Task, Auth} = this.props;
        TaskActions.updateTask(
            Task.detail.task.id,
            {
                participation: [{user: Auth.user.id, accepted: true, responded: true}]
            }
        );
    }

    handleRejectTask() {
        const {TaskActions, Task, Auth} = this.props;
        if (confirm('Confirm reject task')) {
            TaskActions.updateTask(
                Task.detail.task.id,
                {
                    participation: [{user: Auth.user.id, accepted: false, responded: true}]
                }
            );
        }
    }

    onUpload(files) {
        const {Task, TaskActions} = this.props;
        const {task} = Task.detail;
        TaskActions.updateTask(task.id, null, files);
    }

    openMilestone(event) {
        if (event) {
            this.setState({modalEvent: {id: event}});
            this.open();
        }
    }

    renderModalContent() {
        return (
            <div>
                <LargeModal title={this.state.modalEvent.title || 'Task Update'} show={this.state.showModal}
                            onHide={this.close.bind(this)}>
                    <MilestonePage>
                        <Milestone milestone_id={this.state.modalEvent.id}/>
                    </MilestonePage>
                </LargeModal>
            </div>
        );
    }

    render() {
        const {Auth, Task, TaskActions, params} = this.props;
        const {task, uploads} = Task.detail;
        var task_status = parse_task_status(task);
        let is_admin_or_owner = Auth.user.id == task.user.id || Auth.user.is_staff;
        let is_confirmed_assignee = task.assignee && task.assignee.accepted && task.assignee.user.id == Auth.user.id;

        let workflow_link = `/task/${task.id}/?nr=true`;
        let can_pay = is_admin_or_owner && task.closed && !task.paid;
        let can_rate = is_admin_or_owner && task.closed && task.paid;
        let can_edit_shares = is_confirmed_assignee && task.details && task.details.participation_shares.length > 1;

        const pay_popover = (
            <Popover id="popover">
                <div>{task.paid ? 'Payment has been completed' : 'Close the task to move to this step'}</div>
            </Popover>
        );

        const rate_dev_popover = (
            <Popover id="popover">
                <div>Close the task and make the payment to move to this step</div>
            </Popover>
        );

        return (
            <div>
                {this.renderModalContent()}
                <div className="workflow-head clearfix">
                    <div className="pull-left" style={{marginBottom: '10px'}}>
                        <div className="title">
                            <Link to={`/task/${task.id}/`}>{task.title}</Link>
                        </div>
                        <div className="task-status"><i className={"fa fa-circle " + task_status.css}/> {task_status.message}</div>
                    </div>

                    {is_admin_or_owner || task.is_participant ? (
                        <div className="task-actions pull-right">
                            {is_admin_or_owner ? (
                                <div>
                                    <Link to={`/task/${task.id}/edit`} className="btn">
                                        <i className="fa fa-pencil-square-o"/> Edit</Link>

                                    <div className="dropdown" style={{display: 'inline-block'}}>
                                        <button className="btn" type="button" id="chat-overflow" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                            <i className="fa fa-ellipsis-v"/>
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="chat-overflow">
                                            <li>
                                                <button type="button" className="btn"
                                                        onClick={this.handleDeleteTask.bind(this)}>
                                                    <i className="fa fa-trash-o"/> Delete
                                                </button>
                                            </li>
                                            <li>
                                                {task.closed ? (
                                                    task.paid ? (
                                                        null
                                                    ) : (
                                                        <button type="button"
                                                                className="btn"
                                                                onClick={this.handleOpenTask.bind(this)}>
                                                            Open task
                                                        </button>
                                                    )
                                                ) : (
                                                    <button type="button"
                                                            className="btn"
                                                            onClick={this.handleCloseTask.bind(this)}>
                                                        Close task
                                                    </button>
                                                )}
                                            </li>
                                            <li>
                                                {task.apply?(
                                                    <button type="button" className="btn " onClick={this.handleCloseApplications.bind(this)}>Close applications</button>
                                                ):(
                                                    <button type="button" className="btn " onClick={this.handleOpenApplications.bind(this)}>Open applications</button>
                                                )}
                                            </li>
                                            {task.closed && !task.paid && Auth.user.is_staff ? (
                                                <li>
                                                    <button type="button"
                                                            className="btn"
                                                            onClick={this.handleMarkPaid.bind(this)}>
                                                        Mark as paid
                                                    </button>
                                                </li>
                                            ) : null}
                                        </ul>
                                    </div>
                                </div>
                            ) : null}
                            {!task.closed && task.is_participant && task.my_participation && !task.my_participation.responded ? (
                                <div>
                                    <button type="button"
                                            className="btn"
                                            onClick={this.handleAcceptTask.bind(this)}>
                                        Accept task
                                    </button>
                                    <button type="button"
                                            className="btn"
                                            onClick={this.handleRejectTask.bind(this)}>
                                        Reject task
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                    <div className="clearfix"></div>

                    <div className="pull-left">
                        {(is_admin_or_owner || can_edit_shares) ? (
                            <ul className="workflow-steps">
                                <li><IndexLink to={`/task/${task.id}/`} activeClassName="active">Task
                                    workflow</IndexLink>
                                </li>
                                {is_admin_or_owner ? (
                                    [
                                        <li key="applications">
                                            <Link to={`/task/${task.id}/applications/`}
                                                  activeClassName="active">
                                                Go to applications
                                            </Link>
                                        </li>,
                                        <li key="payment">
                                            <Link to={can_pay?`/task/${task.id}/pay/`:workflow_link}
                                                  activeClassName="active"
                                                  className={can_pay?'':'disabled'}>
                                                {can_pay ? 'Make payment' : (
                                                    <OverlayTrigger placement="top" overlay={pay_popover}>
                                                        <div>Make payment</div>
                                                    </OverlayTrigger>
                                                )}
                                            </Link>
                                        </li>,
                                        <li key="rate">
                                            <Link to={can_rate?`/task/${task.id}/rate/`:workflow_link}
                                                  activeClassName="active"
                                                  className={can_rate?'':'disabled'}>
                                                {can_rate ? 'Rate Developers' : (
                                                    <OverlayTrigger placement="top" overlay={rate_dev_popover}>
                                                        <div>Rate Developers</div>
                                                    </OverlayTrigger>
                                                )}
                                            </Link>
                                        </li>
                                    ]
                                ) : null}
                                {can_edit_shares ? (
                                    <li>
                                        <Link to={`/task/${task.id}/participation/`}
                                              activeClassName="active">
                                            Edit participation shares
                                        </Link>
                                    </li>
                                ) : null}
                            </ul>
                        ) : null}
                    </div>

                    {is_admin_or_owner ? (
                        <ul className="integration-options pull-right">
                            <li>
                                <Link to={`/task/${task.id}/integrations/${SOCIAL_PROVIDERS.github}`}
                                      activeClassName="active"
                                      title="GitHub">
                                    <i className="fa fa-github"/>
                                </Link>
                            </li>
                            <li>
                                <Link to={`/task/${task.id}/integrations/${SOCIAL_PROVIDERS.slack}`}
                                      activeClassName="active"
                                      title="Slack">
                                    <i className="fa fa-slack"/>
                                </Link>
                            </li>
                        </ul>
                    ) : null}
                </div>

                <div className="workflow-overview overview">
                    <div className="mainbox chatbox">

                        {task.details ? (
                            <div className="list-box">
                                <ActivityList
                                    Auth={Auth}
                                    activities={Task.detail.activity.items[getTaskKey(task.id)] || []}
                                    isLoading={Task.detail.activity.isFetching[getTaskKey(task.id)] || false}
                                    isLoadingMore={Task.detail.activity.isFetchingMore[getTaskKey(task.id)] || false}
                                    loadMoreUrl={Task.detail.activity.next[getTaskKey(task.id)] || null}
                                    loadMoreCallback={TaskActions.listMoreTaskActivity}
                                    loadMoreText="Show older activity"
                                />
                            </div>
                        ) : null}
                        {task.details ? (
                            <CommentSection className="comment-box">
                                <CommentForm
                                    object_details={{content_type: task.content_type, object_id: task.id}}
                                    uploadCallback={this.onUpload.bind(this)}
                                    uploadSaved={Task.detail.isSaved}
                                    isSaving={Task.detail.isSaving}/>
                            </CommentSection>
                        ) : null}
                    </div>

                    <div className="sidebox">
                        <div className="overview-details">
                            <div className="wrapper">
                                <Timeline task={task}
                                          start={task.created_at}
                                          end={task.deadline}
                                          events={task.progress_events}
                                          openMilestone={this.openMilestone.bind(this)}>
                                    <div className="pledge">{task.display_fee}</div>

                                    {task.deadline ? (
                                        <div className="deadline">
                                            <div>
                                                <i className="fa fa-clock-o fa-2x"/>
                                            </div>
                                            <div>
                                                <div
                                                    className="bold">{moment.utc(task.deadline).local().format("Do MMM 'YY")}</div>
                                                <div>{moment.utc(task.deadline).local().format('hh:mm A')}</div>
                                            </div>
                                        </div>
                                    ) : null}
                                </Timeline>

                                {task.description ? (
                                    <div>
                                        <strong>Description</strong>
                                        <div className="description"
                                             dangerouslySetInnerHTML={{__html: task.description}}/>
                                    </div>
                                ) : null}

                                <strong>Posted by</strong>
                                <div>
                                    <Avatar src={task.user.avatar_url}/> <Link
                                    to={`/people/${task.user.username}/`}>{task.user.display_name}</Link>
                                </div>

                                {task.assignee ? (
                                    <div>
                                        <strong>Assignee</strong>
                                        <div className="collaborator">
                                            <Avatar src={task.assignee.user.avatar_url}/>
                                            <Link
                                                to={`/people/${task.assignee.user.username}/`}>{task.assignee.user.display_name}</Link>
                                            <span className="status">{task.assignee.accepted ?
                                                <i className="fa fa-check-circle accepted"/> : '[Invited]'}</span>
                                        </div>
                                    </div>
                                ) : null}

                                {task.details && task.details.participation && task.details.participation.length > (task.assignee ? 1 : 0) ? (
                                    <div>
                                        <strong>Developers</strong>
                                        {task.details.participation.map((participation) => {
                                            const participant = participation.user;
                                            return (
                                                (!task.assignee || participant.id != task.assignee.user.id) && (participation.accepted || !participation.responded) ? (
                                                    <div className="collaborator" key={participant.id}>
                                                        <Avatar src={participant.avatar_url}/>
                                                        <Link
                                                            to={`/people/${participant.username}/`}>{participant.display_name}</Link>
                                                        <span className="status">{participation.accepted ?
                                                            <i className="fa fa-check-circle accepted"/> : '[Invited]'}</span>
                                                    </div>
                                                ) : null
                                            )
                                        })}
                                    </div>
                                ) : null}

                                {task.url ? (
                                    <div>
                                        <strong>Code Location</strong>
                                        <p><a href={task.url}>{task.url}</a></p>
                                    </div>
                                ) : null}
                                {task.milestones.length ? (
                                    <div>
                                        <strong>Milestones</strong>
                                        {task.milestones.map(milestone => {
                                            return (
                                                <div key={milestone.id}>
                                                    <Link to={`/task/${task.id}/event/${milestone.id}`}>
                                                        <i className={"fa fa-flag"+((milestone.type==4)?'-checkered':'-o')}/> {milestone.title}
                                                        <span
                                                            style={{marginLeft: '5px'}}>{moment.utc(milestone.due_at).local().format('Do, MMMM YYYY, h:mm a')}</span>
                                                    </Link>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="overview-files">
                            {uploads ? (
                                <div className="wrapper">
                                    <h4>Files</h4>
                                    {uploads.map(upload => {
                                        return (
                                            <div key={upload.id} className="file">
                                                <a href={upload.url}><i className="fa fa-download"/> {upload.name}
                                                    <strong>[{upload.display_size}]</strong></a>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

TaskWorflow.contextTypes = {
    router: React.PropTypes.object.isRequired
};
