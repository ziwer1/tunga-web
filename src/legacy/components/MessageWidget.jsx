import React from 'react';

export default class MessageWidget extends React.Component {
    onBodyChange(e) {
        var body = e.target.value.trim();
        if (this.props.onBodyChange) {
            this.props.onBodyChange(body);
        }
        if (e.keyCode === 13 && !e.shiftKey) {
            this.onSend(e);
        }
    }

    onAddAttachment() {
        if (this.props.onAddAttachment) {
            this.props.onAddAttachment();
        }
    }

    onSend(e) {
        if (this.props.onSend) {
            this.props.onSend(e);
            // No overlay when visitor sends a chat
            window.tungaCanOpenOverlay = false;
        }
    }

    render() {
        return (
            <div className="message-widget">
                <div className="input-group">
                    {this.props.canUpload ? (
                        <span className="input-group-btn">
                            <button
                                type="button"
                                className="btn btn-borderless"
                                onClick={this.onAddAttachment.bind(this)}>
                                <i className="tunga-icon-create fa-3x" />
                            </button>
                        </span>
                    ) : null}
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder={this.props.placeholder}
                        rows="2"
                        onKeyUp={this.onBodyChange.bind(this)}
                    />
                </div>
                <button
                    type="button"
                    className="btn btn-send"
                    disabled={this.props.isSending}
                    onClick={this.onSend.bind(this)}>
                    <i className="fa fa-paper-plane" />
                </button>
            </div>
        );
    }
}

MessageWidget.propTypes = {
    onSend: React.PropTypes.func.isRequired,
    onBodyChange: React.PropTypes.func,
    onAddAttachment: React.PropTypes.func,
    isSending: React.PropTypes.bool,
    placeholder: React.PropTypes.string,
    canUpload: React.PropTypes.bool,
};

MessageWidget.defaultProps = {
    placeholder: 'Write your message here',
    canUpload: true,
};
