import React from 'react'
import connect from '../utils/CommentConnector'
import CommentForm from '../components/CommentForm'
import CommentList from '../components/CommentList'

class CommentSection extends React.Component {

    render() {
        const { Auth, Comment, CommentActions, object_details, filter } = this.props;
        return (
            <div>
                <CommentList filter={filter} Comment={Comment} CommentActions={CommentActions}/>

                <CommentForm object_details={object_details} Comment={Comment} CommentActions={CommentActions} Auth={Auth}/>
            </div>
        );
    }
}

export default connect(CommentSection);
