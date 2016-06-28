import React from 'react'
import { Link } from 'react-router'

import SearchBox from '../components/SearchBox'
import Progress from '../components/status/Progress'
import LoadMore from '../components/status/LoadMore'
import Avatar from '../components/Avatar'
import connect from '../utils/connectors/ChannelConnector'

export function resizeOverviewBox() {
    var w_h = $(window).height();
    var nav_h = $('nav.navbar').height();
    var wf_h = $('.chat-head').height();
    var t_h = nav_h + wf_h + 70;

    if(w_h > t_h) {
        $('.chat-overview').css('height', (w_h - t_h)+'px');
    }
}

class MessagePage extends React.Component {

    componentDidMount() {
        $(document).ready(resizeOverviewBox);
        $(window).resize(resizeOverviewBox);

        const { Auth, ChannelActions } = this.props;
        ChannelActions.listChannels({user: Auth.user.id});
    }

    renderChildren() {
        return React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {
                Auth: this.props.Auth,
                Channel: this.props.Channel,
                Message: this.props.Message,
                ChannelActions: this.props.ChannelActions,
                MessageActions: this.props.MessageActions
            });
        }.bind(this));
    }

    render() {
        const { Channel, ChannelActions } = this.props;

        return (
            <div>
                <div className="chat-head">
                    <h2>Messages</h2>
                </div>

                <div className="chat-overview overview">
                    <div className="sidebox channelbox">
                        <SearchBox placeholder="Search" onSearch={ChannelActions.listChannels}/>
                        <div>
                            <Link to="/channel/start/"><i className="fa fa-plus"/> Start a new conversation</Link>
                        </div>
                        {Channel.list.isFetching?(
                        <Progress/>
                            ):(
                        <div className="list-box">
                            <div className="channel-list">
                                {Channel.list.ids.map((id) => {
                                    let channel = Channel.list.channels[id];
                                    return(
                                    <Link to={`/channel/${channel.id}/`}>
                                        {channel.user?(
                                        <span><Avatar src={channel.user.avatar_url} size="small"/> {channel.user.display_name}</span>
                                            ):null}
                                        {channel.user && channel.subject?(
                                        <span>: </span>
                                            ):null}
                                        <span>{channel.subject} </span>{channel.user?null:`(${channel.participants.length} participants)`}
                                        {channel.new?<span className="badge">{channel.new}</span>:null}
                                    </Link>
                                        );
                                    })}
                            </div>
                            <LoadMore url={Channel.list.next} callback={ChannelActions.listMoreChannels}
                                      loading={Channel.list.isFetchingMore} text="Show more"/>
                        </div>)}
                    </div>
                    <div className="mainbox">
                        {this.renderChildren()}
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(MessagePage);
