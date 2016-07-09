import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import TimeAgo from 'react-timeago'
import Progress from './status/Progress'
import LoadMore from './status/LoadMore'
import Avatar from './Avatar'
import Attachments from './Attachments'

export default class ActivityList extends React.Component {

    componentDidMount() {
        const { TaskActions, task } = this.props;
        TaskActions.listTaskActivity(task.id);
    }

    renderComment(comment) {
        return(
            <div className="well card media" key={comment.id}>
                <div className="media-left">
                    <Avatar src={comment.user.avatar_url}/>
                </div>
                <div className="media-body">
                    <p>
                        <Link to={`/member/${comment.user.id}/`}>{comment.user.display_name}</Link>
                        <TimeAgo date={moment.utc(comment.created_at).local().format()} className="pull-right"/>
                    </p>
                    <div dangerouslySetInnerHTML={{__html: comment.body}}/>
                    {comment.uploads.length?(<Attachments attachments={comment.uploads}/>):null}
                </div>
            </div>
        );
    }

    renderAction(id, user_id, user_full_name, avatar_url, created_at, body, summary) {
        return(
            <div className="well card media" key={id}>
                <div className="media-left">
                    <Avatar src={avatar_url}/>
                </div>
                <div className="media-body">
                    <p>
                        {user_id?(
                            <Link to={`/member/${user_id}/`}>{user_full_name}</Link>
                        ):(
                            <span>{user_full_name}</span>
                        )}
                        {summary?(<span> {summary}</span>):null}

                        <TimeAgo date={moment.utc(created_at).local().format()} className="pull-right"/>
                    </p>
                    <div>{body}</div>
                </div>
            </div>
        );
    }

    renderAcitivity(item) {
        let object = item.activity;
        let activity_type = item.activity_type;
        switch (item.action) {
            case 'comment':
                return this.renderComment(object);
                break;
            case 'add':
                if(activity_type == 'participation') {
                    let creator = object.details.created_by;
                    let participant = object.details.user;
                    let body = (
                        <div>
                            <span>Added a participant: </span>
                            <Link to={`/member/${participant.id}/`}>{participant.display_name}</Link>
                        </div>
                    );
                    return this.renderAction(
                        item.id, creator.id, creator.display_name, creator.avatar_url, object.created_at, body
                    );
                }
                break;
            case 'report':
                if(activity_type == 'integration_activity') {
                    let summary = object.url?(<a href={object.url} target="_blank">{object.summary}</a>):object.summary;
                    let body = (
                        <div>
                            {object.title || object.body}
                            {!(object.title || object.body) && object.url?(
                                <div><a href={object.url} target="_blank">{object.url}</a></div>
                            ):null}
                        </div>
                    );

                    return this.renderAction(
                        item.id, null, object.user_display_name, object.avatar_url, object.created_at, body, summary
                    );
                }
                break;
            default:
                break;
        }
        return null;
    }
    render() {
        const { Task, TaskActions } = this.props;
        return (
            Task.detail.activity.isFetching?
                (<Progress/>)
                :
                (<div className="comment-list">
                    {<LoadMore url={Task.detail.activity.next} callback={TaskActions.listMoreTaskActivity}
                              loading={Task.detail.activity.isFetchingMore} direction="up" text="Show older comments"/>}

                    {Task.detail.activity.items.map((item) => {
                        return this.renderAcitivity(item);
                        })}
                </div>)

        );
    }
}
