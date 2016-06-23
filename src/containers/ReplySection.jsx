import React from 'react'
import connect from '../utils/connectors/ReplyConnector'
import ReplyForm from '../components/ReplyForm'
import ReplyList from '../components/ReplyList'

class ReplySection extends React.Component {

    render() {
        const { Auth, Reply, ReplyActions, message } = this.props;
        return (
            <div>
                <ReplyList filter={{message: message.id}} Reply={Reply} ReplyActions={ReplyActions}/>

                <ReplyForm message={message} Reply={Reply} ReplyActions={ReplyActions} Auth={Auth}/>
            </div>
        );
    }
}

export default connect(ReplySection);
