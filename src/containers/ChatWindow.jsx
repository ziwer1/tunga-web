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
        this.state = {channel: null, lastChannel: lastChannel};
    }

    componentDidMount() {
        resizeOverviewBox();
        $(window).resize(resizeOverviewBox);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.Channel.detail.isSaved != this.props.Channel.detail.isSaved && nextProps.Channel.detail.channel.id) {
            const { channel } = nextProps.Channel.detail;
            this.setState({channel});
            this.saveChannel(channel);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        resizeOverviewBox();
    }

    componentWillUnmount() {
        this.saveChannel(this.getCurrentChannel() || this.state.lastChannel);
    }

    getCurrentChannel() {
        return (typeof (this.state.channel) === "object")?this.state.channel:null;
    }

    saveChannel(channel) {
        if (typeof(Storage) !== "undefined") {
            try {
                window.localStorage.channel = JSON.stringify(channel);
            } catch (e) {
                // Failed to save
            }
        }
    }

    startChannel() {
        this.setState({channel: 'new', lastChannel: this.getCurrentChannel() || this.state.lastChannel});
    }

    openChannel(channel) {
        this.setState({channel, lastChannel: this.getCurrentChannel() || this.state.lastChannel});
    }

    closeWindow() {
        this.setState({channel: null, lastChannel: this.getCurrentChannel() || this.state.lastChannel});
    }

    render() {
        const { Auth, Channel, Message, ChannelActions, MessageActions } = this.props;
        const { channel } = this.state;

        return (
            <div id="chat-widget">
                {channel?(
                    <div id="chat-window">
                        <button className="btn btn-borderless chat-close fa-lg"
                              activeClassName="active" title="Close"
                                onClick={this.closeWindow.bind(this)}>
                            <i className="fa fa-minus"/>
                        </button>
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
                        <button className="btn chat-btn" onClick={this.startChannel.bind(this)}> <i className="fa fa-question-circle fa-lg"/> Need Help? Chat with us.</button>
                        {this.state.lastChannel && (typeof(this.state.lastChannel) === "object")?(
                            <button className="btn chat-btn" onClick={this.openChannel.bind(this, this.state.lastChannel)}> <i className="fa fa-comments fa-lg"/> {this.state.lastChannel.subject || this.state.lastChannel.alt_subject}</button>
                        ):null}
                    </div>
                )}

            </div>
        );
    }
}

export default connect(ChatWindow);
