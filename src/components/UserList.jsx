import React from 'react';
import { Link, IndexLink } from 'react-router';
import Progress from './status/Progress';
import LoadMore from './status/LoadMore';
import UserCard from './UserCard';
import SearchBox from './SearchBox';

export default class UserList extends React.Component {

    componentDidMount() {
        this.props.UserActions.listUsers({filter: this.getFilter(), skill: this.getSkill(), ...this.props.filters, search: this.props.search});
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(this.props.search);
        if(prevProps.location && this.props.location && prevProps.location.pathname != this.props.location.pathname || prevProps.search != this.props.search) {
            this.props.UserActions.listUsers({filter: this.getFilter(), skill: this.getSkill(), ...this.props.filters, search: this.props.search});
        }
    }

    getFilter() {
        if(this.props.params && this.props.params.filter) {
            return this.props.params.filter;
        }
        return null;
    }

    getSkill() {
        if(this.props.params && this.props.params.skill) {
            return this.props.params.skill;
        }
        return null;
    }

    render() {
        const { Auth, User, UserActions, params } = this.props;

        let filter = this.getFilter();
        let skill = this.getSkill();

        const page_title = {
            developers: 'All Coders',
            clients: 'Clients',
            requests: 'Requests',
            relevant: 'Relevant',
            team: Auth.user.is_project_owner?'My Team':'My Friends',
            'my-clients': 'My Clients'
        };

        return (
            <div>
                {this.props.hide_header?null:(
                <div>
                    {page_title[filter] || skill?(
                    <h2>{page_title[filter] || 'People'}</h2>
                        ):null}
                    {skill?(
                        <div className="nav-top-filter">
                            <Link to={`/people/skill/${skill}/`} className="active" style={{marginRight: '40px'}}><i className="tunga-icon-tag"/> {skill}</Link>
                            <Link to={`/people/skill/${skill}/developers/`} activeClassName="active">Coders</Link>
                            <Link to={`/people/skill/${skill}/clients/`} activeClassName="active">Clients</Link>
                        </div>
                    ):null}
                    <SearchBox placeholder="Search by name or skills"
                               filter={{filter, skill}}
                               onSearch={UserActions.listUsers}
                               count={User.list.count}/>
                </div>
                    )}
                {User.list.isFetching?
                    (<Progress/>)
                    :
                    (<div>
                        <div className="row flex-row">
                            {User.list.ids.map((id) => {
                                const user = User.list.users[id];
                                return(
                                <div className="col-sm-6 col-md-4" key={id}>
                                    <UserCard Auth={Auth} user={user} UserActions={UserActions} hideOnDisconnect={filter == 'team'}/>
                                </div>
                                    );
                                })}
                        </div>
                        <LoadMore url={User.list.next} callback={UserActions.listMoreUsers} loading={User.list.isFetchingMore}/>
                        {User.list.ids.length?null:(
                        <div className="alert alert-info">No users match your query</div>
                            )}
                    </div>)
                    }
            </div>
        );
    }
}
