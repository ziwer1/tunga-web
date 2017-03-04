import React from 'react';
import {Link} from 'react-router';
import Progress from './status/Progress';
import LoadMore from './status/LoadMore';
import UserCard from './UserCard';
import SearchBox from './SearchBox';

import { isAuthenticated, isAdmin, isDeveloper, isProjectOwner } from '../utils/auth';

export default class UserList extends React.Component {

    componentDidMount() {
        this.props.UserActions.listUsers({
            filter: this.getFilter(),
            skill: this.getSkill(), ...this.props.filters,
            search: this.props.search
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.location && this.props.location && prevProps.location.pathname != this.props.location.pathname || prevProps.search != this.props.search) {
            this.props.UserActions.listUsers({
                filter: this.getFilter(),
                skill: this.getSkill(), ...this.props.filters,
                search: this.props.search
            });
        }
    }

    getFilter() {
        if (this.props.params && this.props.params.filter) {
            return this.props.params.filter;
        }
        return null;
    }

    getSkill() {
        if (this.props.params && this.props.params.skill) {
            return this.props.params.skill;
        }
        return null;
    }

    render() {
        const {User, Notification, UserActions, bsClass, max} = this.props;
        const requests = Notification && Notification.notifications ? Notification.notifications.requests : 0;

        let filter = this.getFilter();
        let skill = this.getSkill();

        var all_users = User.list.ids;
        if(max > 0) {
            all_users = all_users.slice(0, max);
        }

        return (
            <div>
                {this.props.hide_header ? null : (
                    <div>
                        <div className="clearfix">
                            <div className="pull-right">
                                <SearchBox placeholder="Search by name or skills"
                                           filter={{filter, skill}}
                                           onSearch={UserActions.listUsers}
                                           count={User.list.count}/>
                            </div>
                            <h2 className="pull-left">People</h2>
                        </div>
                        <div className="nav-top-filter">
                            <Link to="/people/filter/developers" activeClassName="active">Developers</Link>
                            {isAuthenticated() ? (
                                [
                                    isAdmin() ? (
                                        <Link to="/people/filter/clients" key="clients"
                                              activeClassName="active">Clients</Link>) : null,
                                    <Link to="/people/filter/team" activeClassName="active" key="team">
                                        {isDeveloper() ? 'My friends' : 'My team'}
                                    </Link>,
                                    isDeveloper() ? (
                                        <Link to="/people/filter/my-clients" key="my-clients" activeClassName="active">My Clients</Link>
                                    ) : null,
                                    <Link to="/people/filter/requests" activeClassName="active"  key="requests"
                                          style={{marginLeft: '20px'}}>
                                        Requests {requests ? <span className="badge">{requests}</span> : null}
                                    </Link>,
                                    isProjectOwner() || isAdmin() ? (
                                        <Link to="/people/filter/relevant" key="relevant" activeClassName="active">Relevant to
                                            me</Link>
                                    ) : null
                                ]
                            ) : null}
                            {skill ? (
                                <Link to={`/people/skill/${skill}/`} className="active" style={{marginLeft: '20px'}}>
                                    <i className="tunga-icon-tag"/> {skill}
                                </Link>
                            ) : null}
                        </div>
                    </div>
                )}
                {User.list.isFetching ?
                    (<Progress/>)
                    :
                    (<div>
                        <div className="row flex-row">
                            {all_users.map((id) => {
                                const user = User.list.users[id];
                                return (
                                    <div className={bsClass || "col-sm-6 col-md-4"} key={id}>
                                        <UserCard user={user} UserActions={UserActions}
                                                  hideOnDisconnect={filter == 'team'}/>
                                    </div>
                                );
                            })}
                        </div>
                        {all_users.length < max?(
                            <LoadMore url={User.list.next} callback={UserActions.listMoreUsers}
                                      loading={User.list.isFetchingMore}/>
                        ):null}
                        {User.list.ids.length ? null : (
                            <div className="alert alert-info">No users match your query</div>
                        )}
                    </div>)
                }
            </div>
        );
    }
}

UserList.propTypes = {
    hide_header: React.PropTypes.bool,
    bsClass: React.PropTypes.string,
    max: React.PropTypes.number
};

UserList.defaultProps = {
    hide_header: false,
    bsClass: 'col-sm-6 col-md-4',
    max: 0
};
