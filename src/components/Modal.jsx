import React from 'react';
import ReactDOM  from 'react-dom';
import {Provider} from 'react-redux';
import { Modal, Button } from 'react-bootstrap';

import store from '../store';

class ModalWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showModal: true};
    }

    open() {
        this.setState({showModal: true});
    }

    close() {
        this.setState({showModal: false});

        const {dismiss} = this.props;
        if(dismiss) {
            dismiss();
        }
    }

    renderChildren() {
        return React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {
                close: this.close.bind(this)
            });
        }.bind(this));
    }

    render() {
        const { options, className } = this.props;

        return (
            <Modal show={this.state.showModal}
                   onHide={this.close.bind(this)}
                   bsStyle={options && options.bsStyle?options.bsStyle:"md"}
                   dialogClassName={options && options.className}>
                <Modal.Header closeButton/>
                <Modal.Body>
                    {this.renderChildren()}
                </Modal.Body>
            </Modal>
        );
    }
}


const createModal = (Component, show, dismiss, options) => {
    const wrapper = document.getElementById('content').appendChild(document.createElement('div'));

    ReactDOM.render(
        <Provider store={store}>
            <ModalWrapper show={show} dismiss={dismiss} options={options}>
                {Component}
            </ModalWrapper>
        </Provider>,
        wrapper
    );
};

export default createModal;
