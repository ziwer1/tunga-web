import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import _ from 'lodash';
import {Button, OverlayTrigger, Tooltip, ButtonGroup} from 'react-bootstrap';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import TinyMCE  from 'react-tinymce';
import Dropzone from 'react-dropzone';
import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';
import UserSelector from '../containers/UserSelector';
import SkillSelector from '../containers/SkillSelector';
import ComponentWithModal from './ComponentWithModal';
import LargeModal from './ModalLarge';
import MilestoneForm from './MilestoneForm';
import ProjectPage from '../containers/ProjectPage';
import ProjectForm from './ProjectForm';

import {
    USER_TYPE_DEVELOPER, TASK_TYPE_CHOICES, TASK_SCOPE_CHOICES, TASK_SCOPE_ONE_TIME, TASK_SCOPE_ONGOING,
    TASK_BILLING_METHOD_CHOICES, TASK_BILLING_METHOD_FIXED, TASK_BILLING_METHOD_HOURLY, TASK_CODERS_NEEDED_CHOICES,
    TASK_VISIBILITY_CHOICES, VISIBILITY_DEVELOPERS, VISIBILITY_CUSTOM, UPDATE_SCHEDULE_CHOICES
} from '../constants/Api';
import {TINY_MCE_CONFIG } from '../constants/settings';

momentLocalizer(moment);

export default class TaskForm extends ComponentWithModal {

    constructor(props) {
        super(props);
        var schedule_options = [];
        var schedule_map = {};
        UPDATE_SCHEDULE_CHOICES.forEach((schedule) => {
            schedule_options.push({id: `${schedule.number}_${schedule.unit}`, name: schedule.name});
            schedule_map[`${schedule.number}_${schedule.unit}`] = {update_interval: schedule.number, update_interval_units: schedule.unit};
        });
        this.state = {
            is_project: null, deadline: null, skills: [], scope: null,
            description: '', remarks: '', visibility: VISIBILITY_DEVELOPERS,
            assignee: null, participants: [], schedule_options, schedule_map,
            step: 1, schedule: null, attachments: [], showAll: false, milestones: [],
            modalMilestone: null, modalContent: null, modalTitle: '', coders_needed: null, task_type: null,
            has_requirements: null, pm_required: null, billing_method: null, stack_description: '', deliverables: '',
            skype_id: ''
        };
    }

