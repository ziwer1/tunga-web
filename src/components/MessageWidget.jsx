import React from 'react'
import Dropzone from 'react-dropzone'
import TinyMCE  from 'react-tinymce'
import Progress from './status/Progress'
import FormStatus from './status/FormStatus'
import FieldError from './status/FieldError'
import {TINY_MCE_CONFIG } from '../constants/settings'
import { nl_to_br } from '../utils/html'

export default class MessageWidget extends React.Component {

    onBodyChange(e) {
        var body = e.target.value.trim();
        if(this.props.onBodyChange) {
            this.props.onBodyChange(body);
        }
        if (e.keyCode === 13 && !e.shiftKey) {
            this.onSend(e);
        }
    }

    onAddAttachment() {
        if(this.props.onAddAttachment) {
            this.props.onAddAttachment();
        }
    }

    onSend(e) {
        if(this.props.onSend) {
            this.props.onSend(e);
        }
    }

    render() {
        return (
            <div className="input-group message-widget">
                <span className="input-group-btn">
                    <button type="button" className="btn btn-default" onClick={this.onAddAttachment.bind(this)}>
                        <i className="fa fa-paperclip"/>
                    </button>
                </span>
                <textarea type="text" className="form-control" placeholder="Write your message here" rows="1"
                          onKeyUp={this.onBodyChange.bind(this)}/>
                <span className="input-group-btn">
                    <button type="button" className="btn btn-default" disabled={this.props.loading}
                            onClick={this.onSend.bind(this)}>
                        <i className="fa fa-paper-plane"/>
                    </button>
                </span>
            </div>
        );
    }
}
