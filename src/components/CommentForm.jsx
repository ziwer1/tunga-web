import React from 'react'
import Progress from './status/Progress'
import FormStatus from './status/FormStatus'
import FieldError from './status/FieldError'
import TinyMCE  from 'react-tinymce'

export default class CommentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {body: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onBodyChange(e) {
        this.setState({body: e.target.getContent()});
    }

    handleSubmit(e) {
        e.preventDefault();
        var body = this.state.body;
        if (!body) {
            return;
        }
        const { CommentActions, object_details } = this.props;
        CommentActions.createComment({ ...object_details, body});
        return;
    }

    render() {
        const { Comment } = this.props;
        return (
            <div className="well card">
                <form onSubmit={this.handleSubmit} name="comment" role="comment">
                    <FormStatus loading={Comment.detail.isSaving}
                                error={Comment.detail.error.create}/>

                    {(Comment.detail.error.create && Comment.detail.error.create.body)?
                        (<FieldError message={Comment.detail.error.create.body}/>):''}
                    <div className="form-group">
                        <div>
                            <TinyMCE
                                config={{plugins: 'autolink link image lists print preview', toolbar: 'undo redo | bold italic | alignleft aligncenter alignright'}}
                                onChange={this.onBodyChange.bind(this)}/>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-default pull-right" disabled={Comment.detail.isSaving}>Comment</button>
                    <div className="clearfix"></div>
                </form>
            </div>

        );
    }
}
