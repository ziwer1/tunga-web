import PropTypes from 'prop-types';
import React from 'react';

import {addEventListeners, BUTTON_EVENTS} from './utils';

export default class Button extends React.Component {
    static defaultProps = {
        type: 'button',
        variant: 'primary'
    };

    static propTypes = {
        type: PropTypes.string,
        className: PropTypes.string,
        variant: PropTypes.string,
        size: PropTypes.string,
    };

    render() {
        return (
            <button type={this.props.type || 'button'}
                    className={`btn btn-${this.props.variant || 'primary'} ${this.props.className || ''} ${this.props.size ?`btn-${this.props.size}`:''}`}
                    {...addEventListeners(BUTTON_EVENTS, this.props)}>
                {this.props.children}
            </button>
        );
    }
}
