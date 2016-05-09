import React from 'react'
import { Link } from 'react-router'
import connect from '../utils/NotificationConnector'
import Progress from '../components/status/Progress'

class Home extends React.Component {
    componentDidMount() {
        if(this.props.Auth.isAuthenticated) {
            this.props.NotificationActions.getNotifications();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.Auth.isAuthenticated != this.props.Auth.isAuthenticated) {
            this.props.NotificationActions.getNotifications();
        }
    }

    render() {
        const { Notification, Auth } = this.props;
        return (
            <div className="home-page">
                <div className="bg-wrapper">
                    <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2">
                        <img src={require("../images/home-bg.jpg")} />
                    </div>
                </div>
                <h1 className="title">Hi {Auth.user.first_name || Auth.user.display_name}!</h1>
                <div className="notification-list">
                    {Notification.notifications?(
                    <ul>
                        {Notification.notifications.messages?(
                        <li><Link to="/message/inbox">You have {Notification.notifications.messages} unread messages <i className="fa fa-caret-right"/></Link></li>
                            ):''}
                        {Notification.notifications.tasks?(
                        <li><Link to="/task">You have {Notification.notifications.tasks} tasks running <i className="fa fa-caret-right"/></Link></li>
                            ):''}
                        {Notification.notifications.notifications?(
                        <li><Link to="">You have new {Notification.notifications.notifications} notification</Link></li>
                            ):''}
                        {Notification.notifications.profile && Notification.notifications.profile.count?(
                        <li><Link to="/profile">Update your profile now, {Notification.notifications.profile.missing.length?`there are ${Notification.notifications.profile.missing.length} fields missing`:null}</Link></li>
                            ):''}
                        {Notification.notifications.requests?(
                        <li><Link to="/member/filter/requests">You have {Notification.notifications.requests} requests {Auth.user.is_project_owner?'from developers':''}</Link></li>
                            ):''}
                    </ul>
                        ):(<div className="alert">You have no new notifications</div>)}
                </div>
            </div>

        );
    }
}

export default connect(Home);
