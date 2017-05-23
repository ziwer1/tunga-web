import React from 'react';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import Dropzone from 'react-dropzone';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';

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
                            message={'Progress Report saved successfully'}
                            error={ProgressReport.detail.error.create || ProgressReport.detail.error.update}/>
            );
        }

        return (
            <div>
                <form onSubmit={this.handleSubmit} name="progress_report" role="form" ref="progress_report_form">
                    <h4>Progress Report</h4>
                    <FormStatus loading={ProgressReport.detail.isSaving}
                                success={ProgressReport.detail.isSaved}
                                message={'Progress Report saved successfully'}
                                error={ProgressReport.detail.error.create || ProgressReport.detail.error.update}/>

                    {isDeveloper()?(
                        {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.status)?
                            (<FieldError message={ProgressReport.detail.error.create.status}/>):null}
                        {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.status)?
                            (<FieldError message={ProgressReport.detail.error.update.status}/>):null}
                        <div className="form-group">
                            <label className="control-label">Task status *</label>
                            <div>
                                <div className="btn-group btn-choices select" role="group" aria-label="task ststus">
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

                        <div>
                            <div className="form-group">
                                <label className="control-label">When did you start this sprint/task/project?</label>
                                <DateTimePicker ref="due_at"
                                                onChange={this.onTaskStartChange.bind(this)}
                                                time={false}/>
                            </div>
                        </div>

                        <div>
                            <div className="form-group">
                                <label className="control-label">When is the next deadline? *</label>
                                <DateTimePicker ref="due_at"
                                                onChange={this.onNextDeadlineChange.bind(this)}
                                                defaultValue={this.state.next_deadline?(new Date(moment.utc(this.state.next_deadline).format())):null}
                                                time={false}/>
                            </div>
                        </div>

                        <div>
                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.next_deadline_met)?
                                (<FieldError message={ProgressReport.detail.error.create.next_deadline_met}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.next_deadline_met)?
                                (<FieldError message={ProgressReport.detail.error.update.next_deadline_met}/>):null}
                            <div className="form-group">
                                <label className="control-label">Do you anticipate to meet this deadline? *</label>
                                <div>
                                    <div className="btn-group btn-choices select" role="group" aria-label="task ststus">
                                        {[
                                            {id: true, name: 'Yes'},
                                            {id: false, name: 'No'}
                                        ].map(status => {
                                            return (
                                                <button key={status.id} type="button"
                                                        className={"btn " + (typeof this.state.next_deadline_met == 'boolean' && this.state.next_deadline_met == status.id?' active':'')}
                                                        onClick={this.onNextDeadlineStatusChange.bind(this, status.id)}>{status.name}
                                                </button>
                                            )
                                        })}
                                    </div>
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

                        {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.today_to_dos)?
                            (<FieldError message={ProgressReport.detail.error.create.today_to_dos}/>):null}
                        {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.today_to_dos)?
                            (<FieldError message={ProgressReport.detail.error.update.today_to_dos}/>):null}
                        <div className="form-group">
                            <label className="control-label">What are the next steps? *</label>
                            <textarea placeholder="What are the next steps?"
                                      className="form-control"
                                      ref="today_to_dos"
                                      onChange={this.onInputChange.bind(this, 'today_to_dos')}
                                      value={this.state.today_to_dos} required>{this.state.today_to_dos}</textarea>
                        </div>

                        {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.deadline_date_rate)?
                            (<FieldError message={ProgressReport.detail.error.create.deadline_date_rate}/>):null}
                        {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.deadline_date_rate)?
                            (<FieldError message={ProgressReport.detail.error.update.deadline_date_rate}/>):null}
                        <div className="form-group">
                            <label className="control-label">How do you rate your deliverable for today’s deadline? *</label>
                            <div>
                                <input type="number" className="form-control" ref="deadline_date_rate" required placeholder="Deadline Date Deliverable Rate" defaultValue={progress_report.deadline_date_rate}/>
                            </div>
                        </div>

                    ):null}

                    {isProjectOwner()?(
                        <div>
                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.this_week_deadline_met)?
                                (<FieldError message={ProgressReport.detail.error.create.this_week_deadline_met}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.this_week_deadline_met)?
                                (<FieldError message={ProgressReport.detail.error.update.this_week_deadline_met}/>):null}
                            <div className="form-group">
                                <label className="control-label">Was the deadline for this week met? *</label>
                                <div>
                                    <div className="btn-group btn-choices select" role="group" aria-label="task ststus">
                                        {[
                                            {id: true, name: 'Yes'},
                                            {id: false, name: 'No'}
                                        ].map(status => {
                                            return (
                                                <button key={status.id} type="button"
                                                        className={"btn " + (typeof this.state.this_week_deadline_met == 'boolean' && this.state.this_week_deadline_met == status.id?' active':'')}
                                                        onClick={this.onThisWeekDeadlineMetStatusChange.bind(this, status.id)}>{status.name}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.pm_deadline_informed)?
                                (<FieldError message={ProgressReport.detail.error.create.pm_deadline_informed}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.pm_deadline_informed)?
                                (<FieldError message={ProgressReport.detail.error.update.pm_deadline_informed}/>):null}
                            <div className="form-group">
                                <label className="control-label">Did the project manager/developer(s) inform you promptly about not making the deadline?  *</label>
                                <div>
                                    <div className="btn-group btn-choices select" role="group" aria-label="task ststus">
                                        {[
                                            {id: true, name: 'Yes'},
                                            {id: false, name: 'No'}
                                        ].map(status => {
                                            return (
                                                <button key={status.id} type="button"
                                                        className={"btn " + (typeof this.state.pm_deadline_informed == 'boolean' && this.state.pm_deadline_informed == status.id?' active':'')}
                                                        onClick={this.onPmDeadlineInformedStatusChange.bind(this, status.id)}>{status.name}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.deliverable_satisfaction)?
                                (<FieldError message={ProgressReport.detail.error.create.deliverable_satisfaction}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.deliverable_satisfaction)?
                                (<FieldError message={ProgressReport.detail.error.update.deliverable_satisfaction}/>):null}
                            <div className="form-group">
                                <label className="control-label">Are you satisfied with the deliverables?  *</label>
                                <div>
                                    <div className="btn-group btn-choices select" role="group" aria-label="task ststus">
                                        {[
                                            {id: true, name: 'Yes'},
                                            {id: false, name: 'No'}
                                        ].map(status => {
                                            return (
                                                <button key={status.id} type="button"
                                                        className={"btn " + (typeof this.state.deliverable_satisfaction == 'boolean' && this.state.deliverable_satisfaction == status.id?' active':'')}
                                                        onClick={this.onDeliverableSatisfactionStatusChange.bind(this, status.id)}>{status.name}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.developer_deliverables_rate)?
                            (<FieldError message={ProgressReport.detail.error.create.developer_deliverables_rate}/>):null}
                        {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.developer_deliverables_rate)?
                            (<FieldError message={ProgressReport.detail.error.update.developer_deliverables_rate}/>):null}
                        <div className="form-group">
                            <label className="control-label">How would you rate the deliverables on a scale from 1 to 10? *</label>
                            <div>
                                <input type="number" className="form-control" ref="developer_deliverables_rate" required placeholder="Deadline Date Deliverable Rate" defaultValue={progress_report.developer_deliverables_rate}/>
                            </div>
                        </div>

                        <div>
                            {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.pm_communication)?
                                (<FieldError message={ProgressReport.detail.error.create.pm_communication}/>):null}
                            {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.pm_communication)?
                                (<FieldError message={ProgressReport.detail.error.update.pm_communication}/>):null}
                            <div className="form-group">
                                <label className="control-label">Is the communication between you and the project manager/clients going well?   *</label>
                                <div>
                                    <div className="btn-group btn-choices select" role="group" aria-label="task ststus">
                                        {[
                                            {id: true, name: 'Yes'},
                                            {id: false, name: 'No'}
                                        ].map(status => {
                                            return (
                                                <button key={status.id} type="button"
                                                        className={"btn " + (typeof this.state.pm_communication == 'boolean' && this.state.pm_communication == status.id?' active':'')}
                                                        onClick={this.onDeliverableSatisfactionStatusChange.bind(this, status.id)}>{status.name}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

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


                    ):null}

                    

                    <div className="text-center">
                        <button type="submit" className="btn  " disabled={ProgressReport.detail.isSaving}>{progress_report.id?'Update Report':'Save Report'}</button>
                    </div>
                    <div className="clearfix"></div>
                </form>
            </div>

        );
    }
}
