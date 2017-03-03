import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import TimeAgo from 'react-timeago';
import { ProgressBar } from 'react-bootstrap';
import Progress from './status/Progress';
import LoadMore from './status/LoadMore';
import Avatar from './Avatar';
import Attachments from './Attachments';
import randomstring from 'randomstring';

import { PROGRESS_EVENT_TYPE_MILESTONE, PROGRESS_EVENT_TYPE_SUBMIT } from '../constants/Api';
import { isAuthenticated, getUser } from '../utils/auth';

export function scrollList (listId) {
    var activity_list = $(`#list${listId}.activity-list`);
    activity_list.scrollTop(activity_list.find('.item-wrapper').height());
}

export default class ActivityList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {listId: randomstring.generate()};
    }

    componentDidMount() {
        scrollList(this.state.listId);
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.activities && (!prevProps.activities || this.props.activities.length != prevProps.activities.length)) {
            scrollList(this.state.listId);
        }
    }

    cleanActivity(item) {
        let object = item.activity;
        let activity_type = item.activity_type;
        var creator = null;
        var created_at = item.timestamp;
        var body = null;
        var summary = null;
        var uploads = null;
        var more = null;

        switch (item.action) {
            case 'send':
                if(activity_type == 'message') {
                    creator = object.sender || object.user;
                    created_at = object.created_at;
                    body = (<div dangerouslySetInnerHTML={{__html: object.html_body || object.body}}/>);
                    uploads = object.attachments;
                }
                break;
            case 'comment':
                creator = object.user;
                created_at = object.created_at;
                body = (<div dangerouslySetInnerHTML={{__html: object.html_body}}/>);
                uploads = object.uploads;
                break;
            case 'upload':
                creator = object.user;
                created_at = object.created_at;
                uploads = [object];
                break;
            case 'add':
                if(activity_type == 'participation') {
                    creator = object.created_by;
                    created_at = object.created_at;
                    let participant = object.details.user;
                    body = (
                        <div>
                            <div>Added a participant:</div>
                            <Avatar src={participant.avatar_url} size="xs"/>
                            <Link to={`/people/${participant.username}/`}>{participant.display_name}</Link>
                        </div>
                    );
                }
                break;
            case 'create':
                if(activity_type == 'progress_event') {
                    creator = object.created_by || {
                            id: 'tunga',
                            username: null,
                            display_name: 'Tunga Bot',
                            avatar_url: 'https://tunga.io/icons/Tunga_squarex150.png'
                        };
                    created_at = object.created_at;
                    body = (
                        <div>
                            {[PROGRESS_EVENT_TYPE_MILESTONE, PROGRESS_EVENT_TYPE_SUBMIT].indexOf(object.type) > -1?(
                                <div><i className={"fa fa-flag"+((object.type==4)?'-checkered':'-o')}/> Created a milestone:</div>
                            ):null}
                            <Link to={`/work/${object.task}/event/${object.id}/`}>
                                {object.title || (<span><i className="fa fa-flag-o"/> Scheduled an update</span>)}
                            </Link>
                            <div>Due: {moment.utc(object.due_at).local().format('Do, MMMM YYYY')}</div>
                        </div>
                    );
                }
                break;
            case 'report':
                if(activity_type == 'progress_report') {
                    creator = object.user;
                    created_at = object.created_at;
                    uploads = object.uploads;
                    more = {
                        link: `/work/${object.details.event.task}/event/${object.event}/`,
                        text: 'View full report'
                    };
                    let progress = object.percentage || 0;
                    body = (
                        <div>
                            <p><i className="fa fa-newspaper-o"/> Progress report: </p>
                            <Link to={`/work/${object.details.event.task}/event/${object.event}/`}>
                                {object.details.event.title || 'Scheduled Update'}
                            </Link>
                            <div>Status: {object.status_display}</div>
                            <div>
                                <ProgressBar bsStyle="success" now={progress} label={`${progress}% Completed`} />
                            </div>
                            {object.accomplished?(
                                <div dangerouslySetInnerHTML={{__html: object.accomplished}}/>
                            ):null}
                        </div>
                    );
                } else if(activity_type == 'integration_activity') {
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
            return {id: item.id, type: activity_type, user: creator, created_at, body, summary, uploads, more};
        }
        return null;
    }

    renderThread(thread) {
        if(!thread.first) {
            return null;
        }

        const { last_read } = this.props;
        let activity = thread.first;
        let day_format = 'd/MM/YYYY';
        var last_sent_day = '';
        let today = moment.utc().local().format(day_format);

        let is_current_user = (activity.user.id == getUser().id) || (!isAuthenticated() && activity.user.inquirer);
        let display_name = is_current_user?'Me':activity.user.display_name;

        let avatar_div = (
            <div className={is_current_user?"media-right":"media-left"}>
                <Avatar src={activity.user.avatar_url}/>
            </div>
        );

        return(
            <div key={activity.id} id={"activity" + activity.id}
                 className={
                 "media message" +
                 (last_read != null && activity.user.id != getUser().id && last_read < activity.id?' new':'') +
                 (is_current_user?' pull-right clearfix':'')
                 }>
                {is_current_user?null:avatar_div}
                <div className="media-body">
                    <div className="body">
                        <p>
                            {activity.user.id && activity.user.username?(
                                <Link to={`/people/${activity.user.username}/`}>{display_name}</Link>
                            ):(
                                <span className="username">{display_name}</span>
                            )}
                            {activity.summary?(<span> {activity.summary}</span>):null}

                            <TimeAgo date={moment.utc(activity.created_at).local().format()} className="pull-right"/>
                        </p>
                        <div>{activity.body}</div>
                        {activity.uploads && activity.uploads.length?(
                            <Attachments attachments={activity.uploads}/>
                        ):null}
                        {activity.more?(
                            <div className="clearfix">
                                <Link to={activity.more.link} className="pull-right">{activity.more.text || 'Read more'}</Link>
                            </div>
                        ):null}
                    </div>

                    {thread.others?(
                        thread.others.map(other_msg => {
                            let sent_day = moment.utc(other_msg.created_at).local().format(day_format);
                            let msg = (
                                <div id={"activity" + other_msg.id} key={"activity" + other_msg.id}
                                     className={['message', 'comment', 'upload'].indexOf(other_msg.type) > -1?"sub-message":"sub-thread"} >
                                    {sent_day == last_sent_day || sent_day != today || activity.summary?null:(
                                        <p>
                                            {activity.summary?(<span> {activity.summary}</span>):null}
                                            <TimeAgo date={moment.utc(other_msg.created_at).local().format()} className="pull-right"/>
                                        </p>
                                    )}
                                    <div>{other_msg.body}</div>
                                    {other_msg.uploads && other_msg.uploads.length?(<Attachments attachments={other_msg.uploads}/>):null}
                                    {other_msg.more?(
                                        <div className="clearfix">
                                            <Link to={other_msg.more.link} className="pull-right">{other_msg.more.text || 'Read more'}</Link>
                                        </div>
                                    ):null}
                                </div>
                            );

                            last_sent_day = sent_day;
                            return msg;
                        })
                    ):null}
                </div>
                {is_current_user?avatar_div:null}
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
                (<div id={`list${this.state.listId}`} className="activity-list">
                    <div className="item-wrapper">
                        {<LoadMore url={loadMoreUrl} callback={loadMoreCallback}
                                   loading={isLoadingMore} direction="up" text={loadMoreText || "Show older activity"}/>}

                        {activities && activities.map((item, idx, all_msgs) => {
                            var activity = this.cleanActivity(item);
                            var msgs = [];
                            if(activity) {
                                if(activity.user.id != null && activity.user.id == last_sender) {
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
                    </div>
                </div>)

        );
    }
}
