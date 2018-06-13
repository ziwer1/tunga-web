import React from 'react';

import CustomInputGroup from './CustomInputGroup';
import {filterEventProps} from "./utils";

export default class SearchBox extends React.Component {
    static propTypes = {
        className: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        branded: React.PropTypes.bool,
    };

    static defaultProps = {
        branded: true
    };

    render() {
        return (
            <CustomInputGroup variant={`search${this.props.branded?'':'-plain'}`}
                              className={this.props.className}
                              placeholder={this.props.placeholder}
                              {...filterEventProps(this.props)}/>
        );
    }
}
