import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import _ from 'lodash';
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import Dropzone from 'react-dropzone';
import FormStatus from './status/FormStatus';
import FieldError from './status/FieldError';

import UserSelector from '../containers/UserSelector';
import SkillSelector from '../containers/SkillSelector';
import ComponentWithModal from './ComponentWithModal';
import LargeModal from './LargeModal';
import MilestoneForm from './MilestoneForm';

import {
    USER_TYPE_DEVELOPER, USER_TYPE_PROJECT_MANAGER, TASK_TYPE_CHOICES, TASK_SCOPE_CHOICES, TASK_SCOPE_CHOICES_NEW_USER, TASK_SCOPE_ONGOING, TASK_SCOPE_PROJECT,
    TASK_BILLING_METHOD_CHOICES, TASK_BILLING_METHOD_FIXED, TASK_BILLING_METHOD_HOURLY, TASK_CODERS_NEEDED_CHOICES,
    TASK_VISIBILITY_CHOICES, VISIBILITY_DEVELOPERS, VISIBILITY_CUSTOM, UPDATE_SCHEDULE_CHOICES, suggestTaskTypeSkills,
    TASK_TYPE_OTHER, TASK_SCOPE_TASK
} from '../constants/Api';

import { getTaskTypeUrl, getScopeUrl, sendGAPageView } from '../utils/tracking';
import { isAuthenticated, isProjectManager, getUser, isAdmin, openProfileWizard } from '../utils/auth';
import { estimateDevHoursForFee, getAcquisitionUrl } from '../utils/tasks';
import { parseNumber } from '../utils/helpers';

momentLocalizer(moment);

