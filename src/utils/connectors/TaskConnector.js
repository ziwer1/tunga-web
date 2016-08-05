import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as TaskActions from '../../actions/TaskActions'
import * as AuthActions from '../../actions/AuthActions'
import * as ApplicationActions from '../../actions/ApplicationActions'
import * as SavedTaskActions from '../../actions/SavedTaskActions'
import * as CommentActions from '../../actions/CommentActions'

function mapStateToProps(state) {
    return {Auth: state.Auth, Task: state.Task, Nav: state.Nav};
}

function mapDispatchToProps(dispatch) {
    return {
        TaskActions: {
            ...bindActionCreators({
                listRunningTasks: AuthActions.listRunningTasks,
                listRepos: AuthActions.listRepos,
                listIssues: AuthActions.listIssues
            }, dispatch),
            ...bindActionCreators(TaskActions, dispatch),
            ...bindActionCreators(ApplicationActions, dispatch),
            ...bindActionCreators(SavedTaskActions, dispatch),
            ...bindActionCreators(CommentActions, dispatch)
        }
    }
}

export default function connectToTasks(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component);
};


