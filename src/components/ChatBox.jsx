import React from 'react'
import Progress from './status/Progress'
import Avatar from './Avatar'
import MessageForm from './MessageForm'
import ActivityList from './ActivityList'
import SearchBox from './SearchBox'


export default class ChatBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {view: 'messages'};
    }

    componentWillMount() {
        this.intervals = [];
    }

    componentDidMount() {
        const { ChannelActions } = this.props;
        ChannelActions.retrieveChannel(this.props.params.channelId);
        ChannelActions.listChannelActivity(this.props.params.channelId);

        if(this.props.params.channelId) {
            this.setInterval(this.getNewMessages.bind(this), 5000);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.params.channelId != prevProps.params.channelId) {
            const { ChannelActions } = this.props;
            ChannelActions.retrieveChannel(this.props.params.channelId);
            ChannelActions.listChannelActivity(this.props.params.channelId);
            this.onViewChange('messages');
        }
    }

    componentWillUnmount() {
        this.intervals.map(clearInterval);
    }

    setInterval() {
        this.intervals.push(setInterval.apply(null, arguments));
    }

    getNewMessages() {
        const { Channel, ChannelActions, search, filters } = this.props;
        if(this.props.params.channelId && !Channel.detail.activity.isFetching && Channel.detail.activity.items.length) {
            var since = 0;
            if(Channel.detail.activity.items.length) {
                since = Channel.detail.activity.items[Channel.detail.activity.items.length-1].id;
                if(since === undefined || since === null) {
                    [...Channel.detail.activity.items].reverse().some(item => {
                        if(item.id) {
                            since = item.id;
                        }
                        return item.id;
                    });
                }
            }
            ChannelActions.listChannelActivity(this.props.params.channelId, {since, ...filters, search});
        }
    }

    onViewChange(view) {
        this.setState({view});
    }

    onSendMessage(body, attachments) {
        const { MessageActions, Channel } = this.props;
        const { channel } = Channel.detail;
        MessageActions.createMessage({channel: channel.id, body}, attachments);
    }

    onUpload(files) {
        const { Channel, ChannelActions } = this.props;
        const { channel } = Channel.detail;
        ChannelActions.updateChannel(channel.id, null, files);
    }

    onSearch(filters) {
        const { Channel, ChannelActions } = this.props;
        const { channel } = Channel.detail;
        ChannelActions.listChannelActivity(channel.id, filters);
    }

    render() {
        const { Auth, Channel, ChannelActions, Message } = this.props;
        const { channel, attachments } = Channel.detail;

        return (Channel.detail.isRetrieving?
                (<Progress/>)
                :(
                channel.id?(
                    <div className="chatbox">
                        <div className="chatbox-top clearfix">
                            <div className="chat-actions pull-right">
                                <div className="btn-group btn-choices select pull-right" role="group">
                                    <button className="btn btn-borderless"
                                            onClick={this.onViewChange.bind(this, 'messages')}>
                                        <i className="fa fa-comments"/>
                                    </button>
                                    <button className="btn btn-borderless"
                                            onClick={this.onViewChange.bind(this, 'attachments')}>
                                        <i className="fa fa-paperclip"/>
                                    </button>
                                </div>
                                {this.state.view == 'messages'?(
                                <SearchBox placeholder="Search messages"
                                           onSearch={this.onSearch.bind(this)}
                                           count={Channel.detail.activity.count}/>
                                    ):null}
                            </div>
                            <div className="media">
                                <div className="media-left">
                                    {channel.user?(
                                        <Avatar src={channel.user.avatar_url} />
                                    ):null}
                                </div>
                                <div className="media-body">
                                    {channel.user?(
                                        [<h4>{channel.user.display_name}</h4>,
                                        <div>{channel.subject} </div>]
                                    ):(
                                        <h4>{channel.subject} </h4>
                                    )}
                                    <div>{channel.user?null:`${channel.participants.length} participants`}</div>
                                </div>
                            </div>
                            <div className="clearfix"></div>
                        </div>
                        <div className="list-box">
                            {this.state.view == 'attachments'?(
                            <div className="attachment-list">
                                {attachments?(
                                <div>
                                    <strong>Files</strong>
                                    {attachments.map(upload => {
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
                            <ActivityList
                                Auth={Auth}
                                activities={Channel.detail.activity.items}
                                isLoading={Channel.detail.activity.isFetching}
                                isLoadingMore={Channel.detail.activity.isFetchingMore}
                                loadMoreUrl={Channel.detail.activity.next}
                                loadMoreCallback={ChannelActions.listMoreChannelActivity}
                                loadMoreText="Show older messages"
                                last_read={Channel.detail.last_read}
                            />
                                )}
                        </div>
                        <MessageForm
                            messageCallback={this.onSendMessage.bind(this)}
                            messageSaved={Message.detail.isSaved}
                            uploadCallback={this.onUpload.bind(this)}
                            uploadSaved={Channel.detail.isSaved}
                            isSending={Message.detail.isSaving || Channel.detail.isSaving}/>
                    </div>
                ):null
            )
        );
    }
}
