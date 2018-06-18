import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';

export default class ProjectCard extends React.Component {
    static propTypes = {
        project: PropTypes.object
    };

    render() {
        const {project} = this.props;

        return (
            project?(
                <div className="project-card">
                    <Link to={`/projects/${project.id}`}>{project.title}</Link>
                </div>
            ):null
        );
    }
}
