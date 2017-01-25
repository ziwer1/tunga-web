import React from 'react';
import moment from 'moment';
import Progress from './status/Progress';
import UserCardProfile from './UserCardProfile';
import ComponentWithModal from './ComponentWithModal';
import LargeModal from './ModalLarge';
import confirm from '../utils/confirm';

export default class ApplicationList extends ComponentWithModal {

    constructor(props) {
        super(props);
        this.state = {application: null, modalStep: 'select', close_applications: false};
    }

    componentDidMount() {
        const { TaskActions, Task } = this.props;
        TaskActions.listApplications({task: Task.detail.task.id, responded: 'False'});
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.Task.detail.applications.isSaved && !prevProps.Task.detail.applications.isSaved) {
            const { Task } = this.props;
            if(this.state.application) {
                this.setState({
                    application: Task.detail.applications.items[this.state.application.id],
                    modalStep: 'confirm'
                });
            }
        }
    }

    handleCloseApplications() {
        const { TaskActions, Task } = this.props;
        confirm('Confirm close applications').then(
            function () {
                TaskActions.updateTask(Task.detail.task.id, {apply: false, apply_closed_at: moment.utc().format()});
            }
        );
    }

    handleOpenApplications() {
        const { TaskActions, Task } = this.props;
        TaskActions.updateTask(Task.detail.task.id, {apply: true, apply_closed_at: null});
    }

    handleSelectDeveloper(application, accepted=false) {
        this.setState({application, modalStep: 'select', close_applications: false});
        this.open();
    }

    handleAcceptApplication(close_applications) {
        const { TaskActions, task } = this.props;
        var assignee = !task.assignee;
        this.setState({close_applications});
        const application = this.state.application;
        TaskActions.updateApplication(application.id, {accepted: true, responded: true});
        TaskActions.updateTask(application.task, {apply: !close_applications, participation: [{user: application.user.id, assignee, accepted: true, responded: true}]});
    }

    handleRejectApplication(application) {
        const { TaskActions } = this.props;
        confirm(`Decline ${application.user.display_name}'s application`).then(
            function () {
                TaskActions.updateApplication(application.id, {accepted: false, responded: true});
            }
        );
    }

    renderModalContent() {
        const { TaskActions, Task, Auth } = this.props;
        const { task } = Task.detail;
        return (
            <div>
                <LargeModal title="Developer Section" bsStyle="md"
                            show={this.state.showModal} onHide={this.close.bind(this)} bsStyle="modal-md">
                    {this.state.application?(
                    <div>
                        {this.state.modalStep == 'select'?(
                        <div>
                            Would you like to work with one developer or create a team for this task?
                            <div className="popup-actions">
                                <button type="button" className="btn"
                                        onClick={this.handleAcceptApplication.bind(this, true)}>
                                    Select {this.state.application.details.user.display_name} and close applications</button>
                                <button type="button" className="btn"
                                        onClick={this.handleAcceptApplication.bind(this, false)}>
                                    Add more developers and create a team for this task</button>
                            </div>
                        </div>
                            ):null}
                        {this.state.modalStep == 'confirm'?(
                        <div>
                            {this.state.application.details.user.display_name} {this.state.close_applications?`received a confirmation of your selection. ${this.state.application.details.user.first_name} now has access to the task page and will contact you soon.`:'has been added to the team'}
                            <div className="popup-actions">
                                <button type="button" className="btn" onClick={this.close.bind(this)}>{this.state.close_applications?'Go to task page':'Select other developers'}</button>
                            </div>
                        </div>
                            ):null}
                    </div>
                        ):null}
                </LargeModal>
            </div>
        );
    }

    render() {
        const { Task } = this.props;
        const { task, applications } =  Task.detail;

        var milestone_summary = '';
        if(task.milestones) {
            milestone_summary = task.milestones.map(milestone => {
                return milestone.title;
            }).join(', ');
        }

        return (
            <div>
                {this.renderModalContent()}
                {Task.detail.isRetrieving || Task.detail.applications.isRetrieving?
                    (<Progress/>)
                    :
                    (<div>
                        <div className="nav-top-filter pull-right">
                            {task.apply?(
                                <button type="button" className="btn " onClick={this.handleCloseApplications.bind(this)}>Close applications</button>
                            ):(
                                <button type="button" className="btn " onClick={this.handleOpenApplications.bind(this)}>Open applications</button>
                            )}
                        </div>
                        <div className="row">
                            {applications.ids.map((id) => {
                                const application = applications.items[id];
                                const { user } =  application.details;
                                return(
                                <div className="col-xs-12" key={id}>
                                    <div className={"card application-card" + ((application.responded && !application.accepted)?' rejected':'')}>
                                        {task.closed || application.responded?null:(
                                        <div className="actions pull-right">
                                            <div>
                                                <button type="button" className="btn btn-block "
                                                        onClick={this.handleSelectDeveloper.bind(this, application, true)}>
                                                    Select developer</button>
                                            </div>
                                            <div>
                                                <button type="button" className="btn btn-block "
                                                        onClick={this.handleRejectApplication.bind(this, application)}>
                                                    Decline application</button>
                                            </div>
                                        </div>
                                            )}
                                        <UserCardProfile user={user}/>
                                        {user.profile && user.profile.skills.length?(
                                        <div>
                                            <p className="title">Skillset</p>
                                            {user.profile.skills.map(skill => {
                                                return skill.name;
                                                }).join(', ')}
                                        </div>
                                            ):null}
                                        <div>
                                            {application.pitch?(
                                            <div>
                                                <p className="title">Motivation</p>
                                                <div className="description" dangerouslySetInnerHTML={{__html: application.pitch}}/>
                                            </div>
                                                ):null}
                                            {application.hours_needed?(
                                            <div>
                                                <p className="title">Workload</p>
                                                <div>{application.details.user.first_name} estimates {application.hours_needed} hours for this task</div>
                                            </div>
                                                ):null}
                                            {application.deliver_at?(
                                            <div>
                                                <p className="title">Delivery Date</p>
                                                {moment.utc(application.deliver_at).local().format('dddd, Do MMMM, YYYY')}
                                            </div>
                                                ):null}
                                            <div>
                                                <p className="title">Agreements</p>
                                                <div>{application.details.user.first_name} has agreed to the deadline {task.update_interval || task.milestones.length?(
                                                    (task.update_interval?((task.milestones.length?', ':' and ')+'update preferences'):'')+
                                                        (task.milestones.length?` and milestones (${milestone_summary})`:'')
                                                    ):null} you've set for this task</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    )
                                })}
                        </div>
                        {applications.ids.length?null:(
                        <div className="alert alert-info">No applications</div>
                            )}
                    </div>)
                    }
            </div>
        );
    }
}
