import { combineReducers } from 'redux'
import Auth from './AuthReducers'
import Profile from './ProfileReducers'
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
    Notification,
    Task,
    User,
    Comment,
    Message,
    Reply,
    UserSelection,
    SkillSelection,
    Utility
});

export default TungaApp;
