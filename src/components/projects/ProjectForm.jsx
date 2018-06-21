import PropTypes from 'prop-types';
import React from 'react';

import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import ChoiceGroup from '../core/ChoiceGroup';
import SkillSelector from '../core/SkillSelector';
import TextArea from '../core/TextArea';
import DateTimePicker from '../core/DateTimePicker';
import Upload from '../core/Upload';

import {cleanSkills} from '../../actions/utils/api';

import { omit } from 'lodash';

export default class ProjectForm extends React.Component {
    static propTypes = {
        project: PropTypes.object,
        onCreate: PropTypes.func,
        isSaving: PropTypes.bool,
        isSaved: PropTypes.bool,
        errors: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
          title: "",
          description: "",
          skills: [],
          type: "",
          expected_duration: "",
          documents: [],
          deadline: null,
          titleError:"",
          descriptionError:"",
          projectTypeError:"",
          durationError:"",
        };

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleDurationChange = this.handleDurationChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleDeadlineChange = this.handleDeadlineChange.bind(this);
        this.handleDocumentChange = this.handleDocumentChange.bind(this);
        this.handleTechnologyChange = this.handleTechnologyChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate() {
        if(typeof this.props.project==='number' && (this.props.project%1)===0) {
            this.props.history.push(`/projects/${this.props.project}`);
        }
    }

    componentDidMount(){
        console.log(this.props.project)
    }

    handleTitleChange(event){
        this.setState({title: event.target.value, titleError:""})
    }

    handleTypeChange(value){
        this.setState({type: value, projectTypeError:""})
    }

     handleDurationChange(value){
        this.setState({expected_duration: value, durationError:""})
    }

    handleDescriptionChange(event){
        this.setState({description: event.target.value, descriptionError:""})
    }

    handleDeadlineChange(value){
        this.setState({deadline: value})
    }

    handleDocumentChange(value){
        this.setState({documents: [...value]})
    }

    handleTechnologyChange(value){
        let result = cleanSkills(value);
        this.setState({skills: [...result]})
    }

    handleSubmit(event) {
        event.preventDefault();

        if(!this.state.title.length){
            this.setState({titleError: "Project Title is empty"})
            return
        }

        if(!this.state.description.length){
            this.setState({descriptionError: "Project Description is empty"})
            return
        }

        if(!this.state.type.length){
            this.setState({projectTypeError: "Project Type is not specified"})
            return
        }

        if(!this.state.expected_duration.length){
            console.log ('expected duration')
            this.setState({durationError: "Project Duration is not specified"})
            return
        }

        if (this.state.titleError || this.state.descriptionError || this.state.projectTypeError || this.state.durationError ){
                return
            }

        let {documents, ...input} = this.state;
        let clean_input = omit(input, ['titleError','descriptionError','projectTypeError','durationError']);
        this.props.onCreate({...clean_input}, documents)

    }




    render() {

        return (
            <div className="content-card project-form-card">
                <form onSubmit={this.handleSubmit}>
                    <Container>
                        <Row>
                          <Col>
                            <div className="form-group">
                              <Label for="projectTitle" className='font-weight-bold'>Project Title*</Label>
                              <Input className={" " + (this.state.titleError ? 'is-invalid' : '')} placeholder='Project title' id='projectTitle' onChange={this.handleTitleChange} />
                              {this.state.titleError && <div className="invalid-feedback">
                                {this.state.titleError}
                              </div>}
                            </div>
                            <div className="form-group">
                              <Label for="projectType" className='font-weight-bold'>Which type of project do you have?*</Label>
                              <div className='text text-sm font-weight-thin'> Please select one of the options below </div>
                              <ChoiceGroup className="is-invalid" id='projectType' onChange={this.handleTypeChange} choices={[['web', 'Web'], ['mobile', 'Mobile'], ['other', 'Other']]} size="sm" />                 
                              {this.state.projectTypeError && <div className='text text-sm'>
                                {this.state.projectTypeError}
                              </div>}
                            </div>
                            <div className="form-group">
                              <Label for="projectExpectedDuration" className='font-weight-bold'>What is the expected duration of the project*</Label>
                              <div className='text text-sm font-weight-thin'> Please select one of the options below </div>
                              <ChoiceGroup id='projectExpectedDuration' onChange={this.handleDurationChange} choices={[['2w', 'Less than 2 weeks'], ['6m', 'Less than 6 months'], ['permanent', 'Permanent basis']]} size="sm" />
                              {this.state.durationError && <div className='text text-sm'>
                                {this.state.durationError}
                              </div>}                 
                            </div>
                            <div className="form-group">
                              <Label for="projectTechnology" className='font-weight-bold'>Which technology do you want to use (Optional)</Label>
                              <SkillSelector id='projectTechnology' onChange={this.handleTechnologyChange} placeholder="Type here to add a technology" />                 
                            </div>                                        
                          </Col>
                          <Col>
                            <div className="form-group">
                              <Label for="projectDescription" className='font-weight-bold'>Short Description of the project*</Label>
                              <TextArea className={" " + (this.state.descriptionError ? 'is-invalid' : '')} id='projectDescription' onChange={this.handleDescriptionChange} placeholder="Short Description" />
                              {this.state.descriptionError && <div className="invalid-feedback">
                                {this.state.descriptionError}
                              </div>}
                            </div>
                            <div className="form-group">
                              <Label for="projectDeadline" className='font-weight-bold'>Add a preferred deadline (optional)</Label>
                              <DateTimePicker calendar={true} time={false} id='projectDeadline' onChange={this.handleDeadlineChange} />                 
                            </div>
                            <div className="form-group">
                              <Label for="projectDocuments" className='font-weight-bold'>Add documents</Label>
                              <Upload variant='icon' onChange={this.handleDocumentChange} multiple={true} id='projectDocuments'/>                 
                            </div>                              
                          </Col>
                        </Row>
                        <Row>
                            <Col><button type="submit" className="btn btn-primary float-right">Submit</button></Col>          
                        </Row>
                    </Container>







                </form>
            </div>
        );
    }
}
