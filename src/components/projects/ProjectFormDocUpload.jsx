import PropTypes from "prop-types";
import React from "react";

import { Container, Row, Col, Label } from "reactstrap";

import {openModal} from '../core/utils/modals'
import Upload from "../core/Upload";


export default class ProjectFormDocUpload extends React.Component {


    constructor(props) {
        super(props);
    
        this.handleRequirementDocumentChange = this.handleRequirementDocumentChange.bind(this);
        this.handleOtherDocumentChange = this.handleOtherDocumentChange.bind(this);
    }


    format_file_array(value, type){

        let file_array = [];
        let len = value.length;
        for (var i = 0; i < len; i++) {
            file_array.push({
                file: value[i],
                type: type,
                description: "",
            });
        }

        return file_array
    }

    handleRequirementDocumentChange(value) {

        this.props.dismiss()

        let file_array = this.format_file_array(value, "requirements")
        
        this.props.proceed(file_array)

    }

    handleOtherDocumentChange(value) {
        this.props.dismiss()

        let file_array = this.format_file_array(value, "other")
        
        this.props.proceed(file_array)
    }


    render() {
        return (
            <div>
                <Container>
                    <Row>
                        <Col><Upload instructions="Requirement Document" multiple={true} placeholder={<i className="tg-ic-file tunga-ic-sz-md"/>} onChange={this.handleRequirementDocumentChange} /></Col>
                        <Col><Upload instructions="Other Document" multiple={true} placeholder={<i className="tg-ic-file tunga-ic-sz-md"/>} onChange={this.handleOtherDocumentChange} /></Col>
                    </Row>
                </Container>     
            </div>        
        );
    }
}
