import 'babel-polyfill'; // Add Promises polyfill to global environment

//Import local css
import '../scss/guide.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, IndexRedirect, Redirect} from 'react-router';
import store from '../store';
import history from '../history';

import StyleGuide from './components/StyleGuide';

if (__PRODUCTION__) {
    // Configure raven
    Raven.config(
        'https://3b4b870154ce496c9d3dd9673a529bb9@sentry.io/121717',
    ).install();
}



ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="*" component={StyleGuide}/>
        </Router>
    </Provider>,
    document.getElementById('content'),
);
