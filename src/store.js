import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk';
import TungaApp from './reducers/index'

let compose_args = [
    applyMiddleware(thunk)
];

if(__DEV__ || __PRERELEASE__) {
    compose_args.push(window.devToolsExtension?window.devToolsExtension(): f => f);
}

let store = createStore(
    TungaApp,
    compose(...compose_args)
);

export default store;
