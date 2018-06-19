import React from 'react';

const FieldError = ({message}) => {
    return (
        <div className="error">{message || ''}</div>
    );
};

export default FieldError;
