import React from 'react';

export default class Button extends React.Component {
    static propTypes = {
        type: React.PropTypes.string,
        className: React.PropTypes.string,
        variant: React.PropTypes.string,
        size: React.PropTypes.string,
    };

    static defaultProps = {
        type: 'button',
        variant: 'primary'
    };

    render() {
        return (
            <button type={this.props.type || 'button'}
                    className={`btn ${this.props.variant?`btn-${this.props.variant}`:''} ${this.props.className || ''} ${this.props.size ?`btn-${this.props.size}`:''}`}>
                {this.props.children}
            </button>
        );
    }
}
