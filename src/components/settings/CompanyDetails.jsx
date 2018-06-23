import PropTypes from 'prop-types';
import React from 'react';
import {FormGroup} from 'reactstrap';

import CustomInputGroup from '../core/CustomInputGroup';
import CountrySelector from '../core/CountrySelector';
import FieldError from '../core/FieldError';
import Success from '../core/Success';


export default class CompanyDetails extends React.Component {
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
            street: company ? company.street : null,
            plot_number: company ? company.plot_number : null,
            city: company ? company.city : null,
            postal_code: company ? company.postal_code : null,
            country: company ? company.country : null,
            vat_number: company ? company.vat_number : null,
            reg_no: company ? company.reg_no : null
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const {user, ProfileActions} = this.props;
        
        const street = this.state.street;
        const plot_number = this.state.plot_number;
        const city = this.state.city;
        const postal_code = this.state.postal_code;
        const country = this.state.country;
        const vat_number = this.state.vat_number;
        const reg_no = this.state.reg_no;
        
        const id = user.company ? user.company.id : null
        ProfileActions.updateCompany(id, {
            street,
            plot_number,
            city,
            postal_code,
            country,
            vat_number,
            reg_no
        });
        return;
    }

    onChangeField(key, e) {
        let newState = {};
        newState[key] = e.target.value;
        this.setState(newState);
    }

    render() {
        const { user, errors } = this.props
        return (
            <div>
                {this.props.isSaved.company ? ( 
                    <Success message="Comapny Details saved successfully" /> 
                    ): null 
                }
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.company &&
                            errors.company.street ? (
                                <FieldError
                                    message={errors.company.street}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Street</label>
                                <CustomInputGroup
                                    onChange={this.onChangeField.bind(this, 'street')}
                                    variant=' '
                                    placeholder=' '
                                    defaultValue={this.state.street}
                                />
                            </FormGroup>
                        </div>
                        <div className="col-sm-4">
                        {errors.company &&
                            errors.company.plot_number ? (
                                <FieldError
                                    message={errors.company.plot_number}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Number/Plot</label>
                                <CustomInputGroup
                                    onChange={this.onChangeField.bind(this, 'plot_number')}
                                    variant=' ' 
                                    placeholder=' '
                                    defaultValue={this.state.plot_number}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.company &&
                            errors.company.city ? (
                                <FieldError
                                    message={errors.company.city}
                                />
                            ) : null}
                            <FormGroup>
                                <label>City</label>
                                <CustomInputGroup
                                    onChange={this.onChangeField.bind(this, 'city')}
                                    variant=' '
                                    placeholder=' '
                                    defaultValue={this.state.city}
                                />
                            </FormGroup>
                        </div>
                        <div className="col-sm-4">
                        {errors.company &&
                            errors.company.postal_code ? (
                                <FieldError
                                    message={errors.company.postal_code}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Zip Code</label>
                                <CustomInputGroup
                                    onChange={this.onChangeField.bind(this, 'postal_code')}
                                    variant=' '
                                    placeholder=' '
                                    defaultValue={this.state.postal_code}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.company &&
                            errors.company.country ? (
                                <FieldError
                                    message={errors.company.country}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Country</label>
                                <CountrySelector
                                    onChange={this.onChangeField.bind(this, 'country')}
                                    selected={this.state.country}
                                />
                            </FormGroup>
                        </div>
                        <div className="col-sm-4">
                        {errors.company &&
                            errors.company.vat_number ? (
                                <FieldError
                                    message={errors.company.vat_number}
                                />
                            ) : null}
                            <FormGroup>
                                <label>VAT number</label>
                                <CustomInputGroup
                                    onChange={this.onChangeField.bind(this, 'vat_number')}
                                    variant=' '
                                    placeholder=' '
                                    defaultValue={this.state.vat_number}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.company &&
                            errors.company.reg_no ? (
                                <FieldError
                                    message={errors.company.reg_no}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Company Registration Number (Optional)</label>
                                <CustomInputGroup
                                    onChange={this.onChangeField.bind(this, 'reg_no')}
                                    variant=' '
                                    placeholder=' '
                                    defaultValue={this.state.reg_no}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <button
                        type="save"
                        className="btn btn-primary float-right"
                        disabled={this.props.isSaving.company}
                    >
                        save
                    </button>
                </form>
            </div>
        );
    }
}
