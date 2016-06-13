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
import { USER_TYPE_DEVELOPER, TASK_VISIBILITY_CHOICES, VISIBILITY_DEVELOPERS, VISIBILITY_CUSTOM, UPDATE_SCHEDULE_CHOICES } from '../constants/Api'
import {TINY_MCE_CONFIG } from '../constants/settings'

momentLocalizer(moment);

export default class TaskForm extends React.Component {
    constructor(props) {
        super(props);
        var schedule_options = [];
        var schedule_map = {};
        UPDATE_SCHEDULE_CHOICES.forEach((schedule) => {
            schedule_options.push({id: `${schedule.number}_${schedule.unit}`, name: schedule.name});
            schedule_map[`${schedule.number}_${schedule.unit}`] = {update_interval: schedule.number, update_interval_units: schedule.unit};
        })
        this.state = {
            deadline: null, skills: [], description: '', visibility: VISIBILITY_DEVELOPERS,
            assignee: null, participants: [], schedule_options, schedule_map,
            step: 1, schedule: null, attachments: []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const task = this.props.task || {};
        if(task.id) {
            const assignee = task.assignee?task.assignee.user:null;
            const description = task.description || '';
            var participants = [];
            if(task.details) {
                task.details.participation.forEach((participant) => {
                    if(participant.user.id != assignee) {
                        participants.push(participant.user.id);
                    }
                });
            }
            this.setState({visibility: task.visibility, assignee, participants, description, schedule: this.getScheduleId()});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.Task.detail.isSaved && !prevProps.Task.detail.isSaved) {
            const { Task } = this.props;
            if(!this.props.task) {
                this.refs.task_form.reset();
                this.setState({
                    deadline: null, skills: [], description: '', visibility: VISIBILITY_DEVELOPERS,
                    assignee: null, participants: [], schedule: null, attachments: []
                });
                if(this.props.history) {
                    this.props.history.replaceState(null, '/task/'+ Task.detail.task.id);
                }
            }
        }
    }

    changeStep(direction=true) {
        var next_step = this.state.step + (direction?1:-1);
        console.log(next_step);
        this.setState({step: next_step})
    }

    getScheduleId() {
        const task = this.props.task || {};
        var schedule_id = null;
        if(task.update_interval && task.update_interval_units) {
            schedule_id = `${task.update_interval}_${task.update_interval_units}`;
        }
        return schedule_id;
    }

    getCollaborators() {
        const task = this.props.task || {};
        var collaborators = [];
        if(task.id && task.details) {
            task.details.participation.forEach((collaborator) => {
                if(collaborator.user.id != this.state.assignee) {
                    collaborators.push(collaborator.user);
                }
            });
        }
        return collaborators;
    }

    onDeadlineChange(date) {
        this.setState({deadline: moment(date).utc().format()});
    }

    onDescriptionChange(e) {
        this.setState({description: e.target.getContent()});
    }

    onSkillChange(skills) {
        this.setState({skills: skills});
    }

    onVisibilityChange(visibility = VISIBILITY_DEVELOPERS) {
        this.setState({visibility: visibility});
        if(visibility != VISIBILITY_CUSTOM) {
            this.setState({assignee: null});
        }
    }

    onUpdateScheduleChange(schedule) {
        var schedule_id = schedule || null;
        this.setState({schedule: schedule_id});
    }

    onAssigneeChange(users) {
        var assignee = null;
        if(Array.isArray(users) && users.length) {
            assignee = users[0];
        }
        this.setState({assignee: assignee});
    }

    onParticipantChange(users) {
        if(Array.isArray(users)) {
            this.setState({participants: Array.from(new Set([...this.state.participants, ...users]))});
        }
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
        var title = this.refs.title.value.trim();
        var description = this.state.description;
        var fee = this.refs.fee.value.trim();
        var deadline = this.state.deadline;
        var url = this.refs.url.value.trim();
        var visibility = this.state.visibility;
        var schedule_id = this.state.schedule || null;
        var update_schedule = null;
        if(schedule_id) {
            update_schedule = this.state.schedule_map[schedule_id];
        }
        var assignee = this.state.assignee;
        var participants = this.state.participants;
        if(assignee) {
            participants.push(assignee);
        }

        const { TaskActions } = this.props;
        const task = this.props.task || {};
        const selected_skills = this.state.skills;
        const skills = selected_skills.join(',');
        const attachments = this.state.attachments;

        const task_info = {title, description, skills, url, fee, deadline, visibility, ...update_schedule, assignee, participants};
        if(task.id) {
            TaskActions.updateTask(task.id, task_info);
        } else {
            TaskActions.createTask(task_info, attachments);
        }
        return;
    }

    render() {
        const { Task } = this.props;
        const task = this.props.task || {};
        const description = this.props.task?task.description:'';
        return (
            <div>
                {task.id?null:(
                <h3>Post a new task</h3>
                    )}
                <form onSubmit={this.handleSubmit} name="task" role="form" ref="task_form">
                    <FormStatus loading={Task.detail.isSaving}
                                success={Task.detail.isSaved}
                                message={'Task saved successfully'}
                                error={Task.detail.error.create || Task.detail.error.update}/>

                    <div className={[2,3].indexOf(this.state.step) == -1?null:'sr-only'}>
                        {(Task.detail.error.create && Task.detail.error.create.title)?
                            (<FieldError message={Task.detail.error.create.title}/>):null}
                        {(Task.detail.error.update && Task.detail.error.update.title)?
                            (<FieldError message={Task.detail.error.update.title}/>):null}
                        <div className="form-group">
                            <label className="control-label">Task title *</label>
                            <div><input type="text" className="form-control" ref="title" required placeholder="Title" defaultValue={task.title}/></div>
                        </div>

                        {(Task.detail.error.create && Task.detail.error.create.description)?
                            (<FieldError message={Task.detail.error.create.description}/>):null}
                        {(Task.detail.error.update && Task.detail.error.update.description)?
                            (<FieldError message={Task.detail.error.update.description}/>):null}
                        <div className="form-group">
                            <label className="control-label">Task description</label>
                            <TinyMCE
                                content={description}
                                config={TINY_MCE_CONFIG}
                                onChange={this.onDescriptionChange.bind(this)}/>
                        </div>

                        {(Task.detail.error.create && Task.detail.error.create.skills)?
                            (<FieldError message={Task.detail.error.create.skills}/>):null}
                        {(Task.detail.error.update && Task.detail.error.update.skills)?
                            (<FieldError message={Task.detail.error.update.skills}/>):null}
                        <div className="form-group">
                            <label className="control-label">Skills required for this task *</label>
                            <SkillSelector filter={{filter: null}} onChange={this.onSkillChange.bind(this)} skills={task.details?task.details.skills:[]}/>
                        </div>
                    </div>

                    <div className={this.state.step == 2?null:'sr-only'}>
                        {(Task.detail.error.create && Task.detail.error.create.fee)?
                            (<FieldError message={Task.detail.error.create.fee}/>):null}
                        {(Task.detail.error.update && Task.detail.error.update.fee)?
                            (<FieldError message={Task.detail.error.update.fee}/>):null}
                        <div className="form-group">
                            <label className="control-label">Pledge (in Euro) *</label>
                            <div><input type="text" className="form-control" ref="fee" required placeholder="Pledge in €" defaultValue={task.fee}/></div>
                            <div style={{marginTop: '10px'}}>13% of pledge goes to Tunga</div>
                        </div>

                        {(Task.detail.error.create && Task.detail.error.create.deadline)?
                            (<FieldError message={Task.detail.error.create.deadline}/>):null}
                        {(Task.detail.error.update && Task.detail.error.update.deadline)?
                            (<FieldError message={Task.detail.error.update.deadline}/>):null}
                        <div className="form-group">
                            <label className="control-label">Deadline</label>
                            <DateTimePicker ref="deadline" onChange={this.onDeadlineChange.bind(this)} defaultValue={task.deadline?(new Date(moment.utc(task.deadline).format())):null}/>
                        </div>

                        {(Task.detail.error.create && Task.detail.error.create.url)?
                            (<FieldError message={Task.detail.error.create.url}/>):null}
                        {(Task.detail.error.update && Task.detail.error.update.url)?
                            (<FieldError message={Task.detail.error.update.url}/>):null}
                        <div className="form-group">
                            <label className="control-label">Code location</label>
                            <div><input type="text" className="form-control" ref="url" placeholder="URL e.g GitHub, GitLab, BitBucket issue link" defaultValue={task.url}/></div>
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
                                <button type="button" className="btn btn-default" style={{marginRight: '5px'}}
                                        onClick={this.onAddAttachment.bind(this)}>
                                    <i className="fa fa-upload"/> Upload file
                                </button>
                            </div>
                        </div>

                        {(Task.detail.error.create && Task.detail.error.create.update_schedule)?
                            (<FieldError message={Task.detail.error.create.update_schedule}/>):null}
                        {(Task.detail.error.update && Task.detail.error.update.update_schedule)?
                            (<FieldError message={Task.detail.error.update.update_schedule}/>):null}
                        <div className="form-group">
                            <label className="control-label">Update preferences *</label>
                            <div>
                                <div className="btn-group btn-choices select" role="group" aria-label="update preference">
                                    <button type="button"
                                            className={"btn btn-default" + (!this.state.schedule?' active':'')}
                                            onClick={this.onUpdateScheduleChange.bind(this, null)}>No updates
                                    </button>
                                    {this.state.schedule_options.map(schedule => {
                                        return (
                                        <button key={schedule.id} type="button"
                                                className={"btn btn-default" + (this.state.schedule == schedule.id?' active':'')}
                                                onClick={this.onUpdateScheduleChange.bind(this, schedule.id)}>{schedule.name}
                                        </button>
                                            )
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={this.state.step == 3?null:'sr-only'}>
                        {(Task.detail.error.create && Task.detail.error.create.visibility)?
                            (<FieldError message={Task.detail.error.create.visibility}/>):null}
                        {(Task.detail.error.update && Task.detail.error.update.visibility)?
                            (<FieldError message={Task.detail.error.update.visibility}/>):null}
                        <div className="form-group">
                            <label className="control-label">Visibility *</label>
                            <br/>
                            <div className="btn-group btn-choices select" role="group" aria-label="visibility">
                                {TASK_VISIBILITY_CHOICES.map(visibility => {
                                    return (
                                    <button key={visibility.id} type="button"
                                            className={"btn btn-default" + (this.state.visibility == visibility.id?' active':'')}
                                            onClick={this.onVisibilityChange.bind(this, visibility.id)}>{visibility.name}
                                    </button>
                                        )
                                    })}
                            </div>
                            {this.state.visibility == VISIBILITY_CUSTOM?(
                            <div style={{marginTop: '10px'}}>
                                <div className="form-group">
                                    <label className="control-label">Assignee *</label>
                                    <UserSelector filter={{type: USER_TYPE_DEVELOPER}}
                                                  onChange={this.onAssigneeChange.bind(this)}
                                                  selected={task.details && task.details.assignee && task.details.assignee.user?[task.details.assignee.user]:[]}
                                                  max={1}/>
                                </div>
                                <div className="form-group">
                                    <label className="control-label">Collaborators</label>
                                    <UserSelector filter={{type: USER_TYPE_DEVELOPER}}
                                                  onChange={this.onParticipantChange.bind(this)}
                                                  selected={this.getCollaborators()}
                                                  deselected={this.state.assignee?[this.state.assignee]:[]}
                                                  unremovable={this.getCollaborators().map((user) => {return user.id})}/>
                                </div>
                            </div>
                                ):null}
                        </div>

                        <div className="text-center">
                            <button type="submit" className="btn btn-default btn-action" disabled={Task.detail.isSaving}>{task.id?'Update task':'Publish task'}</button>
                        </div>
                    </div>
                    <div className="nav pull-right">
                        {this.state.step > 1?(
                        <button type="button" className="btn btn-default" onClick={this.changeStep.bind(this, false)}>
                            <i className="fa fa-angle-left fa-lg"/>
                        </button>
                            ):null}
                        {this.state.step < 3?(
                        <button type="button" className="btn btn-default" onClick={this.changeStep.bind(this, true)}>
                            <i className="fa fa-angle-right fa-lg"/>
                        </button>
                            ):null}
                    </div>
                    <div className="clearfix"></div>
                </form>
            </div>

        );
    }
}
