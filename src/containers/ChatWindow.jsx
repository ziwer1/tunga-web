import React from 'react';
import ChannelView from '../components/Channel';
import SupportChannelForm from '../components/SupportChannelForm';
import ChatBox from '../components/ChatBox';

import connect from '../utils/connectors/ChannelConnector';
import { CHANNEL_TYPES } from '../constants/Api';

export function resizeOverviewBox() {
    var w_h = $(window).height();
    var nav_h = $('nav.navbar').height();
    var wf_h = $('.chat-head').height();
    var t_h = nav_h + wf_h + 120;

    if(w_h > t_h) {
        $('.chat-overview').css('height', (w_h - t_h)+'px');
    }
}


class ChatWindow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {channel: null, new: 0, open: false};
    }

    componentWillMount() {
        this.intervals = [];

        const { Auth } = this.props;
        var channel = null;
        var open = false;
        if(this.props.channelId) {
            channel = {id: this.props.channelId};
            open = true;
        } else if (!Auth.isAuthenticated && typeof(Storage) !== "undefined") {
            try {
                channel = JSON.parse(window.localStorage.channel);
            } catch (e) {
                channel = null;
            }
        }
        this.setState({channel, open});
    }

    componentDidMount() {
        resizeOverviewBox();
        $(window).resize(resizeOverviewBox);

        this.setInterval(this.getNewMessages.bind(this), 10000);

        const { Auth, ChannelActions } = this.props;

        if(Auth.isAuthenticated) {
            ChannelActions.createSupportChannel();
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.Channel.detail.channel.id) {
            var currentChannel = this.getCurrentChannel();
            const { channel } = nextProps.Channel.detail;

            if(
                nextProps.Channel.detail.channel.type == CHANNEL_TYPES.support &&
                ((nextProps.Channel.detail.isSaved != this.props.Channel.detail.isSaved) ||
                (currentChannel && nextProps.Channel.detail.channel.id == currentChannel.id))
            ) {
                this.setState({channel});
                this.saveChannel(channel);
            }
        }

        if(nextProps.Channel.detail.support.new != this.state.new) {
            this.setState({new: nextProps.Channel.detail.support.new});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        resizeOverviewBox();
    }

    componentWillUnmount() {
        this.saveChannel(this.getCurrentChannel());
        this.intervals.map(clearInterval);
    }

    setInterval() {
        this.intervals.push(setInterval.apply(null, arguments));
    }

    getCurrentChannel() {
        return (typeof (this.state.channel) === "object")?this.state.channel:null;
    }

    saveChannel(channel) {
        const { Auth } = this.props;
        if (!Auth.isAuthenticated && typeof(Storage) !== "undefined") {
            try {
                window.localStorage.channel = JSON.stringify(channel);
            } catch (e) {
                window.localStorage.channel = null;
            }
        }
    }

    startChannel() {
        const { Auth, ChannelActions } = this.props;
        if(Auth.isAuthenticated && !this.state.channel) {
            ChannelActions.createSupportChannel();
        }
        this.setState({open: true});
    }

    minimizeWindow() {
        this.setState({open: false});
    }

    closeWindow() {
        this.setState({open: false});
    }

    getNewMessages() {
        const { ChannelActions } = this.props;
        const channel = this.state.channel;
        if(!this.state.open && channel) {
            var since = channel.last_read || 0;
            ChannelActions.listChannelActivity(channel.id, {since}, false);
        }
    }

    render() {
        const { Auth, Channel, Message, ChannelActions, MessageActions } = this.props;
        const { channel } = this.state;

        return (
            <div id="chat-widget">
                {this.state.open?(
                    <div id="chat-window">
                        <div className="chat-overview overview">
                            <div className="mainbox">
                                {channel && channel.id?(
                                    <ChannelView
                                        channelId={channel.id}
                                        channelView="messages"
                                        Auth={Auth}
                                        Channel={Channel}
                                        Message={Message}
                                        ChannelActions={ChannelActions}
                                        MessageActions={MessageActions}>
                                        <ChatBox />
                                    </ChannelView>
                                ):(Auth.isAuthenticated?null:(
                                    <SupportChannelForm
                                        Auth={Auth}
                                        Channel={Channel}
                                        Message={Message}
                                        ChannelActions={ChannelActions}
                                        MessageActions={MessageActions}/>
                                ))}
                            </div>
                        </div>
                    </div>
                ):null}

                <div>
                    {this.state.open?(
                        <button className="btn chat-btn" onClick={this.closeWindow.bind(this)}>
                            <i className="fa fa-times fa-lg"/>
                        </button>
                    ):(
                        <button className="btn chat-btn" onClick={this.startChannel.bind(this)}>
                            <i className={`${Auth.isAuthenticated?'tunga-icon-support':'fa fa-comments fa-lg'}`}/>
                            {this.state.new?(<span className="badge">{this.state.new}</span>):null}
                        </button>
                    )}
                </div>
            </div>
        );
    }
}

export default connect(ChatWindow);
