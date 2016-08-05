import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import TimeAgo from 'react-timeago'
import Progress from './status/Progress'
import LoadMore from './status/LoadMore'
import Avatar from './Avatar'
import Attachments from './Attachments'

export default class ReplyList extends React.Component {

    componentDidMount() {
        const { ReplyActions, filter } = this.props;
        ReplyActions.listReplies(filter);
    }

    render() {
        const { Reply, ReplyActions } = this.props;
        return (
            <div>
                {Reply.list.isFetching?
                    (<Progress/>)
                    :
                    (<div>
                        <LoadMore url={Reply.list.next} callback={ReplyActions.listMoreReplies}
                                  loading={Reply.list.isFetchingMore} direction="up" text="Show older messages"/>

                        {Reply.list.replies.map((reply) => {
                        return(
                        <div className="card media" key={reply.id}>
                            <div className="media-left">
                                <Avatar src={reply.details?reply.details.user.avatar_url:null}/>
                            </div>
                            <div className="media-body">
                                <p>
                                    {reply.details?(
                                    <Link to={`/member/${reply.user}/`}>{reply.details.user.display_name}</Link>
                                        ):''}
                                    <TimeAgo date={moment.utc(reply.created_at).local().format()} className="pull-right"/>
                                </p>
                                <div dangerouslySetInnerHTML={{__html: reply.body}}/>
                                {reply.attachments.length?(<Attachments attachments={reply.attachments}/>):null}
                            </div>
                        </div>
                        );
                        })}
                    </div>)
                    }
            </div>
        );
    }
}
