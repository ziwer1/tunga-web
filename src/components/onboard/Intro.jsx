import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';

export default class Intro extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        isSaving: PropTypes.object,
        isSaved: PropTypes.object,
        ProfileActions: PropTypes.object,
    };

    render() {
        return (
            <div>
                // TODO: {this.constructor.name} section goes here

                <div><Link to="/onboard/step-one">Next</Link></div>
            </div>
        );
    }
}
