import React from 'react'
import moment from 'moment'
import momentLocalizer from 'react-widgets/lib/localizers/moment'
import DateTimePicker from 'react-widgets/lib/DateTimePicker'
import TinyMCE  from 'react-tinymce'
import Dropzone from 'react-dropzone'
import Progress from './status/Progress'
import FormStatus from './status/FormStatus'
import FieldError from './status/FieldError'
import UserSelector from '../containers/UserSelector'
import SkillSelector from '../containers/SkillSelector'
import { PROGRESS_REPORT_STATUS_CHOICES, PROGRESS_REPORT_STATUS_ON_SCHEDULE } from '../constants/Api'
import {TINY_MCE_CONFIG } from '../constants/settings'

momentLocalizer(moment);

export default class ProgressReportForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {status: null, accomplished: '', next_steps: '', remarks: '', attachments: []};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const progress_report = this.props.progress_report || {};
        if(progress_report.id) {
            const status = progress_report.status || null;
            const accomplished = progress_report.accomplished || '';
            const next_steps = progress_report.next_steps || '';
            const remarks = progress_report.remarks || '';
            this.setState({status, accomplished, next_steps, remarks});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.ProgressReport.detail.isSaved && !prevProps.ProgressReport.detail.isSaved) {
            if(!this.props.progress_report) {
                this.refs.progress_report_form.reset();
                this.setState({status: null, accomplished: '', next_steps: '', remarks: '', attachments: []});
            }
        }
    }

    onProgressStatusChange(status) {
        this.setState({status});
    }

    onAccomplishedChange(e) {
        this.setState({accomplished: e.target.getContent()});
    }

    onNextStepsChange(e) {
        this.setState({next_steps: e.target.getContent()});
    }

    onRemarksChange(e) {
        this.setState({remarks: e.target.getContent()});
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
        var remarks = this.state.remarks;
        const attachments = this.state.attachments;

        const { ProgressReportActions } = this.props;
        const progress_report = this.props.progress_report || {};
        const milestone = this.props.milestone || {};

        const progress_report_info = {event: milestone.id, status, percentage, accomplished, next_steps, remarks};
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
        const accomplished = this.props.progress_report?progress_report.accomplished:'';
        const next_steps = this.props.progress_report?progress_report.next_steps:'';
        const remarks = this.props.progress_report?progress_report.remarks:'';

        return (
            <div>
                <form onSubmit={this.handleSubmit} name="progress_report" role="form" ref="progress_report_form">
                    <h4>Progress Report</h4>
                    <FormStatus loading={ProgressReport.detail.isSaving}
                                success={ProgressReport.detail.isSaved}
                                message={'Progress Report saved successfully'}
                                error={ProgressReport.detail.error.create || ProgressReport.detail.error.update}/>

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

                    {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.accomplished)?
                        (<FieldError message={ProgressReport.detail.error.create.accomplished}/>):null}
                    {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.accomplished)?
                        (<FieldError message={ProgressReport.detail.error.update.accomplished}/>):null}
                    <div className="form-group">
                        <label className="control-label">What have you accomplished? *</label>
                        <TinyMCE
                            content={accomplished}
                            config={TINY_MCE_CONFIG}
                            onChange={this.onAccomplishedChange.bind(this)}/>
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
                        <label className="control-label">What are the next steps?</label>
                        <TinyMCE
                            content={next_steps}
                            config={TINY_MCE_CONFIG}
                            onChange={this.onNextStepsChange.bind(this)}/>
                    </div>

                    {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.remarks)?
                        (<FieldError message={ProgressReport.detail.error.create.remarks}/>):null}
                    {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.remarks)?
                        (<FieldError message={ProgressReport.detail.error.update.remarks}/>):null}
                    <div className="form-group">
                        <label className="control-label">Any other remarks</label>
                        <TinyMCE
                            content={remarks}
                            config={TINY_MCE_CONFIG}
                            onChange={this.onRemarksChange.bind(this)}/>
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
