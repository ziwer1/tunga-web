import React, {PropTypes} from 'react';
import { confirmable } from 'react-confirm';
import { Modal, Button } from 'react-bootstrap';

@confirmable
class ConfirmDialog extends React.Component {
    render() {
        const {show, proceed, dismiss, cancel, confirmation, options} = this.props;
        let safe_options = options || {};

        return (
            <Modal show={show} onHide={dismiss} bsStyle="md">
                <Modal.Header closeButton/>
                <Modal.Body>
                    {confirmation}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => cancel()} className="btn-alt">{safe_options.cancel || 'Cancel'}</Button>
                    <Button onClick={() => proceed()}>{safe_options.ok || 'OK'}</Button>
                </Modal.Footer>
            </Modal>
        )
    };
}

ConfirmDialog.propTypes = {
    show: PropTypes.bool,
    proceed: PropTypes.func,
    cancel: PropTypes.func,
    dismiss: PropTypes.func,
    confirmation: PropTypes.string,
    options: PropTypes.object
};

export default confirmable(ConfirmDialog);
