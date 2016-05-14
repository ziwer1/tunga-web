import React from 'react'
import { Link, IndexLink } from 'react-router'
import Progress from './status/Progress'
import LoadMore from './status/LoadMore'
import UserCard from './UserCard'
import SearchBox from './SearchBox'

export default class UserList extends React.Component {

    componentDidMount() {
        var filter = this.props.params.filter || null;
        this.props.UserActions.listUsers({filter});
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.location.pathname != this.props.location.pathname) {
            var filter = this.props.params.filter || null;
            this.props.UserActions.listUsers({filter});
        }
    }

    render() {
        const { Auth, User, UserActions, filter } = this.props;
        const page_title = {
            developers: 'All Developers',
            'project-owners': 'Project Owners',
            requests: 'Requests',
            relevant: 'Relevant',
            team: Auth.user.is_project_owner?'My Team':'My Friends',
            'my-project-owners': 'My Project Owners'
        };
        return (
            <div>
                {Auth.user.is_developer && ['developers', 'project-owners'].indexOf(this.props.params.filter) > -1?(
                <div>
                    <h2>Tunga Tribe</h2>
                    <ul className="nav nav-pills nav-top-filter">
                        <li role="presentation"><Link to="/member/filter/developers" activeClassName="active">Developers</Link></li>
                        <li role="presentation"><Link to="/member/filter/project-owners" activeClassName="active">Project Owners</Link></li>
                    </ul>
                </div>
                    ):(page_title[this.props.params.filter]?(
                <h2>{page_title[this.props.params.filter]}</h2>
                    ):null)}
                <SearchBox filter={{filter: filter}} placeholder="Search by name or skills" onSearch={UserActions.listUsers}/>
                {User.list.isFetching?
                    (<Progress/>)
                    :
                    (<div>
                        <div className="row flex-row">
                            {User.list.ids.map((id) => {
                                const user = User.list.users[id];
                                return(
                                <div className="col-sm-6 col-md-4" key={id}>
                                    <UserCard Auth={Auth} user={user} UserActions={UserActions}/>
                                </div>
                                    );
                                })}
                        </div>
                        <LoadMore url={User.list.next} callback={UserActions.listMoreUsers} loading={User.list.isFetchingMore}/>
                        {User.list.ids.length?'':(
                        <div className="alert alert-info">No users match your query</div>
                            )}
                    </div>)
                    }
            </div>
        );
    }
}
