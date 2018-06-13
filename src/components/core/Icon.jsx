import PropTypes from 'prop-types';
import React from 'react';

export default class Icon extends React.Component {
    static propTypes = {
        name: PropTypes.string,
        size: PropTypes.string,
        className: PropTypes.string,
    };

    render() {
        return (
            <i className={`tg-ic-${this.props.name || ''} ${this.props.size?`tunga-ic-sz-${this.props.size}`:''} ${this.props.className || ''}`}/>
        );
    }
}
