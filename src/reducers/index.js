import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import Auth from './AuthReducers';
import Profile from './ProfileReducers';
import Project from './ProjectReducers';
import User from './UserReducers';

const TungaApp = combineReducers({
    Auth,
    Profile,
    Project,
    User,
    routing: routerReducer,
});

export default TungaApp;
