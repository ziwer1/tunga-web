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
