import React from 'react'
import { Link } from 'react-router'
import TagList from './TagList'
import Progress from './status/Progress'
import MessageList from './MessageList'

export default class Inbox extends React.Component {

    render() {
        const { Message, MessageActions, Auth } = this.props;
        const { message } = Message.detail;

        return (
            <div>
                <MessageList filter={'inbox'} Message={Message} Auth={Auth} MessageActions={MessageActions}/>
            </div>

        );
    }
}
