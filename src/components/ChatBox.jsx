import React from 'react';
import { Link } from 'react-router';
import Avatar from './Avatar';
import MessageForm from './MessageForm';
import ActivityList from './ActivityList';
import moment from 'moment';

import { getChannelKey } from '../utils/reducers';
import { CHANNEL_TYPES } from '../constants/Api';


export default class ChatBox extends React.Component {

    getView() {
        if(this.props.channelView) {
            return this.props.channelView;
        }
        return null;
    }

    onSendMessage(body, attachments) {
        const { channel, MessageActions } = this.props;
        MessageActions.createMessage({channel: channel.id, body}, attachments);
    }

    onUpload(files) {
        const { channel, ChannelActions } = this.props;
        ChannelActions.updateChannel(channel.id, null, files);
    }

    render() {
        const { channel, Auth, Channel, ChannelActions, Message } = this.props;
        const { attachments } = channel;
        let view = this.getView();
        var activities = Channel.detail.activity.items[getChannelKey(channel.id)] || [];

        /*if(!activities.length && channel.type == CHANNEL_TYPES.support) {
            // Add a welcome message for support channels
            activities.push({
                action: 'send',
                activity_type: 'message',
                activity: {
                    // id: "welcome",
                    sender: {
                        id: 'tunga',
                        username: null,
                        display_name: 'Tunga Support',
                        avatar_url: 'https://tunga.io/icons/Tunga_squarex150.png'
                    },
                    html_body: "<div>Hello David,<br/>How can we help you?.</div>",
                    created_at: moment().format()
                }
            });
        }*/

        return (
            <div className="list-box">
                {view == 'files'?(
                    <div className="attachment-list">
                        {attachments?(
                            <div>
                                <h4>Files</h4>
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
                ):null}

                {view == 'people'?(
                    <div className="people-list">
                        <h4>People</h4>
                        {channel.details && channel.details.participants?(
                            <div className="row">
                                {channel.details.participants.map(user => {
                                    return (
                                        <div key={user.id} className="col-md-6">
                                            <div className="media card">
                                                <div className="media-left">
                                                    <Avatar src={user.avatar_url} size=""/>
                                                </div>
                                                <div className="media-body">
                                                    <div><Link to={`/people/${user.username}`}>{user.display_name}</Link></div>
                                                    <div className="secondary">@{user.username}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ):null}
                    </div>
                ):null}

                {['files', 'people'].indexOf(view) == -1?(
                    [
                        <ActivityList
                            Auth={Auth}
                            activities={activities}
                            isLoading={Channel.detail.activity.isFetching[getChannelKey(channel.id)] || false}
                            isLoadingMore={Channel.detail.activity.isFetchingMore[getChannelKey(channel.id)] || false}
                            loadMoreUrl={Channel.detail.activity.next[getChannelKey(channel.id)] || null}
                            loadMoreCallback={ChannelActions.listMoreChannelActivity}
                            loadMoreText="Show older messages"
                            last_read={channel.previous_last_read || channel.last_read} />,
                        <MessageForm
                            messageCallback={this.onSendMessage.bind(this)}
                            messageSaved={Message.detail.isSaved}
                            uploadCallback={this.onUpload.bind(this)}
                            uploadSaved={Channel.detail.isSaved}
                            isSending={Message.detail.isSaving || Channel.detail.isSaving}
                            canUpload={Auth.isAuthenticated} />
                    ]
                ):null}
            </div>
        );
    }
}
