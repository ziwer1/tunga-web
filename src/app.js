import 'babel-polyfill'; // Add Promises polyfill to global environment

//Import local css
import 'react-widgets/lib/less/react-widgets.less';
import "css/style.less";

// Local JS
import "script!js/js.cookie.js";

import React from 'react';
import ReactDOM  from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, IndexRedirect, Redirect } from 'react-router';
import store from './store';
import history from './history';

history.listen(location => {
    window.ga('send', 'pageview');
    window.twq('track','PageView');
});

import App from 'containers/App';
import LandingPage from 'containers/LandingPage';
import Home from 'containers/Home';
import SignInPage from 'containers/SignInPage';
import AccountType from 'containers/AccountType';
import SignUpPage from 'containers/SignUpPage';
import DeveloperApplication from 'containers/DeveloperApplication';
import PasswordResetPage from 'containers/PasswordResetPage';
import PasswordResetConfirmPage from 'containers/PasswordResetConfirmPage';
import SettingsPage from 'containers/SettingsPage';
import ProjectPage from 'containers/ProjectPage';
import ProjectForm from 'components/ProjectForm';
import Project from 'components/Project';
import ProjectDetail from 'components/ProjectDetail';
import TaskPage from 'containers/TaskPage';
import TaskList from 'components/TaskList';
import TaskForm from 'components/TaskForm';
import Task from 'components/Task';
import ApplicationForm from 'components/ApplicationForm';
import TaskWorflow from 'components/TaskWorflow';
import ApplicationList from 'components/ApplicationList';
import MilestonePage from 'containers/MilestonePage';
import Milestone from 'components/Milestone';
import IntegrationList from 'components/IntegrationList';
import TaskPay from 'components/TaskPay';
import Participation from 'components/Participation';
import RateDevelopers from 'components/RateDevelopers';
import UserPage from 'containers/UserPage';
import UserList from 'components/UserList';
import User from 'components/User';
import MessagePage from 'containers/MessagePage';
import Channel from 'components/Channel';
import ChannelForm from 'components/ChannelForm';
import SupportChannelForm from 'components/SupportChannelForm';
import ChatBox from 'components/ChatBox';
import MessageList from 'components/MessageList';
import ProfilePage from 'containers/ProfilePage';
import Profile from 'components/Profile';
import Stack from 'components/Stack';
import CompanyProfile from 'components/CompanyProfile';
import PaymentMethod from 'components/PaymentMethod';
import Account from 'components/Account';
import IDDocument from 'components/IDDocument';
import ProfilePicture from 'components/ProfilePicture';
import PasswordChangeForm from 'components/PasswordChangeForm';
import ProfileType from 'components/ProfileType';
import PaymentList from 'components/PaymentList';
import SupportPage from 'containers/SupportPage';
import SupportSectionList from 'components/SupportSectionList';
import SupportPageDetail from 'components/SupportPageDetail';
import SearchPage from 'containers/SearchPage';
import SupportPageList from 'components/SupportPageList';

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
                    <Route path="company" component={CompanyProfile} />
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
                    <Route path=":projectId" component={Project}>
                        <IndexRoute component={ProjectDetail}/>
                        <Route path="edit" component={ProjectForm} crumb="Edit"/>
                        <Route path="task" component={TaskForm} crumb="Create Task"/>
                    </Route>
                </Route>
                <Route path="task" component={TaskPage}>
                    <IndexRoute component={TaskList}/>
                    <Route path="new" component={TaskForm} />
                    <Route path="filter/:filter" component={TaskList} />
                    <Route path="skill/:skill(/:filter)" component={TaskList} />
                    <Route path=":taskId" component={Task}>
                        <IndexRoute component={TaskWorflow} />
                        <Route path="edit" component={TaskForm} crumb="Edit"/>
                        <Route path="apply" component={ApplicationForm} crumb="Apply"/>
                        <Route path="applications" component={ApplicationList} crumb="Applications"/>
                        <Route path="integrations" component={IntegrationList} crumb="Integrations">
                            <IndexRedirect to="github" />
                            <Route path=":provider" crumb="Integrations"/>
                        </Route>
                        <Route path="pay" component={TaskPay} crumb="Pay"/>
                        <Route path="participation" component={Participation} crumb="Edit Participation"/>
                        <Route path="rate" component={RateDevelopers} crumb="Rate Developers"/>
                        <Route path="event" component={MilestonePage}>
                            <Route path=":eventId" component={Milestone}/>
                        </Route>
                    </Route>
                </Route>
                <Route path="people" component={UserPage}>
                    <IndexRedirect to="filter/developers"/>
                    <Route path="filter/:filter" component={UserList} />
                    <Route path="skill/:skill(/:filter)" component={UserList} />
                    <Route path=":userId" component={User} />
                </Route>
                <Redirect path="member*" to="people*"/>
                <Route path="conversation" component={MessagePage}>
                    <IndexRedirect to="start"/>
                    <Route path="start" component={ChannelForm}>
                        <Route path=":recipientId" />
                    </Route>
                    <Route path=":channelId" component={Channel}>
                        <IndexRedirect to="messages" />
                        <Route path="edit" component={ChannelForm} />
                        <Route path=":channelView" component={ChatBox} />
                    </Route>
                </Route>
                <Redirect path="message*" to="channel"/>
                <Redirect path="channel*" to="conversation*"/>
                <Route path="payments" component={TaskPage}>
                    <IndexRoute component={PaymentList}/>
                    <Route path=":filter" component={PaymentList}/>
                </Route>
                <Route path="support" component={SupportPage}>
                    <IndexRoute component={SupportSectionList}/>
                    <Route path=":section">
                        <IndexRoute component={SupportPageList}/>
                        <Route path="tag/:tag" component={SupportPageList} />
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
                <Route path="help" component={MessagePage}>
                    <IndexRedirect to="start"/>
                    <Route path="start" component={SupportChannelForm}/>
                    <Route path=":channelId" component={Channel}>
                        <IndexRoute component={ChatBox} />
                    </Route>
                </Route>
                <Route path="customer" component={LandingPage}>
                    <Route path="help" component={MessagePage}>
                        <IndexRedirect to="start"/>
                        <Route path="start" component={SupportChannelForm}/>
                        <Route path=":channelId" component={Channel}>
                            <IndexRoute component={ChatBox} />
                        </Route>
                    </Route>
                </Route>
                <Redirect path="*" to="home" />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('content')
);
