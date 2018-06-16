import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import SettingsContainer from './settings/SettingsContainer';
import PaymentsList from './payments/PaymentsList';
import UserContainer from './network/UserContainer';

const MainContent = () => {
    return (
        <div className='main-content'>
            <Switch>
                <Redirect exact from='/payments' to='/payments/filter/pending-in'/>
                <Redirect exact from='/settings' to='/settings/profile'/>
                <Route path='/settings' component={SettingsContainer}/>
                <Route path='/payments' component={PaymentsList}/>
                <Route path='/network' component={UserContainer}/>
            </Switch>
        </div>
    )
};

export default MainContent;
