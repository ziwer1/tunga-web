import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import SettingsContainer from './settings/SettingsContainer';

export default class MainContent extends React.Component {
    render() {
        return (
            <div className='main-content'>
                <Switch>
                    <Redirect exact from='/payments' to='/payments/filter/pending-in'/>
                    <Redirect exact from='/settings' to='/settings/profile'/>
                    <Route path='/settings' component={SettingsContainer}/>
                </Switch>
            </div>
        )
    }
}
