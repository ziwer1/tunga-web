import PropTypes from 'prop-types';
import React from 'react';
import {FormGroup} from 'reactstrap';

import Input from '../core/InputGroup';
import FieldError from '../core/FieldError';
import CountrySelector from '../core/CountrySelector';
import Icon from '../core/Icon';


export default class StepTwo extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        isSaving: PropTypes.object,
        isSaved: PropTypes.object,
        errors: PropTypes.object,
        ProfileActions: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            street: '',
            city: '',
            country: '',
            plot_number: '',
            postal_code: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isSaved.profile) {
            this.props.history.push('/onboard/step-three');
        }
    }

    onChangeField(key, e) {
        let newState = {};
        newState[key] = e.target.value;
        this.setState(newState);
    }

    handleSubmit(e) {
        e.preventDefault();
        const {user, ProfileActions} = this.props;
        
        const street = this.state.street;
        const city = this.state.city;
        const country = this.state.country;
        const plot_number = this.state.plot_number;
        const postal_code = this.state.postal_code;
        
        ProfileActions.updateProfile(user.profile.id, {
            street,
            city,
            country,
            plot_number,
            postal_code
        });
        return;
    }


    render() {
        const {errors} = this.props;
        return (
            <div>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <div className="row">
                        <div className="col-sm-8">
                        {errors.profile &&
                            errors.profile.street ? (
                                <FieldError
                                    message={errors.profile.street}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Street *</label>
                                <Input placeholder=' ' onChange={this.onChangeField.bind(this, 'street')}/>
                            </FormGroup>
                        </div>
                        <div className="col-sm-3">
                        {errors.profile &&
                            errors.profile.plot_number ? (
                                <FieldError
                                    message={errors.profile.plot_number}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Number/Plot *</label>
                                <Input placeholder=' ' onChange={this.onChangeField.bind(this, 'plot_number')}/>
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
                                <label>City *</label>
                                <Input placeholder=' ' onChange={this.onChangeField.bind(this, 'city')}/>
                            </FormGroup>
                        </div>
                        <div className="col-sm-3">
                        {errors.profile &&
                            errors.profile.postal_code ? (
                                <FieldError
                                    message={errors.profile.postal_code}
                                />
                            ) : null}
                            <FormGroup>
                                <label>Zip code *</label>
                                <Input placeholder=' ' onChange={this.onChangeField.bind(this, 'postal_code')} />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="col-sm-8">
                    {errors.profile &&
                        errors.profile.country ? (
                            <FieldError
                                message={errors.profile.country}
                            />
                        ) : null}
                        <FormGroup>
                            <label>Country *</label>
                            <CountrySelector
                                onChange={this.onChangeField.bind(this, 'country')}
                            />
                        </FormGroup>
                </div>
                <div>
                    <button className="float-left onboard-action" onClick={() => this.props.history.push('/onboard/step-one')} >
                        <Icon name='arrow-left' size='md'/>
                    </button>
                    <button type="submit" className="btn float-right onboard-action">
                        <Icon name='arrow-right' size='md' />
                    </button>
                </div>
                </form>
            </div>
        );
    }
}
