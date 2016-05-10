import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import TimeAgo from 'react-timeago'
import Progress from './status/Progress'
import LoadMore from './status/LoadMore'
import Avatar from './Avatar'
import SearchBox from './SearchBox'

export default class MessageList extends React.Component {

    componentDidMount() {
        const { MessageActions, filter } = this.props;
        if(filter) {
            MessageActions.listMessages({filter});
        }
    }

    render() {
        const { Message, MessageActions, filter } = this.props;
        return (
            <div>
                <SearchBox filter={{filter: filter}} placeholder="Search for messages" onSearch={MessageActions.listMessages}/>
                {Message.list.isFetching?
                    (<Progress/>)
                    :
                    (<div>
                        <div className="message-list">
                            {Message.list.messages.map((message) => {
                                return(
                                <div className={"message"+(message.is_read?'':' new')} key={message.id}>
                                    <Link to={`/message/${message.id}/`}>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Avatar src={message.details.user.avatar_url}/> {message.details.user.display_name}
                                            </div>
                                            <div className="col-md-3">{message.subject}</div>
                                            <div className="col-md-3"><div dangerouslySetInnerHTML={{__html: message.body}}/></div>
                                            <div className="col-md-3">
                                                <TimeAgo date={moment.utc(message.created_at).local().format()} className="pull-right"/>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                    );
                                })}
                            <LoadMore url={Message.list.next} callback={MessageActions.listMoreMessages} loading={Message.list.isFetchingMore}/>
                            {Message.list.messages.length?'':(
                            <div className="alert alert-info">No messages</div>
                                )}
                        </div>
                    </div>)
                    }
            </div>
        );
    }
}
