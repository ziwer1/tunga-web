import PropTypes from "prop-types";
import React from "react";

import {openModal} from '../core/utils/modals'

import ProjectFormDocType from "./ProjectFormDocType"


export default class ProjectFormDocuments extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            documents: props.docs,
        };
        this.handleUploadClick = this.handleUploadClick.bind(this);
    }

    componentDidUpdate(prevProps){
        if (prevProps.docs.length !== this.props.docs.length){
            this.setState({ documents: [...this.props.docs ] })
        }
    }

    handleUploadClick() {
        openModal(<ProjectFormDocType/>, "Type of document", undefined, undefined, 'sm').then((result) => { 
        this.props.onAddDocuments(result);
        });
    }


    render() {
        return (
            <div>
                <div>
                    {this.state.documents.map(doc => {
                    return (<div>{doc.file ? doc.file.name : doc.url}</div>);
                    })}
                </div>
                <button type="button" onClick={this.handleUploadClick} className="btn btn-icon "><i className="tg-ic-add tunga-ic-sz-md "></i></button>
            </div>
                            
        );
    }
}
