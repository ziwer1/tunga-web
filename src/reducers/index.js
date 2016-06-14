import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import Auth from './AuthReducers'
import Profile from './ProfileReducers'
import Settings from './SettingsReducers'
import Notification from './NotificationReducers'
import Task from './TaskReducers'
import User from './UserReducers'
import Comment from './CommentReducers'
import Message from './MessageReducers'
import Reply from './ReplyReducers'
import UserSelection from './UserSelectionReducers'
import SkillSelection from './SkillSelectionReducers'
import Utility from './UtilityReducers'


const TungaApp = combineReducers({
    Auth,
    Profile,
    Settings,
    Notification,
    Task,
    User,
    Comment,
    Message,
    Reply,
    UserSelection,
    SkillSelection,
    Utility,
    routing: routerReducer
});

export default TungaApp;
