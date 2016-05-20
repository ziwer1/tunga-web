import React from 'react'
import TinyMCE  from 'react-tinymce'
import Progress from './status/Progress'
import FormStatus from './status/FormStatus'
import FieldError from './status/FieldError'
import SkillSelector from '../containers/SkillSelector'
import {TINY_MCE_CONFIG } from '../constants/settings'

export default class Stack extends React.Component {
    constructor(props) {
        super(props);
        this.state = {bio: '', skills: []};
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
                        <SkillSelector filter={{filter: null}} onChange={this.onSkillChange.bind(this)} skills={Profile.profile.details?Profile.profile.details.skills:[]}/>
                    </div>

                    <button type="submit" className="btn btn-default pull-right" disabled={Profile.isSaving.profile}>Save</button>
                    <div className="clearfix"></div>
                </form>
                    )}
            </div>

        );
    }
}
