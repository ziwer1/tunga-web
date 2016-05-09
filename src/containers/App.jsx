import React from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Progress from '../components/status/Progress'
import NavBar from '../components/NavBar'
import SideBar from './SideBar'

import * as AuthActions from '../actions/AuthActions'
import * as NavActions from '../actions/NavActions'
import * as UserSelectionActions from '../actions/UserSelectionActions'
import * as SkillSelectionActions from '../actions/SkillSelectionActions'

import { UNAUTHED_ONLY_PATH, UNAUTHED_ACCESS_PATH, PROFILE_COMPLETE_PATH } from '../constants/patterns'

class App extends React.Component {
    componentDidMount() {
        if(!this.props.Auth.isVerifying) {
            this.props.AuthActions.verify();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { Auth, location, NavActions } = this.props;
        if((prevProps.location.pathname != location.pathname) || (prevProps.Auth.isAuthenticated != Auth.isAuthenticated) || (prevProps.Auth.isVerifying != Auth.isVerifying && !Auth.isVerifying)) {
            if(UNAUTHED_ONLY_PATH.test(location.pathname) && Auth.isAuthenticated) {
                this.props.history.replaceState(null, '/home');
                return;
            }

            if(!UNAUTHED_ACCESS_PATH.test(location.pathname) && !Auth.isAuthenticated) {
                this.props.history.replaceState(null, '/signin');
                return;
            }
        }

        if(Auth.isAuthenticated && !Auth.user.type && !PROFILE_COMPLETE_PATH.test(location.pathname)) {
            this.props.history.replaceState(null, '/profile/complete');
            return;
        }

        if(prevProps.location.pathname != location.pathname) {
            NavActions.reportPathChange(prevProps.location.pathname, location.pathname);
        }
    }

    handleAppClick(e) {
        const { UserSelectionActions, SkillSelectionActions } = this.props;
        UserSelectionActions.invalidateUserSuggestions();
        SkillSelectionActions.invalidateSkillSuggestions();
    }

    render() {
        const {Auth, AuthActions, children, location} = this.props;
        return (
            Auth.isVerifying?
                (<div className="app-loading">
                    <Progress message="Initializing Tunga ..."/>
                </div>)
                :
                this.props.location.pathname=='/'?children:(
                    <div className="app-wrapper" onClick={this.handleAppClick.bind(this)}>
                        <NavBar Auth={Auth} AuthActions={AuthActions} location={location}/>

                        <div className="container-fluid">
                            <div className="row">
                                {Auth.isAuthenticated && !PROFILE_COMPLETE_PATH.test(this.props.location.pathname)?(<SideBar Auth={Auth} location={location}/>):null}
                                <div className={Auth.isAuthenticated && !PROFILE_COMPLETE_PATH.test(this.props.location.pathname)?"col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main":"col-sm-12"}>
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                )
        );
    }
}


function mapStateToProps(state) {
    return {Auth: state.Auth};
}

function mapDispatchToProps(dispatch) {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
        NavActions: bindActionCreators(NavActions, dispatch),
        UserSelectionActions: bindActionCreators(UserSelectionActions, dispatch),
        SkillSelectionActions: bindActionCreators(SkillSelectionActions, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
