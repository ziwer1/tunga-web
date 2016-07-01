import React from 'react'
import { Link, IndexLink } from 'react-router'
import Progress from './status/Progress'
import LoadMore from './status/LoadMore'
import UserCard from './UserCard'
import SearchBox from './SearchBox'

export default class UserList extends React.Component {

    componentDidMount() {
        var filter = null;
        if(this.props.params && this.props.params.filter) {
            filter = this.props.params.filter;
        }
        this.props.UserActions.listUsers({filter, ...this.props.filters, search: this.props.search});
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.location && this.props.location && prevProps.location.pathname != this.props.location.pathname || prevProps.search != this.props.search) {
            var filter = null;
            if(this.props.params && this.props.params.filter) {
                filter = this.props.params.filter;
            }
            this.props.UserActions.listUsers({filter, ...this.props.filters, search: this.props.search});
        }
    }

    render() {
        const { Auth, User, UserActions, params } = this.props;

        var filter = null;
        if(params && params.filter) {
            filter = this.props.params.filter;
        }

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
                {this.props.hide_header?null:(
                <div>
                    {page_title[filter]?(
                    <h2>{page_title[filter]}</h2>
                        ):null}
                    <SearchBox placeholder="Search by name or skills"
                               filter={{filter: filter}}
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
                        {User.list.ids.length?'':(
                        <div className="alert alert-info">No users match your query</div>
                            )}
                    </div>)
                    }
            </div>
        );
    }
}
