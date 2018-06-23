import PropTypes from 'prop-types';
import React from 'react';

export default class Team extends React.Component {
    static propTypes = {
        project: PropTypes.object,
        ProjectActions: PropTypes.object,
    };

    render() {
        return (
            <div>
                // TODO: {this.constructor.name} form goes here
            </div>
        );
    }
}
