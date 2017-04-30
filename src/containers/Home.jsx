import React from 'react';
import {Link} from 'react-router';
import moment from 'moment';

import connect from '../utils/connectors/NotificationConnector';
import Clock from '../components/Clock';

import { getUser, isAdmin, isProjectManager } from '../utils/auth';

class Home extends React.Component {
    componentDidMount() {
        if (this.props.Auth.isAuthenticated) {
            this.props.NotificationActions.getNotifications();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.Auth.isAuthenticated != this.props.Auth.isAuthenticated) {
            this.props.NotificationActions.getNotifications();
        }
    }

    getGreetingTime() {
        var greeting = null; //return g

        const currentTime = new Date();
        let currentHour = currentTime.getHours();

        let start_afternoon = 12;
        let start_evening = 17;

        if (currentHour >= start_afternoon && currentHour < start_evening) {
            greeting = "afternoon";
        } else if (currentHour >= start_evening) {
            greeting = "evening";
        } else {
            greeting = "morning";
        }

        return greeting;
    }

    render() {
        const {Notification} = this.props;

        var imageNumber = (parseInt(moment().format('E') + moment().format('w')) % 5) + 1;

        return (
            <div className="home-page">
                <div className="bg-wrapper">
                    <img src={require(`../images/home/Image-${imageNumber}.jpg`)}/>
                </div>

                <div className="content">
                    <div className="card">
                        <p className="title">
                            Hello {getUser().first_name || getUser().display_name}!
                        </p>
                        <Clock/>
                    </div>

                    <div className={`notification-list ${isAdmin() || isProjectManager()?'large':''}`}>
                        <ul>
                            {Notification.notifications.profile &&
                            Notification.notifications.profile.missing &&
                            Notification.notifications.profile.missing.length?(
                                <li id="inner-my-profile">
                                    <Link to="/profile">
                                        <span className="icon">
                                            <i className="tunga-icon-profile"/> <span className="badge">{Notification.notifications.profile.missing.length}</span>
                                        </span><br/>
                                        My Profile
                                    </Link>
                                </li>
                            ):null}
                            {Notification.notifications.requests?(
                                <li id="inner-tribe">
                                    <Link to="/people/filter/requests">
                                <span className="icon">
                                    <i className="tunga-icon-tribe"/> <span className="badge">{Notification.notifications.requests}</span>
                                </span><br/>
                                        Tribe
                                    </Link>
                                </li>
                            ):null}
                            {Notification.notifications.messages?(
                                <li id="inner-my-messages">
                                    <Link to="/conversation">
                                <span className="icon">
                                    <i className="tunga-icon-message"/> <span className="badge">{Notification.notifications.messages}</span>
                                </span><br/>
                                        Messages
                                    </Link>
                                </li>
                            ):null}
                            {Notification.notifications.tasks?(
                                <li id="inner-running-tasks">
                                    <Link to="/work/filter/running">
                                <span className="icon">
                                    <i className="tunga-icon-running-tasks"/> <span className="badge">{Notification.notifications.tasks}</span>
                                </span><br/>
                                        Running tasks
                                    </Link>
                                </li>
                            ):null}
                            {isAdmin() || isProjectManager()?(
                                [
                                    Notification.notifications.estimates?(
                                        <li id="inner-estimates">
                                            <Link to="/work/filter/estimates">
                                            <span className="icon">
                                                <i className="tunga-icon-project"/> <span className="badge">{Notification.notifications.estimates}</span>
                                            </span><br/>
                                                Estimates
                                            </Link>
                                        </li>
                                    ):null,
                                    Notification.notifications.quotes?(
                                        <li id="inner-quotes">
                                            <Link to="/work/filter/quotes">
                                            <span className="icon">
                                                <i className="tunga-icon-project"/> <span className="badge">{Notification.notifications.quotes}</span>
                                            </span><br/>
                                                Quotes
                                            </Link>
                                        </li>
                                    ):null
                                ]
                            ):null}
                        </ul>
                    </div>
                </div>
            </div>

        );
    }
}

export default connect(Home);
