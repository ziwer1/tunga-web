import PropTypes from "prop-types";
import React from "react";

import { Container, Row, Col, Label } from "reactstrap";
import ChoiceGroup from "../core/ChoiceGroup";
import SkillSelector from "../core/SkillSelector";
import TextArea from "../core/TextArea";
import DateTimePicker from "../core/DateTimePicker";
import Upload from "../core/Upload";
import Input from "../core/Input";
import FieldError from "../core/FieldError";

import { cleanSkills } from "../../actions/utils/api";

import { omit } from "lodash";

export default class ProjectForm extends React.Component {
    static propTypes = {
        project: PropTypes.object,
        onCreate: PropTypes.func,
        isSaving: PropTypes.bool,
        isSaved: PropTypes.bool,
        errors: PropTypes.object
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
            error:{
                title:"",
                description:"",
                type:"",
                duration:""
            }
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
        if (
            typeof this.props.project === "number" &&
            this.props.project % 1 === 0
        ) {
            this.props.history.push(`/projects/${this.props.project}`);
        }
    }

    handleTitleChange(event) {
        let field_value = event.target.value;
        this.setState((prevState) => {
          return {title: field_value, error: {...prevState.error, title:''}};
        });
    }

    handleTypeChange(value) {
        this.setState((prevState) => {
          return {type: value, error: {...prevState.error, type:''}};
        });
    }

    handleDurationChange(value) {
        this.setState((prevState) => {
          return {expected_duration: value, error: {...prevState.error, duration:''}};
        });
    }

    handleDescriptionChange(event) {
        let field_value = event.target.value;
        this.setState((prevState) => {
          return {description: field_value, error: {...prevState.error, description:''}};
        });
    }

    handleDeadlineChange(value) {
        this.setState({ deadline: value });
    }

    handleDocumentChange(value) {
        this.setState({ documents: [...value] });
    }

    handleTechnologyChange(value) {
        let result = cleanSkills(value);
        this.setState({ skills: [...result] });
    }

    handleSubmit(event) {
        event.preventDefault();

        if (!this.state.title.length) {
            this.setState((prevState) => {
              return {error: {...prevState.error, title:"Project Title is empty"}};
            });
            return;
        }

        if (!this.state.description.length) {
            this.setState((prevState) => {
              return {error: {...prevState.error, description: "Project Description is empty"}};
            });
            return;
        }


        if (!this.state.type.length) {
            this.setState((prevState) => {
              return {error: {...prevState.error, type: "Project Type is not specified"}};
            });
            return;
        }

        if (!this.state.expected_duration.length) {
            this.setState((prevState) => {
              return {error: {...prevState.error, duration: "Project Duration is not specified"}};
            });
            return;
        }

        if (
            this.state.error.title ||
            this.state.error.description ||
            this.state.error.type ||
            this.state.error.duration
        ) {
            return;
        }

        
        let filtered_input = omit(this.state, ["error"])
        this.props.onCreate(filtered_input)

    }

    render() {
        return (
            <div className="content-card project-form-card">
                <form onSubmit={this.handleSubmit}>
                    <Container>
                        <Row>
                            <Col>
                                <div className="form-group form-group-padding-bottom">
                                    <Label
                                        for="projectTitle"
                                        className="font-weight-bold"
                                    >
                                        Project Title*
                                    </Label>
                                    <Input
                                        placeholder="Project title"
                                        id="projectTitle"
                                        onChange={this.handleTitleChange}
                                    />
                                    {this.state.error.title && (
                                        <FieldError message={this.state.error.title}/>
                                    )}
                                </div>
                                <div className="form-group form-group-padding-bottom">
                                    <Label
                                        for="projectType"
                                        className="font-weight-bold"
                                    >
                                        Which type of project do you have?*
                                    </Label>
                                    <div className="text text-sm font-weight-thin">
                                        {" "}
                                        Please select one of the options below{" "}
                                    </div>
                                    <ChoiceGroup
                                        id="projectType"
                                        onChange={this.handleTypeChange}
                                        choices={[
                                            ["web", "Web"],
                                            ["mobile", "Mobile"],
                                            ["other", "Other"]
                                        ]}
                                        size="sm"
                                    />
                                    {this.state.error.type && (
                                        <FieldError message={this.state.error.type}/>
                                    )}
                                </div>
                                <div className="form-group form-group-padding-bottom">
                                    <Label
                                        for="projectExpectedDuration"
                                        className="font-weight-bold"
                                    >
                                        What is the expected duration of the
                                        project*
                                    </Label>
                                    <div className="text text-sm font-weight-thin">
                                        {" "}
                                        Please select one of the options below{" "}
                                    </div>
                                    <ChoiceGroup
                                        id="projectExpectedDuration"
                                        onChange={this.handleDurationChange}
                                        choices={[
                                            ["2w", "Less than 2 weeks"],
                                            ["6m", "Less than 6 months"],
                                            ["permanent", "Permanent basis"]
                                        ]}
                                        size="sm"
                                    />
                                    {this.state.error.duration && (
                                        <FieldError message={this.state.error.duration}/>
                                    )}
                                </div>
                                <div className="form-group form-group-padding-bottom">
                                    <Label
                                        for="projectTechnology"
                                        className="font-weight-bold"
                                    >
                                        Which technology do you want to use
                                        (Optional)
                                    </Label>
                                    <SkillSelector
                                        id="projectTechnology"
                                        onChange={this.handleTechnologyChange}
                                        placeholder="Type here to add a technology"
                                    />
                                </div>
                            </Col>
                            <Col>
                                <div className="form-group form-group-padding-bottom">
                                    <Label
                                        for="projectDescription"
                                        className="font-weight-bold"
                                    >
                                        Short Description of the project*
                                    </Label>
                                    <TextArea
                                        id="projectDescription"
                                        onChange={this.handleDescriptionChange}
                                        placeholder="Short Description"
                                    />
                                    {this.state.error.description && (
                                        <FieldError message={this.state.error.description}/>
                                    )}
                                </div>
                                <div className="form-group form-group-padding-bottom">
                                    <Label
                                        for="projectDeadline"
                                        className="font-weight-bold"
                                    >
                                        Add a preferred deadline (optional)
                                    </Label>
                                    <DateTimePicker
                                        calendar={true}
                                        time={false}
                                        id="projectDeadline"
                                        onChange={this.handleDeadlineChange}
                                    />
                                </div>
                                <div className="form-group form-group-padding-bottom">
                                    <Label
                                        for="projectDocuments"
                                        className="font-weight-bold"
                                    >
                                        Add documents
                                    </Label>
                                    <Upload
                                        variant="icon"
                                        onChange={this.handleDocumentChange}
                                        multiple={true}
                                        id="projectDocuments"
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <button
                                    type="submit"
                                    className="btn btn-primary float-right"
                                >
                                    Submit
                                </button>
                            </Col>
                        </Row>
                    </Container>
                </form>
            </div>
        );
    }
}