    componentWillMount() {
        const task = this.props.task || {};
        if(task.id) {
            const assignee = task.assignee && task.assignee.user?task.assignee.user.id:null;
            const description = task.description || '';
            const remarks = task.remarks || '';
            var participants = [];
            if(task.details) {
                task.details.participation.forEach((participant) => {
                    if(participant.user.id != assignee) {
                        participants.push(participant.user.id);
                    }
                });
            }
            this.setState({
                is_project: task.is_project, scope: task.scope, visibility: task.visibility, assignee, participants, description, remarks,
                schedule: this.getScheduleId(), milestones: task.milestones, deadline: task.deadline,
                coders_needed: task.coders_needed, task_type: task.type, has_requirements: task.has_requirements,
                pm_required: task.pm_required, billing_method: task.billing_method,
                stack_description: task.stack_description, deliverables: task.deliverables, skype_id: task.skype_id
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.Task.detail.isSaved && !prevProps.Task.detail.isSaved) {
            const { Task } = this.props;
            if(!this.props.task) {
                this.refs.task_form.reset();
                this.setState({
                    is_project: null, deadline: null, skills: [], scope: null,
                    description: '', remarks: '', visibility: VISIBILITY_DEVELOPERS,
                    assignee: null, participants: [], schedule: null, attachments: [], showAll: false,
                    step: 1, milestones: [], modalMilestone: null, modalContent: null, modalTitle: '', coders_needed: null,
                    task_type: null, has_requirements: null, pm_required: null,
                    billing_method: null, stack_description: '', deliverables: '', skype_id: ''
                });

                const { router } = this.context;
                router.replace(`/task/${Task.detail.task.id}`);
            }
        }
    }

    changeStep(direction=true) {
        var next_step = this.state.step + (direction?1:-1);
        this.setState({step: next_step});
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

    onTaskTypeChange(type) {
        this.setState({task_type: type});
        this.changeStep();
    }

    onWorkScopeChange(scope) {
        this.setState({scope});
        this.changeStep();
    }

    onIsProjectChange(is_project) {
        this.setState({is_project});
        this.changeStep();
    }

    onHasRequirementsChange(has_requirements) {
        this.setState({has_requirements});
        this.changeStep();
    }

    onPMRequiredChange(pm_required) {
        this.setState({pm_required});
    }

    onDeadlineChange(date) {
        this.setState({deadline: moment(date).utc().format()});
    }

    onDescriptionChange(key, e) {
        var new_state = {};
        new_state[key] = e.target.getContent();
        this.setState(new_state);
    }

    onRemarksChange(e) {
        this.setState({remarks: e.target.getContent()});
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

    showAll(e) {
        if(!this.refs.task_form.checkValidity()) {
            this.setState({showAll: true});
        }
    }

    onComposeMilestone(milestone) {
        this.setState({modalMilestone: milestone, modalContent: 'milestone', modalTitle: 'Add milestone'});
        this.open();
    }

    onAddMilestone(milestone){
        var new_milestones = this.state.milestones;
        if(milestone.idx > -1) {
            new_milestones[milestone.idx] = milestone;
        } else {
            new_milestones = [...new_milestones, milestone];
        }
        this.setState({milestones: new_milestones});
    }

    onStateValueChange(key, value) {
        var new_state = {};
        new_state[key] = value;
        this.setState(new_state);
    }

    handleSubmit(e) {
        e.preventDefault();
        var title = this.refs.title?this.refs.title.value.trim():null;
        var description = this.state.description;
        var stack_description = this.state.stack_description;
        var deliverables = this.state.deliverables;

        var task_type = this.state.task_type;
        var scope = this.state.scope;
        var is_project = this.state.is_project;
        var has_requirements = this.state.has_requirements;
        var pm_required = this.state.pm_required;

        var coders_needed = this.state.coders_needed;
        var billing_method = this.state.billing_method;
        var fee = this.refs.fee?(this.refs.fee.value.trim() || null):null;
        var deadline = this.state.deadline;

        var url = this.refs.url?this.refs.url.value.trim():null;
        var remarks = this.state.remarks;

        var skype_id = this.state.skype_id;

        var visibility = this.state.visibility;
        var schedule_id = this.state.schedule || null;
        var update_schedule = null;
        if(schedule_id) {
            update_schedule = this.state.schedule_map[schedule_id];
        }

        var participation = [];

        var assignee = this.state.assignee;
        var participants = this.state.participants;
        if (participants) {
            participation = participants.map(function (id) {
                return {user: id, assignee: false};
            });
        }
        if(assignee) {
            participation.push({user: assignee, assignee: true});
        }
        var milestones = this.state.milestones;

        const selected_skills = this.state.skills;
        const skills = selected_skills.join(',');
        const attachments = this.state.attachments;

        const { TaskActions, project } = this.props;
        const task = this.props.task || {};

        const task_info = {
            title, description, remarks, skills, url, fee, visibility,
            participation, milestones, ...update_schedule
        };

        if(project && project.id) {
            task_info.parent = project.id;
        }
        if(task_type) {
            task_info.type = task_type;
        }
        if(scope) {
            task_info.scope = scope;
        }
        if(typeof is_project == 'boolean') {
            console.log(typeof is_project);
            task_info.is_project = is_project;
        }
        if(typeof has_requirements == 'boolean') {
            task_info.has_requirements = has_requirements;
        }
        if(typeof pm_required == 'boolean') {
            task_info.pm_required = pm_required;
        }
        if(stack_description) {
            task_info.scope = stack_description;
        }
        if(deliverables) {
            task_info.deliverables = deliverables;
        }
        if(billing_method) {
            task_info.billing_method = billing_method;
        }
        if(coders_needed) {
            task_info.coders_needed = coders_needed;
        }
        if(deadline) {
            task_info.deadline = deadline;
        }
        if(skype_id) {
            task_info.skype_id = skype_id;
        }

        if(task.id) {
            TaskActions.updateTask(task.id, task_info, attachments);
        } else {
            TaskActions.createTask(task_info, attachments);
        }
        return;
    }

    renderModalContent() {
        return (
            <div>
                <LargeModal title={this.state.modalTitle} show={this.state.showModal} onHide={this.close.bind(this)}>
                    {this.state.modalContent == 'project'?(
                    <ProjectPage>
                        <ProjectForm hide_title={true} onSuccess={this.onAddProject.bind(this)}/>
                    </ProjectPage>
                        ):null}
                    {this.state.modalContent == 'milestone'?(
                    <MilestoneForm
                        milestone={this.state.modalMilestone}
                        onSave={this.onAddMilestone.bind(this)}
                        close={this.close.bind(this)}/>
                        ):null}
                </LargeModal>
            </div>
        );
    }

    render() {
        const { Auth, Task, project } = this.props;
        const task = this.props.task || {};
        let is_project_task = (project && project.id) || (task && task.parent);
        let work_type = this.state.is_project?'project':'task';

        if(!Auth.user.can_contribute) {
            return (
                <div>
                    {task.id?null:(
                        <h2>Post a new task</h2>
                    )}
                    <div className="alert alert-info">You need to complete your profile before you can post tasks</div>
                    <div>
                        <Link to="/profile"><i className="fa fa-arrow-right"/> Continue to your profile</Link>
                    </div>
                </div>
            );
        }
        const description = this.props.task?task.description:'';
        const stack_description = this.props.task?task.stack_description:'';
        const deliverables = this.props.task?task.deliverables:'';
        const remarks = this.props.task?task.remarks:'';
        const has_error = Task.detail.error.create || Task.detail.error.update;

        let taskTypeComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.type)?
                    (<FieldError message={Task.detail.error.create.type}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.type)?
                    (<FieldError message={Task.detail.error.update.type}/>):null}
                <div className="form-group">
                    <label className="control-label">What kind of work do you have?</label>
                    <div>
                        <div className="btn-choices task-type-choices" role="group">
                            {TASK_TYPE_CHOICES.map(task_type => {
                                return (
                                    <button key={task_type.id} type="button"
                                            className={"btn " + (this.state.task_type == task_type.id?' active':'')}
                                            onClick={this.onTaskTypeChange.bind(this, task_type.id)}>
                                        <i className={`fa ${task_type.icon} fa-3x`}/>
                                        <div>{task_type.name}</div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );

        let taskScopeComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.scope)?
                    (<FieldError message={Task.detail.error.create.scope}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.scope)?
                    (<FieldError message={Task.detail.error.update.scope}/>):null}
                <div className="form-group">
                    <label className="control-label">What is the nature of the project?</label>
                    <div>
                        <div className="btn-choices choice-fork" role="group">
                            {TASK_SCOPE_CHOICES.map(scope_type => {
                                return (
                                    <button key={scope_type.id} type="button"
                                            className={"btn" + (this.state.scope == scope_type.id?' active':'')}
                                            onClick={this.onWorkScopeChange.bind(this, scope_type.id)}>
                                        <div>{scope_type.name}</div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );

        let isProjectComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.is_project)?
                    (<FieldError message={Task.detail.error.create.is_project}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.is_project)?
                    (<FieldError message={Task.detail.error.update.is_project}/>):null}
                <div className="form-group">
                    <label className="control-label">What is the scope of the work?</label>
                    <div>
                        <div className="btn-choices choice-fork" role="group">
                            {[
                                {id: false, name: 'I have a task<br/>&lt; 50 hours'},
                                {id: true, name: 'I have a project<br/>&gt; than 50 hours'}
                            ].map(work_type => {
                                return (
                                    <button key={work_type.id} type="button"
                                            className={"btn" + (this.state.is_project == work_type.id?' active':'')}
                                            onClick={this.onIsProjectChange.bind(this, work_type.id)}>
                                        <div dangerouslySetInnerHTML={{__html: work_type.name}} />
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );

        let hasRequirementsComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.has_requirements)?
                    (<FieldError message={Task.detail.error.create.has_requirements}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.has_requirements)?
                    (<FieldError message={Task.detail.error.update.has_requirements}/>):null}
                <div className="form-group">
                    <label className="control-label">Do you have clear requirements for this project?</label>
                    <div>
                        <div className="btn-choices choice-fork" role="group">
                            {[
                                {id: true, name: 'Yes, and I would like to submit my project on Tunga now'},
                                {id: false, name: 'No, I would like to talk to someone on Tunga about my project'}
                            ].map(has_requirements => {
                                return (
                                    <button key={has_requirements.id} type="button"
                                            className={"btn" + (this.state.has_requirements == has_requirements.id?' active':'')}
                                            onClick={this.onHasRequirementsChange.bind(this, has_requirements.id)}>
                                        <div dangerouslySetInnerHTML={{__html: has_requirements.name}} />
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );

        let requiresPMComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.pm_required)?
                    (<FieldError message={Task.detail.error.create.pm_required}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.pm_required)?
                    (<FieldError message={Task.detail.error.update.pm_required}/>):null}
                <div className="form-group">
                    <label className="control-label">Do you want a project manager for this project?</label>
                    <div>
                        <div className="btn-choices" role="group">
                            {[
                                {id: true, name: 'Yes, I want a project manager'},
                                {id: false, name: 'No, I will manage all processes for this project myself'}
                            ].map(pm_options => {
                                return (
                                    <button key={pm_options.id} type="button"
                                            className={"btn" + (this.state.pm_required == pm_options.id?' active':'')}
                                            onClick={this.onPMRequiredChange.bind(this, pm_options.id)}>
                                        <div dangerouslySetInnerHTML={{__html: pm_options.name}} />
                                    </button>
                                )
                            })}
                        </div>
                        <div className="card">
                            Responsibities that a project manager on Tunga takes on:<br/>
                            - Assembling the team of developers<br/>
                            - Making the plan for the project<br/>
                            - Reporting progress of the project<br/>
                            - Troubleshooting<br/>
                            - Organizing (daily) standups<br/>
                        </div>
                    </div>
                </div>
            </div>
        );

        let titleComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.title)?
                    (<FieldError message={Task.detail.error.create.title}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.title)?
                    (<FieldError message={Task.detail.error.update.title}/>):null}
                <div className="form-group">
                    <label className="control-label">Title for your {work_type} *</label>
                    <div><input type="text" className="form-control" ref="title" required placeholder="Title" defaultValue={task.title}/></div>
                </div>
            </div>
        );

        let descComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.description)?
                    (<FieldError message={Task.detail.error.create.description}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.description)?
                    (<FieldError message={Task.detail.error.update.description}/>):null}
                <div className="form-group">
                    <label className="control-label">{
                        this.state.scope == TASK_SCOPE_ONGOING?'What kind of work do you have for developers':(
                            this.state.is_project?(
                                this.state.has_requirements?'Goals of the project':'Describe the idea you have for the project'
                            ):'Requirements for this task'
                        )
                    }</label>
                    <TinyMCE
                        content={description}
                        config={TINY_MCE_CONFIG}
                        onChange={this.onDescriptionChange.bind(this, 'description')}/>
                </div>
            </div>
        );

