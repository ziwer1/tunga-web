import React from 'react'
import connect from '../utils/connectors/ProjectConnector'

class ProjectPage extends React.Component {

    renderChildren() {
        return React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {
                Auth: this.props.Auth,
                Project: this.props.Project,
                Task: this.props.Task,
                ProjectActions: this.props.ProjectActions,
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

export default connect(ProjectPage);
