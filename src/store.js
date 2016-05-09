import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import TungaApp from './reducers/index'

let store = createStore(
    TungaApp,
    applyMiddleware(thunk)
);

export default store;
