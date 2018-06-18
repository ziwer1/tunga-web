import React from 'react';

import Icon from './Icon';

const Success = ({message}) => {
    return (
        <div className="alert alert-success"><Icon name="check"/> {message || 'Changes saved succesfully!'}</div>
    );
};

export default Success;
