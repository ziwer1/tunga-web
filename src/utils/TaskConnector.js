import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as TaskActions from '../actions/TaskActions'
import * as ApplicationActions from '../actions/ApplicationActions'
import * as SavedTaskActions from '../actions/SavedTaskActions'

function mapStateToProps(state) {
    return {Auth: state.Auth, Task: state.Task};
}

function mapDispatchToProps(dispatch) {
    return {
        TaskActions: {
            ...bindActionCreators(TaskActions, dispatch),
            ...bindActionCreators(ApplicationActions, dispatch),
            ...bindActionCreators(SavedTaskActions, dispatch)
        }
    }
}

export default function connectToTasks(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component);
};


