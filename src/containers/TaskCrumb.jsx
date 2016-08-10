import React from 'react';
import { Link } from 'react-router';
import { Breadcrumb } from 'react-bootstrap';
import connect from '../utils/connectors/TaskConnector';

class TaskCrumb extends React.Component {

    render() {
        const { Task, section } = this.props;
        const { task } = Task.detail;

        return (
            section?(
                <Breadcrumb>
                    <Breadcrumb.Item><Link to={`/task/${task.id}`} query={{nr: 'true'}}>{task.title}</Link></Breadcrumb.Item>
                    <Breadcrumb.Item active>{this.props.section}</Breadcrumb.Item>
                </Breadcrumb>
            ):null
        );
    }
}

TaskCrumb.propTypes = {
    section: React.PropTypes.string.required
};

export default connect(TaskCrumb);
