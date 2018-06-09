import React from 'react';

export default class Icon extends React.Component {
    static propTypes = {
        name: React.PropTypes.string,
        size: React.PropTypes.string,
        className: React.PropTypes.string,
    };

    render() {
        return (
            <i className={`tg-ic-${this.props.name || ''} ${this.props.size?`tunga-ic-sz-${this.props.size}`:''} ${this.props.className || ''}`}/>
        );
    }
}
