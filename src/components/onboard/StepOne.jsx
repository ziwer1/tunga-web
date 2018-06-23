import PropTypes from 'prop-types';
import React from 'react';
import {FormGroup} from 'reactstrap';

import Input from '../core/InputGroup';
import FieldError from '../core/FieldError';
import Icon from '../core/Icon';


export default class StepOne extends React.Component {
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
            first_name: '',
            last_name: '',
            company: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isSaved.profile) {
            this.props.history.push('/onboard/step-two');
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
        
        const first_name = this.state.first_name;
        const last_name = this.state.last_name;
        const company = this.state.company;
        
        ProfileActions.updateProfile(user.profile.id, {
            first_name,
            last_name
        });
        
        const id = user.company ? user.company.id : null
        ProfileActions.updateCompany(id, {
            name: company
        });
        return;
    }

    render() {
        const {errors} = this.props;
        return (
            <div>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <div className="col-sm-8">
                    {errors.profile &&
                        errors.profile.first_name ? (
                            <FieldError
                                message={errors.profile.first_name}
                            />
                        ) : null}
                        <FormGroup>
                            <label>First Name*</label>
                            <Input placeholder=' ' onChange={this.onChangeField.bind(this, 'first_name')} />
                        </FormGroup>
                    </div>
                    <div className="col-sm-8">
                    {errors.profile &&
                        errors.profile.last_name ? (
                            <FieldError
                                message={errors.profile.last_name}
                            />
                        ) : null}
                        <FormGroup>
                            <label>Last Name*</label>
                            <Input placeholder=' ' onChange={this.onChangeField.bind(this, 'last_name')} />
                        </FormGroup>
                    </div>
                    <div className="col-sm-8">
                    {errors.company &&
                        errors.company.name ? (
                            <FieldError
                                message={errors.company.name}
                            />
                        ) : null}
                        <FormGroup>
                            <label>Your company name</label>
                            <Input placeholder=' ' onChange={this.onChangeField.bind(this, 'company')} />
                        </FormGroup>
                    </div>
                    <button disabled={this.props.isSaving.profile} className="float-right onboard-action">
                        <Icon name='arrow-right' size='md' />
                    </button>
                </form>
            </div>
        );
    }
}
