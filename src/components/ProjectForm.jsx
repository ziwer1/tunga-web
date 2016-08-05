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

export default class ProjectForm extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {deadline: null, description: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const project = this.props.project || {};
        if(project.id) {
            const description = project.description || '';
            this.setState({description});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.Project.detail.isSaved && !prevProps.Project.detail.isSaved) {
            const { Project } = this.props;
            if(!this.props.project) {
                this.refs.project_form.reset();
                this.setState({deadline: null, description: ''});
                if(this.props.onSuccess) {
                    this.props.onSuccess(Project.detail.project);
                } else {
                    const { router } = this.context;
                    router.replace('/project/'+ Project.detail.project.id);
                }
            }
        }
    }

    onDeadlineChange(date) {
        this.setState({deadline: moment(date).utc().format()});
    }

    onDescriptionChange(e) {
        this.setState({description: e.target.getContent()});
    }

    handleSubmit(e) {
        e.preventDefault();
        var title = this.refs.title.value.trim();
        var description = this.state.description;
        var deadline = this.state.deadline;

        const { ProjectActions } = this.props;
        const project = this.props.project || {};

        const project_info = {title, description, deadline};
        if(project.id) {
            ProjectActions.updateProject(project.id, project_info);
        } else {
            ProjectActions.createProject(project_info);
        }
        return;
    }

    render() {
        const { Project } = this.props;
        const project = this.props.project || {};
        const description = this.props.project?project.description:'';

        return (
            <div>
                {project.id || this.props.hide_title?null:(
                <h3 className="title">Create a project</h3>
                    )}
                <form onSubmit={this.handleSubmit} name="project" role="form" ref="project_form">
                    <FormStatus loading={Project.detail.isSaving}
                                success={Project.detail.isSaved}
                                message={'Project saved successfully'}
                                error={Project.detail.error.create || Project.detail.error.update}/>

                    {(Project.detail.error.create && Project.detail.error.create.title)?
                        (<FieldError message={Project.detail.error.create.title}/>):null}
                    {(Project.detail.error.update && Project.detail.error.update.title)?
                        (<FieldError message={Project.detail.error.update.title}/>):null}
                    <div className="form-group">
                        <label className="control-label">Project title *</label>
                        <div><input type="text" className="form-control" ref="title" required placeholder="Title" defaultValue={project.title}/></div>
                    </div>

                    {(Project.detail.error.create && Project.detail.error.create.description)?
                        (<FieldError message={Project.detail.error.create.description}/>):null}
                    {(Project.detail.error.update && Project.detail.error.update.description)?
                        (<FieldError message={Project.detail.error.update.description}/>):null}
                    <div className="form-group">
                        <label className="control-label">Project description</label>
                        <TinyMCE
                            content={description}
                            config={TINY_MCE_CONFIG}
                            onChange={this.onDescriptionChange.bind(this)}/>
                    </div>

                    {(Project.detail.error.create && Project.detail.error.create.deadline)?
                        (<FieldError message={Project.detail.error.create.deadline}/>):null}
                    {(Project.detail.error.update && Project.detail.error.update.deadline)?
                        (<FieldError message={Project.detail.error.update.deadline}/>):null}
                    <div className="form-group">
                        <label className="control-label">Deadline</label>
                        <DateTimePicker ref="deadline" onChange={this.onDeadlineChange.bind(this)} />
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn  " disabled={Project.detail.isSaving}>{project.id?'Update project':'Create project'}</button>
                    </div>
                    <div className="clearfix"></div>
                </form>
            </div>

        );
    }
}
