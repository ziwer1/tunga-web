import React from 'react';

import ShowcaseContainer from '../containers/ShowcaseContainer';

import TaskContainer from '../containers/TaskContainer';
import TaskDetailContainer from '../containers/TaskDetailContainer';
import TaskForm from '../components/TaskForm';
import Avatar from '../components/Avatar';
import MetaTags from "../components/MetaTags";

import {getClientTestimonials} from '../constants/data';
import {getEditToken} from '../utils/tasks';

export default class TaskWizard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'Hire top African developers!', subtitle: null, step: 1
        };
    }

    onStepChange(step, idx, all_steps) {
        this.setState({
            title: step && step.title?step.title:'Hire top African developers!',
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

    renderHeaderContent() {
        var testimonials = getClientTestimonials(2);
        const {options} = this.props;

        return (
            <div className={`task-wizard ${this.state.step == 1?'show-trust':''}`}>
                <div className="title-bar">
                    <i className="icon tunga-icon-post-task"/>
                    <div className="heading-3 text-center">{this.state.title}</div>
                    <div className="heading-1">{this.state.subtitle}</div>
                </div>
                <div className="task-section">
                    <TaskContainer>
                        <TaskDetailContainer taskId={this.getTaskId()} editToken={getEditToken()}>
                            <TaskForm showSectionHeader={false} options={options} onStepChange={this.onStepChange.bind(this)}/>
                        </TaskDetailContainer>
                    </TaskContainer>
                </div>
                <div className="dev-section">
                    <div className="dev-list">
                        {testimonials.map(testimonial => {
                            return (
                                <div className="card">
                                    <div className="media">
                                        <div className="media-left">
                                            <Avatar src={testimonial.image} size="medium"/>
                                        </div>
                                        <div className="media-body">
                                            <div className="media-heading"><strong>{testimonial.name} from {testimonial.company}</strong></div>
                                            <div>
                                                <i className="fa fa-quote-left pull-left"/>
                                                <span dangerouslySetInnerHTML={{__html: testimonial.message}}/>
                                                <i className="fa fa-quote-right pull-right"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="clearfix"></div>
            </div>
        );
    }

    render() {
        let meta_title = "Tunga | Get Started";
        let meta_description = "Hire top African developers!";

        return (
            <ShowcaseContainer className="task-wizard-page" headerContent={this.renderHeaderContent()}>
                <MetaTags title={meta_title} description={meta_description}/>
            </ShowcaseContainer>
        );
    }
}
