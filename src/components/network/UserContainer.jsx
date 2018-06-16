import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { withRouter, Switch, Route } from 'react-router-dom';

import * as UserActions from '../../legacy/actions/UserActions';

import UserListContainer from './UserListContainer';
import UserList from './UserList';
import UserDetailContainer from './UserDetailContainer';
import UserProfile from "./UserProfile";


import {USER_TYPE_DEVELOPER} from "../../legacy/constants/Api";

const UserContainer = ({User, UserActions}) => {
    return (
        <React.Fragment>
            <Switch>
                <Route exact path="/network/:username" render={props => <UserDetailContainer {...props} username={props.match.params.username} User={User} UserActions={UserActions} filters={{type: USER_TYPE_DEVELOPER}}><UserProfile/></UserDetailContainer>}/>
                {[
                    '/network/filter/:filter',
                    '/network',
                ].map(path => {
                    return (
                        <Route key={`user-container-path--${path}`} path={path} render={props => <UserListContainer {...props} User={User} UserActions={UserActions} filters={{type: USER_TYPE_DEVELOPER}}><UserList/></UserListContainer>}/>
                    );
                })}
            </Switch>
        </React.Fragment>
    );
};

function mapStateToProps(state) {
    return {
        User: state.User
    };
}

function mapDispatchToProps(dispatch) {
    return {
        UserActions: bindActionCreators(UserActions, dispatch),
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserContainer));