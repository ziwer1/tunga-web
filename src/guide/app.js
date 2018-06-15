import 'babel-polyfill'; // Add Promises polyfill to global environment

//Import local css
import 'react-widgets/lib/less/react-widgets.less';
import '../scss/guide.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import createLogger from "redux-logger";

import Guide from './components/Guide';

const logger = createLogger({
    collapsed: true,
    level: 'info',
    duration: true,
});

const store = createStore(() => {}, compose(applyMiddleware(logger), (window.devToolsExtension ? window.devToolsExtension() : f => f)));

if (__PRODUCTION__) {
    // Configure raven
    Raven.config(
        'https://3b4b870154ce496c9d3dd9673a529bb9@sentry.io/121717',
    ).install();
}

ReactDOM.render(
    <BrowserRouter>
        <Guide/>
    </BrowserRouter>,
    document.getElementById('guide-root'),
);
