import React from 'react';

import UserPage from '../containers/UserPage';
import UserList from '../components/UserList';

import TaskContainer from '../containers/TaskContainer';
import TaskForm from '../components/TaskForm';

import createModal from '../components/Modal';
import {DEVELOPER_FEE, PM_FEE, SOCIAL_PROVIDERS, STATUS_SUBMITTED, STATUS_APPROVED, STATUS_ACCEPTED} from '../constants/Api';

import {isAdmin, getUser} from '../utils/auth';
import {parseNumber} from '../utils/helpers';

export function parse_task_status(task) {
    let work_type = task.is_project?'project':'task';
    var task_status = {message: `This ${work_type} is open for applications`, css: 'open'};
    if(task.closed) {
        task_status.message = `This ${work_type} is closed`;
        task_status.css = 'closed';
    } else if(!task.apply) {
        task_status.message =  `Applications ${work_type} are closed for this task`;
        task_status.css = 'in-progress';
    }
    return task_status;
}

export function openTaskWizard(options={}) {
    return createModal(
        <div className="task-wizard">
            <div className="task-section">
                <div className="title-bar">
                    <h2 className="title text-center">Hire top African coders!</h2>
                </div>
                <TaskContainer>
                    <TaskForm options={options}/>
                </TaskContainer>
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

export function getDevHours(activities) {
    if(!activities || !activities.length) {
        return 0;
    }
    return activities.map(function (activity) {
        return activity.hours;
    }).reduce((a,b) => {
        return parseInt(a)+parseInt(b);
    });
}

export function getPMHours(activities) {
    return 0.15*getDevHours(activities);
}

export function getTotalHours(activities) {
    let dev_hours = getDevHours(activities);
    return dev_hours + (0.15*dev_hours);
}

export function getDevPay(activities) {
    return DEVELOPER_FEE*getDevHours(activities);
}

export function getPMPay(activities) {
    return DEVELOPER_FEE*0.15*getDevHours(activities);
}

export function getTotalPay(activities) {
    let dev_hours = getDevHours(activities);
    return (DEVELOPER_FEE*dev_hours) + (PM_FEE*0.15*dev_hours);
}

export function getPayDetails(activities) {
    let dev_hours = getDevHours(activities);
    var details = {
        dev: {
            hours: dev_hours,
            fee: parseNumber(DEVELOPER_FEE*dev_hours)
        }
    };

    details.pm = {
        hours: parseNumber(0.15*dev_hours),
        fee: parseNumber(PM_FEE*0.15*dev_hours)
    };

    details.total = {
        hours: parseNumber(details.dev.hours + parseFloat(details.pm.hours)),
        fee: parseNumber(parseFloat(details.dev.fee) + parseFloat(details.pm.fee))
    };
    return details;
}

export function isTaskOwner(task) {
    return (task.user && task.user.id == getUser().id);
}

export function isTaskPM(task) {
    return (task.pm && task.pm.id == getUser().id);
}

export function canAddEstimate(task) {
    return (!task.estimate && (isAdmin() || isTaskPM(task)));
}

export function canEditEstimate(task) {
    return (
        task.estimate && (
        [STATUS_SUBMITTED, STATUS_ACCEPTED, STATUS_APPROVED].indexOf(task.estimate.status) == -1 && (isAdmin() || isTaskPM(task))
        )
    )
}

export function canModerateEstimate(task) {
    return (
        task.estimate && task.estimate.status == STATUS_SUBMITTED && isAdmin()
    )
}

export function canReviewEstimate(task) {
    return (
        task.estimate && task.estimate.status == STATUS_APPROVED && (isTaskOwner(task) || (isAdmin() && (__PRERELEASE__ || __DEV__)))
    )
}

export function canViewEstimate(task) {
    return task.estimate && (isAdmin() || isTaskPM(task) || isTaskOwner(task))
}

export function isEstimationComplete(task) {
    return (task.estimate && task.estimate.status == STATUS_ACCEPTED);
}

export function canAddQuote(task) {
    return (isEstimationComplete(task) && !task.quote && (isAdmin() || isTaskPM(task)));
}

export function canEditQuote(task) {
    console.log(task.quote);
    return (
        task.quote && (
            [STATUS_SUBMITTED, STATUS_ACCEPTED, STATUS_APPROVED].indexOf(task.quote.status) == -1 && (isAdmin() || isTaskPM(task))
        )
    )
}

export function canModerateQuote(task) {
    return (
        task.quote && task.quote.status == STATUS_SUBMITTED && isAdmin()
    )
}

export function canReviewQuote(task) {
    return (
        task.quote && task.quote.status == STATUS_APPROVED && (isTaskOwner(task) || (isAdmin() && (__PRERELEASE__ || __DEV__)))
    )
}

export function canViewQuote(task) {
    return task.quote && (isAdmin() || isTaskPM(task) || isTaskOwner(task))
}

