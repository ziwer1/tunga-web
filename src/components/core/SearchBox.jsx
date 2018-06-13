import PropTypes from 'prop-types';
import React from 'react';

import CustomInputGroup from './CustomInputGroup';
import {filterEventProps} from "./utils";

export default class SearchBox extends React.Component {
    static defaultProps = {
        branded: true
    };

    static propTypes = {
        className: PropTypes.string,
        placeholder: PropTypes.string,
        branded: PropTypes.bool,
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