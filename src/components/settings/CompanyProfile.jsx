import PropTypes from 'prop-types';
import React from 'react';
import {FormGroup} from 'reactstrap';

import CustomInputGroup from '../core/CustomInputGroup';
import TextArea from '../core/TextArea';
import FieldError from '../core/FieldError';
import Success from '../core/Success';
import SkillSelector from '../core/SkillSelector';


export default class CompanyProfile extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        isSaving: PropTypes.object,
        isSaved: PropTypes.object,
        errors: PropTypes.object,
        ProfileActions: PropTypes.object,
    };

    constructor(props) {
        super(props);
        const { company } = props.user;
        this.state = {
            name: company ? company.name : null,
            website: company ? company.website : null,
            bio: company ? company.bio : null,
            skills: company ? company.skills : null
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const {user, ProfileActions} = this.props;
        
        const name = this.state.name;
        const website = this.state.website;
        const bio = this.state.bio;
        const skills = this.state.skills ? this.state.skills.toString() : '';
        
        const id = user.company ? user.company.id : null
        ProfileActions.updateCompany(id, {
            name,
            website,
            bio,
            skills
        });
        return;
    }

    onChangeField(key, e) {
        let newState = {};
        newState[key] = e.target.value;
        this.setState(newState);
    }

    onChangeSkills(skills) {
        this.setState({ skills: skills });
    }

    render() {
        const { user, errors } = this.props
        return (
            <div>
                {this.props.isSaved.company ? ( 
                    <Success message="Comapny Profile saved successfully" /> 
                    ): null 
                }
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.company &&
                            errors.company.name ? (
                                <FieldError
                                    message={errors.company.name}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">Your company Name</label>
                                <CustomInputGroup
                                    onChange={this.onChangeField.bind(this, 'name')}
                                    variant=' '
                                    placeholder=' '
                                    defaultValue={this.state.name}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.company &&
                            errors.company.website ? (
                                <FieldError
                                    message={errors.company.website}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">Company Website</label>
                                <CustomInputGroup
                                    onChange={this.onChangeField.bind(this, 'website')}
                                    variant=' '
                                    placeholder=' '
                                    defaultValue={this.state.website}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.company &&
                            errors.company.bio ? (
                                <FieldError
                                    message={errors.company.bio}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">Company Bio</label>
                                <TextArea
                                    placeholder=''
                                    onChange={this.onChangeField.bind(this, 'bio')}
                                    defaultValue={this.state.bio}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.company &&
                            errors.company.skills ? (
                                <FieldError
                                    message={errors.company.skills}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">Technologies used by your company</label>
                                <SkillSelector
                                    placeholder="Type here to add a technology, e.g Python, Android or Rails"
                                    onChange={this.onChangeSkills.bind(this)}
                                    defaultValue={this.state.skills}
                                    selected={this.state.skills}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary float-right"
                        disabled={this.props.isSaving.company}
                        >
                        Save
                    </button>
                </form>
            </div>
        );
    }
}
