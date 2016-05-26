import React from 'react'
import { Link, IndexLink } from 'react-router'
import Progress from './status/Progress'
import LoadMore from './status/LoadMore'
import TagList from './TagList'
import TaskCard from './TaskCard'
import SearchBox from './SearchBox'

export default class TaskList extends React.Component {

    componentDidMount() {
        var filter = this.props.params.filter || null;
        this.props.TaskActions.listTasks({filter});
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.location.pathname != this.props.location.pathname) {
            var filter = this.props.params.filter || null;
            this.props.TaskActions.listTasks({filter});
        }
    }

    render() {
        const { Auth, Task, TaskActions, filter } = this.props;
        return (
            <div>
                <h2>{this.props.params.filter == 'my-tasks' && !Auth.user.is_developer?'My ':null}Tasks</h2>
                {this.props.params.filter == 'my-tasks' && !Auth.user.is_developer?null:(
                <ul className="nav nav-pills nav-top-filter">
                    <li role="presentation"><IndexLink to="/task" activeClassName="active">All Tasks</IndexLink></li>
                    <li role="presentation"><Link to="/task/filter/skills" activeClassName="active">My Skills</Link></li>
                    <li role="presentation"><Link to="/task/filter/project-owners" activeClassName="active">My Companies</Link></li>
                    <li role="presentation"><Link to="/task/filter/saved" activeClassName="active">Saved</Link></li>
                    {Auth.user.is_developer?(
                    <li role="presentation"><Link to="/task/filter/my-tasks" activeClassName="active">My Tasks</Link></li>
                        ):null}
                </ul>
                    )}
                <SearchBox filter={{filter: filter}} placeholder="Search for tasks" onSearch={TaskActions.listTasks}/>
                {Task.list.isFetching?
                    (<Progress/>)
                    :
                    (<div>
                        <div className="row flex-row">
                            {Task.list.ids.map((id) => {
                                const task = Task.list.tasks[id];
                                return(
                                <div className="col-sm-6 col-md-4" key={id}>
                                    <TaskCard Auth={Auth} Task={Task} task={task} TaskActions={TaskActions}/>
                                </div>
                                    );
                                })}
                        </div>
                        <LoadMore url={Task.list.next} callback={TaskActions.listMoreTasks} loading={Task.list.isFetchingMore}/>
                        {Task.list.ids.length?'':(
                        <div className="alert alert-info">No tasks match your query</div>
                            )}
                    </div>)
                    }
            </div>
        );
    }
}
