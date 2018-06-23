import PropTypes from 'prop-types';
import React from 'react';
import {FormGroup} from 'reactstrap';

import Input from '../core/InputGroup';
import FieldError from '../core/FieldError';
import Icon from '../core/Icon';
import Upload from '../core/Upload';


export default class StepThree extends React.Component {
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
            phone_number: '',
            vat_no: '',
            reg_no: '',
            image: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isSaved.profile) {
            this.props.history.push('/onboard/finish');
        }
    }

    onChangeField(key, e) {
        let newState = {};
        newState[key] = e.target.value;
        this.setState(newState);
    }

    onChangeFile(files) {
        this.setState({ image: files[0] });
    }

    handleSubmit(e) {
        e.preventDefault();
        const {user, ProfileActions} = this.props;
        
        const phone_number = this.state.phone_number;
        const vat_no = this.state.vat_no;
        const reg_no = this.state.reg_no;
        const image = this.state.image;
        
        ProfileActions.updateProfile(user.profile.id, {
            phone_number,
            vat_no,
            reg_no,
            image
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
                            <div>
                                <div className="col-sm-12">
                                    {errors.profile &&
                                        errors.profile.phone_number ? (
                                            <FieldError
                                                message={errors.profile.phone_number}
                                            />
                                        ) : null}
                                    <FormGroup>
                                        <label>Phone Number</label>
                                        <Input placeholder=' ' onChange={this.onChangeField.bind(this, 'phone_number')}/>
                                    </FormGroup>
                                </div>
                                <div className="col-sm-12">
                                {errors.profile &&
                                    errors.profile.vat_no ? (
                                        <FieldError
                                            message={errors.profile.vat_no}
                                        />
                                    ) : null}
                                    <FormGroup>
                                        <label>VAT No</label>
                                        <Input placeholder=' ' onChange={this.onChangeField.bind(this, 'vat_no')}/>
                                    </FormGroup>
                                </div>
                                <div className="col-sm-12">
                                {errors.profile &&
                                    errors.profile.reg_no ? (
                                        <FieldError
                                            message={errors.profile.reg_no}
                                        />
                                    ) : null}
                                    <FormGroup>
                                        <label>Company registration number</label>
                                        <Input placeholder=' ' onChange={this.onChangeField.bind(this, 'reg_no')}/>
                                    </FormGroup>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4">
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
                                    onChange={this.onChangeFile.bind(this)}
                                />
                            </FormGroup>
                        </div>
                    </div>
                    <button className="float-left onboard-action" onClick={() => this.props.history.push('/onboard/step-two')} >
                        <Icon name='arrow-left' size='md'/>
                    </button>
                    <button type="submit" className="btn float-right onboard-action">
                        <Icon name='check2' size='md' />
                    </button>
                </form>
            </div>
        );
    }
}
