import React from 'react'
import Progress from './status/Progress'
import FormStatus from './status/FormStatus'
import FieldError from './status/FieldError'
import SkillSelector from '../containers/SkillSelector'

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.ProfileActions.getCountries();
        this.props.ProfileActions.retrieveProfile();
    }

    handleSubmit(e) {
        e.preventDefault();
        var first_name = this.refs.first_name.value.trim();
        var last_name = this.refs.last_name.value.trim();
        if(!first_name || !last_name) {
            return;
        }
        var company = this.refs.company?this.refs.company.value.trim():null;
        var country = this.refs.country.value.trim();
        var city = this.refs.city.value.trim();
        var street = this.refs.street.value.trim();
        var plot_number = this.refs.plot_number.value.trim();
        var phone_number = this.refs.phone_number.value.trim();
        const { Profile, ProfileActions } = this.props;
        ProfileActions.updateProfile(Profile.profile.id, {country, city, street, plot_number, phone_number, company});
        ProfileActions.updateAuthUser({first_name, last_name});
        return;
    }

    render() {
        const { Auth, Profile } = this.props;
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
                        (<FieldError message={Profile.error.user.first_name}/>):''}
                    <div className="form-group">
                        <label className="control-label">First Name</label>
                        <div><input type="text" className="form-control" ref="first_name" placeholder="First Name" required defaultValue={Auth.user.first_name}/></div>
                    </div>

                    {(Profile.error.user && Profile.error.user.last_name)?
                        (<FieldError message={Profile.error.user.last_name}/>):''}
                    <div className="form-group">
                        <label className="control-label">Last Name</label>
                        <div><input type="text" className="form-control" ref="last_name" placeholder="Last Name" required defaultValue={Auth.user.last_name}/></div>
                    </div>

                    {(Auth.user.is_project_owner && Profile.error.profile && Profile.error.profile.company)?
                        (<FieldError message={Profile.error.profile.company}/>):''}
                    {Auth.user.is_project_owner?(
                    <div className="form-group">
                        <label className="control-label">Company</label>
                        <div><input type="text" className="form-control" ref="company" placeholder="Company" defaultValue={Profile.profile.company}/></div>
                    </div>
                        ):null}

                    {(Profile.error.profile && Profile.detail.error.profile.country)?
                        (<FieldError message={Profile.detail.error.profile.country}/>):''}
                    <div className="form-group">
                        <label className="control-label">Country</label>
                        <select className="form-control" ref="country" defaultValue={Profile.profile.country}>
                            {Profile.countries.map(country => {
                                return <option key={country.code} value={country.code}>{country.name}</option>
                                })}
                        </select>
                    </div>

                    {(Profile.error.profile && Profile.error.profile.city)?
                        (<FieldError message={Profile.error.profile.city}/>):''}
                    <div className="form-group">
                        <label className="control-label">City</label>
                        <div><input type="text" className="form-control" ref="city" placeholder="City" defaultValue={Profile.profile.city}/></div>
                    </div>

                    {(Profile.error.profile && Profile.error.profile.street)?
                        (<FieldError message={Profile.error.profile.street}/>):''}
                    <div className="form-group">
                        <label className="control-label">Street</label>
                        <div><input type="text" className="form-control" ref="street" placeholder="Street" defaultValue={Profile.profile.street}/></div>
                    </div>

                    {(Profile.error.profile && Profile.error.profile.plot_number)?
                        (<FieldError message={Profile.error.profile.plot_number}/>):''}
                    <div className="form-group">
                        <label className="control-label">Plot Number</label>
                        <div><input type="text" className="form-control" ref="plot_number" placeholder="Plot Number" defaultValue={Profile.profile.plot_number}/></div>
                    </div>

                    {(Profile.error.profile && Profile.error.profile.phone_number)?
                        (<FieldError message={Profile.error.profile.phone_number}/>):''}
                    <div className="form-group">
                        <label className="control-label">Phone Number</label>
                        <div><input type="text" className="form-control" ref="phone_number" placeholder="Phone Number" defaultValue={Profile.profile.phone_number}/></div>
                    </div>

                    <button type="submit" className="btn btn-default pull-right" disabled={Profile.isSaving.profile || Profile.isSaving.user}>Save</button>
                    <div className="clearfix"></div>
                </form>
                    )}
            </div>

        );
    }
}