var sections = [];
var fork_position = {};

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
            modalMilestone: null, modalContent: null, modalTitle: '', coders_needed: null, type: null,
            has_requirements: null, pm_required: null, billing_method: null, stack_description: '', deliverables: '',
            skype_id: '', contact_required: null, has_more_info: null, overrideErrors: false, pm: null,
            schedule_call: {day: null, from: null, to: null}, ...props.options
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
                ...task,
                assignee, participants, description, remarks,
                fee: task.pay,
                schedule: this.getScheduleId(), type: task.type,
                skills: task.details && task.details.skills?task.details.skills.map((skill) => {
                    return skill.name;
                }):[],
                milestones: task.progress_events
            });
        } else {
            const { project } = this.props;
            if(project && project.id) {
                this.setState({type: project.type || TASK_TYPE_OTHER, scope: TASK_SCOPE_TASK, ...this.props.options});
            }
        }
    }

    componentDidMount() {
        if(this.state.step == 1) {
            this.reportFunnelUrl(this.getStepUrl());
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.Task.detail.isSaved && !prevProps.Task.detail.isSaved) {
            if(!isAuthenticated() && this.props.onStepChange) {
                this.props.onStepChange({
                    title: "Thank you for using Tunga!",
                    subtitle: "One of our project hackers will reach out to you ASAP!"
                }, this.state.step-1, sections);
            }

            this.reportFunnelUrl(this.getStepUrl(true));

            this.reportAcquistion();

            const { Task } = this.props;
            if(!this.props.task) {
                if(this.refs.task_form) {
                    this.refs.task_form.reset();
                }
                this.setState({
                    is_project: null, deadline: null, skills: [], scope: null,
                    description: '', remarks: '', visibility: VISIBILITY_DEVELOPERS,
                    assignee: null, participants: [], schedule: null, attachments: [], showAll: false,
                    step: 1, milestones: [], modalMilestone: null, modalContent: null, modalTitle: '', coders_needed: null,
                    type: null, has_requirements: null, pm_required: null, pm: null,
                    billing_method: null, stack_description: '', deliverables: '', skype_id: '', contact_required: null,
                    has_more_info: false
                });
            }

            if(isAuthenticated()) {
                const { router } = this.context;
                router.replace(`/work/${Task.detail.task.id}`);
            }
        }

        var path_change = ['step', 'type', 'scope', 'contact_required', 'pm_required', 'has_more_info'].map((key) => {
            return this.state[key] != prevState[key];
        });

        if(path_change.indexOf(true) > -1 && !this.props.Task.detail.isSaved) {
            this.reportFunnelUrl(this.getStepUrl());
        }

        if(this.state.step != prevState.step && this.props.onStepChange && !this.props.Task.detail.isSaved) {
            this.props.onStepChange(sections[this.state.step-1], this.state.step-1, sections);
        }
    }

    componentWillUnmount() {
        this.props.TaskActions.clearValidations();
    }

    changeStep(direction=true, overrideErrors) {
        var next_step = this.state.step + (direction?1:-1);
        var new_state = {step: next_step};
        if(typeof overrideErrors == 'boolean') {
            new_state.overrideErrors = overrideErrors;
        }
        this.setState(new_state);
    }

    reportFunnelUrl(url) {
        const { enabledWidgets } = this.props;
        if(!(enabledWidgets && enabledWidgets.length)) {
            sendGAPageView(url);
        }
    }

    getStepUrl(complete=false) {

        var suffix = '';
        if(complete) {
            suffix = '/complete'
        }
        if(this.state.step > 1) {
            suffix = '/step/' + this.state.step + suffix;
        }

        if(this.state.has_more_info && this.canShowFork('has_more_info')) {
            suffix = '/more-info/' + (this.state.has_more_info?'yes':'no') + suffix;
        }

        if(typeof this.state.contact_required == 'boolean' && this.canShowFork('contact_required')) {
            suffix = '/talk/' + (this.state.contact_required?'yes':'no') + suffix;
        }

        if(typeof this.state.pm_required == 'boolean' && this.canShowFork('pm_required')) {
            suffix = '/pm/' + (this.state.pm_required?'yes':'no') + suffix;
        }

        const scope_url = getScopeUrl(this.state.scope);
        if(scope_url && this.canShowFork('scope')) {
            suffix = '/scope/' + scope_url + suffix;
        }

        const type_url = getTaskTypeUrl(this.state.type);
        if(type_url && this.canShowFork('type')) {
            suffix = '/type/' + type_url + suffix;
        }
        return window.location.protocol + '//' + window.location.hostname + (window.location.port?`:${window.location.port}`:'') + (isAuthenticated()?'/work/new':'/start') + suffix;
    }

    reportAcquistion() {
        const task = this.props.Task.detail.task;
        const url = getAcquisitionUrl(task);
        if(!this.props.task && url) {
            sendGAPageView(url);
        }
    }

    canShowFork(fork) {
        return fork_position[fork] && this.state.step > fork_position[fork];
    }

    canSkip(required, requires) {
        if(required) {
            return false;
        }
        if(requires) {
            var i = 0;
            do {
                var key = requires[i];
                var val = this.state[key];
                if(!val || (Array.isArray(val) && !val.length)) {
                    return false;
                }
                i++;
            }
            while (i < requires.length);
        }
        return true;
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
        this.setState({deadline: (date?moment(date).utc().format():undefined)});
    }

    onScheduleChange(part, date) {
        console.log('schedule', part, moment(date).utc().format());
        var new_schedule_call = this.state.schedule_call;
        switch(part) {
            case 'day':
                new_schedule_call.day = moment(date).utc().format('YYYY-MM-DD');
                break;
            case 'from':
            case 'to':
                new_schedule_call[part] = moment(date).utc().format('hh:mm:ss');
                break;
            default:
                break
        }
        console.log('new_schedule_call', new_schedule_call);
        this.setState({schedule_call: new_schedule_call});
    }

    onRichTextChange(key, e) {
        var new_state = {};
        new_state[key] = e.target.getContent();
        this.setState(new_state);
    }

    onInputChange(key, e) {
        var new_state = {};
        new_state[key] = e.target.value;
        this.setState(new_state);
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
        this.setState({assignee});
    }

    onPMChange(users) {
        var pm = null;
        if(Array.isArray(users) && users.length) {
            pm = users[0];
        }
        this.setState({pm});
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
        this.setState({showAll: !this.refs.task_form.checkValidity(), overrideErrors: false});
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
        const task = this.props.task || {};

        var new_state = {};
        new_state[key] = value;

        var shouldChangeStep = false;
        if(key == 'type') {
            new_state.skills = Array.from(new Set([...this.state.skills, ...suggestTaskTypeSkills(value)['selected']]));
        }

        if(key == 'scope') {
            if(value == TASK_SCOPE_TASK) {
                new_state.pm_required = false;
            } else if(!task.id && isProjectManager()) {
                new_state.pm_required = false;
            }
        }

        if(!isAuthenticated() && key == 'contact_required' && typeof value == 'boolean') {
            if(value) {
                // Schedule a call
                new_state.has_more_info = false;
            } else {
                // request more info
                new_state.has_more_info = true;
            }
            shouldChangeStep = true;
        }

        this.setState(new_state);
        if(['type', 'scope', 'is_project', 'has_requirements', 'pm_required'].indexOf(key) > -1) {
            shouldChangeStep = true;
        }

        if(key == 'has_more_info' && value) {
            shouldChangeStep = true;
        }

        if(shouldChangeStep) {
            this.changeStep();
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        const { TaskActions, project } = this.props;
        const task = this.props.task || {};


        var req_data = {};
        req_data.title = this.refs.title?this.refs.title.value.trim():null;
        req_data.description = this.refs.description?this.refs.description.value.trim():null;
        req_data.stack_description = this.refs.stack_description?this.refs.stack_description.value.trim():null;
        req_data.deliverables = this.refs.deliverables?this.refs.deliverables.value.trim():null;

        req_data.type = this.state.type;
        req_data.scope = (!isAuthenticated() && !this.state.scope)?TASK_SCOPE_PROJECT:this.state.scope;

        req_data.has_requirements = this.state.has_requirements;
        req_data.pm_required = this.state.pm_required;
        req_data.contact_required = this.state.contact_required;

        req_data.coders_needed = this.state.coders_needed;
        req_data.billing_method = this.state.billing_method;
        req_data.fee = this.refs.fee?(this.refs.fee.value.trim() || null):null;
        req_data.deadline = this.state.deadline;

        req_data.url = this.refs.url?this.refs.url.value.trim():null;
        req_data.remarks = this.refs.remarks?this.refs.remarks.value.trim():null;

        req_data.skype_id = this.state.skype_id;
        req_data.email = this.refs.email?this.refs.email.value.trim():null;
        req_data.first_name = this.refs.first_name?this.refs.first_name.value.trim():null;
        req_data.last_name = this.refs.last_name?this.refs.last_name.value.trim():null;

        req_data.visibility = this.state.visibility;
        req_data.pm = this.state.pm;

        var schedule_id = this.state.schedule || null;
        var update_schedule = null;
        if(schedule_id) {
            update_schedule = this.state.schedule_map[schedule_id];
        }
        req_data = {...req_data, ...update_schedule};

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
        req_data.participation = participation;
        req_data.milestones = this.state.milestones;

        const selected_skills = this.state.skills;
        if(selected_skills) {
            req_data.skills = selected_skills.join(',');
        }
        const attachments = this.state.attachments;

        if(project && project.id) {
            req_data.parent = project.id;
        }

        if(this.state.schedule_call && this.state.schedule_call.day) {
            if(this.state.schedule_call.from) {
                req_data.schedule_call_start = `${this.state.schedule_call.day}T${this.state.schedule_call.from}Z`;
            }
            if(this.state.schedule_call.to) {
                req_data.schedule_call_end = `${this.state.schedule_call.day}T${this.state.schedule_call.to}Z`;
            }
        }

        var task_info = {};
        Object.keys(req_data).forEach(function (key) {
            const data_value = req_data[key];
            if(data_value || typeof data_value == 'boolean') {
                task_info[key] = data_value;
            }
        });

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
        const { Task, project, enabledWidgets, options, showSectionHeader } = this.props;
        const task = this.props.task || {};

        if(!isAuthenticated() && Task.detail.isSaved) {
            return (
                <div className="thank-you">
                    Awesome!<br/>
                    <i className="fa fa-check-circle"/>
                </div>
            );
        }

        let is_project_task = (project && project.id) || (task && task.parent);
        let is_project = this.state.scope != TASK_SCOPE_TASK;
        let work_type = (is_project)?'project':'task';

        if(isAuthenticated() && !getUser().can_contribute && !task.id && !isAdmin()) {
            return (
                <div>
                    {task.id?null:(
                        <h2>Post a new task</h2>
                    )}
                    <div className="alert alert-info">You need to complete your profile before you can post work</div>
                    <div>
                        <Link to="/profile" onClick={(e) => {e.preventDefault(); openProfileWizard()}}><i className="fa fa-arrow-right"/> Continue to your profile</Link>
                    </div>
                </div>
            );
        }

        const description = this.props.task?task.description:'';
        const stack_description = this.props.task?task.stack_description:'';
        const deliverables = this.props.task?task.deliverables:'';
        const remarks = this.props.task?task.remarks:'';
        const has_error = Task.detail.error.create || Task.detail.error.update;
        let canShowAll = (this.state.showAll || has_error) && !this.state.overrideErrors;

        let taskTypeComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.type)?
                    (<FieldError message={Task.detail.error.create.type}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.type)?
                    (<FieldError message={Task.detail.error.update.type}/>):null}
                <div className="btn-choices choice-fork three" role="group">
                    {TASK_TYPE_CHOICES.map(type => {
                        return (
                            <div className="choice">
                                <button key={type.id} type="button"
                                        className={"btn " + (this.state.type == type.id?' active':'')}
                                        onClick={this.onStateValueChange.bind(this, 'type', type.id)}>
                                    <i className={`icon ${type.icon}`}/>
                                </button>
                                <div>{type.name}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        );

        let taskScopeComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.scope)?
                    (<FieldError message={Task.detail.error.create.scope}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.scope)?
                    (<FieldError message={Task.detail.error.update.scope}/>):null}
                <div className="btn-choices choice-fork three" role="group">
                    {(isAuthenticated()?TASK_SCOPE_CHOICES:TASK_SCOPE_CHOICES_NEW_USER).map(scope_type => {
                        return (
                            <div className="choice">
                                <button key={scope_type.id} type="button"
                                        className={"btn" + (this.state.scope == scope_type.id?' active':'')}
                                        onClick={this.onStateValueChange.bind(this, 'scope', scope_type.id)}>
                                    <i className={`icon ${scope_type.icon}`}/>
                                </button>
                                <div dangerouslySetInnerHTML={{__html: scope_type.name}} />
                            </div>
                        )
                    })}
                </div>
            </div>
        );

        let hasRequirementsComp = (
            <div className="form-group">
                {(Task.detail.error.create && Task.detail.error.create.has_requirements)?
                    (<FieldError message={Task.detail.error.create.has_requirements}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.has_requirements)?
                    (<FieldError message={Task.detail.error.update.has_requirements}/>):null}
                <div className="btn-choices choice-fork" role="group">
                    {[
                        {id: true, name: 'Yes, and I would like to submit my project on Tunga now', icon: 'fa fa-check-circle'},
                        {id: false, name: 'No, I would like to talk to someone on Tunga about my project', icon: 'fa fa-times-circle'}
                    ].map(has_requirements => {
                        return (
                            <div className="choice">
                                <button key={has_requirements.id} type="button"
                                        className={"btn" + (this.state.has_requirements == has_requirements.id?' active':'')}
                                        onClick={this.onStateValueChange.bind(this, 'has_requirements', has_requirements.id)}>
                                    <i className={`icon ${has_requirements.icon}`}/>
                                </button>
                                <div dangerouslySetInnerHTML={{__html: has_requirements.name}} />
                            </div>
                        )
                    })}
                </div>
            </div>
        );

        let requiresPMComp = (
            <div className="form-group">
                {(Task.detail.error.create && Task.detail.error.create.pm_required)?
                    (<FieldError message={Task.detail.error.create.pm_required}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.pm_required)?
                    (<FieldError message={Task.detail.error.update.pm_required}/>):null}
                <div>
                    <div>
                        <div className="btn-choices" role="group">
                            {[
                                {id: true, name: 'Yes, I want a project manager', icon: 'fa fa-check-circle'},
                                {id: false, name: 'No, I will manage all processes for this project myself', icon: 'fa fa-times-circle'}
                            ].map(pm_options => {
                                return (
                                    <button key={pm_options.id} type="button"
                                            className={"btn" + (this.state.pm_required == pm_options.id?' active':'')}
                                            onClick={this.onStateValueChange.bind(this, 'pm_required', pm_options.id)}>
                                        <div dangerouslySetInnerHTML={{__html: pm_options.name}} />
                                    </button>
                                )
                            })}
                        </div>
                        <div className="form-group">
                            <div className="card">
                                <p>
                                    Responsibities that a project manager on Tunga takes on:<br/>
                                    - Assembling the team of developers<br/>
                                    - Making the plan for the project<br/>
                                    - Reporting progress of the project<br/>
                                    - Troubleshooting<br/>
                                    - Organizing (daily) standups<br/>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

        let requiresContactComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.contact_required)?
                    (<FieldError message={Task.detail.error.create.contact_required}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.contact_required)?
                    (<FieldError message={Task.detail.error.update.contact_required}/>):null}
                <div className="form-group">
                    <label className="control-label">How would you like to proceed?</label>
                    <div>
                        <div className="btn-choices" role="group">
                            {[
                                {id: true, name: 'Get me in touch with a project manager'},
                                {id: false, name: `Fill in more information${isAdmin()?'':' and get an estimate'}`}
                            ].map(contact_options => {
                                return (
                                    <button key={contact_options.id} type="button"
                                            className={"btn" + (this.state.contact_required == contact_options.id?' active':'')}
                                            onClick={this.onStateValueChange.bind(this, 'contact_required', contact_options.id)}>
                                        <div dangerouslySetInnerHTML={{__html: contact_options.name}} />
                                    </button>
                                )
                            })}
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
                    <div><input type="text" className="form-control" ref="title" required placeholder="Title" onChange={this.onInputChange.bind(this, 'title')} value={this.state.title}/></div>
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
                        isAuthenticated()?(
                            this.state.scope == TASK_SCOPE_ONGOING?'What kind of work do you have for developers':(
                                is_project?(
                                    this.state.has_requirements?'Goals of the project':'Describe the idea you have for the project'
                                ):`Description *`
                            )
                        ):'Description *'
                    }</label>
                    <textarea placeholder={`Description of the ${work_type}`}
                              className="form-control"
                              ref="description"
                              onChange={this.onInputChange.bind(this, 'description')}
                              value={this.state.description} required={!isAuthenticated()}>{this.state.description}</textarea>
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
                    <textarea placeholder="" className="form-control" ref="stack_description" onChange={this.onInputChange.bind(this, 'stack_description')} value={this.state.stack_description}></textarea>
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
                    <textarea placeholder="" className="form-control" ref="deliverables" onChange={this.onInputChange.bind(this, 'deliverables')} value={this.state.deliverables}></textarea>
                </div>
            </div>
        );

        let skillsComp = (
            <div className="form-group">
                {(Task.detail.error.create && Task.detail.error.create.skills)?
                    (<FieldError message={Task.detail.error.create.skills}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.skills)?
                    (<FieldError message={Task.detail.error.update.skills}/>):null}
                <div>
                    {(enabledWidgets && enabledWidgets.length) || canShowAll?(<label className="control-label">Tag skills or products that are relevant to this {work_type} {isAuthenticated()?'*':''}</label>):null}
                    <SkillSelector filter={{filter: null}}
                                   onChange={this.onSkillChange.bind(this)}
                                   skills={task.id || (this.state.skills && this.state.skills.length)?this.state.skills:[]}
                                   suggested={suggestTaskTypeSkills(this.state.type)['suggested']}
                                   showTitle={!((enabledWidgets && enabledWidgets.length) || canShowAll)}/>
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
                    <label className="control-label">What is your estimated budget for this {work_type}? - (optional)</label>
                    <div><input type="number" className="form-control" ref="fee" required={!is_project_task && isAuthenticated()} placeholder="Amount in Euros"  onChange={this.onInputChange.bind(this, 'fee')} value={this.state.fee?parseNumber(this.state.fee):''}/></div>
                    {this.state.fee?(
                        <div style={{marginTop: '10px'}}>Estimated Number of development hours: <span className="bold">{estimateDevHoursForFee(this.state.fee)} hr{this.state.fee?'s':''}</span></div>
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
                            <DateTimePicker ref="deadline"
                                            onChange={this.onDeadlineChange.bind(this)}
                                            defaultValue={task.deadline?(new Date(moment.utc(task.deadline).format())):null}
                                            value={this.state.deadline?new Date(moment.utc(this.state.deadline).format()):null}
                                            time={false}/>
                        </div>
                        <div>
                            <button type="button"
                                    className={"btn btn-grey " + (this.state.deadline === undefined?' active':'')}
                                    onClick={this.onStateValueChange.bind(this, 'deadline', this.state.deadline === undefined?null:undefined)}>I'm not sure
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );

        let filesComp = (
            <div className="form-group">
                <label className="control-label">{is_project?`Please upload relevant files for the ${work_type} (e.g functional requirements and/or wireframes)`:'Files'}</label>
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
                                        const tooltip = (<Tooltip id="tooltip"><strong>{milestone.title}</strong><br/>{milestone.due_at?moment.utc(milestone.due_at).local().format('Do, MMMM YYYY'):null}</Tooltip>);
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
                                                    {moment.utc(this.state.deadline).subtract(1, 'days').local().format('Do, MMMM YYYY')}
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

        let developersComp = (
            <div>
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
        );

        let pmComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.pm)?
                    (<FieldError message={Task.detail.error.create.pm}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.pm)?
                    (<FieldError message={Task.detail.error.update.pm}/>):null}
                <div className="form-group">
                    <label className="control-label">Project Manager</label>
                    <UserSelector filter={{type: USER_TYPE_PROJECT_MANAGER}}
                                  onChange={this.onPMChange.bind(this)}
                                  selected={task.pm?[task.pm]:[]}
                                  max={1}/>
                </div>
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
                            {developersComp}
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
                    <div><input type="text" className="form-control" ref="url" placeholder="URL e.g GitHub, GitLab, BitBucket issue link"  onChange={this.onInputChange.bind(this, 'url')} value={this.state.url}/></div>
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
                        <textarea placeholder={`Which files can you deliver in order to provide more details for this ${work_type}`} className="form-control" ref="remarks" onChange={this.onInputChange.bind(this, 'remarks')} value={this.state.remarks}></textarea>
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
                            {is_project?(
                                <button type="button"
                                        className={"btn " + (this.state.billing_method === undefined?' active':'')}
                                        onClick={this.onStateValueChange.bind(this, 'billing_method', this.state.deadline === undefined?null:undefined)}>I'm not sure
                                </button>
                            ):null}
                        </div>
                        {!is_project && this.state.billing_method == TASK_BILLING_METHOD_HOURLY?(
                            <div className="card">
                                Tunga offers fixed hourly fees ranging from &euro; 19 - &euro; 25 per hour.<br/>
                                The fee per developers will be presented when they apply for the task.
                            </div>
                        ):null}

                        {is_project?(
                            <div>
                                {this.state.billing_method == TASK_BILLING_METHOD_HOURLY?(
                                    <div className="card">
                                        Developers will make an estimate of the hours needed, but you will pay for the actual hours logged.<br/>
                                        Tunga offers fixed hourly fees ranging from &euro; 19 - &euro; 25 per hour.
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
                {!is_project && this.state.billing_method == TASK_BILLING_METHOD_FIXED?(feeComp):null}
            </div>
        );

        let skypeComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.skype_id)?
                    (<FieldError message={Task.detail.error.create.skype_id}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.skype_id)?
                    (<FieldError message={Task.detail.error.update.skype_id}/>):null}
                <div className="form-group">
                    <label className="control-label">Skype id</label>
                    <div className="row">
                        <div className="col-md-12">
                            <div>
                                <input type="text"
                                        className="form-control"
                                        ref="skype_id" placeholder="Your Skype ID"
                                        defaultValue={task.skype_id}
                                        onChange={this.onInputChange.bind(this, 'skype_id')}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

        let emailComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.email)?
                    (<FieldError message={Task.detail.error.create.email}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.email)?
                    (<FieldError message={Task.detail.error.update.email}/>):null}
                <div className="form-group">
                    <label className="control-label">E-mail address *</label>
                    <div><input type="email" name="email" className="form-control" ref="email" required placeholder="Email"  onChange={this.onInputChange.bind(this, 'email')} value={this.state.email}/></div>
                </div>
            </div>
        );

        let personalComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.first_name)?
                    (<FieldError message={Task.detail.error.create.first_name}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.first_name)?
                    (<FieldError message={Task.detail.error.update.first_name}/>):null}
                {(Task.detail.error.create && Task.detail.error.create.last_name)?
                    (<FieldError message={Task.detail.error.create.last_name}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.last_name)?
                    (<FieldError message={Task.detail.error.update.last_name}/>):null}
                <div className="form-group">
                    <label className="control-label">Name *</label>
                    <div className="row">
                        <div className="col-md-6">
                            <input type="text" name="first_name" className="form-control" ref="first_name" required placeholder="First Name"  onChange={this.onInputChange.bind(this, 'first_name')} value={this.state.first_name}/>
                        </div>
                        <div className="col-md-6">
                            <input type="text" name="last_name" className="form-control" ref="last_name" required placeholder="Last Name"  onChange={this.onInputChange.bind(this, 'last_name')} value={this.state.last_name}/>
                        </div>
                    </div>
                </div>
            </div>
        );

        let hasMoreInfoComp = (
            <div className="form-group">
                {(Task.detail.error.create && Task.detail.error.create.has_more_info)?
                    (<FieldError message={Task.detail.error.create.has_more_info}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.has_more_info)?
                    (<FieldError message={Task.detail.error.update.has_more_info}/>):null}
                <label className="control-label">Would you like to provide more information about your {work_type}?</label>
                <div className="btn-choices" role="group">
                    {[
                        {id: true, name: 'I have more information'}
                    ].map(has_more_info => {
                        return (
                            <button key={has_more_info.id} type="button"
                                    className={"btn" + (this.state.has_more_info == has_more_info.id?' active':'')}
                                    onClick={this.onStateValueChange.bind(this, 'has_more_info', !this.state.has_more_info)}>
                                {has_more_info.name}
                            </button>
                        )
                    })}
                </div>
            </div>
        );

        if(!isAuthenticated()) {
            hasMoreInfoComp = (
                <div>
                    {(Task.detail.error.create && Task.detail.error.create.contact_required)?
                        (<FieldError message={Task.detail.error.create.contact_required}/>):null}
                    {(Task.detail.error.update && Task.detail.error.update.contact_required)?
                        (<FieldError message={Task.detail.error.update.contact_required}/>):null}
                    <div className="form-group">
                        {this.state.skype_id?(
                            <div className="call-highlight">
                                <div className="text-center">
                                    <i className="icon tunga-icon-headphone"/><br/>
                                    <div className="skype-id">{this.state.skype_id}</div>
                                </div>
                            </div>
                        ):null}
                        <div className="text-center">
                            In a hurry? Schedule a call<br/>
                            Have some time? Provide more info to speed up the process!
                        </div>
                        <div>
                            <div className="btn-choices choice-fork xs two" role="group" style={{ maxWidth: '300px'}}>
                                {[
                                    {id: true, name: 'Schedule call', icon: 'tunga-icon-schedule'},
                                    {id: false, name: 'Speed up process', icon: 'tunga-icon-rocket'}
                                ].map(contact_options => {
                                    return (
                                    <div className="choice">
                                        <button key={contact_options.id} type="button"
                                                className={"btn" + (this.state.contact_required == contact_options.id?' active':'')}
                                                onClick={this.onStateValueChange.bind(this, 'contact_required', contact_options.id)}>
                                            <i className={`icon ${contact_options.icon}`}/>
                                        </button>
                                        <div dangerouslySetInnerHTML={{__html: contact_options.name}} />
                                    </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        let scheduleCallComp = (
            <div>
                {(Task.detail.error.create && Task.detail.error.create.schedule_call_start)?
                    (<FieldError message={Task.detail.error.create.schedule_call_start}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.schedule_call_start)?
                    (<FieldError message={Task.detail.error.update.schedule_call_start}/>):null}

                {(Task.detail.error.create && Task.detail.error.create.schedule_call_end)?
                    (<FieldError message={Task.detail.error.create.schedule_call_end}/>):null}
                {(Task.detail.error.update && Task.detail.error.update.schedule_call_end)?
                    (<FieldError message={Task.detail.error.update.schedule_call_end}/>):null}
                <div className="form-group">
                    <label className="control-label">When are you available for a call?</label>
                    <div>
                        <DateTimePicker ref="schedule_call_day"
                                        onChange={this.onScheduleChange.bind(this, 'day')}
                                        defaultValue={task.schedule_call_start?(new Date(moment.utc(task.schedule_call_start).format())):null}
                                        value={this.state.schedule_call.day?new Date(moment.utc(this.state.schedule_call.day).format()):null}
                                        time={false} min={new Date()} format="dddd, Do MMMM, YYYY"/>
                    </div>
                </div>

                <div className="form-group">
                    <div className="row">
                        <div className="col-md-6">
                            <label className="control-label">From:</label>
                            <DateTimePicker ref="schedule_call_from"
                                            onChange={this.onScheduleChange.bind(this, 'from')}
                                            defaultValue={task.schedule_call_start?(new Date(moment.utc(task.schedule_call_start).format('hh:mm:ss'))):null}
                                            value={this.state.schedule_call.from?new Date(moment.utc(`${moment().format('YYYY-MM-DD')}T${this.state.schedule_call.from}Z`).format()):null}
                                            calendar={false}/>
                        </div>
                        <div className="col-md-6">
                            <label className="control-label">To:</label>
                            <DateTimePicker ref="schedule_call_to"
                                            onChange={this.onScheduleChange.bind(this, 'to')}
                                            defaultValue={task.schedule_call_end?(new Date(moment.utc(task.schedule_call_end).format('hh:mm:ss'))):null}
                                            value={this.state.schedule_call.to?new Date(moment.utc(`${moment().format('YYYY-MM-DD')}T${this.state.schedule_call.to}Z`).format()):null}
                                            calendar={false}/>
                        </div>
                    </div>
                </div>
            </div>
        );

        if(isAuthenticated()) {
            if(enabledWidgets && enabledWidgets.length) {
                let widgetMap = {
                    title: titleComp,
                    description: descComp,
                    skills: skillsComp,
                    fee: feeComp,
                    billing: billingComp,
                    deadline: deadlineComp,
                    milestone: milestoneComp,
                    developers: developersComp,
                    deliverables: deliverablesComp,
                    stack: stackDescComp,
                    files: filesComp,
                    updates: updatesComp,
                    pm: pmComp
                };


                if(enabledWidgets[0] == 'complete-task') {
                    sections = [
                        {
                            title: `Basic details about the ${work_type}`,
                            items: [titleComp, descComp],
                            requires: ['title', 'description']
                        },
                        {
                            title: 'Task description',
                            items: [deliverablesComp, stackDescComp, filesComp]
                        },
                        {
                            title: 'Agreements',
                            items: [deadlineComp, feeComp],
                            requires: ['fee']
                        }
                    ];
                } else {
                    var all_comps = [];
                    enabledWidgets.forEach(function (widget) {
                        let comp = widgetMap[widget];
                        if(comp) {
                            all_comps.push(comp);
                        }
                    });

                    if(all_comps.length) {
                        sections = [
                            {
                                items: all_comps
                            }
                        ];
                    }
                }

            } else if(is_project_task) {
                sections = [
                    {
                        title: `Basic details about the ${work_type}`,
                        items: [titleComp, skillsComp],
                        requires: ['title', 'skills']
                    },
                    {
                        title: 'Task description',
                        items: [descComp],
                        requires: ['description']
                    },
                    {
                        title: 'Agreements',
                        items: [feeComp, deadlineComp],
                        requires: ['fee']
                    },
                    {
                        title: `Who would you like to see your ${work_type}?`,
                        items: [visibilityComp]
                    }
                ];
            } else if(this.state.scope == TASK_SCOPE_ONGOING) {
                sections = [
                    {
                        title: `Basic details about the ${work_type}`,
                        items: [codersComp, descComp],
                        requires: ['coders_needed']
                    },
                    {
                        title: 'The next step',
                        items: [skypeComp]
                    }
                ]
            } else {
                sections = [
                    {
                        title: `Tag skills or products that are relevant to this ${work_type}`,
                        items: [skillsComp],
                        requires: ['skills']
                    },
                    {
                        title: `Basic details about your ${work_type}`,
                        items: [titleComp],
                        requires: ['title']
                    }
                ];

                if(is_project) {
                    if(!isProjectManager()) {
                        sections = [
                            ...sections,
                            {
                                title: `Do you want a project manager for this ${work_type}?`,
                                items: [requiresPMComp],
                                required: true,
                                forks: ['pm_required']
                            }
                        ];
                    }

                    var stepComps = [];

                    if(this.state.pm_required) {
                        stepComps = [
                            requiresContactComp,
                            this.state.contact_required === null?null:(
                                this.state.contact_required?skypeComp:(
                                    <div>
                                        {descComp}
                                        {deliverablesComp}
                                        {filesComp}
                                    </div>
                                )
                            )
                        ];

                        sections = [
                            ...sections,
                            {
                                title: 'Project description',
                                items: stepComps,
                                forks: ['contact_required']
                            }
                        ];
                    } else {
                        sections = [
                            ...sections,
                            {
                                title: 'Project description',
                                items: [descComp, stackDescComp, deliverablesComp, filesComp]
                            }
                        ];
                    }

                    if(!this.state.pm_required || !this.state.contact_required) {
                        sections = [
                            ...sections,
                            {
                                title: 'Agreements',
                                items: [deadlineComp, billingComp]
                            }
                        ];
                    }

                    if(isAdmin() || isProjectManager()) {
                        sections = [
                            ...sections,
                            {
                                title: `Who would you like to see your ${work_type}?`,
                                items: [visibilityComp]
                            }
                        ];
                    }

                } else {
                    sections = [
                        ...sections,
                        {
                            title: 'Requirements',
                            items: [descComp, filesComp, codersComp]
                        },
                        {
                            title: 'Agreements',
                            items: [deadlineComp, billingComp]
                        },
                        {
                            title: `Who would you like to see your ${work_type}?`,
                            items: [visibilityComp]
                        }
                    ]
                }


            }

            if(!(enabledWidgets && enabledWidgets.length) && !task.id && !is_project_task && !canShowAll) {
                sections = [
                    {
                        title: 'What kind of work do you have?',
                        items: [taskTypeComp],
                        required: true,
                        forks: ['type']
                    },
                    {
                        title: 'Scope of your work',
                        items: [taskScopeComp],
                        required: true,
                        forks: ['scope']
                    },
                    ... sections
                ];
            }
        } else {
            sections = [];

            if(!canShowAll) {
                sections = [
                    ...sections,
                    {
                        title: "Let's launch your project",
                        items: [hasMoreInfoComp],
                        required: true
                    }
                ];
            }

            if(this.state.has_more_info) {
                sections = [
                    ...sections,
                    {
                        title: `Tag skills or products that are relevant to this ${work_type}`,
                        items: [skillsComp]
                    },
                    {
                        title: 'Additional information',
                        items: [deliverablesComp, stackDescComp, filesComp]
                    },
                    {
                        title: `Basic details about the ${work_type}`,
                        items: [descComp],
                        requires: ['description']
                    },
                    {
                        title: 'Additional information',
                        items:  [feeComp, deadlineComp],
                        requires: ['fee']
                    }
                ];
            }

            sections = [
                ...sections,
                {
                    title: 'Schedule Call',
                    items: [scheduleCallComp],
                    required: true
                }
            ];

            if(!canShowAll) {

                if(!options || !options.type) {
                    sections = [
                        {
                            title: 'What kind of project do you have?',
                            items: [taskTypeComp],
                            required: true,
                            forks: ['type']
                        },
                        ...sections
                    ];
                }
            }

            sections = [
                {
                    title: "Hire top African developers from Tunga!",
                    items: [personalComp, emailComp, skypeComp],
                    requires: ['first_name', 'last_name', 'email'],
                    action: 'Find me great developers'
                },
                ...sections
            ];
        }

        let current_section = sections[this.state.step-1];

        let showPrev = this.state.step > 1 && (current_section && !current_section.required && !canShowAll);
        let showNext = this.state.step < sections.length && (current_section && !current_section.required && !canShowAll);
        let showSubmit = this.state.step == sections.length || canShowAll;

        return (
            <div className="form-wrapper task-form">
                {this.renderModalContent()}
                {!isAuthenticated() || task.id || is_project_task?null:(
                    <h2 className="title text-center">Post work</h2>
                    )}

                {showSectionHeader && current_section && current_section.title && !canShowAll?(
                    <div className="section-title clearfix">
                        <h4 className="pull-left"
                            id={`task-wizard-title-step-${this.canShowFork('type')?getTaskTypeUrl(this.state.type):''}-${this.canShowFork('scope')?getScopeUrl(this.state.scope):''}-${typeof this.state.pm_required == 'boolean' && this.canShowFork('pm_required')?(this.state.pm_required?'pm':'nopm'):''}-${this.state.step}`}>{current_section.title}</h4>
                        <div className="slider pull-right">
                            {sections.map((section, idx) => {
                                return (
                                    <i className={`fa fa-circle${this.state.step == (idx+1)?'':'-o'}`}/>
                                )
                            })}
                        </div>
                    </div>
                ):null}

                <form onSubmit={this.handleSubmit.bind(this)} name="task" role="form" ref="task_form" className={canShowAll?'steps-all':null}>
                    <div className="form-group">
                        <FormStatus loading={Task.detail.isSaving}
                                    success={Task.detail.isSaved}
                                    message={'Task saved successfully'}
                                    error={Task.detail.error.create || Task.detail.error.update}
                                    errorMessage={Task.detail.error.create && Task.detail.error.create.form || Task.detail.error.update && Task.detail.error.update.form}/>
                    </div>

                    {sections.map((section, idx) => {
                        if(section.forks && this.state.step == idx+1) {
                            section.forks.forEach(function (fork) {
                                if(fork) {
                                    fork_position[fork] = this.state.step;
                                }
                            }, this);
                        }
                        return (
                            <div className={this.state.step == (idx+1) || canShowAll?'step':'sr-only'}>
                                {section.items.map(item => {
                                    return item;
                                })}
                            </div>
                        )
                    })}

                    {showPrev || showNext || showSubmit?(
                        <div className="nav text-center">
                            {showPrev?(
                                <button type="button" className="btn btn-alt nav-btn prev-btn pull-left" onClick={this.changeStep.bind(this, false, true)}>
                                    <i className="fa fa-chevron-left"/> Previous
                                </button>
                            ):null}
                            {showNext?(
                                <div className={current_section.action?'text-center':'pull-right'}>
                                    <button type="button"
                                            className={`btn ${current_section.action?'':'btn-alt nav-btn next-btn'}`}
                                            onClick={this.changeStep.bind(this, true)} disabled={!this.canSkip(current_section.required, current_section.requires)}>
                                        {current_section.action?current_section.action:(
                                            <span>{current_section && this.canSkip(current_section.required, current_section.requires)?'Next':'Skip'} <i className="fa fa-chevron-right"/></span>
                                        )}
                                    </button>
                                </div>
                            ):null}
                            {showSubmit?(
                                <div className="text-center">
                                    <button type="submit"
                                            onClick={this.showAll.bind(this)}
                                            className="btn"
                                            disabled={Task.detail.isSaving}>
                                        {this.state.scope == TASK_SCOPE_ONGOING || !isAuthenticated()?'Find me awesome developers':(
                                            `${task.id?'Update':'Publish'} ${is_project?'project':'task'}`
                                        )}
                                    </button>
                                </div>
                            ):null}
                        </div>
                    ):null}
                    <div className="clearfix"></div>
                </form>
            </div>

        );
    }
}


TaskForm.propTypes = {
    task: React.PropTypes.object,
    project: React.PropTypes.object,
    enabledWidgets: React.PropTypes.array,
    options: React.PropTypes.object,
    showSectionHeader: React.PropTypes.bool
};

TaskForm.defaultProps = {
    task: null,
    project: null,
    enabledWidgets: [],
    options: null,
    showSectionHeader: true
};

TaskForm.contextTypes = {
    router: React.PropTypes.object.isRequired
};
