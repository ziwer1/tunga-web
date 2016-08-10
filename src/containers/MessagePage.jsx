import React from 'react';
import { Link } from 'react-router';

import SearchBox from '../components/SearchBox';
import Progress from '../components/status/Progress';
import LoadMore from '../components/status/LoadMore';
import Avatar from '../components/Avatar';
import connect from '../utils/connectors/ChannelConnector';

export function resizeOverviewBox() {
    var w_h = $(window).height();
    var nav_h = $('nav.navbar').height();
    var wf_h = $('.chat-head').height();
    var t_h = nav_h + wf_h + 90;

    if(w_h > t_h) {
        $('.chat-overview').css('height', (w_h - t_h)+'px');
    }
}

class MessagePage extends React.Component {

    componentDidMount() {
        resizeOverviewBox();
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
                        <SearchBox placeholder="Search" onSearch={ChannelActions.listChannels} count={Channel.list.count}/>
                        <div>
                            <Link to="/conversation/start/"><i className="fa fa-plus"/> Start a new conversation</Link>
                        </div>
                        {Channel.list.isFetching?(
                        <Progress/>
                            ):(
                        <div className="list-box">
                            <div className="channel-list">
                                {Channel.list.ids.map((id) => {
                                    let channel = Channel.list.channels[id];
                                    return(
                                    <Link to={`/conversation/${channel.id}/`} className="media" activeClassName="active">
                                        <div className="media-left">
                                            <Avatar src={channel.user?channel.user.avatar_url:null}
                                                    icon={channel.user?null:"glypichon-comment"}
                                                    badge={channel.new || null}/>
                                        </div>
                                        <div className="media-body channel-details">
                                            {channel.user?(
                                                <div>{channel.user.display_name}</div>
                                            ):null}
                                            <div>{channel.subject} </div>
                                            <div style={{fontSize: '90%'}}>{channel.user?null:`${channel.participants.length} people`}</div>
                                        </div>
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
