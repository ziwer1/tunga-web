import React from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Progress from '../components/status/Progress';

import * as AuthActions from '../actions/AuthActions';
import * as NavActions from '../actions/NavActions';
import * as UserSelectionActions from '../actions/UserSelectionActions';
import * as SkillSelectionActions from '../actions/SkillSelectionActions';

import { PROFILE_COMPLETE_PATH } from '../constants/patterns';

import { initNavUIController } from '../utils/ui';
import { requiresAuth, requiresNoAuth, requiresAuthOrEmail } from '../utils/router';

import ComponentWithModal from '../components/ComponentWithModal';
import LargeModal from '../components/ModalLarge';

class App extends ComponentWithModal {

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
        const { Auth, location, NavActions, AuthActions, routes } = this.props;
        if(
            (prevProps.location.pathname != location.pathname) ||
            (prevProps.Auth.isAuthenticated != Auth.isAuthenticated) ||
            (prevProps.Auth.isVerifying != Auth.isVerifying && !Auth.isVerifying)
        ) {
            if(requiresNoAuth(routes) && Auth.isAuthenticated) {
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

            if(requiresAuthOrEmail(routes) && !Auth.isAuthenticated && !Auth.isEmailVisitor) {
                AuthActions.authRedirect(location.pathname);
                router.replace('/signin?next='+location.pathname);
                return;
            }

            if(requiresAuth(routes) && !Auth.isAuthenticated) {
                if(Auth.isEmailVisitor) {
                    this.open();
                } else {
                    AuthActions.authRedirect(location.pathname);
                    router.replace('/signin?next='+location.pathname);
                }
                return;
            }
        }

        if(Auth.isAuthenticated && !Auth.user.type && !PROFILE_COMPLETE_PATH.test(location.pathname)) {
            router.replace('/profile/complete');
            return;
        }

        if((
            //(prevProps.Auth.isEmailVisitor != Auth.isEmailVisitor) ||
            //(prevProps.Auth.isVerifying != Auth.isVerifying && !Auth.isVerifying) ||
            (prevProps.Auth.isAuthenticating != Auth.isAuthenticating && !Auth.isAuthenticating)
            ) && Auth.isEmailVisitor) {
            router.replace('/people/');
        }

        if(prevProps.location.pathname != location.pathname) {
            NavActions.reportPathChange(prevProps.location.pathname, location.pathname);
        }
    }

    handleAppClick() {
        const { UserSelectionActions, SkillSelectionActions } = this.props;
        UserSelectionActions.invalidateUserSuggestions();
        SkillSelectionActions.invalidateSkillSuggestions();
    }

    onClosePopup() {
        const {Auth, routes, location} = this.props;
        const { router } = this.context;

        this.close();
        if(requiresAuth(routes) && !Auth.isAuthenticated) {
            AuthActions.authRedirect(location.pathname);
            router.replace('/signin?next='+location.pathname);
        }
    }

    renderModalContent() {
        return (
            <LargeModal title="Login or Join" modalSize="medium"
                        show={this.state.showModal} onHide={this.onClosePopup.bind(this)}>
                <div className="alert alert-info">You need to Login or Sign Up to access this page</div>
                <div className="clearfix">
                    <div className="pull-right">
                        <Link to="/signup" className="btn" onClick={this.close.bind(this)}>Sign Up</Link>
                        <Link to="/signin" className="btn btn-alt" onClick={this.close.bind(this)}>Login</Link>
                    </div>
                </div>
            </LargeModal>
        );
    }

    renderChildren() {
        return React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {
                Auth: this.props.Auth,
                AuthActions: this.props.AuthActions,
                location: this.props.location,
                onAppClick: this.handleAppClick.bind(this)
            });
        }.bind(this));
    }

    render() {
        const {Auth} = this.props;
        return (
            Auth.isVerifying?
                (
                    <div className="app-loading">
                        <div>
                            <img src={require('../images/logo.png')}/>
                        </div>
                        <Progress message="Initializing ..."/>
                    </div>
                ):(
                <div style={{height: '100%'}}>
                    {this.renderModalContent()}
                    {this.renderChildren()}
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

App.contextTypes = {
    router: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired
};

App.childContextTypes = {
    router: React.PropTypes.object,
    location: React.PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
