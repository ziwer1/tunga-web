import PropTypes from 'prop-types';
import React from 'react';

import Button from './Button';

import {filterEventProps} from "./utils";

export default class ChoiceGroup extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        choices: PropTypes.array,
        selected: PropTypes.any,
        onChange: PropTypes.func,
        type: PropTypes.string,
        variant: PropTypes.string,
        size: PropTypes.string,
    };

    static defaultProps = {
        variant: 'choice',
        choices: []
    };

    constructor(props) {
        super(props);
        this.state = {selected: props.selected};
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.selected !== this.props.selected) {
            this.setState({selected: nextProps.selected});
        }
    }

    onChange(choice) {
        this.setState({selected: choice});
        if(this.props.onChange) {
            this.props.onChange(choice);
        }
    }

    render() {
        return (
            <div className={`btn-group choice-group ${this.props.className || ''}`}>
                {this.props.choices.map(choice => {
                    return (
                        <Button variant={this.props.variant || 'choice'}
                                size={this.props.size}
                                className={`${this.state.selected === choice[0]?'active':''}`}
                                {...filterEventProps(this.props)}
                                onClick={this.onChange.bind(this, choice[0])}>{choice[1]}</Button>
                    );
                })}
            </div>
        );
    }
}
