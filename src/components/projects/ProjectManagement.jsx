import PropTypes from 'prop-types';
import React from 'react';

export default class ProjectManagement extends React.Component {
    static propTypes = {
        project: PropTypes.object
    };

    render() {
        const {project} = this.props;

        return (
            project?(
                <div className="project-page">
                    {project.title}
                </div>
            ):null
        );
    }
}
