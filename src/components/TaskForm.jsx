import React from 'react'
import moment from 'moment'
import momentLocalizer from 'react-widgets/lib/localizers/moment'
import TinyMCE  from 'react-tinymce'
import Progress from './status/Progress'
import FormStatus from './status/FormStatus'
import FieldError from './status/FieldError'
import UserSelector from '../containers/UserSelector'
import SkillSelector from '../containers/SkillSelector'
import DateTimePicker from 'react-widgets/lib/DateTimePicker'

import { USER_TYPE_DEVELOPER, VISIBILITY_CHOICES, VISIBILITY_ALL_CODERS, VISIBILITY_CUSTOM } from '../constants/Api'

momentLocalizer(moment);

export default class TaskForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {deadline: null, skills: [], description: '', visibility: VISIBILITY_ALL_CODERS, assignee: null, participants: []};
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
            this.setState({visibility: task.visibility, assignee, participants, description});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.Task.detail.isSaved && !prevProps.Task.detail.isSaved) {
            const { Task } = this.props;
            if(!this.props.task) {
                this.refs.task_form.reset();
                if(this.props.history) {
                    this.props.history.replaceState(null, '/task/'+ Task.detail.task.id);
                }
            }
        }
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

    onVisibilityChange(visibility = VISIBILITY_ALL_CODERS) {
        this.setState({visibility: visibility});
        if(visibility != VISIBILITY_CUSTOM) {
            this.setState({assignee: null});
        }
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

    handleSubmit(e) {
        e.preventDefault();
        var title = this.refs.title.value.trim();
        var description = this.state.description;
        var fee = this.refs.fee.value.trim();
        var deadline = this.state.deadline;
        var url = this.refs.url.value.trim();
        var visibility = this.state.visibility;
        var assignee = this.state.assignee;
        var participants = this.state.participants;
        if(assignee) {
            participants.push(assignee);
        }

        const { TaskActions } = this.props;
        const task = this.props.task || {};
        const selected_skills = this.state.skills;
        const skills = selected_skills.join(',');

        if (!title || !fee || !skills) {
            return;
        }

        const task_info = {title, description, skills, url, fee, deadline, visibility, assignee, participants}
        if(task.id) {
            TaskActions.updateTask(task.id, task_info);
        } else {
            TaskActions.createTask(task_info);
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
                <form onSubmit={this.handleSubmit} name="task" role="task" ref="task_form">
                    <FormStatus loading={Task.detail.isSaving}
                                success={Task.detail.isSaved}
                                message={'Task saved successfully'}
                                error={Task.detail.error.create || Task.detail.error.update}/>

                    {(Task.detail.error.create && Task.detail.error.create.title)?
                        (<FieldError message={Task.detail.error.create.title}/>):null}
                    {(Task.detail.error.update && Task.detail.error.update.title)?
                        (<FieldError message={Task.detail.error.update.title}/>):null}
                    <div className="form-group">
                        <label className="control-label">Task summary *</label>
                        <div><input type="text" className="form-control" ref="title" required placeholder="Title" defaultValue={task.title}/></div>
                    </div>

                    {(Task.detail.error.create && Task.detail.error.create.fee)?
                        (<FieldError message={Task.detail.error.create.fee}/>):null}
                    {(Task.detail.error.update && Task.detail.error.update.fee)?
                        (<FieldError message={Task.detail.error.update.fee}/>):null}
                    <div className="form-group">
                        <label className="control-label">Pledge (€) *</label>
                        <div><input type="text" className="form-control" ref="fee" required placeholder="Pledge in €" defaultValue={task.fee}/></div>
                    </div>

                    {(Task.detail.error.create && Task.detail.error.create.deadline)?
                        (<FieldError message={Task.detail.error.create.deadline}/>):null}
                    {(Task.detail.error.update && Task.detail.error.update.deadline)?
                        (<FieldError message={Task.detail.error.update.deadline}/>):null}
                    <div className="form-group">
                        <label className="control-label">Deadline</label>
                        <DateTimePicker ref="deadline" onChange={this.onDeadlineChange.bind(this)} defaultValue={task.deadline?(new Date(moment.utc(task.deadline).format())):null}/>
                    </div>

                    {(Task.detail.error.create && Task.detail.error.create.description)?
                        (<FieldError message={Task.detail.error.create.description}/>):null}
                    {(Task.detail.error.update && Task.detail.error.update.description)?
                        (<FieldError message={Task.detail.error.update.description}/>):null}
                    <div className="form-group">
                        <label className="control-label">Description</label>
                        <TinyMCE
                            content={description}
                            config={{plugins: 'autolink link image lists print preview', toolbar: 'undo redo | bold italic | alignleft aligncenter alignright', default_link_target: "_blank", target_list: false}}
                            onChange={this.onDescriptionChange.bind(this)}/>
                    </div>

                    {(Task.detail.error.create && Task.detail.error.create.url)?
                        (<FieldError message={Task.detail.error.create.url}/>):null}
                    {(Task.detail.error.update && Task.detail.error.update.url)?
                        (<FieldError message={Task.detail.error.update.url}/>):null}
                    <div className="form-group">
                        <label className="control-label">Task URL</label>
                        <div><input type="text" className="form-control" ref="url" placeholder="Task URL e.g GitHub, GitLab, BitBucket issue link" defaultValue={task.url}/></div>
                    </div>

                    {(Task.detail.error.create && Task.detail.error.create.skills)?
                        (<FieldError message={Task.detail.error.create.skills}/>):null}
                    {(Task.detail.error.update && Task.detail.error.update.skills)?
                        (<FieldError message={Task.detail.error.update.skills}/>):null}
                    <div className="form-group">
                        <label className="control-label">Skills required for this task *</label>
                        <SkillSelector filter={{filter: null}} onChange={this.onSkillChange.bind(this)} skills={task.details?task.details.skills:[]}/>
                    </div>

                    {(Task.detail.error.create && Task.detail.error.create.visibility)?
                        (<FieldError message={Task.detail.error.create.visibility}/>):null}
                    {(Task.detail.error.update && Task.detail.error.update.visibility)?
                        (<FieldError message={Task.detail.error.update.visibility}/>):null}
                    <div className="form-group">
                        <label className="control-label">Visibility *</label>
                        <br/>
                        <div className="btn-group btn-choices" role="group" aria-label="visibility">
                            {VISIBILITY_CHOICES.map(visibility => {
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
                    <button type="submit" className="btn btn-default pull-right" disabled={Task.detail.isSaving}>{task.id?'Update task':'Post task'}</button>
                    <div className="clearfix"></div>
                </form>
            </div>

        );
    }
}
