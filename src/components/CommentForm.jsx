import React from 'react'
import Dropzone from 'react-dropzone'
import TinyMCE  from 'react-tinymce'
import Progress from './status/Progress'
import FormStatus from './status/FormStatus'
import FieldError from './status/FieldError'
import {TINY_MCE_CONFIG } from '../constants/settings'

export default class CommentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {body: '', attachments: []};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.Comment.detail.isSaved && !prevProps.Comment.detail.isSaved) {
            this.refs.comment_form.reset();
            this.setState({body: '', attachments: []});
        }
    }

    onBodyChange(e) {
        this.setState({body: e.target.getContent()});
    }

    onDrop(attachments) {
        var current = this.state.attachments;
        this.setState({attachments: current.concat(attachments)});
    }

    onAddAttachment() {
        this.refs.dropzone.open();
    }

    handleSubmit(e) {
        e.preventDefault();
        var body = this.state.body;
        const attachments = this.state.attachments;
        const { CommentActions, object_details } = this.props;
        CommentActions.createComment({ ...object_details, body}, attachments);
        return;
    }

    render() {
        const { Comment } = this.props;
        return (
            <div className="well card">
                <form onSubmit={this.handleSubmit} name="comment" role="comment" ref="comment_form">
                    <FormStatus loading={Comment.detail.isSaving}
                                error={Comment.detail.error.create}/>

                    {(Comment.detail.error.create && Comment.detail.error.create.body)?
                        (<FieldError message={Comment.detail.error.create.body}/>):''}
                    <div className="form-group">
                        <div>
                            <TinyMCE
                                config={TINY_MCE_CONFIG}
                                onChange={this.onBodyChange.bind(this)}/>
                        </div>
                    </div>

                    <Dropzone ref="dropzone" onDrop={this.onDrop.bind(this)} style={{display: 'none'}}>
                        <div>Try dropping some files here, or click to select files to upload.</div>
                    </Dropzone>
                    {this.state.attachments?(
                    <div>
                        <div>{this.state.attachments.map((file) => {
                            return (<div><i className="fa fa-file-text-o"/> {file.name}</div>)
                            })}</div>
                    </div>
                        ):null}

                    <div className="pull-right">
                        <button type="button" className="btn btn-default" style={{marginRight: '5px'}}
                                onClick={this.onAddAttachment.bind(this)}>
                            <i className="fa fa-paperclip"/> Add attachment
                        </button>
                        <button type="submit" className="btn btn-default pull-right" disabled={Comment.detail.isSaving}>
                            Comment
                        </button>
                    </div>
                    <div className="clearfix"></div>
                </form>
            </div>

        );
    }
}
