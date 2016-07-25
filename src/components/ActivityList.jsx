import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import TimeAgo from 'react-timeago'
import Progress from './status/Progress'
import LoadMore from './status/LoadMore'
import Avatar from './Avatar'
import Attachments from './Attachments'

export default class ActivityList extends React.Component {

    cleanActivity(item) {
        let object = item.activity;
        let activity_type = item.activity_type;
        var creator = null;
        var created_at = item.timestamp;
        var body = null;
        var summary = null;
        var uploads = null;
        switch (item.action) {
            case 'send':
                if(activity_type == 'message') {
                    creator = object.user;
                    created_at = object.created_at;
                    body = (<div dangerouslySetInnerHTML={{__html: object.body}}/>);
                    uploads = object.attachments;
                }
                break;
            case 'comment':
                creator = object.user;
                created_at = object.created_at;
                body = (<div dangerouslySetInnerHTML={{__html: object.body}}/>);
                uploads = object.uploads;
                break;
            case 'upload':
                creator = object.user;
                created_at = object.created_at;
                uploads = [object];
                break;
            case 'add':
                if(activity_type == 'participation') {
                    creator = object.details.created_by;
                    created_at = object.created_at;
                    let participant = object.details.user;
                    body = (
                        <div>
                            <span>Added a participant: </span>
                            <Link to={`/member/${participant.id}/`}>{participant.display_name}</Link>
                        </div>
                    );
                }
                break;
            case 'report':
                if(activity_type == 'integration_activity') {
                    creator = {
                        display_name: object.user_display_name,
                        avatar_url: object.avatar_url
                    };
                    created_at = object.created_at;
                    body = (
                        <div>
                            {object.title || object.body}
                            {!(object.title || object.body) && object.url?(
                                <div><a href={object.url} target="_blank">{object.url}</a></div>
                            ):null}
                        </div>
                    );
                    summary = object.url?(<a href={object.url} target="_blank">{object.summary}</a>):object.summary;
                }
                break;
            default:
                break;
        }
        if(creator) {
            return {id: item.id, type: activity_type, user: creator, created_at, body, summary, uploads};
        }
        return null;
    }

    renderThread(thread) {
        if(!thread.first) {
            return null;
        }

        const { Auth, last_read } = this.props;
        let activity = thread.first;
        let day_format = 'd/MM/YYYY';
        var last_sent_day = '';
        let today = moment.utc().local().format(day_format);

        return(
            <div key={activity.id}  id={"activity" + activity.id}
                 className={"well card media message" + (last_read != null && activity.user.id != Auth.user.id && last_read < activity.id?' new':'')}>
                <div className="media-left">
                    <Avatar src={activity.user.avatar_url}/>
                </div>
                <div className="media-body">
                    <p>
                        {activity.user.id?(
                            <Link to={`/member/${activity.user.id}/`}>{activity.user.display_name}</Link>
                        ):(
                            <span>{activity.user.display_name}</span>
                        )}
                        {activity.summary?(<span> {activity.summary}</span>):null}

                        <TimeAgo date={moment.utc(activity.created_at).local().format()} className="pull-right"/>
                    </p>
                    <div>{activity.body}</div>
                    {activity.uploads && activity.uploads.length?(<Attachments attachments={activity.uploads}/>):null}

                    {thread.others?(
                        thread.others.map(other_msg => {
                            let sent_day = moment.utc(other_msg.created_at).local().format(day_format);
                            let msg = (
                                <div style={{marginTop: '5px'}}>
                                    {sent_day == last_sent_day || sent_day != today || activity.summary?null:(
                                        <p>
                                            {activity.summary?(<span> {activity.summary}</span>):null}
                                            <TimeAgo date={moment.utc(other_msg.created_at).local().format()} className="pull-right"/>
                                        </p>
                                    )}
                                    <div>{other_msg.body}</div>
                                    {other_msg.uploads && other_msg.uploads.length?(<Attachments attachments={other_msg.uploads}/>):null}
                                </div>
                            );

                            last_sent_day = sent_day;
                            return msg;
                        })
                    ):null}
                </div>
            </div>
        );
    }

    render() {
        const { activities, isLoading, isLoadingMore, loadMoreUrl, loadMoreCallback, loadMoreText } = this.props;
        var last_sender = null;
        var thread = {};

        return (
            isLoading?
                (<Progress/>)
                :
                (<div className="activity-list">
                    {<LoadMore url={loadMoreUrl} callback={loadMoreCallback}
                              loading={isLoadingMore} direction="up" text={loadMoreText || "Show older activity"}/>}

                    {activities.map((item, idx, all_msgs) => {
                        var activity = this.cleanActivity(item);
                        var msgs = [];
                        if(activity) {
                            if(activity.user.id == last_sender) {
                                thread.others = [...thread.others, activity];
                            } else {
                                msgs = [...msgs, this.renderThread(thread)];
                                thread.first = activity;
                                thread.others = [];
                            }

                            last_sender = activity.user.id;
                        }

                        if(idx+1 == all_msgs.length) {
                            msgs = [...msgs, this.renderThread(thread)];
                        }
                        return msgs;
                        })}
                </div>)

        );
    }
}
