import React from 'react'
import { Link, IndexLink } from 'react-router'
import connect from '../utils/TaskConnector'

class RunningTasks extends React.Component {

    componentDidMount() {
        this.props.TaskActions.listRunningTasks();
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.onChange && prevProps.Task.running != this.props.Task.running) {
            this.props.onChange();
        }

        if(prevProps.num_tasks != this.props.num_tasks) {
            this.props.TaskActions.listRunningTasks();
        }
    }

    render() {
        const { Task } = this.props;
        return (
            <div id="running-tasks">
                <h5 className="title">Running Tasks</h5>
                <ul className="nav nav-sidebar">
                    {Task.running.map((task) => {
                        return (<li key={task.id}><Link to={`/task/${task.id}/`}>{task.title}</Link></li>)
                        })}
                </ul>
            </div>
        );
    }
}

export default connect(RunningTasks);
