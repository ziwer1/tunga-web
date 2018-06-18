import PropTypes from 'prop-types';
import React from 'react';

export default class ProjectForm extends React.Component {
    static propTypes = {
        Project: PropTypes.object,
        ProjectActions: PropTypes.object,
    };

    render() {

        return (
            <div className="content-card project-form-card">
                // TODO: Project form goes here
            </div>
        );
    }
}
