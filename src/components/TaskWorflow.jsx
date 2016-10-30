import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import CommentSection from '../containers/CommentSection';
import Avatar from './Avatar';
import CommentForm from './CommentForm';
import ActivityList from './ActivityList';
import LargeModal from './ModalLarge';
import ComponentWithModal from './ComponentWithModal';
import Timeline from './Timeline';
import MilestonePage from '../containers/MilestonePage';
import Milestone from './Milestone';

import { parse_task_status } from '../utils/tasks';

export function resizeOverviewBox() {
    var w_h = $(window).height();
    var nav_h = $('nav.navbar').height();
    var wf_h = $('.workflow-head').height();
    var t_h = nav_h + wf_h + 80;
    if(w_h > t_h) {
        $('.workflow-overview').css('height', (w_h - t_h)+'px');
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

        if(this.props.params && this.props.params.eventId) {
            this.openMilestone(this.props.params.eventId);
        }
    }

    componentDidMount() {
        const { Auth, TaskActions, Task } = this.props;
        const { task } = Task.detail;

        TaskActions.listTaskActivity(task.id);

        resizeOverviewBox();
        $(window).resize(resizeOverviewBox);

        if(this.props.params.taskId) {
            this.setInterval(this.getNewActivity.bind(this), 5000);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.params && nextProps.params.eventId != this.props.params.eventId) {
            this.openMilestone(nextProps.params.eventId);
        }

        if(nextProps.Task.detail.task.closed != this.props.Task.detail.task.closed) {
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
        const { Auth, Task } = props;
        const { task } = Task.detail;

        if(Auth.user.id == task.user.id && task.closed && (!this.context.location.query || !this.context.location.query.nr) && (!props.params || !props.params.eventId)) {
            const { router } = this.context;
            var next = null;
            if(task.paid) {
                next = `/task/${Task.detail.task.id}/rate`;
            } else {
                next = `/task/${Task.detail.task.id}/pay`;
            }

            if(next) {
                router.replace(next);
            }
        }

    }

    getNewActivity() {
        const { Task, TaskActions, search, filters } = this.props;
        if(this.props.params.taskId && !Task.detail.activity.isFetching && Task.detail.activity.items.length) {
            var since = 0;
            if(Task.detail.activity.items.length) {
                since = Task.detail.activity.items[Task.detail.activity.items.length-1].id;
                if(since === undefined || since === null) {
                    [...Task.detail.activity.items].reverse().some(item => {
                        if(item.id) {
                            since = item.id;
                        }
                        return item.id;
                    });
                }
            }
            TaskActions.listTaskActivity(this.props.params.taskId, {since, ...filters, search});
        }
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
        TaskActions.updateTask(
            Task.detail.task.id,
            {
                participation: [{user: Auth.user.id, accepted: true, responded: true}]
            }
        );
    }

    handleRejectTask() {
        const { TaskActions, Task, Auth } = this.props;
        if(confirm('Confirm reject task')) {
            TaskActions.updateTask(
                Task.detail.task.id,
                {
                    participation: [{user: Auth.user.id, accepted: false, responded: true}]
                }
            );
        }
    }

    onUpload(files) {
        const { Task, TaskActions } = this.props;
        const { task } = Task.detail;
        TaskActions.updateTask(task.id, null, files);
    }

    openMilestone(event) {
        if(event) {
            this.setState({modalEvent: {id: event}});
            this.open();
        }
    }

    renderModalContent() {
        return (
            <div>
                <LargeModal title={this.state.modalEvent.title || 'Task Update'} show={this.state.showModal} onHide={this.close.bind(this)}>
                    <MilestonePage>
                        <Milestone milestone_id={this.state.modalEvent.id}/>
                    </MilestonePage>
                </LargeModal>
            </div>
        );
    }

    render() {
        const { Auth, Task, TaskActions, params } = this.props;
        const { task, uploads } = Task.detail;
        var task_status = parse_task_status(task);
        let is_admin_or_owner = Auth.user.id == task.user.id || Auth.user.is_staff;
        let is_confirmed_assignee = task.assignee && task.assignee.accepted && task.assignee.user.id == Auth.user.id;

        return (
            <div>
                {this.renderModalContent()}
                <div className="workflow-head clearfix">
                    <div className="title pull-left"><Link to={`/task/${task.id}/`}>{task.title}</Link></div>

                    {is_admin_or_owner?(
                        <div className="quick-actions pull-left">
                            <Link to={`/task/${task.id}/edit`} className="btn btn-borderless">Edit</Link>
                            <button type="button" className="btn btn-borderless" onClick={this.handleDeleteTask.bind(this)}>Delete</button>
                        </div>
                    ):null}
                    <div className="clearfix"></div>

                    {(is_admin_or_owner || task.is_participant)?(
                        <div className="nav-top-filter pull-right">
                            {!task.closed && task.is_participant && task.my_participation && !task.my_participation.responded?(
                                [
                                    <button type="button" className="btn " onClick={this.handleAcceptTask.bind(this)}>Accept task</button>,
                                    <button type="button" className="btn " onClick={this.handleRejectTask.bind(this)}>Reject task</button>
                                ]
                            ):null}


                            {is_admin_or_owner?(
                                task.closed?(
                                    task.paid?(
                                        <Link to={`/task/${task.id}/rate/`}>Rate Developers</Link>
                                    ):(
                                        [
                                            <button type="button" className="btn " onClick={this.handleOpenTask.bind(this)}>Open task</button>,
                                            <Link to={`/task/${task.id}/pay/`}>Make payment</Link>
                                        ]
                                    )
                                ):(
                                    <button type="button" className="btn " onClick={this.handleCloseTask.bind(this)}>Close task</button>
                                )
                            ):null}

                            {task.closed && !task.paid && Auth.user.is_staff?(
                                <button type="button" className="btn" onClick={this.handleMarkPaid.bind(this)}>Mark as paid</button>
                            ):null}


                            {is_admin_or_owner?(
                                [
                                    <Link to={`/task/${task.id}/applications/`} activeClassName="active">Go to applications</Link>,
                                    <Link to={`/task/${task.id}/integrations/`} activeClassName="active">Integrations</Link>
                                ]
                            ):null}
                            {is_confirmed_assignee && task.details && task.details.participation_shares.length > 1?(
                                <Link to={`/task/${task.id}/participation/`} activeClassName="active">Edit participation shares</Link>
                            ):null}
                        </div>
                    ):null}
                    <div>
                        <div className="dropdown" style={{display: 'inline-block', marginBottom: '15px'}}>
                            <button id="task-actions-toggle" type="button" className="btn dropdown-toggle" data-toggle="dropdown">
                                <span className="task-status"><i className={"fa fa-circle " + task_status.css}/></span> {task_status.message} <span className="caret"></span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="workflow-overview overview">
                    <div className="mainbox chatbox">

                        {task.details?(
                            <div className="list-box">
                                <ActivityList
                                    Auth={Auth}
                                    activities={Task.detail.activity.items}
                                    isLoading={Task.detail.activity.isFetching}
                                    isLoadingMore={Task.detail.activity.isFetchingMore}
                                    loadMoreUrl={Task.detail.activity.next}
                                    loadMoreCallback={TaskActions.listMoreTaskActivity}
                                    loadMoreText="Show older activity"
                                />
                            </div>
                        ):null}
                        {task.details?(
                            <CommentSection className="comment-box">
                                <CommentForm
                                    object_details={{content_type: task.content_type, object_id: task.id}}
                                    uploadCallback={this.onUpload.bind(this)}
                                    uploadSaved={Task.detail.isSaved}
                                    isSaving={Task.detail.isSaving}/>
                            </CommentSection>
                        ):null}
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

                                    {task.deadline?(
                                        <div className="deadline">
                                            <div>
                                                <i className="fa fa-clock-o fa-2x"/>
                                            </div>
                                            <div>
                                                <div className="bold">{moment.utc(task.deadline).local().format("Do MMM 'YY")}</div>
                                                <div>{moment.utc(task.deadline).local().format('hh:mm A')}</div>
                                            </div>
                                        </div>
                                    ):null}
                                </Timeline>

                                {task.description?(
                                    <div>
                                        <strong>Description</strong>
                                        <div className="description" dangerouslySetInnerHTML={{__html: task.description}}/>
                                    </div>
                                ):null}

                                <strong>Posted by</strong>
                                <div>
                                    <Avatar src={task.user.avatar_url}/> <Link to={`/people/${task.user.username}/`}>{task.user.display_name}</Link>
                                </div>

                                {task.assignee?(
                                    <div>
                                        <strong>Assignee</strong>
                                        <div className="collaborator">
                                            <Avatar src={task.assignee.user.avatar_url}/>
                                            <Link to={`/people/${task.assignee.user.username}/`}>{task.assignee.user.display_name}</Link>
                                            <span className="status">{task.assignee.accepted?<i className="fa fa-check-circle accepted"/>:'[Invited]'}</span>
                                        </div>
                                    </div>
                                ):null}

                                {task.details && task.details.participation && task.details.participation.length > (task.assignee?1:0)?(
                                    <div>
                                        <strong>Developers</strong>
                                        {task.details.participation.map((participation) => {
                                            const participant = participation.user;
                                            return (
                                                (!task.assignee || participant.id != task.assignee.user.id) && (participation.accepted || !participation.responded)?(
                                                    <div className="collaborator" key={participant.id}>
                                                        <Avatar src={participant.avatar_url}/>
                                                        <Link to={`/people/${participant.username}/`}>{participant.display_name}</Link>
                                                        <span className="status">{participation.accepted?<i className="fa fa-check-circle accepted"/>:'[Invited]'}</span>
                                                    </div>
                                                ):null
                                            )
                                        })}
                                    </div>
                                ):null}

                                {task.url?(
                                    <div>
                                        <strong>Code Location</strong>
                                        <p><a href={task.url}>{task.url}</a></p>
                                    </div>
                                ):null}
                                {task.milestones.length?(
                                    <div>
                                        <strong>Milestones</strong>
                                        {task.milestones.map(milestone => {
                                            return (
                                                <div key={milestone.id}>
                                                    <Link to={`/task/${task.id}/event/${milestone.id}`}>
                                                        <i className={"fa fa-flag"+((milestone.type==4)?'-checkered':'-o')}/> {milestone.title}
                                                        <span style={{marginLeft: '5px'}}>{moment.utc(milestone.due_at).local().format('Do, MMMM YYYY, h:mm a')}</span>
                                                    </Link>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ):null}
                            </div>
                        </div>
                        <div className="overview-files">
                            {uploads?(
                                <div className="wrapper">
                                    <h4>Files</h4>
                                    {uploads.map(upload => {
                                        return (
                                            <div key={upload.id} className="file">
                                                <a href={upload.url}><i className="fa fa-download"/> {upload.name} <strong>[{upload.display_size}]</strong></a>
                                            </div>
                                        );
                                    })}
                                </div>
                            ):null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

TaskWorflow.contextTypes = {
    router: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired
};
