import {bindActionCreators} from "redux";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

import * as ProfileActions from "../legacy/actions/ProfileActions";

function mapStateToProps(state) {
    return {
        Auth: state.Auth,
        Profile: state.Profile
    };
}

function mapDispatchToProps(dispatch) {
    return {
        ProfileActions: bindActionCreators(ProfileActions, dispatch),
    };
}

export default function connectToStore(component) {
    return withRouter(connect(mapStateToProps, mapDispatchToProps)(component))
};
