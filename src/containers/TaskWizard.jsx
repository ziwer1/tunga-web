import React from 'react';
import Helmet from 'react-helmet';

import ShowcaseContainer from './ShowcaseContainer';

import TaskContainer from './TaskContainer';
import TaskForm from '../components/TaskForm';
import Avatar from '../components/Avatar';

import {getClientTestimonials} from '../constants/data';

export default class TaskWizard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: 'Hire top African developers from Tunga!', subtitle: null, step: 1
        };
    }

    onStepChange(step, idx, all_steps) {
        console.log('New step', step);

        this.setState({
            title: step && step.title?step.title:'Hire top African developers from Tunga!',
            subtitle: step && step.subtitle?step.subtitle:null,
            step: idx?idx+1:-1
        });
    }

    renderHeaderContent() {
        var testimonials = getClientTestimonials(2);
        const {options} = this.props;

        return (
            <div className={`task-wizard ${this.state.step == 1?'show-trust':''}`}>
                <div className="title-bar">
                    <div className="heading-3 text-center">{this.state.title}</div>
                    <div className="heading-1">{this.state.subtitle}</div>
                </div>
                <div className="task-section">
                    <TaskContainer>
                        <TaskForm showSectionHeader={false} options={options} onStepChange={this.onStepChange.bind(this)}/>
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

        return (
            <ShowcaseContainer className="task-wizard-page" headerContent={this.renderHeaderContent()}>
                <Helmet
                    title={meta_title}
                    meta={[
                        {name: "twitter:title", content: meta_title},
                        {property: "og:title", content: meta_title}
                    ]}
                />
            </ShowcaseContainer>
        );
    }
}
