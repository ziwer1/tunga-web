import React from 'react';
import ChannelView from '../components/Channel';
import SupportChannelForm from '../components/SupportChannelForm';
import ChatBox from '../components/ChatBox';

import connect from '../utils/connectors/ChannelConnector';

export function resizeOverviewBox() {
    var w_h = $(window).height();
    var nav_h = $('nav.navbar').height();
    var wf_h = $('.chat-head').height();
    var t_h = nav_h + wf_h + 60;

    if(w_h > t_h) {
        $('.chat-overview').css('height', (w_h - t_h)+'px');
    }
}


export default class ChatWindow extends React.Component {

    constructor(props) {
        super(props);
        var lastChannel = null;
        if (typeof(Storage) !== "undefined") {
            try {
                lastChannel = JSON.parse(window.localStorage.channel);
            } catch (e) {
                lastChannel = null;
            }
        }
        this.state = {channel: null, lastChannel: lastChannel, new: 0};
    }

    componentWillMount() {
        this.intervals = [];
    }

    componentDidMount() {
        resizeOverviewBox();
        $(window).resize(resizeOverviewBox);

        this.setInterval(this.getNewMessages.bind(this), 10000);

        if(this.props.channelId) {
            this.openChannel({id: this.props.channelId});
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.Channel.detail.channel.id) {
            var currentChannel = this.getCurrentChannel();
            const { channel } = nextProps.Channel.detail;

            if(nextProps.Channel.detail.isSaved != this.props.Channel.detail.isSaved ||
                (currentChannel && nextProps.Channel.detail.channel.id == currentChannel.id)) {
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
        this.saveChannel(this.getCurrentChannel() || this.state.lastChannel);
        this.intervals.map(clearInterval);
    }

    setInterval() {
        this.intervals.push(setInterval.apply(null, arguments));
    }

    getCurrentChannel() {
        return (typeof (this.state.channel) === "object")?this.state.channel:null;
    }

    saveChannel(channel) {
        if (typeof(Storage) !== "undefined") {
            try {
                window.localStorage.channel = JSON.stringify(channel);
            } catch (e) {
                window.localStorage.channel = null;
            }
        }
    }

    startChannel() {
        this.setState({channel: 'new', lastChannel: this.getCurrentChannel() || this.state.lastChannel});
    }

    openChannel(channel) {
        this.setState({channel, lastChannel: this.getCurrentChannel() || this.state.lastChannel});
    }

    minimizeWindow() {
        this.setState({channel: null, lastChannel: this.getCurrentChannel() || this.state.lastChannel});
    }

    closeWindow() {
        this.setState({channel: null, lastChannel: null});
        this.saveChannel(null);
    }

    getNewMessages() {
        const { ChannelActions } = this.props;
        const lastChannel = this.state.lastChannel;
        if(!this.state.channel && lastChannel && lastChannel.id) {
            var since = lastChannel.last_read || 0;
            ChannelActions.listChannelActivity(lastChannel.id, {since}, false);
        }
    }

    render() {
        const { Auth, Channel, Message, ChannelActions, MessageActions } = this.props;
        const { channel } = this.state;

        return (
            <div id="chat-widget">
                {channel?(
                    <div id="chat-window">
                        <div className="chat-close">
                            <button className="btn btn-borderless"
                                    activeClassName="active" title="Minimize"
                                    onClick={this.minimizeWindow.bind(this)}>
                                <i className="fa fa-minus fa-lg"/>
                            </button>
                            {this.state.channel && (typeof(this.state.channel) === "object")?(
                                <button className="btn btn-borderless"
                                        activeClassName="active" title="Close"
                                        onClick={this.closeWindow.bind(this)}>
                                    <i className="fa fa-times fa-lg"/>
                                </button>
                            ):null}
                        </div>
                        <div className="chat-overview overview">
                            <div className="mainbox">
                                {channel == 'new' && !channel.id?(
                                    <SupportChannelForm
                                        Auth={Auth}
                                        Channel={Channel}
                                        Message={Message}
                                        ChannelActions={ChannelActions}
                                        MessageActions={MessageActions}/>
                                ):(
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
                                )}
                            </div>
                        </div>
                    </div>
                ):(
                    <div>
                        <button className="btn chat-btn" onClick={this.startChannel.bind(this)}>
                            <i className="fa fa-question-circle fa-lg"/> Need Help? Chat with us.
                        </button>
                        {this.state.lastChannel && (typeof(this.state.lastChannel) === "object")?(
                            <div className="previous-chat chat-btn">
                                <button
                                    className="btn btn-borderless"
                                    onClick={this.openChannel.bind(this, this.state.lastChannel)}>
                                    <i className="fa fa-comments fa-lg"/>
                                    <span> {this.state.lastChannel.subject || this.state.lastChannel.alt_subject} </span>
                                    {this.state.new?(<span className="badge">{this.state.new}</span>):null}
                                </button>
                                <button className="btn btn-borderless btn-close"
                                        activeClassName="active" title="Close"
                                        onClick={this.closeWindow.bind(this)}>
                                    <i className="fa fa-times fa-lg"/>
                                </button>
                            </div>
                        ):null}
                    </div>
                )}

            </div>
        );
    }
}

export default connect(ChatWindow);
