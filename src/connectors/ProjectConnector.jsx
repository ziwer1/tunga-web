import {bindActionCreators} from "redux";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

import * as ProjectActions from "../actions/ProjectActions";

function mapStateToProps(state) {
    return {
        Project: state.Project
    };
}

function mapDispatchToProps(dispatch) {
    return {
        ProjectActions: bindActionCreators(ProjectActions, dispatch),
    };
}

export default function connectToStore(component) {
    return withRouter(connect(mapStateToProps, mapDispatchToProps)(component))
};
