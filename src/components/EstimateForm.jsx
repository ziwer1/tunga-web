import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import { Table } from 'react-bootstrap';

import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';
import ComponentWithModal from './ComponentWithModal';
import LargeModal from './LargeModal';
import ActivityForm from './ActivityForm';

import {DEVELOPER_FEE, STATUS_SUBMITTED} from '../constants/Api';

momentLocalizer(moment);

export default class EstimateForm extends ComponentWithModal {
    constructor(props) {
        super(props);
        this.state = {
            introduction: '', activities: [],
            modalActivity: null, modalContent: null, modalTitle: '', submitted: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const estimate = this.props.estimate || {};
        this.setState({...estimate});
    }

    componentDidUpdate(prevProps, prevState) {
        const { Estimate, task } = this.props;
        const estimate = this.props.estimate || {};

        if(this.props.Estimate.detail.isSaved && !prevProps.Estimate.detail.isSaved) {

            if(!this.props.estimate) {
                if(this.refs.estimate_form) {
                    this.refs.estimate_form.reset();
                }
                const { router } = this.context;
                router.replace(`/work/${estimate.task}/estimate/${Estimate.detail.estimate.id}`);
            }

            this.setState({...Estimate.detail.estimate, submitted: false});
        }

        if(this.props.Estimate.detail.estimate.id && !prevProps.Estimate.detail.estimate.id) {
            this.setState({...this.props.Estimate.detail.estimate});
        }

    }

    onInputChange(key, e) {
        var new_state = {};
        new_state[key] = e.target.value;
        this.setState(new_state);
    }

    onStateValueChange(key, value) {
        var new_state = {};
        new_state[key] = value;
        this.setState(new_state);
    }

    onComposeActivity(activity) {
        this.setState({modalActivity: activity, modalContent: 'activity', modalTitle: 'Add activity'});
        this.open();
    }

    onAddActivity(activity){
        var new_activities = this.state.activities;
        if(activity.idx > -1) {
            new_activities[activity.idx] = activity;
        } else {
            new_activities = [...new_activities, activity];
        }
        this.setState({activities: new_activities});
    }

    getTotalHours() {
        if(!this.state.activities || !this.state.activities.length) {
            return 0;
        }
        return this.state.activities.map(function (activity) {
            return activity.hours;
        }).reduce((a,b) => {
            return parseInt(a)+parseInt(b);
        });
    }

    onDelete(idx) {
        if(idx > -1) {
            let activities = Array.from(new Set([...this.state.activities.slice(0, idx), ...this.state.activities.slice(idx+1)]));
            this.setState({activities});
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        var introduction = this.state.introduction;
        var activities = this.state.activities;

        const { EstimateActions } = this.props;
        const estimate = this.props.estimate || {};
        const task = this.props.task || {};

        let estimate_info = {task: estimate.task, introduction, activities};

        if(!estimate.id) {
            estimate_info.task = task.id;
        }

        if(this.state.submitted) {
            estimate_info.status = STATUS_SUBMITTED;
        }

        if(estimate.id) {
            EstimateActions.updateEstimate(estimate.id, estimate_info);
        } else {
            EstimateActions.createEstimate(estimate_info);
        }
        return;
    }

    renderModalContent() {
        return (
            <div>
                <LargeModal title={this.state.modalTitle} show={this.state.showModal} onHide={this.close.bind(this)}>
                    {this.state.modalContent == 'activity'?(
                        <ActivityForm
                            activity={this.state.modalActivity}
                            onSave={this.onAddActivity.bind(this)}
                            close={this.close.bind(this)}/>
                    ):null}
                </LargeModal>
            </div>
        );
    }

    render() {
        const { Estimate } = this.props;
        const task = this.props.task || {};
        const estimate = this.props.estimate || {};

        return (
            <div className="form-wrapper">
                {this.renderModalContent()}
                <form onSubmit={this.handleSubmit} name="estimate-form" role="form" ref="estimate_form">
                    <FormStatus loading={Estimate.detail.isSaving}
                                success={Estimate.detail.isSaved}
                                message={'Estimate saved successfully'}
                                error={Estimate.detail.error.create}/>

                    {(Estimate.detail.error.create && Estimate.detail.error.create.message)?
                        (<FieldError message={Estimate.detail.error.create.message}/>):null}
                    {(Estimate.detail.error.update && Estimate.detail.error.update.message)?
                        (<FieldError message={Estimate.detail.error.update.message}/>):null}

                    {(Estimate.detail.error.create && Estimate.detail.error.create.introduction)?
                        (<FieldError message={Estimate.detail.error.create.introduction}/>):null}
                    {(Estimate.detail.error.update && Estimate.detail.error.update.introduction)?
                        (<FieldError message={Estimate.detail.error.update.introduction}/>):null}
                    <div className="form-group">
                        <label className="control-label">Introduction *</label>
                        <textarea className="form-control"
                                  onChange={this.onInputChange.bind(this, 'introduction')}
                                  value={this.state.introduction}
                                  ref="introduction"
                                  placeholder="Introduction"/>
                    </div>

                    {(Estimate.detail.error.create && Estimate.detail.error.create.activities)?
                        (<FieldError message={Estimate.detail.error.create.activities}/>):null}
                    {(Estimate.detail.error.update && Estimate.detail.error.update.activities)?
                        (<FieldError message={Estimate.detail.error.update.activities}/>):null}
                    <div className="form-group">
                        <label className="control-label">Activities *</label>

                        <button type="button" className="btn" onClick={this.onComposeActivity.bind(this, null)}>Add</button>

                        {this.state.activities && this.state.activities.length?(
                            <Table>
                                <thead>
                                <tr>
                                    <th>Activity</th>
                                    <th>Hours</th>
                                    <th>Fee</th>
                                    <th>Description</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>

                                {this.state.activities.map((activity, idx) => {
                                    return (
                                        <tr>
                                            <td>
                                                <a href="#" onClick={this.onComposeActivity.bind(this, {...activity, idx})}>{_.truncate(activity.title, {length: 25})}</a>
                                            </td>
                                            <td>{activity.hours} hrs</td>
                                            <td>€{DEVELOPER_FEE*activity.hours}</td>
                                            <td>{activity.description}</td>
                                            <td><button className="btn" onClick={this.onDelete.bind(this, idx)}>Delete</button></td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                                <tfoot>
                                <tr>
                                    <th>Totals</th>
                                    <th>{this.getTotalHours()} hrs</th>
                                    <th>€{19.5*this.getTotalHours()}</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                </tfoot>
                            </Table>
                        ):null}

                    </div>

                    <div className="text-center clearfix">
                        <button type="submit"
                                className="btn"
                                disabled={Estimate.detail.isSaving}>
                            Save</button>
                        <button type="submit" value={STATUS_SUBMITTED} className="btn" onClick={(e) => {this.setState({submitted: true}); return true;}} disabled={Estimate.detail.isSaving}>Submit for Review</button>
                    </div>
                </form>
            </div>

        );
    }
}

EstimateForm.propTypes = {
    estimate: React.PropTypes.object,
    task: React.PropTypes.object
};

EstimateForm.defaultProps = {
    estimate: {},
    task: null
};

EstimateForm.contextTypes = {
    router: React.PropTypes.object.isRequired
};
