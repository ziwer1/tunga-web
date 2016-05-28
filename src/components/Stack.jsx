import React from 'react'
import TinyMCE  from 'react-tinymce'
import Progress from './status/Progress'
import FormStatus from './status/FormStatus'
import FieldError from './status/FieldError'
import SkillSelector from '../containers/SkillSelector'
import LargeModal from './ModalLarge'
import WorkForm from './WorkForm'
import EducationForm from './EducationForm'
import {TINY_MCE_CONFIG } from '../constants/settings'

export default class Stack extends React.Component {
    constructor(props) {
        super(props);
        this.state = {bio: '', skills: [], editWork: null, editEducation: null};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.ProfileActions.retrieveProfile();
    }

    onBioChange(e) {
        this.setState({bio: e.target.getContent()});
    }

    onSkillChange(skills) {
        this.setState({skills: skills});
    }

    handleSubmit(e) {
        e.preventDefault();
        var website = this.refs.website?this.refs.website.value.trim():null;
        var bio = this.state.bio;
        const { Profile, ProfileActions } = this.props;
        const selected_skills = this.state.skills;
        const skills = selected_skills.join(',');
        ProfileActions.updateProfile(Profile.profile.id, {website, bio, skills});
        return;
    }

    handleAddWork(work=null) {
        this.setState({modalContent: 'work', modalTitle: 'Work Experience', editWork: work});
        this.open();
    }

    handleAddEducation(education=null) {
        this.setState({modalContent: 'education', modalTitle: 'Education', editEducation: education});
        this.open();
    }

    close() {
        this.setState({showModal: false});
    }

    open() {
        this.setState({showModal: true});
    }

    renderModalContent() {
        const { ProfileActions, Profile, Auth } = this.props;
        return (
            <LargeModal title={this.state.modalTitle} show={this.state.showModal} onHide={this.close.bind(this)}>
                {this.state.modalContent == 'work'?(
                <WorkForm Auth={Auth} Profile={Profile} ProfileActions={ProfileActions} work={this.state.editWork} />
                    ):null}
                {this.state.modalContent == 'education'?(
                <EducationForm Auth={Auth} Profile={Profile} ProfileActions={ProfileActions} education={this.state.editEducation} />
                    ):null}
            </LargeModal>
        );
    }

    render() {
        const { Profile, Auth } = this.props;
        const bio = Profile.profile.bio?Profile.profile.bio:'';

        return (
            <div>
                {Profile.isRetrieving?(
                <Progress/>
                    ):(
                <form onSubmit={this.handleSubmit} name="profile" role="form" ref="profile_form">
                    <FormStatus loading={Profile.isSaving.profile}
                                success={Profile.isSaved.profile}
                                message={'Profile Saved'}
                                error={Profile.error.profile}/>

                    {(Profile.error.profile && Profile.error.profile.bio)?
                        (<FieldError message={Profile.error.profile.bio}/>):''}
                    <div className="form-group">
                        <label className="control-label">Bio</label>
                        <TinyMCE
                            content={bio}
                            config={TINY_MCE_CONFIG}
                            onChange={this.onBioChange.bind(this)}/>
                    </div>

                    {(Auth.user.is_project_owner && Profile.error.profile && Profile.error.profile.website)?
                        (<FieldError message={Profile.error.profile.website}/>):''}
                    {Auth.user.is_project_owner?(
                    <div className="form-group">
                        <label className="control-label">Website</label>
                        <div><input type="text" className="form-control" ref="website" placeholder="Website" defaultValue={Profile.profile.website}/></div>
                    </div>
                        ):null}

                    {(Profile.error.profile && Profile.error.profile.skills)?
                        (<FieldError message={Profile.error.profile.skills}/>):''}
                    <div className="form-group">
                        <label className="control-label">Skills</label>
                        <SkillSelector filter={{filter: null}} onChange={this.onSkillChange.bind(this)} skills={Profile.profile.skills?Profile.profile.skills:[]}/>
                    </div>

                    {Auth.user.is_developer?(
                    <div>
                        <div className="form-group">
                            <label className="control-label">Work Experience</label>
                            <div className="pull-right clearfix">
                                <button type="button" onClick={this.handleAddWork.bind(this)}><i className="fa fa-plus-circle"/> Add Entry</button>
                            </div>
                            <div>
                                {Profile.work.ids.map(id => {
                                    var item = Profile.work.items[id];
                                    return (
                                        <div key={item.id} className="well card" style={{margin: '5px 0'}}>
                                            <div><strong>Position: {item.position}</strong></div>
                                            <div><strong>Company: {item.company}</strong></div>
                                            <div>
                                                Period: {item.start_month_display}/{item.start_year} - {item.end_year?`${item.start_month_display}/${item.start_year}`:'Present'}
                                            </div>
                                            <div dangerouslySetInnerHTML={{__html: item.details}} style={{margin: '5px 0', maxHeight: '50px'}}/>
                                            <button type="button" onClick={this.handleAddWork.bind(this, item)}><i className="fa fa-pencil"/> Edit</button>
                                        </div>
                                        )
                                    })}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="control-label">Education</label>
                            <div className="pull-right clearfix">
                                <button type="button" onClick={this.handleAddEducation.bind(this)}><i className="fa fa-plus-circle"/> Add Entry</button>
                            </div>
                            <div>
                                {Profile.education.ids.map(id => {
                                    var item = Profile.education.items[id];
                                    return (
                                    <div key={item.id} className="well card" style={{margin: '5px 0'}}>
                                        <div><strong>Institution: {item.institution}</strong></div>
                                        <div><strong>Award: {item.award}</strong></div>
                                        <div>
                                            Period: {item.start_month_display}/{item.start_year} - {item.end_year?`${item.start_month_display}/${item.start_year}`:'Present'}
                                        </div>
                                        <div dangerouslySetInnerHTML={{__html: item.details}} style={{margin: '5px 0', maxHeight: '50px'}}/>
                                        <button type="button" onClick={this.handleAddEducation.bind(this, item)}><i className="fa fa-pencil"/> Edit</button>
                                    </div>
                                        )
                                    })}
                            </div>
                        </div>
                    </div>
                        ):null}

                    <button type="submit" className="btn btn-default pull-right" disabled={Profile.isSaving.profile}>Save</button>
                    <div className="clearfix"></div>
                </form>
                    )}
                {this.renderModalContent()}
            </div>

        );
    }
}
