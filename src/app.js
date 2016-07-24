require('es6-promise').polyfill(); // Add Promises polyfill to global environment

//Import local css
import "css/dashboard.css"
import 'react-widgets/lib/less/react-widgets.less'
import "css/style.less"

// Local JS
import "script!js/js.cookie.js";

import React from 'react'
import ReactDOM  from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, IndexRedirect, Redirect } from 'react-router'
import store from './store'

import history from './history'
import App from 'containers/App'
import LandingPage from 'containers/LandingPage'
import Home from 'containers/Home'
import SignInPage from 'containers/SignInPage'
import AccountType from 'containers/AccountType'
import SignUpPage from 'containers/SignUpPage'
import DeveloperApplication from 'containers/DeveloperApplication'
import PasswordResetPage from 'containers/PasswordResetPage'
import PasswordResetConfirmPage from 'containers/PasswordResetConfirmPage'
import SettingsPage from 'containers/SettingsPage'
import ProjectPage from 'containers/ProjectPage'
import ProjectForm from 'components/ProjectForm'
import Project from 'components/Project'
import TaskPage from 'containers/TaskPage'
import TaskList from 'components/TaskList'
import TaskForm from 'components/TaskForm'
import Task from 'components/Task'
import TaskOverview from 'components/TaskOverview'
import ApplicationList from 'components/ApplicationList'
import IntegrationList from 'components/IntegrationList'
import TaskPay from 'components/TaskPay'
import Participation from 'components/Participation'
import UserPage from 'containers/UserPage'
import UserList from 'components/UserList'
import User from 'components/User'
import MessagePage from 'containers/MessagePage'
import ChannelForm from 'components/ChannelForm'
import ChatBox from 'components/ChatBox'
import MessageList from 'components/MessageList'
import ProfilePage from 'containers/ProfilePage'
import Profile from 'components/Profile'
import Stack from 'components/Stack'
import PaymentMethod from 'components/PaymentMethod'
import Account from 'components/Account'
import IDDocument from 'components/IDDocument'
import ProfilePicture from 'components/ProfilePicture'
import PasswordChangeForm from 'components/PasswordChangeForm'
import ProfileType from 'components/ProfileType'
import PaymentList from 'components/PaymentList'
import SupportPage from 'containers/SupportPage'
import SupportSectionList from 'components/SupportSectionList'
import SupportSectionPageList from 'components/SupportSectionPageList'
import SupportPageDetail from 'components/SupportPageDetail'
import SearchPage from 'containers/SearchPage'
import SupportPageList from 'components/SupportPageList'

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute component={LandingPage}/>
                <Route path="signin" component={SignInPage} />
                <Route path="signup">
                    <IndexRoute component={AccountType} />
                    <Route path="project-owner" component={SignUpPage} />
                    <Route path="developer">
                        <IndexRoute component={DeveloperApplication}/>
                        <Route path=":confirmationKey" component={SignUpPage} />
                    </Route>
                </Route>
                <Route path="reset-password" component={PasswordResetPage} />
                <Route path="reset-password/confirm/:uid/:token" component={PasswordResetConfirmPage} />
                <Route path="home" component={Home} />
                <Route path="profile" component={ProfilePage}>
                    <IndexRedirect to="personal"/>
                    <Route path="personal" component={Profile} />
                    <Route path="stack" component={Stack} />
                    <Route path="payment" component={PaymentMethod} />
                    <Route path="payment/:provider" component={PaymentMethod} />
                    <Route path="account" component={Account} />
                    <Route path="id-document" component={IDDocument} />
                    <Route path="photo" component={ProfilePicture} />
                    <Route path="security" component={PasswordChangeForm} />
                    <Route path="security" component={PasswordChangeForm} />
                    <Route path="complete" component={ProfileType} />
                    <Redirect path="*" to="personal" />
                </Route>
                <Route path="settings" component={SettingsPage} />
                <Route path="project" component={ProjectPage}>
                    <IndexRedirect to="new"/>
                    <Route path="new" component={ProjectForm} />
                    <Route path=":projectId">
                        <IndexRoute  component={Project}/>
                        <Route path="task" component={TaskForm} />
                    </Route>
                </Route>
                <Route path="task" component={TaskPage}>
                    <IndexRoute component={TaskList}/>
                    <Route path="new" component={TaskForm} />
                    <Route path="tag/:tag" component={TaskList} />
                    <Route path="filter/:filter" component={TaskList} />
                    <Route path=":taskId" component={Task}>
                        <IndexRoute component={TaskOverview} />
                        <Route path="applications" component={ApplicationList}/>
                        <Route path="integrations" component={IntegrationList}>
                            <IndexRedirect to="github" />
                            <Route path=":provider"/>
                        </Route>
                        <Route path="pay" component={TaskPay} />
                        <Route path="participation" component={Participation} />
                        <Route path="event/:eventId" component={TaskOverview}/>
                        <Route path="edit" />
                    </Route>
                </Route>
                <Route path="member" component={UserPage}>
                    <IndexRedirect to="filter/developers"/>
                    <Route path="filter/:filter" component={UserList} />
                    <Route path=":userId" component={User} />
                </Route>
                <Route path="channel" component={MessagePage}>
                    <Route path="start" component={ChannelForm} />
                    <Route path=":channelId" component={ChatBox} />
                </Route>
                <Route path="payments" component={TaskPage}>
                    <IndexRoute component={PaymentList}/>
                    <Route path=":filter" component={PaymentList}/>
                </Route>
                <Route path="support" component={SupportPage}>
                    <IndexRoute component={SupportSectionList}/>
                    <Route path=":section">
                        <IndexRoute component={SupportSectionPageList}/>
                        <Route path=":page" component={SupportPageDetail} />
                    </Route>
                </Route>
                <Route path="search" component={SearchPage}>
                    <IndexRedirect to="developers"/>
                    <Route path="developers" component={UserList} />
                    <Route path="tasks" component={TaskList} />
                    <Route path="messages" component={MessageList} />
                    <Route path="support" component={SupportPageList} />
                </Route>
                <Redirect path="*" to="home" />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('content')
);
