import React from 'react'
import { Link } from 'react-router'
import connect from '../utils/connectors/MessageConnector'

class MessagePage extends React.Component {

    renderChildren() {
        return React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {
                Auth: this.props.Auth,
                Message: this.props.Message,
                MessageActions: this.props.MessageActions
            });
        }.bind(this));
    }

    render() {
        return (
            <div>
                <h2>Messages</h2>
                <ul className="nav nav-pills nav-top-filter">
                    <li role="presentation"><Link to="/message/inbox" activeClassName="active">Inbox</Link></li>
                    <li role="presentation"><Link to="/message/compose" activeClassName="active">Compose</Link></li>
                    <li role="presentation"><Link to="/message/sent" activeClassName="active">Sent</Link></li>
                </ul>

                {this.renderChildren()}
            </div>
        );
    }
}

export default connect(MessagePage);
