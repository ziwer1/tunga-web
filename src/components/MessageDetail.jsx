import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import TimeAgo from 'react-timeago'
import TagList from './TagList'
import Progress from './status/Progress'
import MessageList from './MessageList'
import ReplySection from '../containers/ReplySection'
import Avatar from './Avatar'
import Attachments from './Attachments'

export default class MessageDetail extends React.Component {

    componentDidMount() {
        const { MessageActions } = this.props;
        MessageActions.retrieveMessage(this.props.params.id);
        MessageActions.updateMessageRead(this.props.params.id);
    }

    render() {
        const { Message, MessageActions, Auth } = this.props;
        const { message } = Message.detail;

        return (
            <div>
                {Message.detail.isRetrieving?
                    (<Progress/>)
                    :(message.id?(
                <div className="message-list">
                    <h3>{message.subject}</h3>
                    <div className="well card media">
                        <div className="media-left">
                            <Avatar src={message.details?(message.details.user.avatar_url):null}/>
                        </div>
                        <div className="media-body">
                            <p>
                                {message.details?(
                                <Link to={`/member/${message.user}/`}>{message.details.user.display_name}</Link>
                                    ):''}
                                <TimeAgo date={moment.utc(message.created_at).local().format()} className="pull-right"/>
                            </p>
                            <p>{message.body}</p>
                            {message.attachments.length?(<Attachments attachments={message.attachments}/>):null}
                        </div>
                    </div>

                    <ReplySection message={message}/>
                </div>
                    ):null)}
            </div>

        );
    }
}
