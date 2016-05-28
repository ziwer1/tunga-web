import React from 'react'
import Dropzone from 'react-dropzone'
import TinyMCE  from 'react-tinymce'
import Progress from './status/Progress'
import FormStatus from './status/FormStatus'
import FieldError from './status/FieldError'
import UserSelector from '../containers/UserSelector'
import Avatar from './Avatar'
import {TINY_MCE_CONFIG } from '../constants/settings'

export default class Compose extends React.Component {
    constructor(props) {
        super(props);
        this.state = {body: '', is_broadcast: false, recipients: [], attachments: []};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.Message.detail.isSaved && !prevProps.Message.detail.isSaved) {
            this.refs.compose.reset();
            this.setState({body: '', is_broadcast: false, recipients: [], attachments: []})
        }
    }

    onRecipientChange(recipients) {
        this.setState({recipients: recipients});
    }

    onBroadcastChange(is_broadcast = false) {
        this.setState({is_broadcast: is_broadcast});
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
        var subject = this.refs.subject.value.trim();
        var body = this.state.body;
        if (!subject || !body ) {
            return;
        }
        const { MessageActions } = this.props;
        const recipients = this.state.recipients;
        const is_broadcast = this.state.is_broadcast;
        const attachments = this.state.attachments;
        MessageActions.createMessage({subject, body, recipients, is_broadcast}, attachments);
        return;
    }

    render() {
        const { Message, Auth } = this.props;
        return (
            <div>
                <form onSubmit={this.handleSubmit} name="compose" role="form" className="well card" ref="compose">
                    <FormStatus loading={Message.detail.isSaving}
                                success={Message.detail.isSaved}
                                message={'Message Sent'}
                                error={Message.detail.error.create}/>

                    {(Message.detail.error.create && Message.detail.error.create.recipients)?
                        (<FieldError message={Message.detail.error.create.recipients}/>):''}

                    <div className="form-group row">
                        <div className="col-xs-1"><div style={{lineHeight: '34px', textAlign: 'right', marginLeft: '10px', wordBreak: 'normal'}}>To:</div></div>
                        <div className="col-xs-11">
                            <div className="btn-group btn-choices" role="group" aria-label="is broadcast">
                                <button type="button" className={"btn btn-default" + (this.state.is_broadcast?'':' active')} onClick={this.onBroadcastChange.bind(this, false)}>Selected users</button>
                                <button type="button" className={"btn btn-default" + (this.state.is_broadcast?' active':'')} onClick={this.onBroadcastChange.bind(this, true)}>My Team</button>
                            </div>
                        </div>
                        {this.state.is_broadcast?null:(
                        <div className="col-xs-11 col-xs-offset-1">
                            <UserSelector filter={{filter: null}} onChange={this.onRecipientChange.bind(this)}/>
                        </div>
                            )}
                    </div>

                    {(Message.detail.error.create && Message.detail.error.create.subject)?
                        (<FieldError message={Message.detail.error.create.subject}/>):''}
                    <div className="form-group row">
                        <div className="col-xs-1">
                            <Avatar src={Auth.user.avatar_url}/>
                        </div>
                        <div className="col-xs-11"><input type="text" className="form-control" ref="subject" required placeholder="Subject"/></div>
                    </div>

                    {(Message.detail.error.create && Message.detail.error.create.body)?
                        (<FieldError message={Message.detail.error.create.body}/>):''}
                    <div className="form-group row">
                        <div className="col-xs-11 col-xs-offset-1">
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
                        <button type="submit" className="btn btn-default" disabled={Message.detail.isSaving}>
                            <i className="fa fa-paper-plane"/> Send
                        </button>
                    </div>
                    <div className="clearfix"></div>
                </form>
            </div>
        );
    }
}