        let stackDescComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.stack_description)?
                    (<FieldError message={Task.detail.error.create.stack_description}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.stack_description)?
                    (<FieldError message={Task.detail.error.update.stack_description}/>):null}
                <div className="form-group">
                    <label className="control-label">Description of the stack/technology you want to use</label>
                    <TinyMCE
                        content={stack_description}
                        config={TINY_MCE_CONFIG}
                        onChange={this.onDescriptionChange.bind(this, 'stack_description')}/>
                </div>
            </div>
        );

        let deliverablesComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.deliverables)?
                    (<FieldError message={Task.detail.error.create.deliverables}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.deliverables)?
                    (<FieldError message={Task.detail.error.update.deliverables}/>):null}
                <div className="form-group">
                    <label className="control-label">What are the deliverables</label>
                    <TinyMCE
                        content={deliverables}
                        config={TINY_MCE_CONFIG}
                        onChange={this.onDescriptionChange.bind(this, 'deliverables')}/>
                </div>
            </div>
        );

        let skillsComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.skills)?
                    (<FieldError message={Task.detail.error.create.skills}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.skills)?
                    (<FieldError message={Task.detail.error.update.skills}/>):null}
                <div className="form-group">
                    <label className="control-label">Skills required for this {work_type} *</label>
                    <SkillSelector filter={{filter: null}}
                                   onChange={this.onSkillChange.bind(this)}
                                   skills={task.details?task.details.skills:[]}/>
                </div>
            </div>
        );

        let feeComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.fee)?
                    (<FieldError message={Task.detail.error.create.fee}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.fee)?
                    (<FieldError message={Task.detail.error.update.fee}/>):null}
                <div className="form-group">
                    <label className="control-label">{
                        this.state.is_project && !this.state.has_requirements?
                            'What is roughly the budget of this project?':
                            `Fixed fee for this task (in Euros) ${is_project_task?' - optional':''}`
                    }</label>
                    <div><input type="text" className="form-control" ref="fee" required={!is_project_task} placeholder="Amount in Euros" defaultValue={task.fee?parseFloat(task.fee).toFixed(2):''}/></div>
                    {!this.state.is_project || this.state.has_requirements?(
                        <div style={{marginTop: '10px'}}>13% of pledge goes to Tunga</div>
                    ):null}
                </div>
            </div>
        );

        let deadlineComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.deadline)?
                    (<FieldError message={Task.detail.error.create.deadline}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.deadline)?
                    (<FieldError message={Task.detail.error.update.deadline}/>):null}
                <div className="form-group">
                    <label className="control-label">When do you need the {work_type} done?</label>
                    <div className="row">
                        <div className="col-md-6">
                            <DateTimePicker ref="deadline" onChange={this.onDeadlineChange.bind(this)} defaultValue={task.deadline?(new Date(moment.utc(task.deadline).format())):null}/>
                        </div>
                        <div>
                            <button type="button"
                                    className={"btn btn-grey " + (this.state.deadline === undefined?' active':'')}
                                    onClick={this.onStateValueChange.bind(this, 'deadline', undefined)}>I don't have a deadline for this task
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );

        let filesComp = (
            <div className="form-group">
                <label className="control-label">{this.state.is_project?`Please upload relevant files for the ${work_type} (e.g functional requirements and/or wireframes)`:'Files'}</label>
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
                    <button type="button" className="btn" style={{marginRight: '5px'}}
                            onClick={this.onAddAttachment.bind(this)}>
                        <i className="fa fa-upload"/> Upload files
                    </button>
                </div>
            </div>
        );

        let updatesComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.update_schedule)?
                    (<FieldError message={Task.detail.error.create.update_schedule}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.update_schedule)?
                    (<FieldError message={Task.detail.error.update.update_schedule}/>):null}
                {is_project_task?null:(
                    <div className="form-group">
                        <div className="highlight">Our coders send you updates to keep you up to date on the progress of your {work_type}</div>
                        <label className="control-label">How often would you like to receive an update?</label>
                        <div className="secondary">* Tunga recommends daily updates</div>
                        <div>
                            <div className="btn-choices" role="group" aria-label="update preference">
                                <button type="button"
                                        className={"btn " + (!this.state.schedule?' active':'')}
                                        onClick={this.onUpdateScheduleChange.bind(this, null)}>No updates
                                </button>
                                {this.state.schedule_options.map(schedule => {
                                    return (
                                        <button key={schedule.id} type="button"
                                                className={"btn " + (this.state.schedule == schedule.id?' active':'')}
                                                onClick={this.onUpdateScheduleChange.bind(this, schedule.id)}>{schedule.name}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );

        let milestoneComp = (
            <div>
                {is_project_task?null:(
                    <div className="form-group">
                        <label className="control-label">Would you like to add milestones to this {work_type}?</label>
                        {this.state.milestones && this.state.milestones.length?(
                            <div>
                                <div className="btn-choices">
                                    {this.state.milestones.map((milestone, idx) => {
                                        const tooltip = (<Tooltip id="tooltip"><strong>{milestone.title}</strong><br/>{milestone.due_at?moment.utc(milestone.due_at).local().format('Do, MMMM YYYY, h:mm a'):null}</Tooltip>);
                                        return (
                                            <OverlayTrigger key={milestone.due_at} placement="top"
                                                            overlay={tooltip}>
                                                <Button bsStyle="default"
                                                        onClick={this.onComposeMilestone.bind(this, {...milestone, idx})}>
                                                    {_.truncate(milestone.title, {length: 25})}
                                                </Button>
                                            </OverlayTrigger>
                                        )
                                    })}
                                    {this.state.deadline?(
                                        <OverlayTrigger placement="top"
                                                        overlay={<Tooltip id="tooltip">
                                                    <strong>Hand over final draft</strong><br/>
                                                    {moment.utc(this.state.deadline).subtract(1, 'days').local().format('Do, MMMM YYYY, h:mm a')}
                                                    </Tooltip>}>
                                            <Button bsStyle="default">{_.truncate('Hand over final draft', {length: 25})}</Button>
                                        </OverlayTrigger>
                                    ):null}
                                </div>
                            </div>
                        ):null}
                        <div>
                            <Button onClick={this.onComposeMilestone.bind(this, null)}>Add milestone</Button>
                        </div>
                    </div>
                )}
            </div>
        );

        let visibilityComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.visibility)?
                    (<FieldError message={Task.detail.error.create.visibility}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.visibility)?
                    (<FieldError message={Task.detail.error.update.visibility}/>):null}
                <div className="form-group">
                    <label className="control-label">Who would you like to be able to see your {work_type}?</label>
                    <br/>
                    <div className="btn-choices" role="group" aria-label="visibility">
                        {TASK_VISIBILITY_CHOICES.map(visibility => {
                            return (
                                <button key={visibility.id} type="button"
                                        className={"btn " + (this.state.visibility == visibility.id?' active':'')}
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
                                              selected={task.assignee && task.assignee.user?[task.assignee.user]:[]}
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
            </div>
        );

        let codeLocationComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.url)?
                    (<FieldError message={Task.detail.error.create.url}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.url)?
                    (<FieldError message={Task.detail.error.update.url}/>):null}
                <div className="form-group">
                    <label className="control-label">Code location</label>
                    <div><input type="text" className="form-control" ref="url" placeholder="URL e.g GitHub, GitLab, BitBucket issue link" defaultValue={task.url}/></div>
                </div>
            </div>
        );

        let remarksComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.remarks)?
                    (<FieldError message={Task.detail.error.create.remarks}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.remarks)?
                    (<FieldError message={Task.detail.error.update.remarks}/>):null}
                {is_project_task?null:(
                    <div className="form-group">
                        <label className="control-label">Which files can you deliver in order to provide more details for this {work_type}?</label>
                        <TinyMCE
                            content={remarks}
                            config={TINY_MCE_CONFIG}
                            onChange={this.onRemarksChange.bind(this)}/>
                    </div>
                )}
            </div>
        );

        let codersComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.coders_needed)?
                    (<FieldError message={Task.detail.error.create.coders_needed}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.coders_needed)?
                    (<FieldError message={Task.detail.error.update.coders_needed}/>):null}
                <div className="form-group">
                    <label className="control-label">How many coders will you need for this {work_type}</label>
                    <div>
                        <div className="btn-choices" role="group" aria-label="coders">
                            {TASK_CODERS_NEEDED_CHOICES.map(coder_number => {
                                return (
                                    <button key={coder_number.id} type="button"
                                            className={"btn " + (this.state.coders_needed && this.state.coders_needed == coder_number.id?' active':'')}
                                            onClick={this.onStateValueChange.bind(this, 'coders_needed', coder_number.id)}>{coder_number.name}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );

        let billingComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.billing_method)?
                    (<FieldError message={Task.detail.error.create.billing_method}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.billing_method)?
                    (<FieldError message={Task.detail.error.update.billing_method}/>):null}
                <div className="form-group">
                    <label className="control-label">How would you like to pay?</label>
                    <div>
                        <div className="btn-choices" role="group" aria-label="coders">
                            {TASK_BILLING_METHOD_CHOICES.map(billing_method => {
                                return (
                                    <button key={billing_method.id} type="button"
                                            className={"btn " + (this.state.billing_method && this.state.billing_method == billing_method.id?' active':'')}
                                            onClick={this.onStateValueChange.bind(this, 'billing_method', billing_method.id)}>{billing_method.name}
                                    </button>
                                )
                            })}
                            {this.state.is_project?(
                                <button type="button"
                                        className={"btn " + (this.state.billing_method === undefined?' active':'')}
                                        onClick={this.onStateValueChange.bind(this, 'billing_method', undefined)}>I'm not sure
                                </button>
                            ):null}
                        </div>
                        {!this.state.is_project && this.state.billing_method == TASK_BILLING_METHOD_HOURLY?(
                            <div className="card">
                                Tunga offers fixed fees ranging from &euro; 19 - &euro; 25 per hour.<br/>
                                The fee per developers will be presented when they apply for the task.
                            </div>
                        ):null}

                        {this.state.is_project && this.state.has_requirements?(
                            <div>
                                {this.state.billing_method == TASK_BILLING_METHOD_HOURLY?(
                                    <div className="card">
                                        Developers will make an estimate of the hours needed, but you will pay for the actual hours logged<br/>
                                        We probably need to add a limit for how far a dev can go over the estimated hours.

                                    </div>
                                ):null}
                                {this.state.billing_method == TASK_BILLING_METHOD_FIXED?(
                                    <div className="card">
                                        Tunga will make a proposal if you choose this option.
                                    </div>
                                ):null}
                                {this.state.billing_method === undefined?(
                                    <div className="card">
                                        Choose this option to postpone your decision.
                                    </div>
                                ):null}
                            </div>
                        ):null}
                    </div>
                </div>
                {!this.state.is_project && this.state.billing_method == TASK_BILLING_METHOD_FIXED?(feeComp):null}
            </div>
        );

        let contactComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.skype_id)?
                    (<FieldError message={Task.detail.error.create.skype_id}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.skype_id)?
                    (<FieldError message={Task.detail.error.update.skype_id}/>):null}
                <div className="form-group">
                    <p className="highlight">We'll reach out to you to plan a call to find the perfect match</p>
                    <label className="control-label">Please fill in your skype id</label>
                    <div className="row">
                        <div className="col-md-6">
                            <div><input type="text"
                                        className="form-control"
                                        ref="skype_id" placeholder="Your Skype ID"
                                        defaultValue={task.skype_id}
                                        onClick={this.onStateValueChange.bind(this, 'skype_id', this.refs.skype_id?this.refs.skype_id.value.trim():'')}
                            /></div>
                        </div>
                        <div>
                            <button type="button"
                                    className={"btn btn-grey " + (this.state.skype_id === undefined?' active':'')}
                                    onClick={this.onStateValueChange.bind(this, 'skype_id', undefined)}>I don't have Skype, Contact me via email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );

        var sections = [];
        if(is_project_task) {
            sections = [
                {
                    items: [titleComp, descComp, skillsComp, feeComp, filesComp, deadlineComp, visibilityComp]
                }
            ];
        } else if(this.state.scope == TASK_SCOPE_ONGOING) {
            sections = [
                {
                    title: '1/2 Basic details about the task',
                    items: [descComp, codersComp, skillsComp]
                },
                {
                    title: '1/2 The next step',
                    items: [contactComp]
                }
            ]
        } else if(this.state.is_project && !this.state.has_requirements) {
            sections = [
                {
                    title: '1/2 Project description',
                    items: [descComp, deliverablesComp, stackDescComp, filesComp]
                },
                {
                    title: '1/2 Agreements',
                    items: [deadlineComp, feeComp]
                }
            ]
        } else {
            sections = [
                {
                    title: `1/${this.state.is_project?'3':'4'} Basic details about your ${work_type}`,
                    items: [titleComp, skillsComp, this.state.is_project?requiresPMComp:null]
                }
            ];

            if(this.state.is_project) {
                sections = [
                    ...sections,
                    {
                        title: '2/3 Project description',
                        items: [descComp, this.state.pm_required?(<div style={{margin: '20px 0'}}>Add developer profiles here?</div>):stackDescComp, deliverablesComp, filesComp]
                    },
                    {
                        title: '3/3 Agreements',
                        items: [updatesComp, deadlineComp, billingComp]
                    }
                ];
            } else {
                sections = [
                    ...sections,
                    {
                        title: '2/4 Requirements',
                        items: [descComp, filesComp, codersComp]
                    },
                    {
                        title: '3/4 Agreements',
                        items: [deadlineComp, billingComp]
                    },
                    {
                        title: '4/4 Workflow updates',
                        items: [updatesComp, milestoneComp, visibilityComp]
                    }
                ]
            }
        }

        if(!task.id && !is_project_task) {
            if(this.state.is_project) {
                sections = [
                    {
                        title: '',
                        items: [hasRequirementsComp],
                        required: true
                    },
                    ...sections
                ]
            }

            if(this.state.scope != TASK_SCOPE_ONGOING) {
                sections = [
                    {
                        title: '',
                        items: [isProjectComp],
                        required: true
                    },
                    ... sections
                ];
            }

            sections = [
                {
                    title: '',
                    items: [taskTypeComp],
                    required: true
                },
                {
                    title: '',
                    items: [taskScopeComp],
                    required: true
                },
                ... sections
            ];
        }

        return (
            <div className="form-wrapper">
                {this.renderModalContent()}
                {task.id || is_project_task?null:(
                <h2 className="title">Post work</h2>
                    )}

                <form onSubmit={this.handleSubmit.bind(this)} name="task" role="form" ref="task_form" className={has_error || this.state.showAll?'steps-all':null}>
                    <FormStatus loading={Task.detail.isSaving}
                                success={Task.detail.isSaved}
                                message={'Task saved successfully'}
                                error={Task.detail.error.create || Task.detail.error.update}/>

                    {sections.map((section, idx) => {
                        return (
                            <div className={this.state.step == (idx+1) || has_error || this.state.showAll?'step':'sr-only'}>
                                {section.title && !(has_error || this.state.showAll)?(<h5 style={{margin: '15px 0'}}>{section.title}</h5>):null}
                                {section.items.map(item => {
                                    return item;
                                })}
                                {idx+1 == sections.length?(
                                    <div className="text-center">
                                        <button type="submit"
                                                onClick={this.showAll.bind(this)}
                                                className="btn"
                                                disabled={Task.detail.isSaving}>
                                            {this.state.scope == TASK_SCOPE_ONGOING?'Find me awesome developers':(
                                                `${task.id?'Update':'Publish'} ${this.state.is_project?'project':'task'}`
                                            )}
                                        </button>
                                    </div>
                                ):null}
                            </div>
                        )
                    })}

                    <div className="nav text-center">
                        {this.state.step > 1?(
                        <button type="button" className="btn prev-btn" onClick={this.changeStep.bind(this, false)}>
                            <i className="tunga-icon-previous"/>
                        </button>
                            ):null}
                        {this.state.step < sections.length && sections[this.state.step-1] && !sections[this.state.step-1].required?(
                        <button type="button" className="btn next-btn" onClick={this.changeStep.bind(this, true)}>
                            <i className="tunga-icon-next"/>
                        </button>
                            ):null}
                    </div>
                    <div className="clearfix"></div>
                </form>
            </div>

        );
    }
}

TaskForm.contextTypes = {
    router: React.PropTypes.object.isRequired
};
