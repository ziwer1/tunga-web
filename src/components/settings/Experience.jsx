import PropTypes from 'prop-types';
import React from 'react';
import {FormGroup} from 'reactstrap';

import TextArea from '../core/TextArea';
import FieldError from '../core/FieldError';
import Success from '../core/Success';
import SkillSelector from '../core/SkillSelector';
import { openModal } from '../core/utils/modals';
import Icon from '../core/Icon';
import WorkForm from './WorkForm';
import EducationForm from './EducationForm';


export default class Experience extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        isSaving: PropTypes.object,
        isSaved: PropTypes.object,
        errors: PropTypes.object,
        ProfileActions: PropTypes.object,
    };

    constructor(props) {
        super(props);
        const { profile } = props.user;
        this.state = {
            bio: profile.bio,
            skills_details: {},
            editWork: null,
            editEducation: null,
            reset: false,
            skill_categories: {},
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const bio = this.state.bio;
        var all_skills = [];
        const skill_categories = this.state.skill_categories;
        if (skill_categories) {
            Object.keys(skill_categories).forEach(category => {
                all_skills = all_skills.concat(skill_categories[category]);
            });
        }
        const skills = all_skills.join(',') || '';
        this.props.ProfileActions.updateProfile(this.props.user.profile.id, {
            bio,
            skills,
            skill_categories
        });
        return;
    }

    onChangeField(key, e) {
        let newState = {};
        newState[key] = e.target.value;
        this.setState(newState);
    }

    onSkillChange(category, skills) {
        let new_state = {};
        new_state[category] = skills;
        this.setState({
            skill_categories: {...this.state.skill_categories, ...new_state},
        });
    }

    flattenSkills(skills) {
        return (skills || []).map(skill => {
            return skill.name;
        });
    }

    handleAddWork(work = {}, e) {
        e.preventDefault();
        this.renderModal(work, 'work');
    }

    handleAddEducation(education = {}, e) {
        e.preventDefault();
        this.renderModal(education, 'education');
    }

    renderModal(work, type) {
        const {ProfileActions, Profile, Auth, isSaved, errors, isSaving} = this.props;
        if (type === 'work') {
            openModal(<WorkForm
                ProfileActions={ProfileActions}
                work={work}
                isSaved={isSaved}
                isSaving={isSaving}
                errors={errors}
              />, 'Add work experience');
        } else {
            openModal(<EducationForm
                ProfileActions={ProfileActions}
                education={work}
                isSaved={isSaved}
                isSaving={isSaving}
                errors={errors}
              />, 'Add education');
        }
        
    }

    render() {
        const { errors, user } = this.props
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.profile &&
                            errors.profile.bio ? (
                                <FieldError
                                    message={errors.profile.bio}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">Your bio</label>
                                <TextArea
                                    placeholder='Type here something about yourself'
                                    onChange={this.onChangeField.bind(this, 'bio')}
                                    defaultValue={this.state.bio}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {[
                                {id: 'language', name: 'Languages'},
                                {id: 'framework', name: 'Frameworks'},
                                {id: 'platform', name: 'Platforms'},
                                {id: 'library', name: 'Libraries'},
                                {id: 'storage', name: 'Storage Engines'},
                                {id: 'other', name: 'Miscellaneous', tag: 'skill'},
                        ].map(skill => {
                            return (
                                <FormGroup key={skill.id}>
                                    <label className="control-label">{skill.name} master</label>
                                    <SkillSelector
                                            filter={{filter: null}}
                                            onChange={this.onSkillChange.bind(
                                                this,
                                                skill.id,
                                            )}
                                            skills={
                                                this.state.skills_details
                                                    ? this.flattenSkills(
                                                        this.state.skills_details[
                                                            skill.id
                                                        ],
                                                    ) || []
                                                    : []
                                            }
                                            reset={this.state.reset}
                                            tagName={skill.tag || skill.id}
                                            placeholder={`Type here to add a ${skill.name}`}
                                        />
                                </FormGroup>
                            )
                        })}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                            <FormGroup>
                                <label className="control-label">Work</label>
                                <div>
                                    <button
                                        className="btn btn-primary"
                                        onClick={this.handleAddWork.bind(this, {})}
                                    >
                                        add entry
                                    </button>
                                </div>
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                            {user.work.length ? user.work.map((work) => {
                                return (
                                    <div className="card work-education-wrapper">
                                        <div className="card-body">
                                            <p>Position: {work.position}</p>
                                            <p>Company: {work.company}</p>
                                            <p>Period: {work.start_month_display}/{work.start_year} - {work.end_month_display}/{work.end_year}</p>
                                            <br />
                                            <p>{work.details}</p>
                                            <button
                                                className="btn btn-primary"
                                                onClick={this.handleAddWork.bind(
                                                    this,
                                                    work,
                                                )}
                                            >
                                                <Icon name="pencil2" /> Edit
                                            </button>
                                        </div>
                                    </div>
                                )
                            }): ''}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                            <FormGroup>
                                <label className="control-label">Education</label>
                                <div>
                                    <button
                                        className="btn btn-primary"
                                        onClick={this.handleAddEducation.bind(this, {})}
                                    >
                                        add entry
                                    </button>
                                </div>
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                            {user.education.length ? user.education.map((data) => {
                                return (
                                    <div className="card work-education-wrapper">
                                        <div className="card-body">
                                            <p>Educational Institute: {data.institution}</p>
                                            <p>Degree: {data.award}</p>
                                            <p>Period: {data.start_month_display}/{data.start_year} - {data.end_month_display}/{data.end_year}</p>
                                            <br />
                                            <p>{data.details}</p>
                                            <button
                                                className="btn btn-primary"
                                                onClick={this.handleAddEducation.bind(
                                                    this,
                                                    data,
                                                )}
                                            >
                                                <Icon name="pencil2" /> Edit
                                            </button>
                                        </div>
                                    </div>
                                )
                            }): ''}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary float-right"
                        disabed={this.props.isSaving.profile}
                    >
                        Save
                    </button>
                </form>
            </div>
        );
    }
}
