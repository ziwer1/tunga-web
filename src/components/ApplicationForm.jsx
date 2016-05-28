import React from 'react'
import moment from 'moment'
import momentLocalizer from 'react-widgets/lib/localizers/moment'
import DateTimePicker from 'react-widgets/lib/DateTimePicker'
import TinyMCE  from 'react-tinymce'
import Progress from './status/Progress'
import FormStatus from './status/FormStatus'
import FieldError from './status/FieldError'
import Success from './status/Success'
import {TINY_MCE_CONFIG } from '../constants/settings'

momentLocalizer(moment);

export default class ApplicationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {deliver_at: null, pitch: '', agree_schedule: false, agree_deadline: false};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const task = this.props.task || {};
        var deliver_at = task.deadline?(new Date(moment.utc(task.deadline).format())):null;
        this.setState({deliver_at: deliver_at});
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.Task.detail.applications.isSaved && !prevProps.Task.detail.applications.isSaved) {
            if(this.refs.application_form) {
                this.refs.application_form.reset();
            }
            const task = this.props.task || {};
            var deliver_at = task.deadline?(new Date(moment.utc(task.deadline).format())):null;
            this.setState({deliver_at: deliver_at, pitch: ''});
        }
    }

    onDeliveryDateChange(date) {
        this.setState({deliver_at: moment(date).utc().format()});
    }

    onPitchChange(e) {
        this.setState({pitch: e.target.getContent()});
    }

    onAgreeScheduleChange(e) {
        this.setState({agree_schedule: !this.state.agree_schedule});
    }

    onAgreeDeadlineChange(e) {
        this.setState({agree_deadline: !this.state.agree_deadline});
    }

    handleSubmit(e) {
        e.preventDefault();
        var pitch = this.state.pitch;
        var hours_needed = this.refs.hours_needed.value.trim() || null;
        var hours_available = this.refs.hours_available.value.trim() || null;
        var deliver_at = this.state.deliver_at;

        const task = this.props.task || {};
        var errors = null;
        if(!this.state.agree_schedule && task.update_interval && task.update_interval_units) {
            errors = {...errors, agree_schedule: "You must agree to the update schedule to apply for this task"};
        }

        if(!this.state.agree_deadline && task.deadline) {
            errors = {...errors, agree_deadline: "You must agree to the milestone deadlines to apply for this task"};
        }

        const { TaskActions } = this.props;

        TaskActions.createApplication({task: task.id, pitch, hours_needed, hours_available, deliver_at}, errors);
        return;
    }

    render() {
        const { Task } = this.props;
        const task = this.props.task || {};
        return (
            <div>
                {Task.detail.applications.isSaved?(
                <Success message="Application sent successfully"/>
                    ):(
                <form onSubmit={this.handleSubmit} name="application_form" role="form" ref="application_form">
                    <FormStatus loading={Task.detail.applications.isSaving}
                                success={Task.detail.applications.isSaved}
                                message={'Application sent successfully'}
                                error={Task.detail.applications.error.create}/>

                    {(Task.detail.applications.error.create && Task.detail.applications.error.create.pitch)?
                        (<FieldError message={Task.detail.applications.error.create.pitch}/>):null}
                    <div className="form-group">
                        <label className="control-label">What makes you qualified for this task *</label>
                        <TinyMCE
                            config={TINY_MCE_CONFIG}
                            onChange={this.onPitchChange.bind(this)}/>
                    </div>

                    {(Task.detail.error.create && Task.detail.error.create.hours_needed)?
                        (<FieldError message={Task.detail.error.create.hours_needed}/>):null}
                    {(Task.detail.error.update && Task.detail.error.update.hours_needed)?
                        (<FieldError message={Task.detail.error.update.hours_needed}/>):null}
                    <div className="form-group">
                        <label className="control-label">Hours needed to complete task *</label>
                        <div><input type="text" className="form-control" ref="hours_needed" required placeholder="Hours needed to complete task"/></div>
                    </div>

                    {(Task.detail.error.create && Task.detail.error.create.hours_available)?
                        (<FieldError message={Task.detail.error.create.hours_available}/>):null}
                    {(Task.detail.error.update && Task.detail.error.update.hours_available)?
                        (<FieldError message={Task.detail.error.update.hours_available}/>):null}
                    <div className="form-group">
                        <label className="control-label">Hours available to work on task *</label>
                        <div><input type="text" className="form-control" ref="hours_available" required placeholder="Hours available to work on task"/></div>
                    </div>

                    {(Task.detail.applications.error.create && Task.detail.applications.error.create.deliver_at)?
                        (<FieldError message={Task.detail.applications.error.create.deliver_at}/>):null}
                    <div className="form-group">
                        <label className="control-label">Delivery Date *</label>
                        <DateTimePicker ref="deliver_at" onChange={this.onDeliveryDateChange.bind(this)} defaultValue={task.deadline?(new Date(moment.utc(task.deadline).format())):null}/>
                    </div>

                    {(Task.detail.applications.error.create && Task.detail.applications.error.create.agree_schedule)?
                        (<FieldError message={Task.detail.applications.error.create.agree_schedule}/>):null}
                    {task.update_interval && task.update_interval_units?(
                    <div className="form-group">
                        <div>Update schedule: {task.update_schedule_display}</div>
                        <div className="checkbox">
                            <label className="control-label">
                                <input type="checkbox" ref="agree_schedule"
                                       checked={this.state.agree_schedule}
                                       onChange={this.onAgreeScheduleChange.bind(this)}/>
                                I agree to the update schedule for this task
                            </label>
                        </div>
                    </div>
                        ):null}

                    {(Task.detail.applications.error.create && Task.detail.applications.error.create.agree_deadline)?
                        (<FieldError message={Task.detail.applications.error.create.agree_deadline}/>):null}
                    {task.deadline?(
                    <div className="form-group">
                        <div>Deadline: {moment.utc(task.deadline).local().format('Do, MMMM YYYY')}</div>
                        <div className="checkbox">
                            <label className="control-label">
                                <input type="checkbox" ref="agree_deadline"
                                       checked={this.state.agree_deadline}
                                       onChange={this.onAgreeDeadlineChange.bind(this)}/>
                                I agree to the milestone deadlines for this task.
                            </label>
                        </div>
                    </div>
                        ):null}

                    <button type="submit" className="btn btn-default pull-right" disabled={Task.detail.applications.isSaving}>Apply</button>
                    <div className="clearfix"></div>
                </form>
                    )}
            </div>

        );
    }
}
