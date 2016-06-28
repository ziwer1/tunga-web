import React from 'react'
import { Link, IndexLink } from 'react-router'
import { Modal } from 'react-bootstrap'
import moment from 'moment'
import TagList from './TagList'
import Progress from './status/Progress'
import Avatar from './Avatar'
import LargeModal from './ModalLarge'
import ComponentWithModal from './ComponentWithModal'
import MessageForm from './MessageForm'
import MessageList from './MessageList'
import SearchBox from './SearchBox'
import { parse_task_status } from '../utils/tasks'


export default class ChatBox extends React.Component {

    componentDidMount() {
        const { ChannelActions } = this.props;
        ChannelActions.retrieveChannel(this.props.params.id);
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.params.id != prevProps.params.id) {
            const { ChannelActions } = this.props;
            ChannelActions.retrieveChannel(this.props.params.id);
        }
    }

    render() {
        const { Auth, Channel, Message, MessageActions } = this.props;
        const { channel } = Channel.detail;

        return (Channel.detail.isRetrieving?
                (<Progress/>)
                :(
                channel.id?(
                    <div className="chatbox">
                        <div className="chatbox-top">
                            <div className="chat-actions pull-right">
                                <SearchBox filter={{channel: channel.id}} placeholder="Search for messages" onSearch={MessageActions.listMessages}/>
                            </div>
                            <h4>
                                {channel.user?(
                                <span><Avatar src={channel.user.avatar_url} size="small"/> {channel.user.display_name}</span>
                                ):null}
                                {channel.user && channel.subject?(
                                <span>: </span>
                                    ):null}
                                <span>{channel.subject} </span>
                                {channel.user?null:`(${channel.participants.length} participants)`}
                            </h4>

                        </div>
                        <div className="list-box">
                            <MessageList Auth={Auth} channel={channel} Message={Message}
                                         MessageActions={MessageActions} filters={{channel: channel.id}}/>
                        </div>
                        <MessageForm Auth={Auth} channel={channel} Message={Message} MessageActions={MessageActions}/>
                    </div>
                ):null
            )
        );
    }
}
