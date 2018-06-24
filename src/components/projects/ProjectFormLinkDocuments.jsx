import PropTypes from "prop-types";
import React from "react";

import { Container, Row, Col, Label } from "reactstrap";

import Button from "../core/Button";
import Input from "../core/Input";
import FieldError from "../core/FieldError";
import {openModal} from '../core/utils/modals'
import Upload from "../core/Upload";


export default class ProjectFormLinkDocuments extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            title:"",
            url:"",
        }

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleUrlChange = this.handleUrlChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleTitleChange(event) {
        this.setState({title: event.target.value})
    }
    

    handleUrlChange(event) {
        this.setState({url: event.target.value})

    }

    handleSubmit(event) {
        event.preventDefault()

        

        let link =  [{
                    url: this.state.url,
                    type: "requirement",
                    description: "",
                }]

        this.props.proceed(link)

        this.props.dismiss()
    }


    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group form-group-padding-bottom">
                        <Input placeholder="Insert Title here" onChange={this.handleTitleChange}/>
                    </div>
                    <div className="form-group form-group-padding-bottom">
                        <Input placeholder="Insert Link here" onChange={this.handleUrlChange}/>
                    </div>
                    <div className="form-group form-group-padding-bottom">    
                        <button type="submit" className="btn btn-primary float-right">Save URL</button>
                    </div>
                </form>     
            </div>        
        );
    }
}
