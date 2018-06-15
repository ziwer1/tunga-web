import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { withRouter, Switch, Route } from 'react-router-dom';

import * as ProfileActions from '../../legacy/actions/ProfileActions';

import Profile from './Profile';
import CompanyProfile from './CompanyProfile';
import CompanyDetails from './CompanyDetails';
import Experience from './Experience';
import Payment from './Payment';
import Account from './Account';
import Privacy from './Privacy';

const SettingsContainer = (props) => {
    return (
        <div className="content-card settings-card">
            <Switch>
                {[
                    ['profile', Profile],
                    ['company-profile', CompanyProfile],
                    ['company-details', CompanyDetails],
                    ['experience', Experience],
                    ['payment', Payment],
                    ['account', Account],
                    ['privacy', Privacy],

                ].map(path => {
                    return (
                        <Route path={`/settings/${path[0]}`} component={path[1]} props={props}/>
                    );
                })}
            </Switch>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        Auth: state.Auth,
        Profile: state.Profile
    };
}

function mapDispatchToProps(dispatch) {
    return {
        ProfileActions: bindActionCreators(ProfileActions, dispatch),
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SettingsContainer));
