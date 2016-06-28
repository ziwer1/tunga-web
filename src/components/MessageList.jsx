import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import TimeAgo from 'react-timeago'
import Progress from './status/Progress'
import LoadMore from './status/LoadMore'
import Avatar from './Avatar'
import SearchBox from './SearchBox'
import Attachments from './Attachments'

export default class MessageList extends React.Component {

    componentDidMount() {
        const { MessageActions, filters, search, channel } = this.props;
        MessageActions.listMessages({...filters, search});
        if(channel) {
            setInterval(this.getNewMessages.bind(this), 5000);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.search != this.props.search) {
            const { MessageActions, filters, search } = this.props;
            MessageActions.listMessages({...filters, search});
        }
    }

    getNewMessages() {
        const { Message, MessageActions, search, filters, channel } = this.props;
        if(channel && !Message.list.isFetching && Message.list.messages.length) {
            var since = 0;
            if(Message.list.messages.length) {
                since = Message.list.messages[Message.list.messages.length-1].id;
            }
            MessageActions.listMessages({...filters, search, channel: channel.id, since});
        }
    }

    render() {
        const { Message, MessageActions, filters, channel } = this.props;
        return (
            <div className="message-list">
                {Message.list.isFetching?
                    (<Progress/>)
                    :
                    (<div>
                        <LoadMore url={Message.list.next} callback={MessageActions.listMoreMessages}
                                  loading={Message.list.isFetchingMore} direction="up" text="Show older messages"/>

                        {Message.list.messages.map((message) => {
                            return(
                            <div key={message.id} id={"message" + message.id}
                                 className={"well card media message" + (channel && Message.list.last_read < message.id?' new':'')}>
                                <div className="media-left">
                                    <Avatar src={message.user.avatar_url}/>
                                </div>
                                <div className="media-body">
                                    <p>
                                        <Link to={channel?`/member/${message.user.id}/`:`/channel/${message.channel}/#message${message.id}`}>{message.user.display_name}</Link>
                                        <TimeAgo date={moment.utc(message.created_at).local().format()} className="pull-right"/>
                                    </p>
                                    <div dangerouslySetInnerHTML={{__html: message.body}}/>
                                    {message.attachments.length?(<Attachments attachments={message.attachments}/>):null}
                                </div>
                            </div>
                                );
                            })}
                        {Message.list.messages.length?'':(
                        <div className="alert alert-info">No messages</div>
                            )}
                    </div>)
                    }
            </div>
        );
    }
}
