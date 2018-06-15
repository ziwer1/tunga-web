import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import DashboardLayout from './DashboardLayout';
import LegacyRedirect from './LegacyRedirect';

export default class App extends React.Component {
    render() {
        return (
            <div>
                <Switch>
                    {'dashboard|projects|network|payments|settings'.split('|').map(path => {
                        return (
                            <Route key={`app-path--${path}`} path={`/${path}`} component={DashboardLayout}/>
                        );
                    })}
                    <Redirect from="/home" to={{...location, pathname: '/dashboard'}}/>
                    <Redirect from="/profile" to={{...location, pathname: '/settings'}}/>
                    <Redirect from="/task" to={{...location, pathname: '/projects'}}/>
                    <Redirect from="/work" to={{...location, pathname: '/projects'}}/>
                    <Redirect from="/people" to={{...location, pathname: '/network'}}/>
                    <Redirect from="/member" to={{...location, pathname: '/network'}}/>
                    <Redirect from="/estimate" to={{...location, pathname: '/proposal'}}/>
                    <Route path="*" component={LegacyRedirect} />
                </Switch>
            </div>
        )
    }
}
