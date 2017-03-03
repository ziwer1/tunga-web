import React from 'react';

import UserPage from '../containers/UserPage';
import UserList from '../components/UserList';

import TaskPage from '../containers/TaskPage';
import TaskForm from '../components/TaskForm';

import { USER_TYPE_DEVELOPER } from '../constants/Api';

import createModal from '../components/Modal';

export function parse_task_status(task) {
    let work_type = task.is_project?'project':'task';
    var task_status = {message: `This ${work_type} is open for applications`, css: 'open'};
    if(task.closed) {
        task_status.message = `This ${work_type} is closed`;
        task_status.css = 'closed';
    } else if(!task.apply) {
        task_status.message =  `This ${work_type} is in progress`;
        task_status.css = 'in-progress';
    }
    return task_status;
}

export function openTaskWizard() {
    return createModal(
        <div className="task-wizard">
            <div className="task-section">
                <div className="title-bar">
                    <h2 className="title text-center">Hire top African coders!</h2>
                </div>
                <TaskPage>
                    <TaskForm/>
                </TaskPage>
            </div>
            <div className="dev-section">
                <h3 className="text-center">Our developers</h3>
                <div className="dev-list">
                    <UserPage>
                        <UserList hide_header={true} bsClass="col-xs-12" filters={{ filter: 'developers'}} max={5}/>
                    </UserPage>
                </div>
            </div>
            <div className="clearfix"></div>
        </div>, null, null, {className: "task-form-dialog", bsStyle: 'lg'}
    );
}

