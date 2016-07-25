import React from 'react'
import Dropzone from 'react-dropzone'
import FormStatus from './status/FormStatus'
import FieldError from './status/FieldError'
import { nl_to_br } from '../utils/html'
import MessageWidget from './MessageWidget'

export default class Compose extends React.Component {
    constructor(props) {
        super(props);
        this.state = {body: '', attachments: []};
    }

    static propTypes = {
        uploadCallback: React.PropTypes.func,
        uploadSaved: React.PropTypes.bool
    };

    componentDidUpdate(prevProps, prevState) {
        if(this.props.Message.detail.isSaved && !prevProps.Message.detail.isSaved || this.props.uploadSaved && !prevProps.uploadSaved) {
            this.refs.message_form.reset();
            this.setState({body: '', attachments: []})
        }
    }

    onBodyChange(body) {
        this.setState({body});
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
        var body = nl_to_br(this.state.body);
        var channel = this.props.channel;
        const { MessageActions } = this.props;
        const attachments = this.state.attachments;
        if(body) {
            MessageActions.createMessage({channel: channel.id, body}, attachments);
        } else if(attachments && attachments.length && this.props.uploadCallback) {
            this.props.uploadCallback(attachments);
        }
        return;
    }

    render() {
        const { Message, Auth } = this.props;
        return (
            <div>
                <form onSubmit={this.handleSubmit.bind(this)} name="compose" role="form" ref="message_form">
                    <FormStatus loading={Message.detail.isSaving}
                                error={Message.detail.error.create}/>

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

                    {(Message.detail.error.create && Message.detail.error.create.body)?
                        (<FieldError message={Message.detail.error.create.body}/>):''}
                    <MessageWidget onAddAttachment={this.onAddAttachment.bind(this)}
                                   onBodyChange={this.onBodyChange.bind(this)}
                                   onSend={this.handleSubmit.bind(this)}
                                   errors={Message.detail.error.create}
                                   loading={Message.detail.isSaving}/>
                </form>
            </div>
        );
    }
}
