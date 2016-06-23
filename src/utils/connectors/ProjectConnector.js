import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as ProjectActions from '../../actions/ProjectActions'

function mapStateToProps(state) {
    return {Auth: state.Auth, Project: state.Project};
}

function mapDispatchToProps(dispatch) {
    return {
        ProjectActions: bindActionCreators(ProjectActions, dispatch)
    }
}

export default function connectToProjects(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component);
};


