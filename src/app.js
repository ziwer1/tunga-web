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
import { Router, Route, IndexRoute, IndexRedirect } from 'react-router'
import store from './store'

import history from './history'
import App from 'containers/App'
import LandingPage from 'containers/LandingPage'
import Home from 'containers/Home'
import SignInPage from 'containers/SignInPage'
import SignupLandingPage from 'containers/SignupLandingPage'
import SignUpPage from 'containers/SignUpPage'
import PasswordResetPage from 'containers/PasswordResetPage'
import PasswordResetConfirmPage from 'containers/PasswordResetConfirmPage'
import SettingsPage from 'containers/SettingsPage'
import TaskPage from 'containers/TaskPage'
import TaskList from 'components/TaskList'
import TaskForm from 'components/TaskForm'
import Task from 'components/Task'
import TaskWorflow from 'components/TaskWorflow'
import ApplicationList from 'components/ApplicationList'
import UserPage from 'containers/UserPage'
import UserList from 'components/UserList'
import User from 'components/User'
import MessagePage from 'containers/MessagePage'
import Inbox from 'components/Inbox'
import Compose from 'components/Compose'
import Sent from 'components/Sent'
import MessageDetail from 'components/MessageDetail'
import ProfilePage from 'containers/ProfilePage'
import Profile from 'components/Profile'
import Stack from 'components/Stack'
import Account from 'components/Account'
import ProfilePicture from 'components/ProfilePicture'
import PasswordChangeForm from 'components/PasswordChangeForm'
import ProfileType from 'components/ProfileType'
import PaymentList from 'components/PaymentList'

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute component={LandingPage}/>
                <Route path="signin" component={SignInPage} />
                <Route path="signup" component={SignupLandingPage} />
                <Route path="reset-password" component={PasswordResetPage} />
                <Route path="reset-password/confirm/:uid/:token" component={PasswordResetConfirmPage} />
                <Route path="home" component={Home} />
                <Route path="profile" component={ProfilePage}>
                    <IndexRedirect to="personal"/>
                    <Route path="personal" component={Profile} />
                    <Route path="stack" component={Stack} />
                    <Route path="account" component={Account} />
                    <Route path="photo" component={ProfilePicture} />
                    <Route path="security" component={PasswordChangeForm} />
                    <Route path="security" component={PasswordChangeForm} />
                    <Route path="complete" component={ProfileType} />
                </Route>
                <Route path="settings" component={SettingsPage} />
                <Route path="task" component={TaskPage}>
                    <IndexRoute component={TaskList}/>
                    <Route path="new" component={TaskForm} />
                    <Route path="tag/:tag" component={TaskList} />
                    <Route path="filter/:filter" component={TaskList} />
                    <Route path=":id" component={Task}>
                        <IndexRoute component={Task} />
                        <Route path="" component={TaskWorflow}>
                            <Route path=":section" />
                        </Route>
                    </Route>
                </Route>
                <Route path="member" component={UserPage}>
                    <IndexRedirect to="filter/developers"/>
                    <Route path="filter/:filter" component={UserList} />
                    <Route path=":id" component={User} />
                </Route>
                <Route path="message" component={MessagePage}>
                    <IndexRedirect to="inbox"/>
                    <Route path="inbox" component={Inbox} />
                    <Route path="compose" component={Compose} />
                    <Route path="sent" component={Sent} />
                    <Route path=":id" component={MessageDetail} />
                </Route>
                <Route path="payments" component={TaskPage}>
                    <IndexRedirect to="pending"/>
                    <Route path=":filter" component={PaymentList} />
                </Route>
                <Route path=":unknown" component={Home} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('content')
);
