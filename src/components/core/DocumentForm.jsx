import React from 'react';
import PropTypes from "prop-types";
import {FormGroup} from 'reactstrap';

import Upload from "./Upload";
import Select from "./Select";
import Input from "./Input";
import CustomInputGroup from "./CustomInputGroup";
import TextArea from "./TextArea";

import {DOCUMENT_TYPES} from "../../actions/utils/api";
import Button from "./Button";

export default class DocumentForm extends React.Component {
    static defaultProps = {
        type: 'file',
    };

    static propTypes = {
        type: PropTypes.string,
        documentTypes: PropTypes.array,
        onChange: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            type: null,
            file: null,
            url: '',
        };
    }

    onChange(key, value) {
        var newState = {};
        newState[key] = value;
        this.setState(newState);
    }

    onSave = (e) => {
        e.preventDefault();

        const {onSave} = this.props;
        if(onSave) {
            onSave(this.state);
        }
    };

    render() {
        const {type, documentTypes} = this.props;

        return (
            <form onSubmit={this.onSave}>
                <FormGroup>
                    <Select options={Array.isArray(documentTypes) && documentTypes.length > 0?documentTypes:Object.keys(DOCUMENT_TYPES).map(key => {
                        return [key, DOCUMENT_TYPES[key]];
                    })} onChange={(type) => {this.onChange('type', type)}}/>
                </FormGroup>
                <FormGroup>
                    <Input placeholder="Insert title here"
                           onChange={(e) => {this.onChange('title', e.target.value)}}/>
                </FormGroup>
                {type === 'url'?(
                    <FormGroup>
                        <CustomInputGroup variant="url"
                                          onChange={(e) => {this.onChange('url', e.target.value)}}/>
                    </FormGroup>
                ):(
                    <FormGroup>
                        <Upload onChange={(files) => {this.onChange('file', files[0])}}/>
                    </FormGroup>
                )}
                <FormGroup>
                    <TextArea placeholder="Description"
                              onChange={(e) => {this.onChange('description', e.target.value)}}/>
                </FormGroup>
                <FormGroup>
                    <Button type="submit" className="float-right">Save</Button>
                </FormGroup>
            </form>
        );
    }
}

