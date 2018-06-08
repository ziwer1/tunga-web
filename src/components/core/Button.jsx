import React from 'react';

export default class Button extends React.Component {
    static propTypes = {
        type: React.PropTypes.string,
        className: React.PropTypes.string,
        variant: React.PropTypes.string,
    };

    static defaultProps = {
        type: 'button',
        variant: ''
    };

    render() {
        return (
            <button type={this.props.type || 'button'}
                    className={`btn ${this.props.variant?`btn-${this.props.variant}`:''} ${this.props.className || ''}`}>
                {this.props.children}
            </button>
        );
    }
}
