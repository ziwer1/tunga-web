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
                    <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2">
                        <img src={require("../images/home-bg.jpg")}/>
                    </div>
                </div>

                <Clock/>

                <h1 className="title">
                    Good {this.getGreetingTime()} {Auth.user.first_name || Auth.user.display_name}!</h1>
                <div className="notification-list">
                    {Notification.notifications ? (
                        <ul>
                            {Notification.notifications.profile || !Auth.user.can_contribute ? (
                                <li>
                                    <Link to="/profile">Update profile</Link>
                                    <div>Please update <strong>your profile</strong></div>
                                </li>
                            ) : null}
                            {Notification.notifications.messages ? (
                                <li>
                                    <Link to="/conversation">View messages</Link>
                                    <div>Please read <strong>your messages</strong></div>
                                </li>
                            ) : null}
                            {Notification.notifications.tasks ? (
                                <li>
                                    <Link to="/task">View tasks</Link>
                                    <div>Please check on <strong>your running tasks</strong></div>
                                </li>
                            ) : null}
                            {Notification.notifications.requests ? (
                                <li>
                                    <Link to="/people/filter/requests">View requests {Auth.user.is_project_owner ? 'from developers' : ''}</Link>
                                    <div>Please respond to <strong>your requests</strong></div>
                                </li>
                            ) : null}
                        </ul>
                    ) : (<div className="alert">You have no new notifications</div>)}
                </div>
            </div>

        );
    }
}

export default connect(Home);
