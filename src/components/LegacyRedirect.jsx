import React from 'react';

export default class LegacyRedirect extends React.Component {

    componentDidMount() {
        window.location.href = `/welcome?redirect_path=${window.location.pathname.replace('/welcome', '')}`;
    }

    render() {
        return (
            <div>
                Redirecting ...
            </div>
        );
    }
}
