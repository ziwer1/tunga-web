import 'babel-polyfill'; // Add Promises polyfill to global environment

//Import local css
import 'react-widgets/lib/less/react-widgets.less';
import './legacy/legacy/css/tour.scss';
//import 'react-joyride/lib/react-joyride.scss';
//import 'Dante2/dist/DanteStyles.css';
import './legacy/css/style.less';
import './scss/tunga.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, IndexRedirect, Redirect} from 'react-router';
import store from './legacy/store';
import history from './legacy/history';

history.listen(location => {
    var full_path = location.pathname + location.search;

    if (__PRODUCTION__) {
        if (window.ga) {
            window.ga('set', 'page', full_path);
            window.ga('send', 'pageview');
        }
        if (window.twq) {
            window.twq('track', 'PageView');
        }
    }

    console.log('Page View sent', full_path);

    if (window.optimizely) {
        window.optimizely = window.optimizely || [];
        window.optimizely.push({type: 'activate'});
    }
});

if (__PRODUCTION__) {
    // Configure raven
    Raven.config(
        'https://3b4b870154ce496c9d3dd9673a529bb9@sentry.io/121717',
    ).install();
}

// Control overlay pop up on landing pages
window.tungaCanOpenOverlay = false;

import App from './legacy/containers/App';
import AppWrapper from './legacy/containers/AppWrapper';
import LandingPage from './legacy/routes/LandingPage';
import PricingPage from './legacy/routes/PricingPage';
import QualityPage from './legacy/routes/QualityPage';
import Home from './legacy/routes/Home';
import SignInPage from './legacy/routes/SignInPage';
import SignUpPage from './legacy/routes/SignUpPage';
import PasswordResetPage from './legacy/containers/PasswordResetPage';
import PasswordResetConfirmPage from './legacy/containers/PasswordResetConfirmPage';
import Agreement from './legacy/routes/Agreement';
import PrivacyPolicy from './legacy/routes/PrivacyPolicy';
import CodeOfConduct from './legacy/routes/CodeOfConduct';
import SettingsPage from './legacy/containers/SettingsPage';
import ProjectBoard from './legacy/components/ProjectBoard';
import ProjectTaskForm from './legacy/components/ProjectTaskForm';
import TaskContainer from './legacy/containers/TaskContainer';
import TaskList from './legacy/components/TaskList';
import TaskForm from './legacy/components/TaskForm';
import EditTaskSectionForm from './legacy/components/EditTaskSectionForm';
import TaskDetailPage from './legacy/routes/TaskDetailPage';
import ApplicationForm from './legacy/components/ApplicationForm';
import TaskWorkflow from './legacy/components/TaskWorkflow';
import ApplicationList from './legacy/components/ApplicationList';
import ApplicationDetail from './legacy/components/ApplicationDetail';
import MilestoneContainer from './legacy/containers/MilestoneContainer';
import Milestone from './legacy/components/Milestone';
import MilestoneList from './legacy/components/MilestoneList';
import EventList from './legacy/components/EventList';
import IntegrationList from './legacy/components/IntegrationList';
import TaskPay from './legacy/components/TaskPay';
import Participation from './legacy/components/Participation';
import RateDevelopers from './legacy/components/RateDevelopers';
import UserPage from './legacy/routes/UserPage';
import UserList from './legacy/components/UserList';
import User from './legacy/components/User';
import InviteDeveloper from './legacy/containers/InviteDeveloper';
import MessagePage from './legacy/routes/MessagePage';
import ChannelContainer from './legacy/containers/ChannelContainer';
import ChannelForm from './legacy/components/ChannelForm';
import ChatBox from './legacy/components/ChatBox';
import MessageList from './legacy/components/MessageList';
import ProfilePage from './legacy/routes/ProfilePage';
import Profile from './legacy/components/Profile';
import Stack from './legacy/components/Stack';
import CompanyProfile from './legacy/components/CompanyProfile';
import Payoneer from './legacy/components/Payoneer';
import Account from './legacy/components/Account';
import IDDocument from './legacy/components/IDDocument';
import ProfilePicture from './legacy/components/ProfilePicture';
import PasswordChangeForm from './legacy/components/PasswordChangeForm';
import ProfileType from './legacy/components/ProfileType';
import PaymentList from './legacy/components/PaymentList';
import SupportPage from './legacy/routes/SupportPage';
import SupportSectionList from './legacy/components/SupportSectionList';
import SupportPageDetail from './legacy/components/SupportPageDetail';
import SearchPage from './legacy/routes/SearchPage';
import SupportPageList from './legacy/components/SupportPageList';
import EstimateContainer from './legacy/containers/EstimateContainer';
import EstimateDetailContainer from './legacy/containers/EstimateDetailContainer';
import EstimateForm from './legacy/components/EstimateForm';
import EstimateDetail from './legacy/components/EstimateDetail';
import EstimateList from './legacy/components/EstimateList';
import QuoteContainer from './legacy/containers/QuoteContainer';
import QuoteDetailContainer from './legacy/containers/QuoteDetailContainer';
import QuoteForm from './legacy/components/QuoteForm';
import QuoteDetail from './legacy/components/QuoteDetail';
import TaskWizard from './legacy/routes/TaskWizard';
import StoryPage from './legacy/routes/StoryPage';
//import TaskWizardLander from './legacy/routes/TaskWizardLander';
import MultiTaskPaymentContainer from './legacy/containers/MultiTaskPaymentContainer';
import MultiTaskPaymentDetailContainer from './legacy/containers/MultiTaskPaymentDetailContainer';
import MultiTaskPay from './legacy/components/MultiTaskPay';
import MultiTaskPayProcessing from './legacy/components/MultiTaskPayProcessing';
import QuizForm from './legacy/components/QuizForm';
import DeveloperProfile from './legacy/components/DeveloperProfile';
import TaskDocument from './legacy/components/TaskDocument';
import BlogContainer from './legacy/containers/BlogContainer';
import BlogDetailContainer from './legacy/containers/BlogDetailContainer';
import BlogForm from './legacy/components/BlogForm';
import BlogList from './legacy/components/BlogList';
import BlogDetail from './legacy/components/BlogDetail';
import FriendOfTungaPage from './legacy/routes/FriendsOfTunga';
import FriendOfTungaRulesPage from './legacy/routes/FriendsOfTungaRules';
import SkillPage from './legacy/routes/SkillPage';

