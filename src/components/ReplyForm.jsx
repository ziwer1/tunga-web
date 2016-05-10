import React from 'react'
import Dropzone from 'react-dropzone'
import Progress from './status/Progress'
import FormStatus from './status/FormStatus'
import FieldError from './status/FieldError'
import Avatar from './Avatar'
import TinyMCE  from 'react-tinymce'

export default class ReplyForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {body: '', is_broadcast: true, attachments: []};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.Reply.detail.isSaved && !prevProps.Reply.detail.isSaved) {
            this.refs.reply_form.reset();
            this.setState({attachments: []})
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
        if (!body) {
            return;
        }
        const { ReplyActions, message } = this.props;
        const is_broadcast = this.state.is_broadcast;
        const attachments = this.state.attachments;
        ReplyActions.createReply({ message: message.id, body, is_broadcast}, attachments);
        return;
    }

    render() {
        const { Reply, Auth } = this.props;
        return (
            <div className="well card">
                <form onSubmit={this.handleSubmit} name="reply" role="reply" ref="reply_form">
                    <FormStatus loading={Reply.detail.isSaving}
                                error={Reply.detail.error.create}/>

                    {(Reply.detail.error.create && Reply.detail.error.create.body)?
                        (<FieldError message={Reply.detail.error.create.body}/>):''}
                    <div className="form-group row">
                        <div className="col-xs-1">
                            <Avatar src={Auth.user.avatar_url}/>
                        </div>
                        <div className="col-xs-11">
                            <TinyMCE
                                config={{plugins: 'autolink link image lists print preview', toolbar: 'undo redo | bold italic | alignleft aligncenter alignright'}}
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
                        <button type="submit" className="btn btn-default pull-right" disabled={Reply.detail.isSaving}>
                            <i className="fa fa-paper-plane"/> Send
                        </button>
                    </div>
                    <div className="clearfix"></div>
                </form>
            </div>

        );
    }
}
