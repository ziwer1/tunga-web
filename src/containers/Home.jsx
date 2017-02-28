import React from 'react';
import {Link} from 'react-router';
import connect from '../utils/connectors/NotificationConnector';
import Progress from '../components/status/Progress';
import Clock from '../components/Clock';

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
        const {Notification, Auth} = this.props;
        return (
            <div className="home-page">
                <div className="bg-wrapper">
                    <img src={require("../images/home/image-5.jpg")}/>
                </div>

                <div className="content">
                    <div className="card">
                        <p className="title">
                            Hello {Auth.user.first_name || Auth.user.display_name}!
                        </p>
                        <Clock/>
                    </div>

                    <div className="notification-list">
                        <ul>
                            <li>
                                <Link to="/profile">
                                <span className="icon">
                                    <i className="tunga-icon-profile"/>
                                    {Notification.notifications.profile &&
                                    Notification.notifications.profile.missing &&
                                    Notification.notifications.profile.missing.length?(
                                        <span className="badge">{Notification.notifications.profile.missing.length}</span>
                                    ):null}
                                </span><br/>
                                    My Profile
                                </Link>
                            </li>
                            <li>
                                <Link to="/people/filter/requests">
                                <span className="icon">
                                    <i className="tunga-icon-tribe"/>
                                    {Notification.notifications.requests?(
                                        <span className="badge">{Notification.notifications.requests}</span>
                                    ):null}
                                </span><br/>
                                    Tribe
                                </Link>
                            </li>
                            <li>
                                <Link to="/conversation">
                                <span className="icon">
                                    <i className="tunga-icon-message"/>
                                    {Notification.notifications.messages?(
                                        <span className="badge">{Notification.notifications.messages}</span>
                                    ):null}
                                </span><br/>
                                    Messages
                                </Link>
                            </li>
                            <li>
                                <Link to="/work/filter/running">
                                <span className="icon">
                                    <i className="tunga-icon-running-tasks"/>
                                    {Notification.notifications.tasks?(
                                        <span className="badge">{Notification.notifications.tasks}</span>
                                    ):null}
                                </span><br/>
                                    Running tasks
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        );
    }
}

export default connect(Home);
