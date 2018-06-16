import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';

export default class Finish extends React.Component {
    static propTypes = {
        Auth: PropTypes.object,
        Profile: PropTypes.object,
        ProfileActions: PropTypes.object,
    };

    render() {
        return (
            <div>
                // TODO: {this.constructor.name} section goes here

                <div><Link to="/dashboard">Dashboard</Link></div>
            </div>
        );
    }
}
