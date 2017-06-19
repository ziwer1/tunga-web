import React from 'react';

import TaskContainer from '../containers/TaskContainer';
import TaskDetailContainer from '../containers/TaskDetailContainer';
import TaskForm from '../components/TaskForm';
import LandingPage from '../routes/LandingPage';

import {getEditToken} from '../utils/tasks';

export default class TaskWizardLander extends LandingPage {

    constructor(props) {
        super(props);
        this.state = {
            title: (
                <span>
                    Discuss your project within<br/>
                    24 hours!
                </span>
            ), subtitle: null, step: 1,
            pageClass: 'task-wizard-page lander', showVideo: false
        };
    }

    onStepChange(step, idx, all_steps) {
        this.setState({
            title: step && step.title?step.title:'',
            subtitle: step && step.subtitle?step.subtitle:null,
            step: idx?idx+1:-1
        });
    }

    getTaskId() {
        if(this.props.params) {
            return this.props.params.taskId;
        }
        return null;
    }

    getPhase() {
        if(this.props.params) {
            return this.props.params.phase;
        }
        return null;
    }

    getDLPTag() {
        const { location } = this.props;
        if(location && location.query.dlp_tag) {
            return location.query.dlp_tag;
        }
        return null;
    }

    getDLPDesc() {
        const { location } = this.props;
        if(location && location.query.dlp_desc) {
            return location.query.dlp_desc;
        }
        return null;
    }

    getDLPPhrase() {
        const tag = this.getDLPTag();
        const desc = this.getDLPDesc();
        if(tag || desc) {
            return `${this.getDLPTag() || 'software'} ${this.getDLPDesc() || 'developers'}`;
        }
        return null;
    }

    renderHeaderContent() {
        const {options} = this.props;
        const dlp_phrase = this.getDLPPhrase();
        const dlp_tag = this.getDLPTag();
        const dlp_desc = this.getDLPDesc();

        let phase = this.getPhase();
        if(['schedule', 'speed-up'].indexOf(phase) == -1) {
            phase = '';
        }

        return (
            <div className="row">
                <div className="col-sm-6 col-md-8">
                    <div className="pitch">
                        <h1>
                            Software outsourcing<br/>
                            done right.
                        </h1>
                        <h3>
                            Work with verified developers with total<br/>
                            control over progress and workflow.
                        </h3>
                    </div>
                </div>
                <div className="col-sm-6 col-md-4">
                    <div className="task-wizard">
                        <div className="task-section">
                            {this.state.step == 1 && !this.getTaskId()?(
                                <h2 className="">
                                    Discuss your project within<br/>
                                    24 hours!
                                </h2>
                            ):(
                                <div className="heading-3 text-center">{this.state.title}</div>
                            )}
                            <TaskContainer>
                                <TaskDetailContainer taskId={this.getTaskId()} editToken={getEditToken()}>
                                    <TaskForm showSectionHeader={false}
                                              options={options}
                                              onStepChange={this.onStepChange.bind(this)}
                                              urlPrefix="welcome"
                                              ctaTxt="Get me started!"
                                              ctaIcon="tunga-icon-rocket fa-lg"
                                              phase={phase}/>
                                </TaskDetailContainer>
                            </TaskContainer>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                </div>
            </div>
        );
    }
}
