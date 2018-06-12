import React from 'react';

import InputGroup from './InputGroup';
import {filterEventProps} from "./utils";

const CUSTOM_INPUTS = {
    search: {
        className: 'input-search input-search-branded',
        placeholder: 'Search',
        prepend: <i className="tg-ic-search" />
    },
    'search-plain': {
        className: 'input-search ',
        placeholder: 'Search',
        prepend: <i className="tg-ic-search" />
    },
    message: {
        placeholder: 'Type message here',
        isAppendText: false,
        append: (
            <button className="btn"
                    type="button">
                <i className="tg-ic-paper-plane" />
            </button>
        )
    },
    url: {
        placeholder: 'Paste URL here',
        prepend: <i className="tg-ic-link" />
    },
    personal: {
        placeholder: 'Name',
        prepend: <i className="tg-ic-avatar" />
    },
    address: {
        placeholder: 'Address',
        prepend: <i className="tg-ic-map-marker" />
    },
    tel: {
        placeholder: 'Phone number',
        prepend: <i className="tg-ic-phone" />
    },
    password: {
        type: 'password',
        placeholder: 'Password',
        prepend: <i className="tg-ic-lock" />
    },
};

export default class CustomInputGroup extends React.Component {
    static propTypes = {
        variant: React.PropTypes.string,
        className: React.PropTypes.string,
        placeholder: React.PropTypes.string,
    };

    static defaultProps = {
        variant: null
    };

    cleanProps() {
        const allowedProps = ['className', 'placeholder'],
            cleanedProps = {};
        allowedProps.forEach(key => {
            if(this.props[key]) {
                cleanedProps[key] = this.props[key];
            }
        });
        return cleanedProps;
    }

    getProperties() {
        let variantProps = CUSTOM_INPUTS[this.props.variant] || {},
            overrideProps = this.cleanProps();

        return {
            ...variantProps,
            ...overrideProps,
            ...{
                className: `${variantProps.className || ''} ${overrideProps.className || ''}`
            }
        }
    }

    render() {
        return (
            <InputGroup {...this.getProperties()} {...filterEventProps(this.props)}/>
        );
    }
}
