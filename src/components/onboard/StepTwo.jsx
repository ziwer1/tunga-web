import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';

export default class StepTwo extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        isSaving: PropTypes.object,
        isSaved: PropTypes.object,
        ProfileActions: PropTypes.object,
    };

    render() {
        return (
            <div>
                // TODO: {this.constructor.name} form goes here

                <div><Link to="/onboard/step-three">Next</Link></div>
            </div>
        );
    }
}
