import React from 'react'
import { Link } from 'react-router'
import TagList from './TagList'
import Progress from './status/Progress'
import MessageList from './MessageList'

export default class Sent extends React.Component {

    render() {
        const { Message, MessageActions, Auth } = this.props;
        const { message } = Message.detail;

        return (
            <div>
                <MessageList filter={'sent'} Message={Message} Auth={Auth} MessageActions={MessageActions}/>
            </div>
        );
    }
}
