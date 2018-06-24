import PropTypes from "prop-types";
import React from "react";

import {openModal} from '../core/utils/modals'
import ChoiceGroup from "../core/ChoiceGroup";
import ProjectFormDocUpload from "./ProjectFormDocUpload"
import ProjectFormLinkDocuments from "./ProjectFormLinkDocuments"


export default class ProjectFormDocType extends React.Component {


    constructor(props) {
        super(props);

        this.handleDocumentModalChange = this.handleDocumentModalChange.bind(this);
    }



    handleDocumentModalChange(value) {

        if (value === 'upload'){
            
            openModal(<ProjectFormDocUpload />, "What kind of document are you uploading", undefined, undefined, 'sm').then((result) => { 
                this.props.proceed(result) 
                });
        }

        if (value === 'link'){
            openModal(<ProjectFormLinkDocuments />, "Add Requirement document", undefined, undefined, 'sm').then((result) => { 
                this.props.proceed(result) 
                });
        }
    }


    render() {
        return (
            <ChoiceGroup variant='dotted-card' onChange={this.handleDocumentModalChange} choices={[['upload', 'Upload File', 'upload'], ['link', 'Insert URL', 'link']]} />                           
        );
    }
}
