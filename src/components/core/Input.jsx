import React from 'react';

export default class Input extends React.Component {
    static propTypes = {
        type: React.PropTypes.string,
        className: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        size: React.PropTypes.string,
    };

    static defaultProps = {
        type: 'text'
    };

    render() {
        return (
            <input type={this.props.type || 'text'}
                   className={`form-control ${this.props.className || ''} ${this.props.size?`form-control-${this.props.size}`:''}`}
                   placeholder={this.props.placeholder}/>
        );
    }
}
