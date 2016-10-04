import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Helmet from "react-helmet"

import Progress from '../components/status/Progress';
import NavBar from '../components/NavBar';
import SideBar from './SideBar';

import * as AuthActions from '../actions/AuthActions';
import * as NavActions from '../actions/NavActions';
import * as UserSelectionActions from '../actions/UserSelectionActions';
import * as SkillSelectionActions from '../actions/SkillSelectionActions';

import { UNAUTHED_ACCESS_PATH, PROFILE_COMPLETE_PATH, LANDING_PAGE_PATH } from '../constants/patterns';

import { initNavUIController } from '../utils/ui';

class App extends React.Component {

    getChildContext() {
        const { router, location } = this.context;
        return {router: router, location: location};
    }

    componentDidMount() {
        if(!this.props.Auth.isVerifying) {
            this.props.AuthActions.verify();
        }

        initNavUIController();
    }

    componentDidUpdate(prevProps, prevState) {
        const { router } = this.context;
        const { Auth, location, NavActions, AuthActions } = this.props;
        if((prevProps.location.pathname != location.pathname) || (prevProps.Auth.isAuthenticated != Auth.isAuthenticated) || (prevProps.Auth.isVerifying != Auth.isVerifying && !Auth.isVerifying)) {
            if(UNAUTHED_ACCESS_PATH.test(location.pathname) && Auth.isAuthenticated) {
                var next = Auth.next;
                if(!next) {
                    next = location.query.next || '/home';
                }
                if(/^\/api\//i.test(next)) {
                    window.location.href = next;
                } else {
                    router.replace(next);
                }
                return;
            }

            if(!UNAUTHED_ACCESS_PATH.test(location.pathname) && !Auth.isAuthenticated) {
                AuthActions.authRedirect(location.pathname);
                router.replace('/signin');
                return;
            }
        }

        if(Auth.isAuthenticated && !Auth.user.type && !PROFILE_COMPLETE_PATH.test(location.pathname)) {
            router.replace('/profile/complete');
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
                (
                    <div className="app-loading">
                        <div>
                            <img src={require('../images/logo.png')}/>
                        </div>
                        <Progress message="Initializing ..."/>
                    </div>
                )
                :
                Auth.isAuthenticated?(
                    <div className="app-wrapper" onClick={this.handleAppClick.bind(this)}>
                        <Helmet
                            title="Tunga"
                            meta={[
                                {"name": "description", "content": "Unlocking Africa's Tech talent potential."}
                              ]}
                        />
                        <NavBar Auth={Auth} AuthActions={AuthActions} location={location}/>

                        <div className="container-fluid">
                            <div className="row">
                                {Auth.isAuthenticated && !PROFILE_COMPLETE_PATH.test(this.props.location.pathname)?(
                                    [
                                        <SideBar Auth={Auth} location={location}/>,
                                        <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2">
                                            <div className="main">{children}</div>
                                        </div>
                                    ]
                                ):(
                                    <div>{children}</div>
                                )}
                            </div>
                        </div>
                    </div>
                ):children
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

App.contextTypes = {
    router: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired
};

App.childContextTypes = {
    router: React.PropTypes.object,
    location: React.PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
