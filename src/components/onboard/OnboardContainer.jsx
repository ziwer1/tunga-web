import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import connect from '../../connectors/ProfileConnector';

import Intro from './Intro';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import Finish from './Finish';

const OnboardContainer = (props) => {
    return (
        <div className="onboard-card">
            <div className="onboard-title">Let's set up your account</div>
            <div className="onboard-content">
                <Switch>
                    <Redirect exact from='/onboard' to='/onboard/intro'/>
                    {[
                        ['intro', <Intro {...props}/>],
                        ['step-one', <StepOne {...props}/>],
                        ['step-two', <StepTwo {...props}/>],
                        ['finish', <Finish {...props}/>],

                    ].map(path => {
                        return (
                            <Route key={`onboard-container-path--${path}`} path={`/onboard/${path[0]}`} render={props => path[1]}/>
                        );
                    })}
                </Switch>
            </div>
        </div>
    );
};

export default connect(OnboardContainer);
