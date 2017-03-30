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


if(__PRODUCTION__) {
    history.listen(location => {
        window.ga('send', 'pageview');
        window.twq('track', 'PageView');
    });
}

import App from 'containers/App';
import AppWrapper from 'containers/AppWrapper';
import LandingPage from 'containers/LandingPage';
import PricingPage from 'containers/PricingPage';
import HowItWorksPage from 'containers/HowItWorksPage';
import Home from 'containers/Home';
import SignInPage from 'containers/SignInPage';
import AccountType from 'containers/AccountType';
import SignUpPage from 'containers/SignUpPage';
import DeveloperApplication from 'containers/DeveloperApplication';
import PasswordResetPage from 'containers/PasswordResetPage';
import PasswordResetConfirmPage from 'containers/PasswordResetConfirmPage';
import Agreement from 'components/Agreement';
import PrivacyPolicy from 'components/PrivacyPolicy';
import CodeOfConduct from 'components/CodeOfConduct';
import SettingsPage from 'containers/SettingsPage';
import ProjectBoard from 'components/ProjectBoard';
import ProjectTaskForm from 'components/ProjectTaskForm';
import TaskContainer from 'containers/TaskContainer';
import TaskList from 'components/TaskList';
import TaskForm from 'components/TaskForm';
import EditTaskSectionForm from 'components/EditTaskSectionForm';
import TaskDetailContainer from 'containers/TaskDetailContainer';
import ApplicationForm from 'components/ApplicationForm';
import TaskWorflow from 'components/TaskWorflow';
import ApplicationList from 'components/ApplicationList';
import ApplicationDetail from 'components/ApplicationDetail';
import MilestoneContainer from 'containers/MilestoneContainer';
import Milestone from 'components/Milestone';
import MilestoneList from 'components/MilestoneList';
import IntegrationList from 'components/IntegrationList';
import TaskPay from 'components/TaskPay';
import Participation from 'components/Participation';
import RateDevelopers from 'components/RateDevelopers';
import UserPage from 'containers/UserPage';
import UserList from 'components/UserList';
import User from 'components/User';
import InviteDeveloper from 'containers/InviteDeveloper';
import MessagePage from 'containers/MessagePage';
import ChannelContainer from 'containers/ChannelContainer';
import ChannelForm from 'components/ChannelForm';
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
import EstimateContainer from 'containers/EstimateContainer';
import EstimateDetailContainer from 'containers/EstimateDetailContainer';
import EstimateForm from 'components/EstimateForm';
import EstimateDetail from 'components/EstimateDetail';
import QuoteContainer from 'containers/QuoteContainer';
import QuoteDetailContainer from 'containers/QuoteDetailContainer';
import QuoteForm from 'components/QuoteForm';
import QuoteDetail from 'components/QuoteDetail';


ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute component={LandingPage} unauthedOnly={true}/>
                <Route unauthedOnly={true}>
                    {/* No Auth Pages */}
                    <Route path="start" component={LandingPage} showTaskWizard={true}/>
                    <Route path="call" component={LandingPage} showCallWidget={true}/>
                    <Route path="how-it-works" component={HowItWorksPage}/>
                    <Route path="pricing" component={PricingPage}/>
                    <Route path="press" component={LandingPage}/>
                    <Route path="FAQ" component={LandingPage}/>
                    <Route path="press" component={LandingPage}/>
                    <Route path="agreement" component={Agreement}/>
                    <Route path="privacy" component={PrivacyPolicy}/>
                    <Route path="code-of-conduct" component={CodeOfConduct}/>
                    <Route path="signin" component={SignInPage}/>
                    <Route path="signup">
                        <IndexRedirect to="/signin"/>
                        {/*<IndexRoute component={AccountType} />*/}
                        <Route path="project-owner" component={SignUpPage} />
                        <Route path="invite/:invitationKey" component={SignUpPage} />
                        <Route path="developer">
                            {/*<IndexRoute component={DeveloperApplication}/>*/}
                            <Route path="invite/:invitationKey" component={SignUpPage} />
                            <Route path=":confirmationKey" component={SignUpPage} />
                        </Route>
                    </Route>
                    <Route path="reset-password" component={PasswordResetPage} />
                    <Route path="reset-password/confirm/:uid/:token" component={PasswordResetConfirmPage} />
                    {/* End of No Auth Pages */}
                </Route>

                <Route component={AppWrapper} authedOrEmailOnly={true}>
                    {/* Auth or Email Only Pages */}
                    <Route authedOnly={true}>
                        {/* Auth Only Pages */}
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
                        <Route path="work" component={TaskContainer}>
                            <IndexRoute component={TaskList}/>
                            <Route path="new" component={TaskForm} />
                            <Route path="filter/:filter" component={TaskList} />
                            <Route path="skill/:skill(/:filter)" component={TaskList} />
                            <Route path=":taskId" component={TaskDetailContainer}>
                                <IndexRoute component={TaskWorflow} />
                                <Route path="edit" crumb="Edit">
                                    <IndexRoute component={TaskForm} />
                                    {/*<Route path="complete-task" component={EditTaskSectionForm} crumb="Finalize Task"/>*/}
                                    <Route path=":editSection" component={EditTaskSectionForm} />
                                </Route>
                                <Route path="apply" component={ApplicationForm} crumb="Apply"/>
                                <Route path="estimate" component={EstimateContainer} crumb="Estimate">
                                    <IndexRedirect to="new"/>
                                    <Route path="new" component={EstimateForm}/>
                                    <Route path=":estimateId" component={EstimateDetailContainer}>
                                        <IndexRoute component={EstimateDetail}/>
                                        <Route path="edit" component={EstimateForm}/>
                                    </Route>
                                </Route>
                                <Route path="quote" component={QuoteContainer} crumb="Quote">
                                    <IndexRedirect to="new"/>
                                    <Route path="new" component={QuoteForm}/>
                                    <Route path=":quoteId" component={QuoteDetailContainer}>
                                        <IndexRoute component={QuoteDetail}/>
                                        <Route path="edit" component={QuoteForm}/>
                                    </Route>
                                </Route>
                                <Route path="quote" component={EstimateForm} crumb="Quote"/>
                                <Route path="applications">
                                    <IndexRoute component={ApplicationList} crumb="Applications"/>
                                    <Route path=":applicationId" component={ApplicationDetail}/>
                                </Route>
                                <Route path="board" component={ProjectBoard} crumb="Project Board"/>
                                <Route path="task/new" component={ProjectTaskForm} crumb="Add task"/>
                                <Route path="integrations" component={IntegrationList} crumb="Integrations">
                                    <IndexRedirect to="github" />
                                    <Route path=":provider" crumb="Integrations"/>
                                </Route>
                                <Route path="pay" component={TaskPay} crumb="Pay"/>
                                <Route path="participation" component={Participation} crumb="Participation shares"/>
                                <Route path="rate" component={RateDevelopers} crumb="Rate Developers"/>
                                <Route path="event" component={MilestoneContainer}>
                                    <Route path=":eventId" component={Milestone}/>
                                </Route>
                            </Route>
                        </Route>
                        <Redirect path="task*" to="work*"/>
                        <Route path="conversation" component={MessagePage}>
                            <IndexRedirect to="start"/>
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
                        <Redirect path="message*" to="channel"/>
                        <Redirect path="channel*" to="conversation*"/>
                        <Route path="payments" component={TaskContainer}>
                            <IndexRoute component={PaymentList}/>
                            <Route path=":filter" component={PaymentList}/>
                        </Route>
                        <Route path="help" component={MessagePage}>
                            <Route path=":channelId" component={ChannelContainer}>
                                <IndexRoute component={ChatBox} />
                            </Route>
                        </Route>
                        <Route path="dashboard">
                            <Route path="updates" component={MilestoneContainer}>
                                <IndexRoute component={MilestoneList}/>
                                <Route path="filter/:filter" component={MilestoneList} />
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
                    <Redirect path="member*" to="people*"/>
                    <Route path="support" component={SupportPage}>
                        <IndexRoute component={SupportSectionList}/>
                        <Route path=":section">
                            <IndexRoute component={SupportPageList}/>
                            <Route path="tag/:tag" component={SupportPageList} />
                            <Route path=":page" component={SupportPageDetail} />
                        </Route>
                    </Route>
                    <Route path="search" component={SearchPage}>
                        <IndexRedirect to="people"/>
                        <Route path="people" component={UserList} />
                        <Route path="developers" component={UserList} />
                        <Route path="tasks" component={TaskList} authedOnly={true}/>
                        <Route path="messages" component={MessageList} authedOnly={true}/>
                        <Route path="support" component={SupportPageList} />
                    </Route>
                    {/* End Auth Only or Email Pages */}
                </Route>
                <Route path="customer/help/:chatId" component={LandingPage} unauthedOnly={true}/>
                <Redirect path="*" to="home" />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('content')
);
