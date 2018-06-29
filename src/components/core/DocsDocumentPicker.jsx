import React from 'react';
import PropTypes from "prop-types";

import IconButton from './IconButton';
import DocumentType from './DocumentType';
import DocumentForm from "./DocumentForm";

import {openModal} from './utils/modals';
import {addPropsToChildren} from './utils/children';
import Button from "./Button";
import Icon from "./Icon";
import {DOCUMENT_TYPES} from "../../actions/utils/api";

const ModalWrapper = (props) => {
    return (
        <div>
            {addPropsToChildren(props.children, {onChange: props.proceed, onSave: props.proceed})}
        </div>
    );
};

export default class DocsDocumentPicker extends React.Component {

    static defaultProps = {
        variant: 'icon',

    };

    static propTypes = {
        variant: PropTypes.string,
        className: PropTypes.string,
        onChange: PropTypes.func,
        documentType: PropTypes.string,
        documentTypes: PropTypes.array,
    };

    constructor(props) {
        super(props);

    }

    filterDocumentsByType(docs, type){
        let filtered_docs = [];
        let len = docs.length

        for (var i = 0; i < len; i++) {
            if(docs[i].type === type){
                filtered_docs.push(docs[i])
            }
        }

        return filtered_docs
    }

    onSelectType = () => {
        openModal(
            <ModalWrapper>
                <DocumentType/>
            </ModalWrapper>,
            'Type of document',
            true, {className: 'modal-upload'}
         ).then((type) => {
             this.onSelectDocument(type);
         });
    };

    onSelectDocument(type) {
        let self = this;
        openModal(
            <ModalWrapper>
                <DocumentForm type={type} documentType={this.props.documentType} documentTypes={this.props.documentTypes}/>
            </ModalWrapper>,
            `Add ${this.props.documentType?(DOCUMENT_TYPES[this.props.documentType] || `${this.props.documentType} document`):' document'}`,
            true, {className: 'modal-upload'}
        ).then((document) => {
            this.props.ProjectActions.createDocument(document)
        });
    }

    onRemoveDoc(idx) {
        this.props.ProjectActions.deleteDocument(idx)
    }

    render() {
        let filtered_docs= this.filterDocumentsByType(this.props.project.documents, this.props.documentType)

        return (
            <div className="document-input">
                {filtered_docs.length > 0?(
                    <div className="file-list">
                        {filtered_docs.map((doc) => {
                            return (
                                <div className="file-item" key={doc.id}>
                                    <a href={doc.download_url}><i className={doc.file?"tg-ic-download":"tg-ic-link"}/> {doc.file?doc.title:doc.url}</a>
                                    <button className="btn" onClick={this.onRemoveDoc.bind(this, doc.id)}><i className="tg-ic-close"/></button>
                                </div>
                            )
                        })}
                    </div>
                ):null}

                {this.props.variant === 'button'?(
                    <Button onClick={this.onSelectType}><Icon name="upload"/> Add documents</Button>
                ):(
                    <IconButton name="add" onClick={this.onSelectType}/>
                )}
            </div>
        );
    }
}
