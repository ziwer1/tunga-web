import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';

export default class StepThree extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        isSaving: PropTypes.object,
        isSaved: PropTypes.object,
        errors: PropTypes.object,
        ProfileActions: PropTypes.object,
    };

    render() {
        return (
            <div>
                // TODO: {this.constructor.name} form goes here

                <div><Link to="/onboard/finish">Next</Link></div>
            </div>
        );
    }
}