import React from 'react';

import Icon from './Icon';

const Error = ({message}) => {
    return (
        <div className="alert alert-danger"><Icon name="attention"/> {message || 'Something went wrong! Please try again.'}</div>
    );
};

export default Error;