let all_routes = (
    <Route>
        <IndexRoute component={LandingPage} />
        <Route path="agreement" component={Agreement} />
        <Route path="privacy" component={PrivacyPolicy} />
        <Route path="code-of-conduct" component={CodeOfConduct} />
        <Route path="our-story" component={StoryPage} />
        <Route path="quality" component={QualityPage} />
        <Route path="pricing" component={PricingPage} />
        <Route path="friends-of-tunga" component={FriendOfTungaPage} />
        <Route path="call" component={LandingPage} showCallWidget={true} />
        <Route
            path="friends-of-tunga-rules"
            component={FriendOfTungaRulesPage}
        />
        <Route path="developer" component={UserPage}>
            <IndexRoute component={DeveloperProfile} />
            <Route path=":userId" component={DeveloperProfile} />
        </Route>
        <Route path="welcome">
            <IndexRoute component={LandingPage} />
            <Route path=":skill" component={SkillPage} />
        </Route>
        <Route unauthedOnly={true}>
            {/* No Auth Pages */}
            <Route path="quiz">
                <IndexRoute component={QuizForm} />
                <Route path="*" component={QuizForm} />
            </Route>
            <Route path="start">
                <IndexRoute component={TaskWizard} />
                <Route path=":phase/:taskId" component={TaskWizard} />
                <Route path=":phase/:taskId/*" component={TaskWizard} />
                <Route path="*" component={TaskWizard} />
            </Route>
            <Route path="start-welcome">
                <IndexRoute component={TaskWizard} />
                <Route path=":phase/:taskId" component={TaskWizard} />
                <Route path=":phase/:taskId/*" component={TaskWizard} />
                <Route path="*" component={TaskWizard} />
            </Route>
            <Route path="start-outsource">
                <IndexRoute component={TaskWizard} />
                <Route path=":phase/:taskId" component={TaskWizard} />
                <Route path=":phase/:taskId/*" component={TaskWizard} />
                <Route path="*" component={TaskWizard} />
            </Route>
            <Route path="signin" component={SignInPage} />
            <Route path="signup">
                <IndexRedirect to="/signin" />
                <Route path="project-owner" component={SignUpPage} />
                <Route path="invite/:invitationKey" component={SignUpPage} />
                <Route path="developer">
                    <Route
                        path="invite/:invitationKey"
                        component={SignUpPage}
                    />
                    <Route path=":confirmationKey" component={SignUpPage} />
                </Route>
            </Route>
            <Route path="reset-password" component={PasswordResetPage} />
            <Route
                path="reset-password/confirm/:uid/:token"
                component={PasswordResetConfirmPage}
            />
            {/* End of No Auth Pages */}
        </Route>

        <Route component={AppWrapper} authedOrEmailOnly={true}>
            {/* Auth or Email Only Pages */}
            <Route authedOnly={true}>
                {/* Auth Only Pages */}
                <Route path="home" component={Home} />
                <Route path="profile" component={ProfilePage}>
                    <IndexRedirect to="personal" />
                    <Route path="personal" component={Profile} />
                    <Route path="stack" component={Stack} />
                    <Route path="company" component={CompanyProfile} />
                    <Route path="payment" component={Payoneer} />
                    <Route path="payment/:provider" component={Payoneer} />
                    <Route path="account" component={Account} />
                    <Route path="id-document" component={IDDocument} />
                    <Route path="photo" component={ProfilePicture} />
                    <Route path="security" component={PasswordChangeForm} />
                    <Route path="security" component={PasswordChangeForm} />
                    <Route path="complete" component={ProfileType} />
                    <Redirect path="*" to="personal" />
                </Route>
                <Route path="proposal" component={EstimateContainer}>
                    <IndexRoute component={EstimateList} />
                    <Route path="new" component={EstimateForm} />
                    <Route path="filter/:filter" component={EstimateList} />
                    <Route
                        path=":estimateId"
                        component={EstimateDetailContainer}>
                        <IndexRoute component={EstimateDetail} />
                        <Route path="edit" component={EstimateForm} />
                    </Route>
                </Route>
                <Redirect path="estimate*" to="proposal*" />
                <Route path="settings" component={SettingsPage} />
                <Route path="events" component={MilestoneContainer}>
                    <IndexRoute component={EventList} />
                </Route>
                <Route path="work" component={TaskContainer}>
                    <IndexRoute component={TaskList} />
                    <Route path="new" component={TaskForm} />
                    <Route path="filter/:filter" component={TaskList} />
                    <Route path="skill/:skill(/:filter)" component={TaskList} />
                    <Route path=":taskId" component={TaskDetailPage}>
                        <IndexRoute component={TaskWorkflow} />
                        <Route path="edit" crumb="Edit">
                            <IndexRoute component={TaskForm} />
                            {/*<Route path="complete-task" component={EditTaskSectionForm} crumb="Finalize Task"/>*/}
                            <Route
                                path=":editSection"
                                component={EditTaskSectionForm}
                                crumbs={{
                                    trello: 'Trello',
                                    'google-drive': 'Google Drive',
                                }}
                            />
                            <Route
                                path="participation"
                                component={TaskForm}
                                crumb="Participation"
                            />
                            <Route
                                path="payment-approval"
                                component={TaskForm}
                                crumb="Payment Review"
                            />
                            <Route path="*" component={TaskForm} />
                        </Route>
                        <Route
                            path="apply"
                            component={ApplicationForm}
                            crumb="Apply"
                        />
                        <Route
                            path="proposal"
                            component={EstimateContainer}
                            crumb="Proposal">
                            <IndexRedirect to="new" />
                            <Route path="new" component={EstimateForm} />
                            <Route
                                path=":estimateId"
                                component={EstimateDetailContainer}>
                                <IndexRoute component={EstimateDetail} />
                                <Route path="edit" component={EstimateForm} />
                            </Route>
                        </Route>
                        <Redirect path="estimate*" to="proposal*" />
                        <Route
                            path="planning"
                            component={QuoteContainer}
                            crumb="Planning">
                            <IndexRedirect to="new" />
                            <Route path="new" component={QuoteForm} />
                            <Route
                                path=":quoteId"
                                component={QuoteDetailContainer}>
                                <IndexRoute component={QuoteDetail} />
                                <Route path="edit" component={QuoteForm} />
                            </Route>
                        </Route>
                        <Route path="applications">
                            <IndexRoute
                                component={ApplicationList}
                                crumb="Applications"
                            />
                            <Route
                                path=":applicationId"
                                component={ApplicationDetail}
                            />
                        </Route>
                        <Route
                            path="board"
                            component={ProjectBoard}
                            crumb="Project Board"
                        />
                        <Route
                            path="task/new"
                            component={ProjectTaskForm}
                            crumb="Add task"
                        />
                        <Route
                            path="task/new/*"
                            component={ProjectTaskForm}
                            crumb="Add task"
                        />
                        <Route
                            path="documents"
                            component={TaskDocument}
                            crumb="Documents"
                        />
                        <Route path="integrations" crumb="Integrations">
                            <IndexRedirect
                                to="github"
                                component={IntegrationList}
                            />
                            <Route
                                path="trello"
                                component={TaskForm}
                                crumb="Trello"
                            />
                            <Route
                                path="google"
                                component={TaskForm}
                                crumb="Google Drive"
                            />
                            <Route
                                path=":provider"
                                component={IntegrationList}
                                crumb="Integrations"
                                crumbs={{slack: 'Slack', github: 'GitHub'}}
                            />
                        </Route>
                        <Route
                            path="invoice"
                            component={TaskPay}
                            crumb="Generate Invoice"
                        />
                        <Route
                            path="pay"
                            component={TaskPay}
                            crumb="Make Payment"
                        />
                        <Route
                            path="participation"
                            component={Participation}
                            crumb="Participation shares"
                        />
                        <Route
                            path="rate"
                            component={RateDevelopers}
                            crumb="Rate Developers"
                        />
                        <Route path="event" component={MilestoneContainer}>
                            <Route path=":eventId" component={Milestone} />
                        </Route>
                    </Route>
                    <Route path="*" component={TaskForm} />
                </Route>
                <Redirect path="task*" to="work*" />
                <Route path="conversation" component={MessagePage}>
                    <IndexRedirect to="start" />
                    <Route path="start" component={ChannelForm}>
                        <Route path=":recipientId" />
                        <Route path="task/:taskId" />
                    </Route>
                    <Route path=":channelId" component={ChannelContainer}>
                        <IndexRedirect to="messages" />
                        <Route path="edit" component={ChannelForm} />
                        <Route path=":channelView" component={ChatBox} />
                    </Route>
                </Route>
                <Redirect path="message*" to="channel" />
                <Redirect path="channel*" to="conversation*" />
                <Route path="payments" component={TaskContainer}>
                    <IndexRoute component={PaymentList} />
                    <Route path="filter/:filter" component={PaymentList} />
                    <Route path="bulk" component={MultiTaskPaymentContainer}>
                        <Route
                            path=":batchId"
                            component={MultiTaskPaymentDetailContainer}>
                            <IndexRoute component={MultiTaskPay} />
                            <Route
                                path="processing"
                                component={MultiTaskPayProcessing}
                            />
                        </Route>
                    </Route>
                </Route>
                <Route path="help" component={MessagePage}>
                    <Route path=":channelId" component={ChannelContainer}>
                        <IndexRoute component={ChatBox} />
                    </Route>
                </Route>
                <Route path="dashboard">
                    <Route path="updates" component={MilestoneContainer}>
                        <IndexRoute component={MilestoneList} />
                        <Route
                            path="filter/:filter"
                            component={MilestoneList}
                        />
                    </Route>
                </Route>
                <Route path="blog/admin" component={BlogContainer}>
                    <IndexRoute component={BlogList} />
                    <Route path="new" component={BlogForm} />
                    <Route path="filter/:filter" component={BlogList} />
                    <Route path=":blogId" component={BlogDetailContainer}>
                        <IndexRedirect to="edit" />
                        <Route path="edit" component={BlogForm} />
                    </Route>
                </Route>
                {/* End Auth Only Pages */}
            </Route>

            <Route path="people" component={UserPage}>
                <IndexRedirect to="filter/developers" />
                <Route path="filter/:filter" component={UserList} />
                <Route path="skill/:skill(/:filter)" component={UserList} />
                <Route path="invite" component={InviteDeveloper} />
                <Route path=":userId" component={User} />
            </Route>
            <Redirect path="member*" to="people*" />
            <Route path="support" component={SupportPage}>
                <IndexRoute component={SupportSectionList} />
                <Route path=":section">
                    <IndexRoute component={SupportPageList} />
                    <Route path="tag/:tag" component={SupportPageList} />
                    <Route path=":page" component={SupportPageDetail} />
                </Route>
            </Route>
            <Route path="search" component={SearchPage}>
                <IndexRedirect to="people" />
                <Route path="people" component={UserList} />
                <Route path="developers" component={UserList} />
                <Route path="tasks" component={TaskList} authedOnly={true} />
                <Route
                    path="messages"
                    component={MessageList}
                    authedOnly={true}
                />
                <Route path="support" component={SupportPageList} />
            </Route>
            {/* End Auth Only or Email Pages */}
        </Route>

        <Route path="blog" component={BlogContainer}>
            <IndexRedirect to="admin" />
            <Route path=":blogId" component={BlogDetailContainer}>
                <IndexRoute component={BlogDetail} />
            </Route>
            <Redirect path="*" to="admin*" />
        </Route>
        <Route
            path="customer/help/:chatId"
            component={LandingPage}
            unauthedOnly={true}
        />
        <Route path=":skill" component={SkillPage} />
        <Redirect path="*" to="home" />
    </Route>
);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <Route path="tunga">{all_routes}</Route>
                {all_routes}
            </Route>
        </Router>
    </Provider>,
    document.getElementById('content'),
);
