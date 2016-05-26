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
        this.state = {deliver_at: null, pitch: ''};
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

    handleSubmit(e) {
        e.preventDefault();
        var pitch = this.state.pitch;
        var deliver_at = this.state.deliver_at;

        const { TaskActions, task } = this.props;

        TaskActions.createApplication({task: task.id, pitch, deliver_at});
        return;
    }

    render() {
        const { Task } = this.props;
        const task = this.props.task || {};
        console.log(Task.detail.applications.isSaved);
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

                    {(Task.detail.applications.error.create && Task.detail.applications.error.create.deliver_at)?
                        (<FieldError message={Task.detail.applications.error.create.deliver_at}/>):null}
                    <div className="form-group">
                        <label className="control-label">Delivery Date *</label>
                        <DateTimePicker ref="deliver_at" onChange={this.onDeliveryDateChange.bind(this)} defaultValue={task.deadline?(new Date(moment.utc(task.deadline).format())):null}/>
                    </div>

                    <button type="submit" className="btn btn-default pull-right" disabled={Task.detail.applications.isSaving}>Apply</button>
                    <div className="clearfix"></div>
                </form>
                    )}
            </div>

        );
    }
}
