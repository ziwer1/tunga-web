import React from 'react';

import {addEventListeners, INPUT_EVENTS} from './utils';

export default class TextArea extends React.Component {
    static propTypes = {
        type: React.PropTypes.string,
        className: React.PropTypes.string,
        placeholder: React.PropTypes.string,
    };

    static defaultProps = {
        type: 'text'
    };

    render() {
        return (
            <textarea className={`form-control ${this.props.className || ''}`}
                      placeholder={this.props.placeholder}
                      {...addEventListeners(INPUT_EVENTS, this.props)}>
                {this.props.children}
            </textarea>
        );
    }
}
