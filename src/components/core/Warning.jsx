import React from 'react';

import Icon from './Icon';

const Warning = ({message}) => {
    return (
        <div className="alert alert-warning"><Icon name="warning"/> {message || 'Something went wrong! Please try again.'}</div>
    );
};

export default Warning;
