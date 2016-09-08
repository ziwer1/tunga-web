import React from 'react';
import { Link } from 'react-router';
import Progress from './status/Progress';
import FormStatus from './status/FormStatus';
import ComponentWithModal from './ComponentWithModal';

import { SOCIAL_LOGIN_URLS, INTEGRATION_TYPE_CHOICES, INTEGRATION_TYPE_REPO, INTEGRATION_TYPE_ISSUE, INTEGRATION_EVENT_CHOICES, INTEGRATION_EVENT_ISSUE_COMMENT } from '../constants/Api';

export default class IntegrationList extends ComponentWithModal {

    constructor(props) {
        super(props);
        this.state = {integration_type: INTEGRATION_TYPE_REPO, events: [], repo: null, issue: null};
    }

    componentDidMount() {
        const { TaskActions, Task, Auth } = this.props;
        const { task, integrations } =  Task.detail;
        if(!Auth.code.repos.ids.length) {
            TaskActions.listRepos('github');
        }

        if(!Auth.code.issues.ids.length) {
            TaskActions.listIssues('github');
        }

        TaskActions.retrieveTaskIntegration(task.id, 'github');
        const { integration } =  integrations;
        var events = [];
        var integration_type = INTEGRATION_TYPE_REPO;
        if(integration.id) {
            events = [...integration.events];
            integration_type = integration.type;
        }
        this.setState({integration_type, events});
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.Task.detail.integrations.isSaved && !prevProps.Task.detail.integrations.isSaved &&
            this.props.Task.detail.integrations.integration.id != prevProps.Task.detail.integrations.integration.id) {
            const { Task } = this.props;
            const { task, integrations } =  Task.detail;
            const { integration } =  integrations;
            var events = [];
            var integration_type = INTEGRATION_TYPE_REPO;
            if(integration.id) {
                events = [...integration.events];
                integration_type = integration.type;
            }
            this.setState({integration_type, events});
        }
    }

    onIntegrationTypeChange(integration_type) {
        this.setState({integration_type});
    }

    onRepoChange(e) {
        let id = e.target.value;
        var repo = null;
        if(id) {
            const { code } = this.props.Auth;
            repo = code.repos.items[id];
        }
        this.setState({repo, issue: null});
    }

    onIssueChange(e) {
        let id = e.target.value;
        var issue = null;
        var repo = null;
        if(id) {
            const { code } = this.props.Auth;
            issue = code.issues.items[id];
            repo = issue['repository'];
        }
        this.setState({repo, issue});
    }

    onEventChange(e) {
        let event = e.target.value;
        let idx = this.state.events.indexOf(event);
        var new_events = [...this.state.events];
        if(e.target.checked && idx == -1) {
            new_events.push(event);
        } else if(!e.target.checked && idx > -1) {
            new_events = [...new_events.slice(0, idx), ...new_events.slice(idx+1)]
        }
        this.setState({events: new_events});
    }

    handleSubmit(e) {
        e.preventDefault();
        var type = this.state.integration_type;
        var events = this.state.events;
        var repo = this.state.repo;
        var issue = this.state.issue;
        const { Task, TaskActions } = this.props;
        const { task } =  Task.detail;
        TaskActions.createTaskIntegration(task.id, 'github', {type, events, repo, issue});
    }

    render() {
        const { Task, Auth } = this.props;
        const { task, integrations } =  Task.detail;
        const { integration } =  integrations;
        const { code } =  Auth;

        return (
            <div>
                <ul className="nav nav-pills nav-top-filter">
                    <li role="presentation"><Link to={`/task/${task.id}/integrations/github`} activeClassName="active">GitHub</Link></li>
                </ul>
                {Task.detail.isRetrieving || Task.detail.integrations.isRetrieving || Auth.code.repos.isFetching || Auth.code.issues.isFetching?
                    (<Progress/>)
                    :
                    (<div>
                        {code.isConnected?(
                            <form onSubmit={this.handleSubmit.bind(this)} name="task" role="form" ref="integration_form">

                                <FormStatus loading={Task.detail.integrations.isSaving}
                                            success={Task.detail.integrations.isSaved}
                                            message={'Integration saved successfully'}
                                            error={Task.detail.integrations.error.create}/>

                                <div className="form-group">
                                    <label className="control-label">Integration type *</label>
                                    <div>
                                        <div className="btn-group btn-choices select" role="group" aria-label="integration type">
                                            {INTEGRATION_TYPE_CHOICES.map(integration_type => {
                                                return (
                                                    <button key={integration_type.id} type="button"
                                                            className={"btn " + (this.state.integration_type == integration_type.id?' active':'')}
                                                            onClick={this.onIntegrationTypeChange.bind(this, integration_type.id)}>{integration_type.name}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {this.state.integration_type == INTEGRATION_TYPE_REPO?(
                                    <div className="form-group">
                                        <label className="control-label">Repository *</label>
                                        <div>
                                            <select type="text" className="form-control" ref="repo"
                                                    onChange={this.onRepoChange.bind(this)}
                                                    defaultValue={integration.repo_id}>
                                                <option value=''>-- Select a repo  --</option>
                                                {code.repos.ids.map((id) => {
                                                    let repo = code.repos.items[id];
                                                    return (<option key={repo.id} value={repo.id}>{repo.name}</option>);
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                ):null}

                                {this.state.integration_type == INTEGRATION_TYPE_ISSUE?(
                                    <div className="form-group">
                                        <label className="control-label">Issue *</label>
                                        <div>
                                            <select type="text" className="form-control" ref="issue"
                                                    onChange={this.onIssueChange.bind(this)}
                                                    defaultValue={integration.issue_id}>
                                                <option value=''>-- Select an issue  --</option>
                                                {code.issues.ids.map((id) => {
                                                    let issue = code.issues.items[id];
                                                    return (<option key={issue.id} value={issue.id}>{issue.title}</option>);
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                ):null}

                                <div className="form-group">
                                    <label className="control-label">Events *</label>
                                    {INTEGRATION_EVENT_CHOICES.map(event => {
                                        if(this.state.integration_type == INTEGRATION_TYPE_ISSUE && event.id != INTEGRATION_EVENT_ISSUE_COMMENT) {
                                            return null;
                                        }
                                        return (
                                            <div key={event.id} className="checkbox">
                                                <label className="control-label">
                                                    <input type="checkbox" value={event.id} onChange={this.onEventChange.bind(this)} checked={this.state.events.indexOf(event.id) > -1}/>
                                                    {event.name}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn  " disabled={Task.detail.integrations.isSaving}>Save Integration</button>
                                </div>
                            </form>
                        ):(
                            <div>
                                <div className="card" style={{maxWidth: '500px'}}>
                                    Connect your task to a GitHub repository or issue to show GitHub activity (e.g comments, pull requests, push events) in your task activity stream.
                                </div>
                                <a href={SOCIAL_LOGIN_URLS.github + `?action=connect&next=/task/${task.id}/integrations/github`}
                                   className="btn " title="Connect with GitHub"
                                   style={{color: '#333', background: '#fff none', borderColor: "#333"}}>
                                    <i className="fa fa-github-square fa-lg"/> Connect with GitHub
                                </a>
                            </div>
                        )}
                    </div>)
                    }
            </div>
        );
    }
}
