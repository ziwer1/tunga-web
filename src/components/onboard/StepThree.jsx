import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';

export default class StepThree extends React.Component {
    static propTypes = {
        Auth: PropTypes.object,
        Profile: PropTypes.object,
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
