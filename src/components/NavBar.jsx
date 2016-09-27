import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Avatar from './Avatar';
import SearchBox from './SearchBox';

import { initSideBarToggle } from '../utils/ui';

export default class NavBar extends React.Component {

    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount() {
        initSideBarToggle();
    }

    handleLogout(e) {
        e.preventDefault();
        this.props.AuthActions.logout();
    }

    render() {
        const { Auth } = this.props;
        return (
            <div className="navbar-wrapper row">
                <nav className="navbar navbar-fixed-top">
                    <div className="navbar-header">
                        {Auth.isAuthenticated?(
                            <button type="button" className="sidebar-toggle navbar-toggle collapsed" data-toggle="sidebar-collapse" data-target="#sidebar" aria-expanded="false" aria-controls="sidebar">
                                <span className="sr-only">Toggle side bar</span>
                                <i className="fa fa-navicon fa-lg"></i>
                            </button>
                        ):null}
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <i className="fa fa-ellipsis-v fa-lg"></i>
                        </button>
                        <Link to="/" className="navbar-brand"><img src={require('../images/header-logo.png')} /></Link>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        {Auth.isAuthenticated?(
                            <ul className="nav navbar-nav navbar-right">
                                <li><SearchBox placeholder="Search" hide_results={true}/></li>
                                <li><Link to="/help"><i className="fa fa-question-circle fa-lg"/> Help</Link></li>
                                <li className="dropdown">
                                    <a href="#" className="dropdown-toggle account-actions-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                        {Auth.user.display_name} <span className="caret" style={{marginLeft: 5+'px'}}></span> <Avatar src={Auth.user.avatar_url}/>
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li><Link to="/profile"><i className="nav-icon tunga-icon-profile"/> My Profile</Link></li>
                                        <li><Link to="/settings"><i className="nav-icon tunga-icon-settings"/> Settings</Link></li>
                                        <li role="separator" className="divider"/>
                                        <li><Link to="" onClick={this.handleLogout}><i className="nav-icon tunga-icon-sign-out"/> Sign Out</Link></li>
                                    </ul>
                                </li>
                            </ul>
                        ):(
                            <ul className="nav navbar-nav navbar-right">
                                <li><Link to="/signup">JOIN</Link></li>
                                <li><Link to="/signin">LOGIN</Link></li>
                            </ul>
                        )}
                    </div>
                </nav>
            </div>
        );
    }
}

NavBar.propTypes = {
    Auth: PropTypes.shape({
        isAuthenticating: PropTypes.bool.isRequired,
        isAuthenticated: PropTypes.bool.isRequired,
        user: PropTypes.object
    }).isRequired
};
