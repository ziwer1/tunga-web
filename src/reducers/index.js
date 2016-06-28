import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import Auth from './AuthReducers'
import Profile from './ProfileReducers'
import Settings from './SettingsReducers'
import Notification from './NotificationReducers'
import Project from './ProjectReducers'
import Task from './TaskReducers'
import User from './UserReducers'
import Comment from './CommentReducers'
import Channel from './ChannelReducers'
import Message from './MessageReducers'
import Milestone from './MilestoneReducers'
import ProgressReport from './ProgressReportReducers'
import UserSelection from './UserSelectionReducers'
import SkillSelection from './SkillSelectionReducers'
import Utility from './UtilityReducers'
import Search from './SearchReducers'


const TungaApp = combineReducers({
    Auth,
    Profile,
    Settings,
    Notification,
    Project,
    Task,
    User,
    Comment,
    Channel,
    Message,
    Milestone,
    ProgressReport,
    UserSelection,
    SkillSelection,
    Utility,
    Search,
    routing: routerReducer
});

export default TungaApp;
