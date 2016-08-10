import React from 'react';
import { Link } from 'react-router';
import Progress from './status/Progress';
import Avatar from './Avatar';
import SearchBox from './SearchBox';


export default class ChatBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {filters: null};
    }

    componentWillMount() {
        this.intervals = [];
    }

    componentDidMount() {
        const { ChannelActions } = this.props;
        ChannelActions.retrieveChannel(this.props.params.channelId);
        ChannelActions.listChannelActivity(this.props.params.channelId);

        if(this.props.params.channelId) {
            this.setInterval(this.getNewMessages.bind(this), 10000);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.params.channelId != prevProps.params.channelId) {
            const { ChannelActions } = this.props;
            ChannelActions.retrieveChannel(this.props.params.channelId);
            ChannelActions.listChannelActivity(this.props.params.channelId);
        }
    }

    componentWillUnmount() {
        this.intervals.map(clearInterval);
    }

    setInterval() {
        this.intervals.push(setInterval.apply(null, arguments));
    }

    getView() {
        if(this.props.params && this.props.params.channelView) {
            return this.props.params.channelView;
        }
        return null;
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
            ChannelActions.listChannelActivity(this.props.params.channelId, {since, ...filters, search, ...this.state.filters});
        }
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
        this.setState({filters});
        const { Channel, ChannelActions } = this.props;
        const { channel } = Channel.detail;
        ChannelActions.listChannelActivity(channel.id, filters);
    }

    renderChildren() {
        return React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {
                Auth: this.props.Auth,
                Channel: this.props.Channel,
                Message: this.props.Message,
                channel: this.props.Channel.detail.channel,
                ChannelActions: this.props.ChannelActions,
                MessageActions: this.props.MessageActions
            });
        }.bind(this));
    }

    render() {
        const { Channel } = this.props;
        const { channel } = Channel.detail;

        return (Channel.detail.isRetrieving?
                (<Progress/>)
                :(
                channel.id && channel.id == this.props.params.channelId?(
                    <div className="chatbox">
                        <div className="chatbox-top clearfix">
                            <div className="chat-actions pull-right">
                                <div className="btn-group btn-choices select pull-right" role="group">
                                    <Link to={`/conversation/${channel.id}`} className="btn btn-borderless">
                                        <i className="fa fa-comments"/>
                                    </Link>
                                    <Link to={`/conversation/${channel.id}/files`} className="btn btn-borderless">
                                        <i className="fa fa-paperclip"/>
                                    </Link>
                                    <div className="dropdown" style={{display: 'inline-block'}}>
                                        <button className="btn btn-borderless dropdown-toggle" type="button" id="chat-overflow" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                            <i className="fa fa-ellipsis-v"/>
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="chat-overflow">
                                            <li>
                                                <Link to={`/conversation/${channel.id}/edit`}
                                                      id="edit-channel">
                                                    <i className="fa fa-pencil-square-o"/> Edit
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={`/conversation/${channel.id}/people`}
                                                      id="edit-channel">
                                                    <i className="glyphicon glyphicon-user"/> People
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                {this.getView() == 'messages'?(
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
                                    <div><Link to={`/conversation/${channel.id}/people/`}>{channel.user?null:`${channel.participants.length} people`}</Link></div>
                                </div>
                            </div>
                            <div className="clearfix"></div>
                        </div>
                        {channel.id?this.renderChildren():null}
                    </div>
                ):null
            )
        );
    }
}
