import React from 'react';
import { Link, IndexLink } from 'react-router';
import connect from '../utils/connectors/TaskConnector';

class RunningTasks extends React.Component {

    componentDidUpdate(prevProps, prevState) {
        if(this.props.onChange && prevProps.Task.running != this.props.Task.running) {
            this.props.onChange();
        }

        if(prevProps.num_tasks != this.props.num_tasks) {
            this.props.TaskActions.listRunningTasks();
        }
    }

    render() {
        const { Auth, Task } = this.props;
        return (
            <div id="running-tasks">
                <ul className="nav nav-sidebar">
                    <li>
                        <div><i className="menu-icon tunga-icon-running-tasks"/> running tasks</div>
                        <ul className="nav">
                            {Auth.running.projects.map((project) => {
                                return (
                                    <li key={project.id}>
                                        <Link to={`/project/${project.id}/`} activeClassName="active" data-toggle="collapse" data-target={`#project-tasks-${project.id}`} className="collapsed"> {project.title}</Link>
                                        <ul id={`project-tasks-${project.id}`} className="nav collapse">
                                            {project.details.tasks.map((task) => {
                                                return task.closed?null:(<li key={task.id}><Link to={`/work/${task.id}/`} activeClassName="active">{task.title}</Link></li>)
                                            })}
                                        </ul>
                                    </li>
                                )
                            })}
                            {Auth.running.tasks.map((task) => {
                                return task.project && Auth.user.id == task.details.project.user.id?null:(<li key={task.id}><Link to={`/work/${task.id}/`} activeClassName="active">{task.title}</Link></li>)
                            })}
                        </ul>
                    </li>
                </ul>
            </div>
        );
    }
}

export default connect(RunningTasks);
