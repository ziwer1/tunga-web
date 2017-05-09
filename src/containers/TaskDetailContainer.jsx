import React from 'react';

import Progress from '../components/status/Progress';

export default class TaskDetailContainer extends React.Component {

    componentDidMount() {
        const {taskId, editToken} = this.props;
        this.props.TaskActions.retrieveTask(taskId, editToken);
    }

    componentDidUpdate(prevProps, prevState) {
        const {taskId} = this.props;
        if(taskId != prevProps.taskId) {
            this.props.TaskActions.retrieveTask(taskId, editToken);
        }
    }

    renderChildren() {
        return React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {
                Task: this.props.Task,
                task: this.props.Task.detail.task,
                editToken: this.props.editToken,
                TaskActions: this.props.TaskActions,
                location: this.props.location
            });
        }.bind(this));
    }

    render() {
        const { Task } = this.props;

        return (
            Task.detail.isRetrieving?(
                <Progress/>
            ):(
                <div>
                    {this.renderChildren()}
                </div>
            ));
    }
}

TaskDetailContainer.contextTypes = {
    router: React.PropTypes.object.isRequired
};
