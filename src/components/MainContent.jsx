import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import SettingsContainer from './settings/SettingsContainer';
import PaymentsList from './payments/PaymentsList';
import NetworkContainer from './network/NetworkContainer';
import OnboardContainer from './onboard/OnboardContainer';

const MainContent = () => {
    return (
        <div className='main-content'>
            <Switch>
                <Redirect exact from='/payments' to='/payments/filter/pending-in'/>
                <Route path='/onboard' component={OnboardContainer}/>
                <Route path='/settings' component={SettingsContainer}/>
                <Route path='/payments' component={PaymentsList}/>
                <Route path='/network' component={NetworkContainer}/>
            </Switch>
        </div>
    )
};

export default MainContent;
