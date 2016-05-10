import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import TimeAgo from 'react-timeago'
import Progress from './status/Progress'
import LoadMore from './status/LoadMore'
import Avatar from './Avatar'

export default class CommentList extends React.Component {

    componentDidMount() {
        const { CommentActions, filter } = this.props;
        if(filter) {
            CommentActions.listComments(filter);
        }
    }

    render() {
        const { Comment, CommentActions } = this.props;
        return (
            <div>
                {Comment.list.isFetching?
                    (<Progress/>)
                    :
                    (<div>
                        <LoadMore url={Comment.list.next} callback={CommentActions.listMoreComments}
                                  loading={Comment.list.isFetchingMore} direction="up" text="Show older comments"/>

                        {Comment.list.comments.map((comment) => {
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
