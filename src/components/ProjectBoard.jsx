import React from 'react';
import { Link } from 'react-router';
import Progress from './status/Progress';
import ComponentWithModal from './ComponentWithModal';
import TaskPage from '../containers/TaskPage';
import TaskList from './TaskList';

export default class ProjectBoard extends ComponentWithModal {

    render() {

        const { Auth, Task, TaskActions } = this.props;
        const { task } = Task.detail;
        let is_admin_or_owner = Auth.user.id == task.user.id || Auth.user.is_staff;

        return (
            Task.detail.isRetrieving?
            (<Progress/>)
            :task.id?(
            <div>
                {is_admin_or_owner?(
                <div>
                    <Link to={`/task/${task.id}/task/new`} className="btn">Add task</Link>

                    <div style={{marginTop: '10px'}}>
                        <TaskPage>
                            <TaskList project={task} hide_header={true} filters={{parent: task.id}}></TaskList>
                        </TaskPage>
                    </div>
                </div>
                    ):null}
            </div>
        ):(
            <div className="alert alert-danger">Project not found</div>
        )
        );
    }
}
