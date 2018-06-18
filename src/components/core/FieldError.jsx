import React from 'react';

const FieldError = ({message}) => {
    return (
        <div className="error">{message || 'Unknown error'}</div>
    );
};

export default FieldError;
