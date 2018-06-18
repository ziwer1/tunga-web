import React from 'react';
import PropTypes from 'prop-types';
import randomstring from 'randomstring';
import _ from 'lodash';

export default class UserDetailContainer extends React.Component  {

    static propTypes = {
        username: PropTypes.string,
        selectionKey: PropTypes.string,
    };

    static defaultProps = {
        filters: {},
        selectionKey: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            selectionKey: props.selectionKey || randomstring.generate(),
            prevKey: null,
        };
    }

    componentDidMount() {
        this.getUser();
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if(prevProps.username !== this.props.username) {
            this.getUser();
        }
    }

    getUser() {
        const {username, UserActions, User} = this.props;
        if(username && !User.users[username] && User.users[User.usernameToId[username]]) {
            UserActions.retrieveUser(username);
        }
    }

    renderChildren() {
        const {username, User, UserActions} = this.props;


        return React.Children.map(
            this.props.children,
            function(child) {
                return React.cloneElement(child, {
                    user: User.users[User.usernameToId[username]],
                    UserActions
                });
            }.bind(this),
        );
    }

    render() {
        return (
            <React.Fragment>
                {this.renderChildren()}
            </React.Fragment>
        );
    }
}
