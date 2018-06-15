import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as AuthActions from '../../legacy/actions/AuthActions';

import PropTypes from "prop-types";

class MyAccountOutput extends React.Component {

    static propTypes = {
        field: PropTypes.string,
    };

    render() {
        const {Auth: {user}, field} = this.props;

        return (
            <React.Fragment>
                {user[field] || null}
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        Auth: state.Auth
    };
}

function mapDispatchToProps(dispatch) {
    return {
        AuthActions: bindActionCreators(AuthActions, dispatch),
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyAccountOutput));
