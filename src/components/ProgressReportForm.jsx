import React from 'react';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import Dropzone from 'react-dropzone';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import _ from 'lodash';

import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';
import { PROGRESS_REPORT_STATUS_CHOICES } from '../constants/Api';
import { isDeveloper, getUser, isProjectManager, isProjectOwner } from '../utils/auth';

momentLocalizer(moment);

export default class ProgressReportForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: null, accomplished: '', next_steps: '', obstacles: '', remarks: '',
            last_deadline_met: null, deadline_report: '', next_deadline: null, team_appraisal: '',
            attachments: []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const progress_report = this.props.progress_report || {};
        if(progress_report.id) {
            this.setState({...progress_report});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.ProgressReport.detail.isSaved && !prevProps.ProgressReport.detail.isSaved) {
            if(!this.props.progress_report) {
                if(this.refs.progress_report_form) {
                    this.refs.progress_report_form.reset();
                }
                this.setState({
                    status: null, accomplished: '', next_steps: '', obstacles: '', remarks: '',
                    last_deadline_met: null, deadline_report: '', next_deadline: null, team_appraisal: '',
                    attachments: []
                });
            }
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

    onProgressStatusChange(status) {
        this.setState({status});
    }

    onLastDeadlineStatusChange(last_deadline_met) {
        this.setState({last_deadline_met});
    }

    onNextDeadlineChange(date) {
        this.setState({next_deadline: moment(date).utc().format()});
    }

    onDrop(attachments) {
        var current = this.state.attachments;
        this.setState({attachments: current.concat(attachments)});
    }

    onAddAttachment() {
        this.refs.dropzone.open();
    }

    getRatingsMap() {
        return _.range(0,11).map(x => { return {id: x, name: x}});
    }

    handleSubmit(e) {
        e.preventDefault();
        var status = this.state.status;
        var percentage = this.refs.percentage.value.trim();
        var accomplished = this.state.accomplished;
        var next_steps = this.state.next_steps;
        var obstacles = this.state.obstacles;
        var remarks = this.state.remarks;
        const attachments = this.state.attachments;
        var last_deadline_met = this.state.last_deadline_met;
        var deadline_report = this.state.deadline_report;
        var next_deadline = this.state.next_deadline;
        var team_appraisal = this.state.team_appraisal;

        const { ProgressReportActions } = this.props;
        const progress_report = this.props.progress_report || {};
        const milestone = this.props.milestone || {};

        const progress_report_info = {
            event: milestone.id, status, percentage, accomplished, next_steps, obstacles, remarks,
            last_deadline_met, deadline_report, next_deadline, team_appraisal
        };
        if(progress_report.id) {
            ProgressReportActions.updateProgressReport(progress_report.id, progress_report_info);
        } else {
            ProgressReportActions.createProgressReport(progress_report_info, attachments);
        }
        return;
    }

    render() {
        const { ProgressReport } = this.props;
        const progress_report = this.props.progress_report || {};

        if(ProgressReport.detail.isSaved) {
            return (
                <FormStatus loading={ProgressReport.detail.isSaving}
                            success={ProgressReport.detail.isSaved}
                            message={`${isProjectOwner()?'Weekly Survey':'Progress Report'} saved successfully`}
                            error={ProgressReport.detail.error.create || ProgressReport.detail.error.update}/>
            );
        }

        return (
            <div>
                <form onSubmit={this.handleSubmit} name="progress_report" role="form" ref="progress_report_form">
                    <h4>{isProjectOwner()?'Weekly Survey':'Progress Report'}</h4>
                    <FormStatus loading={ProgressReport.detail.isSaving}
                                success={ProgressReport.detail.isSaved}
                                message={`${isProjectOwner()?'Weekly Survey':'Progress Report'} saved successfully`}
                                error={ProgressReport.detail.error.create || ProgressReport.detail.error.update}/>

                    {isDeveloper() || isProjectManager()?(
                        <div>
                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.status)?
                                (<FieldError message={ProgressReport.detail.error.create.status}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.status)?
                                (<FieldError message={ProgressReport.detail.error.update.status}/>):null}
                            <div className="form-group">
                                <label className="control-label">Task status *</label>
                                <div>
                                    <div className="btn-group btn-choices select" role="group">
                                        {PROGRESS_REPORT_STATUS_CHOICES.map(status => {
                                            return (
                                                <button key={status.id} type="button"
                                                        className={"btn " + (this.state.status == status.id?' active':'')}
                                                        onClick={this.onProgressStatusChange.bind(this, status.id)}>{status.name}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.percentage)?
                                (<FieldError message={ProgressReport.detail.error.create.percentage}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.percentage)?
                                (<FieldError message={ProgressReport.detail.error.update.percentage}/>):null}
                            <div className="form-group">
                                <label className="control-label">Percentage completed *</label>
                                <div>
                                    <input type="number" className="form-control" ref="percentage" required placeholder="Percentage completed" defaultValue={progress_report.percentage}/>
                                </div>
                            </div>
                        </div>
                    ):null}

                    {isProjectManager() || isProjectOwner()?(
                        <div>
                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.last_deadline_met)?
                                (<FieldError message={ProgressReport.detail.error.create.last_deadline_met}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.last_deadline_met)?
                                (<FieldError message={ProgressReport.detail.error.update.last_deadline_met}/>):null}
                            <div className="form-group">
                                <label className="control-label">Was the last deadline met? *</label>
                                <div>
                                    <div className="btn-group btn-choices select" role="group">
                                        {[
                                            {id: true, name: 'Yes'},
                                            {id: false, name: 'No'}
                                        ].map(status => {
                                            return (
                                                <button key={status.id} type="button"
                                                        className={"btn " + (typeof this.state.last_deadline_met == 'boolean' && this.state.last_deadline_met == status.id?' active':'')}
                                                        onClick={this.onLastDeadlineStatusChange.bind(this, status.id)}>{status.name}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            {isProjectManager() && typeof this.state.last_deadline_met == 'boolean' && !this.state.last_deadline_met?(
                                <div>
                                    {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.deadline_report)?
                                        (<FieldError message={ProgressReport.detail.error.create.deadline_report}/>):null}
                                    {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.deadline_report)?
                                        (<FieldError message={ProgressReport.detail.error.update.deadline_report}/>):null}
                                    <div className="form-group">
                                        <label className="control-label">Why wasn't the last deadline met? Please provide a detailed explanation. *</label>
                                    <textarea placeholder="Why wasn't the last deadline met? Please provide a detailed explanation."
                                              className="form-control"
                                              ref="deadline_report"
                                              onChange={this.onInputChange.bind(this, 'deadline_report')}
                                              value={this.state.deadline_report} required>{this.state.deadline_report}</textarea>
                                    </div>
                                </div>
                            ):null}
                        </div>
                    ):null}

                    {isProjectOwner()?(
                        <div>
                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.rate_deliverables)?
                                (<FieldError message={ProgressReport.detail.error.create.rate_deliverables}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.rate_deliverables)?
                                (<FieldError message={ProgressReport.detail.error.update.rate_deliverables}/>):null}
                            <div className="form-group">
                                <label className="control-label">Are you satisfied with the deliverables? *</label>
                                <div>
                                    <div className="btn-group btn-choices select" role="group">
                                        {this.getRatingsMap().map(status => {
                                            return (
                                                <button key={status.id} type="button"
                                                        className={"btn " + (typeof this.state.rate_deliverables == 'boolean' && this.state.rate_deliverables == status.id?' active':'')}
                                                        onClick={this.onStateValueChange.bind(this, 'rate_deliverables', status.id)}>{status.name}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.rate_communication)?
                                (<FieldError message={ProgressReport.detail.error.create.rate_communication}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.rate_communication)?
                                (<FieldError message={ProgressReport.detail.error.update.rate_communication}/>):null}
                            <div className="form-group">
                                <label className="control-label">Is communication going well between you, the PM and Developers? *</label>
                                <div>
                                    <div className="btn-group btn-choices select" role="group">
                                        {this.getRatingsMap().map(status => {
                                            return (
                                                <button key={status.id} type="button"
                                                        className={"btn " + (typeof this.state.rate_communication == 'boolean' && this.state.last_deadline_met == status.id?' active':'')}
                                                        onClick={this.onStateValueChange.bind(this, 'rate_communication', status.id)}>{status.name}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ):null}

                    {isDeveloper() || isProjectManager()?(
                        <div>
                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.accomplished)?
                                (<FieldError message={ProgressReport.detail.error.create.accomplished}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.accomplished)?
                                (<FieldError message={ProgressReport.detail.error.update.accomplished}/>):null}
                            <div className="form-group">
                                <label className="control-label">What has been accomplished since the last update? *</label>
                        <textarea placeholder="What has been accomplished since the last update?"
                                  className="form-control"
                                  ref="accomplished"
                                  onChange={this.onInputChange.bind(this, 'accomplished')}
                                  value={this.state.accomplished} required>{this.state.accomplished}</textarea>
                            </div>

                            <div className="form-group">
                                <label className="control-label">Files</label>
                                <div>
                                    <Dropzone ref="dropzone" onDrop={this.onDrop.bind(this)} style={{display: 'none'}}>
                                        <div>Try dropping some files here, or click to select files to upload.</div>
                                    </Dropzone>
                                    {this.state.attachments?(
                                        <div>
                                            {this.state.attachments.map((file) => {
                                                return (<div><i className="fa fa-file-text-o"/> {file.name}</div>)
                                            })}
                                        </div>
                                    ):null}
                                    <button type="button" className="btn " style={{marginRight: '5px'}}
                                            onClick={this.onAddAttachment.bind(this)}>
                                        <i className="fa fa-upload"/> Upload files
                                    </button>
                                </div>
                            </div>

                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.next_steps)?
                                (<FieldError message={ProgressReport.detail.error.create.next_steps}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.next_steps)?
                                (<FieldError message={ProgressReport.detail.error.update.next_steps}/>):null}
                            <div className="form-group">
                                <label className="control-label">What are the next steps? *</label>
                        <textarea placeholder="What are the next steps?"
                                  className="form-control"
                                  ref="next_steps"
                                  onChange={this.onInputChange.bind(this, 'next_steps')}
                                  value={this.state.next_steps} required>{this.state.next_steps}</textarea>
                            </div>

                            {isProjectManager()?(
                                <div>
                                    <div className="form-group">
                                        <label className="control-label">When is the next deadline? *</label>
                                        <DateTimePicker ref="due_at"
                                                        onChange={this.onNextDeadlineChange.bind(this)}
                                                        defaultValue={this.state.next_deadline?(new Date(moment.utc(this.state.next_deadline).format())):null}
                                                        time={false}/>
                                    </div>

                                    {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.team_appraisal)?
                                        (<FieldError message={ProgressReport.detail.error.create.team_appraisal}/>):null}
                                    {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.team_appraisal)?
                                        (<FieldError message={ProgressReport.detail.error.update.team_appraisal}/>):null}
                                    <div className="form-group">
                                        <label className="control-label">Are you satisfied with the performance of the developers on this project, please give details? *</label>
                            <textarea placeholder="Are you satisfied with the performance of the developers on this project, please give details?"
                                      className="form-control"
                                      ref="team_appraisal"
                                      onChange={this.onInputChange.bind(this, 'team_appraisal')}
                                      value={this.state.team_appraisal} required>{this.state.team_appraisal}</textarea>
                                    </div>
                                </div>
                            ):null}

                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.obstacles)?
                                (<FieldError message={ProgressReport.detail.error.create.obstacles}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.obstacles)?
                                (<FieldError message={ProgressReport.detail.error.update.obstacles}/>):null}
                            <div className="form-group">
                                <label className="control-label">What obstacles are impeding your progress? *</label>
                        <textarea placeholder="What obstacles are impeding your progress?"
                                  className="form-control"
                                  ref="obstacles"
                                  onChange={this.onInputChange.bind(this, 'obstacles')}
                                  value={this.state.obstacles} required>{this.state.obstacles}</textarea>
                            </div>
                        </div>
                    ):null}

                    {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.remarks)?
                        (<FieldError message={ProgressReport.detail.error.create.remarks}/>):null}
                    {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.remarks)?
                        (<FieldError message={ProgressReport.detail.error.update.remarks}/>):null}
                    <div className="form-group">
                        <label className="control-label">Any other remarks or questions</label>
                        <textarea placeholder="Any other remarks or questions"
                                  className="form-control"
                                  ref="remarks"
                                  onChange={this.onInputChange.bind(this, 'remarks')}
                                  value={this.state.remarks}>{this.state.remarks}</textarea>
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn  " disabled={ProgressReport.detail.isSaving}>{progress_report.id?'Update Report':'Save Report'}</button>
                    </div>
                    <div className="clearfix"></div>
                </form>
            </div>

        );
    }
}
