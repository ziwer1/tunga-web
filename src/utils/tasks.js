export function parse_task_status(task) {
    var task_status = {message: 'This task is open for applications', css: 'open'};
    if(task.closed) {
        task_status.message = 'This task is closed';
        task_status.css = 'closed';
    } else if(!task.apply) {
        task_status.message =  'This task is in progress';
        task_status.css = 'in-progress';
    }
    return task_status;
}
