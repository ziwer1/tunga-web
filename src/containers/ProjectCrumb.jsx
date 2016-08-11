import React from 'react';
import { Link } from 'react-router';
import { Breadcrumb } from 'react-bootstrap';
import connect from '../utils/connectors/ProjectConnector';

class ProjectCrumb extends React.Component {

    render() {
        const { Project, section } = this.props;
        const { project } = Project.detail;

        return (
            section?(
                <Breadcrumb>
                    <Breadcrumb.Item><Link to={`/project/${project.id}`}>{project.title}</Link></Breadcrumb.Item>
                    <Breadcrumb.Item active>{section}</Breadcrumb.Item>
                </Breadcrumb>
            ):null
        );
    }
}

ProjectCrumb.propTypes = {
    section: React.PropTypes.string.required
};

export default connect(ProjectCrumb);
