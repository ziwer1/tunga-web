import PropTypes from 'prop-types';
import React from 'react';
import {confirmable} from 'react-confirm';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import Button from './Button';
import TextArea from './TextArea';

class GenericModal extends React.Component {
    propTypes = {
        show: PropTypes.bool,
        proceed: PropTypes.func,
        cancel: PropTypes.func,
        dismiss: PropTypes.func,
        confirmation: PropTypes.any,
        options: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {response: null};
    }

    toggle() {
        this.setState({
            modalOpen: !this.state.modalOpen
        });
    }

    onResponseChange(e) {
        this.setState({response: e.target.value});
    }

    renderModalContent() {
        const {
            show,
            proceed,
            dismiss,
            cancel,
            confirmation,
            options
        } = this.props;

        console.log('confirmation', confirmation);

        return confirmation;

        return React.cloneElement(confirmation, {
            proceed,
            dismiss,
            cancel
        }, null);
    }

    render() {
        const {
            show,
            proceed,
            dismiss,
            cancel,
            confirmation,
            options
        } = this.props;
        let safe_options = options || {};

        return (
            <Modal
                isOpen={show}
                toggle={dismiss}
                bsStyle="md"
                backdrop={options.mustRespond ? 'static' : true}
                keyboard={!options.mustRespond}>
                {!options.mustRespond || options.title?(
                    <ModalHeader toggle={options.mustRespond?null:dismiss}>
                        {options.title || ''}
                    </ModalHeader>
                ):null}
                <ModalBody>
                    <div>{this.renderModalContent()}</div>
                    {options.isPrompt ? (
                        <div className="form-group">
                            <TextArea onChange={this.onResponseChange.bind(this)}
                            />
                        </div>
                    ) : null}
                </ModalBody>
                {safe_options.hideActions?null:(
                    <ModalFooter>
                        {safe_options.hideCancel ? null : (
                            <Button onClick={() => cancel()} variant="secondary">
                                {safe_options.cancel || 'Cancel'}
                            </Button>
                        )}
                        <Button
                            onClick={() => {
                                if (safe_options.isPrompt) {
                                    if (this.state.response) {
                                        proceed(this.state.response);
                                    }
                                } else {
                                    proceed();
                                }
                            }}
                            disabled={
                                safe_options.isPrompt && !this.state.response
                            }>
                            {safe_options.ok || 'OK'}
                        </Button>
                    </ModalFooter>
                )}
            </Modal>
        );
    }
}

export default confirmable(GenericModal);
