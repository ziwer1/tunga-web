import React from 'react'
import { Link, IndexLink } from 'react-router'
import RunningTasks from './RunningTasks'
import connect from '../utils/connectors/NotificationConnector'

class SideBar extends React.Component {

    componentDidMount() {
        $(document).ready(this.resizeSideBar);
        $(window).resize(this.resizeSideBar);
        if(this.props.Auth.isAuthenticated) {
            this.props.NotificationActions.getNotifications();
            setInterval(this.props.NotificationActions.getNotifications, 15000);
        }
    }

    resizeSideBar() {
        var running = $('#running-tasks');
        running.removeClass('bottom');
        var sidebar = $('#sidebar').height();
        var content = $('#sidebar .wrapper').height() + 40;
        if(content < sidebar) {
            running.addClass('bottom');
        }
    }

    render() {
        const { Auth, Notification } = this.props;
        const messages = Notification.notifications?Notification.notifications.messages:0;
        const tasks = Notification.notifications?Notification.notifications.tasks:0;
        const requests = Notification.notifications?Notification.notifications.requests:0;
        return (
            <div id="sidebar" className="col-sm-3 col-md-2 sidebar">
                <div className="wrapper" onClick={this.resizeSideBar.bind(this)}>
                    <ul className="nav nav-sidebar">
                        <li><Link to="/home" activeClassName="active">Home</Link></li>
                        {Auth.user.is_developer || Auth.user.is_staff?(<li><IndexLink to="/task" activeClassName="active">Find a task</IndexLink></li>):null}
                        {Auth.user.is_project_owner || Auth.user.is_staff?(
                        <li>
                            <a href="#" data-toggle="collapse" data-target="#dashboard-menu"><i className="fa fa-caret-down"/><i className="fa fa-caret-right"/> Work</a>
                            <ul id="dashboard-menu" className="nav">
                                {Auth.user.is_project_owner || Auth.user.is_staff?(<li><Link to="/task/new" activeClassName="active">Post a new task</Link></li>):null}
                                {Auth.user.is_project_owner || Auth.user.is_staff?(<li><Link to="/project/new" activeClassName="active">Create a project</Link></li>):null}
                                {Auth.user.is_project_owner || Auth.user.is_staff?(<li><Link to="/task/filter/my-tasks" activeClassName="active">My Tasks</Link></li>):null}
                                {/*<li><Link to="" activeClassName="active">Notifications</Link></li>*/}
                            </ul>
                        </li>
                            ):null}
                        <li><Link to="/message" activeClassName="active">Messages {messages?<span className="badge">{messages}</span>:null}</Link></li>
                        <li>
                            <a href="#" data-toggle="collapse" data-target="#tribe-menu" className="collapsed"><i className="fa fa-caret-down"/><i className="fa fa-caret-right"/> Tribe</a>
                            <ul id="tribe-menu" className="nav collapse">
                                <li><Link to="/member/filter/developers" activeClassName="active">Coders</Link></li>
                                {Auth.user.is_developer|| Auth.user.is_staff?(<li><Link to="/member/filter/project-owners" activeClassName="active">Clients</Link></li>):null}
                                {Auth.user.is_project_owner || Auth.user.is_staff?(<li><Link to="/member/filter/relevant" activeClassName="active">Relevant to me</Link></li>):null}
                                <li><Link to="/member/filter/team" activeClassName="active">{Auth.user.is_developer?'My friends':'My team'}</Link></li>
                                {Auth.user.is_developer?(<li><Link to="/member/filter/my-project-owners" activeClassName="active">My clients</Link></li>):null}
                                <li><Link to="/member/filter/requests" activeClassName="active">Requests {requests?<span className="badge">{requests}</span>:null}</Link></li>
                            </ul>
                        </li>

                        <li>
                            <a href="#" data-toggle="collapse" data-target="#payments-menu" className="collapsed"><i className="fa fa-caret-down"/><i className="fa fa-caret-right"/> Payments</a>
                            <ul id="payments-menu" className="nav collapse">
                                <li><Link to="/payments/pending" activeClassName="active">Pending Payments</Link></li>
                                <li><Link to="/payments/history" activeClassName="active">History</Link></li>
                            </ul>
                        </li>
                    </ul>

                    <RunningTasks onChange={this.resizeSideBar} num_tasks={tasks}/>
                </div>
            </div>
        );
    }
}

export default connect(SideBar);
