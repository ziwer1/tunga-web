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
                <h2>Tasks</h2>
                {this.props.params.id?'':(
                <ul className="nav nav-pills nav-top-filter">
                    <li role="presentation"><IndexLink to="/task" activeClassName="active">All Tasks</IndexLink></li>
                    <li role="presentation"><Link to="/task/filter/skills" activeClassName="active">My Skills</Link></li>
                    <li role="presentation"><Link to="/task/filter/project-owners" activeClassName="active">My Companies</Link></li>
                    <li role="presentation"><Link to="/task/filter/saved" activeClassName="active">Saved</Link></li>
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
                                <div className="col-md-4" key={id}>
                                    <TaskCard Auth={Auth} task={task} TaskActions={TaskActions}/>
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
