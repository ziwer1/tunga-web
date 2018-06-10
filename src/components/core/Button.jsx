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

    addEventListeners() {
        let eventHandlers = {};
        ['onClick'].map(handler => {
            if(this.props[handler]) {
                eventHandlers[handler] = this.props[handler];
            }
        });
        return eventHandlers;
    }

    render() {
        return (
            <button type={this.props.type || 'button'}
                    className={`btn btn-${this.props.variant || 'primary'} ${this.props.className || ''} ${this.props.size ?`btn-${this.props.size}`:''}`}
                    {...this.addEventListeners()}>
                {this.props.children}
            </button>
        );
    }
}
