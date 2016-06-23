import React from 'react'
import Dropzone from 'react-dropzone'
import TinyMCE  from 'react-tinymce'
import Progress from './status/Progress'
import FormStatus from './status/FormStatus'
import FieldError from './status/FieldError'
import {TINY_MCE_CONFIG } from '../constants/settings'
import { nl_to_br } from '../utils/html'

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
        this.setState({body: e.target.value.trim()});
        if (e.keyCode === 13 && e.ctrlKey) {
            this.handleSubmit(e);
        }
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
        //var body = markdown.toHTML(this.state.body);
        var body = nl_to_br(this.state.body);
		console.log(body);
        const attachments = this.state.attachments;
        const { CommentActions, object_details } = this.props;
        CommentActions.createComment({ ...object_details, body}, attachments);
        return;
    }

    render() {
        const { Comment } = this.props;
        return (
            <form onSubmit={this.handleSubmit} name="comment" role="comment" ref="comment_form">
                <FormStatus loading={Comment.detail.isSaving}
                            error={Comment.detail.error.create}/>

                <Dropzone ref="dropzone" onDrop={this.onDrop.bind(this)} style={{display: 'none'}}>
                    <div>Try dropping some files here, or click to select files to upload.</div>
                </Dropzone>
                {this.state.attachments?(
                <div>
                    {this.state.attachments.map((file) => {
                        return (<div><i className="fa fa-file-text-o"/> {file.name}</div>)
                        })}
                </div>
                    ):null}

                {(Comment.detail.error.create && Comment.detail.error.create.body)?
                    (<FieldError message={Comment.detail.error.create.body}/>):''}
                <div className="input-group">
                        <span className="input-group-btn">
                            <button type="button" className="btn btn-default" onClick={this.onAddAttachment.bind(this)}>
                                <i className="fa fa-paperclip"/>
                            </button>
                        </span>
                        <textarea type="text" className="form-control" placeholder="Write your message here" rows="1"
                                  onKeyUp={this.onBodyChange.bind(this)}/>
                        <span className="input-group-btn">
                            <button type="submit" className="btn btn-default"  disabled={Comment.detail.isSaving}>
                                <i className="fa fa-paper-plane"/>
                            </button>
                        </span>
                </div>
            </form>
        );
    }
}
