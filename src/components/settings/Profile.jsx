import PropTypes from 'prop-types';
import React from 'react';
import {FormGroup} from 'reactstrap';

import CustomInputGroup from '../core/CustomInputGroup';
import Upload from '../core/Upload';
import Icon from '../core/Icon';
import CountrySelector from '../core/CountrySelector';
import FieldError from '../core/FieldError';
import Success from '../core/Success';


export default class Profile extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        isSaving: PropTypes.object,
        isSaved: PropTypes.object,
        errors: PropTypes.object,
        ProfileActions: PropTypes.object,
    };

    constructor(props) {
        super(props);
        const {user} = props;
        this.state = {
            first_name: user.first_name,
            last_name: user.last_name,
            phone_number: user.profile.phone_number,
            profile_picture: user.profile.image,
            street: user.profile.street,
            plot_number: user.profile.plot_number,
            city: user.profile.city,
            zip: user.profile.postal_code,
            country: user.country,
            passport: user.id_document
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const {user, ProfileActions} = this.props;

        const first_name = this.state.first_name;
        const last_name = this.state.last_name;
        const country = this.state.country;
        const city = this.state.city;
        const street = this.state.street;
        const plot_number = this.state.plot_number;
        const postal_code = this.state.zip;
        const phone_number = this.state.phone_number;
        const id_document = this.state.passport;
        const image = this.state.profile_picture;

        ProfileActions.updateProfile(user.profile.id, {
            first_name,
            last_name,
            country,
            city,
            street,
            plot_number,
            postal_code,
            phone_number,
            id_document,
            image
        });
        return;
    }

    onChangeField(key, e) {
        let newState = {};
        newState[key] = e.target.value;
        this.setState(newState);
    }

    onChangeFile(key, files) {
        let newState = {};
        newState[key] = files[0];
        this.setState(newState);
    }

    render() {
        const {errors} = this.props;
        return (
            <div>
                {this.props.isSaved.profile ? ( 
                    <Success message="Profile saved successfully" /> 
                    ): null 
                }
                <form method="post" onSubmit={this.handleSubmit.bind(this)}>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.profile &&
                            errors.profile.first_name ? (
                                <FieldError
                                    message={errors.profile.first_name}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">First Name</label>
                                <CustomInputGroup
                                    onChange={this.onChangeField.bind(this, 'first_name')}
                                    variant=' '
                                    placeholder=' '
                                    defaultValue={this.state.first_name}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.profile &&
                            errors.profile.last_name ? (
                                <FieldError
                                    message={errors.profile.last_name}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">Last Name</label>
                                <CustomInputGroup
                                    onChange={this.onChangeField.bind(this, 'last_name')}
                                    variant=' '
                                    placeholder=' '
                                    defaultValue={this.state.last_name}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.profile &&
                            errors.profile.phone_number ? (
                                <FieldError
                                    message={errors.profile.phone_number}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">Phone Number</label>
                                <CustomInputGroup
                                    onChange={this.onChangeField.bind(this, 'phone_number')}
                                    variant=' '
                                    placeholder=' '
                                    defaultValue={this.state.phone_number}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.profile &&
                            errors.profile.image ? (
                                <FieldError
                                    message={errors.profile.image}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">Picture</label>
                                <Upload
                                    type='image' 
                                    placeholder={<Icon name='avatar' size='xl' />}
                                    onChange={this.onChangeFile.bind(this, 'profile_picture')}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.profile &&
                        errors.profile.street ? (
                            <FieldError
                                message={errors.profile.street}
                            />
                        ) : null}
                            <FormGroup>
                                <label className="control-label">Street</label>
                                <CustomInputGroup
                                    variant=' '
                                    placeholder=' '
                                    onChange={this.onChangeField.bind(this, 'street')}
                                    defaultValue={this.state.street}
                                />
                            </FormGroup>
                        </div>
                        <div className="col-sm-4">
                        {errors.profile &&
                        errors.profile.plot_number ? (
                            <FieldError
                                message={errors.profile.plot_number}
                            />
                        ) : null}
                            <FormGroup>
                                <label className="control-label">Number/Plot</label>
                                <CustomInputGroup
                                    variant=' '
                                    placeholder=' '
                                    required
                                    onChange={this.onChangeField.bind(this, 'plot_number')}
                                    defaultValue={this.state.plot_number}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.profile &&
                        errors.profile.city ? (
                            <FieldError
                                message={errors.profile.city}
                            />
                        ) : null}
                            <FormGroup>
                                <label className="control-label">City</label>
                                <CustomInputGroup
                                    variant=' '
                                    placeholder=' '
                                    required
                                    onChange={this.onChangeField.bind(this, 'city')}
                                    defaultValue={this.state.city}
                                />
                            </FormGroup>
                        </div>
                        <div className="col-sm-4">
                        {errors.profile &&
                        errors.profile.postal_code ? (
                            <FieldError
                                message={errors.profile.postal_code}
                            />
                        ) : null}
                            <FormGroup>
                                <label className="control-label">Zip code</label>
                                <CustomInputGroup
                                    variant=' '
                                    placeholder=' '
                                    required
                                    onChange={this.onChangeField.bind(this, 'zip')}
                                    defaultValue={this.state.postal_code}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.profile &&
                            errors.profile.country ? (
                                <FieldError
                                    message={errors.profile.country}
                                />
                            ) : null}
                            <FormGroup>
                                <label className="control-label">Country</label>
                                <CountrySelector
                                    onChange={this.onChangeField.bind(this, 'country')}
                                    selected={this.state.country}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.profile &&
                        errors.profile.id_document ? (
                            <FieldError
                                message={errors.profile.id_document}
                            />
                        ) : null}
                            <FormGroup>
                                <label className="control-label">Upload ID (passport or national ID card)</label>
                                <Upload
                                    type='image'
                                    placeholder={<Icon name='id' size='xl' />}
                                    onChange={this.onChangeFile.bind(this, 'passport')}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary float-right"
                        disabled={this.props.isSaving.profile}
                        >
                        Save
                    </button>
                </form>
            </div>
        );
    }
}
