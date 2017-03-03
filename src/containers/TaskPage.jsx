import React from 'react';
import connect from '../utils/connectors/TaskConnector';

class TaskPage extends React.Component {

    renderChildren() {
        return React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {
                Task: this.props.Task,
                TaskActions: this.props.TaskActions
            });
        }.bind(this));
    }

    render() {
        return (
            <div>
                {this.renderChildren()}
            </div>
        );
    }
}

export default connect(TaskPage);
