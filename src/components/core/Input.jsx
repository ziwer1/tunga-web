import PropTypes from 'prop-types';
import React from 'react';
import {addEventListeners, INPUT_EVENTS} from "./utils";

export default class Input extends React.Component {
    static propTypes = {
        type: PropTypes.string,
        className: PropTypes.string,
        placeholder: PropTypes.string,
        size: PropTypes.string,
    };

    static defaultProps = {
        type: 'text'
    };

    render() {
        return (
            <input type={this.props.type || 'text'}
                   className={`form-control ${this.props.className || ''} ${this.props.size?`form-control-${this.props.size}`:''}`}
                   placeholder={this.props.placeholder} {...addEventListeners(INPUT_EVENTS, this.props)}/>
        );
    }
}
