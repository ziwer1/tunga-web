import React from 'react'
import TinyMCE  from 'react-tinymce'
import Progress from './status/Progress'
import FormStatus from './status/FormStatus'
import FieldError from './status/FieldError'
import SkillSelector from '../containers/SkillSelector'
import {TINY_MCE_CONFIG } from '../constants/settings'

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {company_profile: '', bio: '', skills: []};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.ProfileActions.getCountries();
        this.props.ProfileActions.retrieveProfile();
    }

    onCompanyProfileChange(e) {
        this.setState({company_profile: e.target.getContent()});
    }

    onBioChange(e) {
        this.setState({bio: e.target.getContent()});
    }

    onSkillChange(skills) {
        this.setState({skills: skills});
    }

    handleSubmit(e) {
        e.preventDefault();
        var first_name = this.refs.first_name.value.trim();
        var last_name = this.refs.last_name.value.trim();
        if(!first_name || !last_name) {
            return;
        }

        var company = this.refs.company?this.refs.company.value.trim():null;
        var vat_number = this.refs.vat_number?this.refs.vat_number.value.trim():null;
        var country = this.refs.country.value.trim();
        var city = this.refs.city.value.trim();
        var street = this.refs.street.value.trim();
        var plot_number = this.refs.plot_number.value.trim();
        var postal_code = this.refs.postal_code.value.trim() || null;
        var phone_number = this.refs.phone_number.value.trim();

        var company_profile = this.state.company_profile;
        var bio = this.state.bio;
        var website = this.refs.website?this.refs.website.value.trim():null;

        const selected_skills = this.state.skills;
        const skills = selected_skills.join(',') || null;

        const { Profile, ProfileActions } = this.props;
        ProfileActions.updateProfile(Profile.profile.id, {
            country, city, street, plot_number, postal_code, phone_number, company, vat_number,
            company_profile, bio, website,
            skills
        });
        ProfileActions.updateAuthUser({first_name, last_name});
        return;
    }

    render() {
        const { Auth, Profile } = this.props;
        const company_profile = Profile.profile.bio?Profile.profile.company_profile:'';
        const bio = Profile.profile.bio?Profile.profile.bio:'';

        return (
            <div>
                {Profile.isRetrieving?(
                <Progress/>
                    ):(
                <form onSubmit={this.handleSubmit} name="profile" role="form" ref="profile_form">
                    <FormStatus loading={Profile.isSaving.profile || Profile.isSaving.user}
                                success={Profile.isSaved.profile || Profile.isSaved.user}
                                message={'Profile Saved'}
                                error={Profile.error.profile}/>

                    {(Profile.error.user && Profile.error.user.first_name)?
                        (<FieldError message={Profile.error.user.first_name}/>):null}
                    <div className="form-group">
                        <label className="control-label">First Name *</label>
                        <div><input type="text" className="form-control" ref="first_name" placeholder="First Name" required defaultValue={Auth.user.first_name}/></div>
                    </div>

                    {(Profile.error.user && Profile.error.user.last_name)?
                        (<FieldError message={Profile.error.user.last_name}/>):null}
                    <div className="form-group">
                        <label className="control-label">Last Name *</label>
                        <div><input type="text" className="form-control" ref="last_name" placeholder="Last Name" required defaultValue={Auth.user.last_name}/></div>
                    </div>

                    {(Profile.error.profile && Profile.error.profile.company)?
                        (<FieldError message={Profile.error.profile.company}/>):null}
                    <div className="form-group">
                        <label className="control-label">Company {Auth.user.is_developer?'(if applicable)':null}</label>
                        <div><input type="text" className="form-control" ref="company" placeholder="Company" defaultValue={Profile.profile.company}/></div>
                    </div>

                    {(Auth.user.is_developer && Profile.error.profile && Profile.error.profile.vat_number)?
                        (<FieldError message={Profile.error.profile.vat_number}/>):null}
                    {Auth.user.is_developer?(
                        <div className="form-group">
                            <label className="control-label">VAT Number (if applicable)</label>
                            <div><input type="text" className="form-control" ref="vat_number" placeholder="VAT Number" defaultValue={Profile.profile.vat_number}/></div>
                        </div>
                    ):null}

                    {(Profile.error.profile && Profile.detail.error.profile.country)?
                        (<FieldError message={Profile.detail.error.profile.country}/>):null}
                    <div className="form-group">
                        <label className="control-label">Country *</label>
                        <select className="form-control" ref="country" required defaultValue={Profile.profile.country}>
                            {Profile.countries.map(country => {
                                return <option key={country.code} value={country.code}>{country.name}</option>
                                })}
                        </select>
                    </div>

                    {(Profile.error.profile && Profile.error.profile.city)?
                        (<FieldError message={Profile.error.profile.city}/>):null}
                    <div className="form-group">
                        <label className="control-label">City *</label>
                        <div><input type="text" className="form-control" ref="city" placeholder="City" required defaultValue={Profile.profile.city}/></div>
                    </div>

                    {(Profile.error.profile && Profile.error.profile.street)?
                        (<FieldError message={Profile.error.profile.street}/>):null}
                    <div className="form-group">
                        <label className="control-label">Street *</label>
                        <div><input type="text" className="form-control" ref="street" placeholder="Street" required defaultValue={Profile.profile.street}/></div>
                    </div>

                    {(Profile.error.profile && Profile.error.profile.plot_number)?
                        (<FieldError message={Profile.error.profile.plot_number}/>):null}
                    <div className="form-group">
                        <label className="control-label">(Plot) Number *</label>
                        <div><input type="text" className="form-control" ref="plot_number" placeholder="Plot Number" required defaultValue={Profile.profile.plot_number}/></div>
                    </div>

                    {(Profile.error.profile && Profile.error.profile.postal_code)?
                        (<FieldError message={Profile.error.profile.postal_code}/>):null}
                    <div className="form-group">
                        <label className="control-label">ZIP Code *</label>
                        <div><input type="text" className="form-control" ref="postal_code" placeholder="ZIP Code" required defaultValue={Profile.profile.postal_code}/></div>
                    </div>

                    {(Profile.error.profile && Profile.error.profile.phone_number)?
                        (<FieldError message={Profile.error.profile.phone_number}/>):null}
                    <div className="form-group">
                        <label className="control-label">Phone Number</label>
                        <div><input type="text" className="form-control" ref="phone_number" placeholder="Phone Number" defaultValue={Profile.profile.phone_number}/></div>
                    </div>

                    {(Auth.user.is_project_owner && Profile.error.profile && Profile.error.profile.company_profile)?
                        (<FieldError message={Profile.error.profile.company_profile}/>):null}
                    {Auth.user.is_project_owner?(
                        <div className="form-group">
                            <label className="control-label">Company Profile</label>
                            <TinyMCE
                                content={company_profile}
                                config={TINY_MCE_CONFIG}
                                onChange={this.onCompanyProfileChange.bind(this)}/>
                        </div>
                    ):null}

                    {(Auth.user.is_project_owner && Profile.error.profile && Profile.error.profile.bio)?
                        (<FieldError message={Profile.error.profile.bio}/>):null}
                    {Auth.user.is_project_owner?(
                        <div className="form-group">
                            <label className="control-label">Company Bio</label>
                            <TinyMCE
                                content={bio}
                                config={TINY_MCE_CONFIG}
                                onChange={this.onBioChange.bind(this)}/>
                        </div>
                    ):null}

                    {(Auth.user.is_project_owner && Profile.error.profile && Profile.error.profile.website)?
                        (<FieldError message={Profile.error.profile.website}/>):null}
                    {Auth.user.is_project_owner?(
                        <div className="form-group">
                            <label className="control-label">Website</label>
                            <div><input type="text" className="form-control" ref="website" placeholder="Website" defaultValue={Profile.profile.website}/></div>
                        </div>
                    ):null}

                    {(Auth.user.is_project_owner && Profile.error.profile && Profile.error.profile.skills)?
                        (<FieldError message={Profile.error.profile.skills}/>):null}
                    {Auth.user.is_project_owner?(
                        <div className="form-group">
                            <label className="control-label">Skills *</label>
                            <SkillSelector filter={{filter: null}} onChange={this.onSkillChange.bind(this)} skills={Profile.profile.skills?Profile.profile.skills:[]}/>
                        </div>
                    ):null}

                    <button type="submit" className="btn btn-default pull-right" disabled={Profile.isSaving.profile || Profile.isSaving.user}>Save</button>
                    <div className="clearfix"></div>
                </form>
                    )}
            </div>

        );
    }
}
