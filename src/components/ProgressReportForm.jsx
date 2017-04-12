import React from 'react';
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import TinyMCE  from 'react-tinymce';
import Dropzone from 'react-dropzone';
import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';
import { PROGRESS_REPORT_STATUS_CHOICES } from '../constants/Api';
import {TINY_MCE_CONFIG } from '../constants/settings';

momentLocalizer(moment);

export default class ProgressReportForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {status: null, accomplished: '', next_steps: '', obstacles: '', remarks: '', attachments: []};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const progress_report = this.props.progress_report || {};
        if(progress_report.id) {
            const status = progress_report.status || null;
            const accomplished = progress_report.accomplished || '';
            const next_steps = progress_report.next_steps || '';
            const obstacles = progress_report.obstacles || '';
            const remarks = progress_report.remarks || '';
            this.setState({status, accomplished, next_steps, obstacles, remarks});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.ProgressReport.detail.isSaved && !prevProps.ProgressReport.detail.isSaved) {
            if(!this.props.progress_report) {
                this.refs.progress_report_form.reset();
                this.setState({status: null, accomplished: '', next_steps: '', obstacles: '', remarks: '', attachments: []});
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

    onAccomplishedChange(e) {
        this.setState({accomplished: e.target.getContent()});
    }

    onNextStepsChange(e) {
        this.setState({next_steps: e.target.getContent()});
    }

    onObstaclesChange(e) {
        this.setState({obstacles: e.target.getContent()});
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
        var obstacles = this.state.obstacles;
        var remarks = this.state.remarks;
        const attachments = this.state.attachments;

        const { ProgressReportActions } = this.props;
        const progress_report = this.props.progress_report || {};
        const milestone = this.props.milestone || {};

        const progress_report_info = {event: milestone.id, status, percentage, accomplished, next_steps, obstacles, remarks};
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
                        <label className="control-label">What have you accomplished since the last update? *</label>
                        <textarea placeholder="What have you accomplished since the last update?"
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

                    {(ProgressReport.detail.error.create && ProgressReport.detail.error.create.obstacles)?
                        (<FieldError message={ProgressReport.detail.error.create.obstacles}/>):null}
                    {(ProgressReport.detail.error.update && ProgressReport.detail.error.update.obstacles)?
                        (<FieldError message={ProgressReport.detail.error.update.obstacles}/>):null}
                    <div className="form-group">
                        <label className="control-label">What obstacles are impeding your progress?</label>
                        <textarea placeholder="What obstacles are impeding your progress?"
                                  className="form-control"
                                  ref="obstacles"
                                  onChange={this.onInputChange.bind(this, 'obstacles')}
                                  value={this.state.obstacles} required>{this.state.obstacles}</textarea>
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
                                  value={this.state.remarks} required>{this.state.remarks}</textarea>
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
