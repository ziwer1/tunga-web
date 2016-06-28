import React from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as UserActions from '../actions/UserActions'
import * as TaskActions from '../actions/TaskActions'
import * as MessageActions from '../actions/MessageActions'

class SearchPage extends React.Component {

    renderChildren() {
        return React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {
                Auth: this.props.Auth,
                User: this.props.User,
                Task: this.props.Task,
                Message: this.props.Message,
                UserActions: this.props.UserActions,
                TaskActions: this.props.TaskActions,
                MessageActions: this.props.MessageActions,
                search: this.props.Search.query,
                hide_header: true
            });
        }.bind(this));
    }

    render() {
        const { Search } = this.props;

        return (
            <div>
                {Search.query?(
                <h3 className="results">{Search.count?Search.count:"Search"} results for "<strong>{Search.query}</strong>"</h3>
                    ):null}
                <ul className="nav nav-pills nav-top-filter">
                    <li role="presentation"><Link to="/search/developers/" activeClassName="active">Developers</Link></li>
                    <li role="presentation"><Link to="/search/tasks/" activeClassName="active">Tasks</Link></li>
                    <li role="presentation" style={{marginLeft: '20px'}}><Link to="/search/messages/" activeClassName="active">Messages</Link></li>
                </ul>

                {this.renderChildren()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {Auth: state.Auth, Search: state.Search, User: state.User, Task: state.Task, Message: state.Message};
}

function mapDispatchToProps(dispatch) {
    return {
        UserActions: bindActionCreators(UserActions, dispatch),
        TaskActions: bindActionCreators(TaskActions, dispatch),
        MessageActions: bindActionCreators(MessageActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
