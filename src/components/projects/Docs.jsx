import PropTypes from 'prop-types';
import React from 'react';
import { Container, Row, Col } from "reactstrap";

import DocsDocumentPicker from "../core/DocsDocumentPicker";
import {DOCUMENT_TYPES} from "../../actions/utils/api";

export default class Docs extends React.Component {
    static propTypes = {
        project: PropTypes.object,
        ProjectActions: PropTypes.object,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <br/>
                <Container>
                    <Row className="documents-row-bottom-margin">
                        <Col>
                            <div className='font-weight-medium'> Estimates document </div>
                            <DocsDocumentPicker {...this.props} documentType={Object.keys(DOCUMENT_TYPES)[Object.keys(DOCUMENT_TYPES).indexOf('estimate')]}/>
                        </Col>
                    </Row>
                    <Row className="documents-row-bottom-margin">
                        <Col>
                            <div className='font-weight-medium'> Proposal documents </div>
                            <DocsDocumentPicker {...this.props} documentType={Object.keys(DOCUMENT_TYPES)[Object.keys(DOCUMENT_TYPES).indexOf('proposal')]}/>
                        </Col>
                    </Row>
                    <Row className="documents-row-bottom-margin">
                        <Col>
                            <div className='font-weight-medium'> Requirements documents </div>
                            <DocsDocumentPicker {...this.props} documentType={Object.keys(DOCUMENT_TYPES)[Object.keys(DOCUMENT_TYPES).indexOf('requirements')]}/>
                        </Col>
                    </Row>
                    <Row className="documents-row-bottom-margin">
                        <Col>
                            <div className='font-weight-medium'> Other documents </div>
                            <DocsDocumentPicker {...this.props} documentType={Object.keys(DOCUMENT_TYPES)[Object.keys(DOCUMENT_TYPES).indexOf('other')]}/>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
