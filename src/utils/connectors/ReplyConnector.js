import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as ReplyActions from '../../actions/ReplyActions'

function mapStateToProps(state) {
    return {Auth: state.Auth, Reply: state.Reply};
}

function mapDispatchToProps(dispatch) {
    return {
        ReplyActions: bindActionCreators(ReplyActions, dispatch)
    }
}

export default function connectToReplies(component) {
    return connect(mapStateToProps, mapDispatchToProps)(component);
};


