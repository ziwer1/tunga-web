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

    constructor(props) {
        super(props);
        this.state = {view: 'messages'};
    }

    componentDidMount() {
        const { ChannelActions } = this.props;
        ChannelActions.retrieveChannel(this.props.params.id);
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.params.id != prevProps.params.id) {
            const { ChannelActions } = this.props;
            ChannelActions.retrieveChannel(this.props.params.id);
            this.onViewChange('messages');
        }
    }

    onViewChange(view) {
        this.setState({view});
    }

    render() {
        const { Auth, Channel, Message, MessageActions } = this.props;
        const { channel } = Channel.detail;

        return (Channel.detail.isRetrieving?
                (<Progress/>)
                :(
                channel.id?(
                    <div className="chatbox">
                        <div className="chatbox-top clearfix">
                            <div className="chat-actions pull-right">
                                <div className="btn-group btn-choices select pull-right" role="group">
                                    <button className="btn"
                                            onClick={this.onViewChange.bind(this, 'messages')}>
                                        <i className="fa fa-comments"/>
                                    </button>
                                    <button className="btn"
                                            onClick={this.onViewChange.bind(this, 'attachments')}>
                                        <i className="fa fa-paperclip"/>
                                    </button>
                                </div>
                                {this.state.view == 'messages'?(
                                <SearchBox placeholder="Search messages"
                                           filter={{channel: channel.id}}
                                           onSearch={MessageActions.listMessages}
                                           count={Message.list.count}/>
                                    ):null}
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
                            {this.state.view == 'attachments'?(
                            <div className="attachment-list">
                                {channel.attachments?(
                                <div>
                                    <strong>Attachments</strong>
                                    {channel.attachments.map(upload => {
                                        return (
                                        <div key={upload.id} className="file">
                                            <a href={upload.url}><i className="fa fa-download"/> {upload.name} <strong>[{upload.display_size}]</strong></a>
                                        </div>
                                            );
                                        })}
                                </div>
                                    ):null}
                            </div>
                                ):(
                            <MessageList Auth={Auth} channel={channel} Message={Message}
                                         MessageActions={MessageActions} filters={{channel: channel.id}}/>
                                )}
                        </div>
                        <MessageForm Auth={Auth} channel={channel} Message={Message} MessageActions={MessageActions}/>
                    </div>
                ):null
            )
        );
    }
}
