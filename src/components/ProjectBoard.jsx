import React from 'react';
import { Link } from 'react-router';
import Progress from './status/Progress';
import ComponentWithModal from './ComponentWithModal';
import TaskPage from '../containers/TaskPage';
import TaskList from './TaskList';

import { isAdmin, getUser } from '../utils/auth';

export default class ProjectBoard extends ComponentWithModal {

    render() {

        const { Task } = this.props;
        const { task } = Task.detail;
        let is_admin_or_owner = getUser().id == task.user.id || isAdmin();

        return (
            Task.detail.isRetrieving?
            (<Progress/>)
            :task.id?(
            <div>
                {is_admin_or_owner?(
                <div>
                    <Link to={`/work/${task.id}/task/new`} className="btn">Add task</Link>

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
