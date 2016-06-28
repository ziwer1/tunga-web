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
import CommentForm from './CommentForm'
import CommentList from './CommentList'
import { parse_task_status } from '../utils/tasks'

export function resizeOverviewBox() {
    var w_h = $(window).height();
    var nav_h = $('nav.navbar').height();
    var wf_h = $('.workflow-head').height();
    var t_h = nav_h + wf_h + 90;//($('.workflow-head .timeline').size()?70:40);
    if(w_h > t_h) {
        $('.workflow-overview').css('height', (w_h - t_h)+'px');
    }
}

export default class TaskOverview extends React.Component {

    componentDidMount() {
        $(document).ready(resizeOverviewBox);
        $(window).resize(resizeOverviewBox);
    }

    render() {
        const { Auth, Task, TaskActions } = this.props;
        const { task } = Task.detail;

        return (
            <div>
                {Task.detail.isRetrieving?
                    (<Progress/>)
                    :(
                <div className="workflow-overview overview">
                    <div className="mainbox chatbox">
                        {task.details?(
                        <CommentSection className="list-box">
                            <CommentList filter={{task: task.id}}/>
                        </CommentSection>
                            ):null}
                        {task.details?(
                        <CommentSection className="comment-box">
                            <CommentForm object_details={{content_type: task.content_type, object_id: task.id}}/>
                        </CommentSection>
                            ):null}
                    </div>

                    <div className="sidebox">
                        <div className="overview-details">
                            <h4>Task details</h4>
                            <div>
                                <strong>Pledge</strong>
                                <h4 className="title">{task.display_fee}</h4>
                            </div>

                            {task.deadline?(
                            <div>
                                <strong>Deadline</strong>
                                <p>{moment.utc(task.deadline).local().format('Do, MMMM YYYY, h:mm a')}</p>
                            </div>
                                ):null}

                            {task.description?(
                            <div>
                                <strong>Description</strong>
                                <div className="description" dangerouslySetInnerHTML={{__html: task.description}}/>
                            </div>
                                ):null}

                            {task.details?(
                            <div>
                                <strong>Posted by</strong>
                                <div>
                                    <Avatar src={task.details.user.avatar_url}/> <Link to={`/member/${task.user}/`}>{task.details.user.display_name}</Link>
                                </div>
                            </div>
                                ):null}

                            {task.assignee && task.details?(
                            <div>
                                <strong>Assignee</strong>
                                <div className="collaborator">
                                    <Avatar src={task.details.assignee.user.avatar_url}/>
                                    <Link to={`/member/${task.assignee.user}/`}>{task.details.assignee.user.display_name}</Link>
                                    <span className="status">{task.assignee.accepted?<i className="fa fa-check-circle accepted"/>:'[Invited]'}</span>
                                </div>
                            </div>
                                ):null}

                            {task.details && task.details.participation && task.details.participation.length?(
                            <div>
                                <strong>Developers</strong>
                                {task.details.participation.map((participation) => {
                                    const participant = participation.user;
                                    return (
                                        (task.assignee && participant.id != task.assignee.user) && (participation.accepted || !participation.responded)?(
                                        <div className="collaborator" key={participant.id}>
                                            <Avatar src={participant.avatar_url}/>
                                            <Link to={`/member/${participant.id}/`}>{participant.display_name}</Link>
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
                                        <i className={"fa fa-flag"+((milestone.type==4)?'-checkered':'-o')}/> {milestone.title}
                                        <span style={{marginLeft: '5px'}}>{moment.utc(milestone.due_at).local().format('Do, MMMM YYYY, h:mm a')}</span>
                                    </div>
                                        );
                                    })}
                            </div>
                                ):null}
                        </div>
                        <div className="overview-files">
                            {task.all_uploads?(
                            <div>
                                <h4>Files</h4>
                                {task.all_uploads.map(upload => {
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
                    )}
            </div>
        );
    }
}
