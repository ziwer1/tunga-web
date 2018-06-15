import PropTypes from 'prop-types';
import React from 'react';

export default class Payment extends React.Component {
    static propTypes = {
        Auth: PropTypes.object,
        Profile: PropTypes.object,
        ProfileActions: PropTypes.object,
    };

    render() {
        return (
            <div>
                // TODO: {this.constructor.name} form goes here
            </div>
        );
    }
}
