import React from 'react';
import { Link, IndexLink } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

  import RunningTasks from './RunningTasks';
 import * as AuthActions from '../actions/AuthActions' 
import * as NotificationActions from '../actions/NotificationActions' 
import * as SupportSectionActions from '../actions/SupportSectionActions';
 import * as SupportPageActions from '../actions/SupportPageActions';

import { resizeSideBar } from '../utils/ui';

class SideBar extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    componentDidMount() {
        $(document).ready(resizeSideBar);
        $(window).resize(resizeSideBar);
        if(this.props.Auth.isAuthenticated) {
            this.props.NotificationActions.getNotifications();
            setInterval(this.props.NotificationActions.getNotifications, 15000);
        }

        const { SupportActions } = this.props;
        SupportActions.listSupportSections();
    }

    isActive(routes, index_only=true) {
        var results = routes.map(route => {
            return this.context.router.isActive(route, index_only);
        });
        return results.indexOf(true) > -1?true:false;
    }

    getActiveClass(routes, index_only=true) {
        return this.isActive(routes, index_only)?'active':'';
    }

    render() {
        const { Auth, Notification, Support } = this.props;
        const messages = Notification.notifications?Notification.notifications.messages:0;
        const tasks = Notification.notifications?Notification.notifications.tasks:0;
        const requests = Notification.notifications?Notification.notifications.requests:0;

        return (
            <div id="sidebar" className="col-xs-10 col-sm-3 col-md-2 sidebar collapse">
                <div className="wrapper" onClick={resizeSideBar()}>
                    <ul className="nav nav-sidebar">
                        <li><Link to="/home" activeClassName="active"><i className="menu-icon tunga-icon-home"/> Home</Link></li>
                        {Auth.user.is_developer || Auth.user.is_staff?(<li><IndexLink to="/task" activeClassName="active"><i className="menu-icon tunga-icon-search"/> Find a task</IndexLink></li>):null}
                        {Auth.user.is_project_owner || Auth.user.is_staff?(<li><Link to="/task/new" activeClassName="active"><i className="menu-icon tunga-icon-work"/> Post a task</Link></li>):null}
                        <li><Link to="/conversation" activeClassName="active"><i className="menu-icon tunga-icon-message"/> Messages {messages?<span className="badge">{messages}</span>:null}</Link></li>
                        <li className={this.getActiveClass(['/people'], false)}>
                            <a href="#" data-toggle="collapse" data-target="#tribe-menu"  className={this.isActive(['/people'], false)?"":"collapsed"}><i className="menu-icon tunga-icon-tribe"/> Tribe </a>
                            <ul id="tribe-menu" className={"nav collapse "+ (this.isActive(['/people'], false)?"in":"")}>
                                <li><Link to="/people/filter/developers" activeClassName="active">Coders</Link></li>
                                {Auth.user.is_developer|| Auth.user.is_staff?(<li><Link to="/people/filter/clients" activeClassName="active">Clients</Link></li>):null}
                                {Auth.user.is_project_owner || Auth.user.is_staff?(<li><Link to="/people/filter/relevant" activeClassName="active">Relevant to me</Link></li>):null}
                                <li><Link to="/people/filter/team" activeClassName="active">{Auth.user.is_developer?'My friends':'My team'}</Link></li>
                                {Auth.user.is_developer?(<li><Link to="/people/filter/my-clients" activeClassName="active">My clients</Link></li>):null}
                                <li><Link to="/people/filter/requests" activeClassName="active">Requests {requests?<span className="badge">{requests}</span>:null}</Link></li>
                            </ul>
                        </li>

                        <li><Link to="/payments" activeClassName="active"><i className="menu-icon tunga-icon-wallet"/> Payments</Link></li>

                        {Support.Section.list.sections.length?(
                            <li className={this.getActiveClass(['/support'], false)}>
                                <a href="#" data-toggle="collapse" data-target="#support-menu" className={this.isActive(['/support'], false)?"":"collapsed"}><i className="menu-icon tunga-icon-support"/> Support </a>
                                <ul id="support-menu" className={"nav collapse "+ (this.isActive(['/support'], false)?"in":"")}>
                                    {Support.Section.list.sections.map(section => {
                                        return (
                                            <li key={section.id}><Link to={`/support/${section.slug}`} activeClassName="active">{section.title}</Link></li>
                                        );
                                    })}
                                </ul>
                            </li>
                        ):null}
                    </ul>

                    <RunningTasks onChange={resizeSideBar} num_tasks={tasks}/>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) { 
    return {Auth: state.Auth, Support: state.Support, Notification: state.Notification}; 
}

  function mapDispatchToProps(dispatch) { 
  return { 
      AuthActions: bindActionCreators(AuthActions, dispatch), 
      NotificationActions: bindActionCreators(NotificationActions, dispatch), 
      SupportActions: { 
          ...bindActionCreators(SupportSectionActions, dispatch), 
          ...bindActionCreators(SupportPageActions, dispatch) 
      } 
  } 
}

 export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
