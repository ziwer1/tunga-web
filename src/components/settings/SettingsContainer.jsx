import React from 'react';

import { Switch, Route } from 'react-router-dom';

import connect from '../../connectors/ProfileConnector';

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
                    ['profile', <Profile {...props}/>],
                    ['company-profile', <CompanyProfile {...props}/>],
                    ['company-details', <CompanyDetails {...props}/>],
                    ['experience', <Experience {...props}/>],
                    ['payment', <Payment {...props}/>],
                    ['account', <Account {...props}/>],
                    ['privacy', <Privacy {...props}/>],

                ].map(path => {
                    return (
                        <Route key={`settings-container-path--${path}`} path={`/settings/${path[0]}`} render={props => path[1]}/>
                    );
                })}
            </Switch>
        </div>
    );
};

export default connect(SettingsContainer);
