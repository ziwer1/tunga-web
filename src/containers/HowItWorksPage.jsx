import React from 'react';
import Helmet from 'react-helmet';

import ShowcaseContainer from './ShowcaseContainer';
import EmailLoginWidget from '../components/EmailLoginWidget';

const STEP_DETAILS = [
    {
        title: "<span class='bold'>1. Browse</span><br/>Developers",
        description: "Browsing and connecting with developers and managing your network is always free!",
        icon: 'tunga-icon-browse-developers'
    },
    {
        title: "<span class='bold'>2. Build a</span><br/> Network",
        description: "Make long-term connections with programmers have the skills you need",
        icon: 'tunga-icon-build-network'
    },
    {
        title: "<span class='bold'>3. Post a</span><br/>Task",
        description: "Post a task to developers and receive responses",
        icon: 'tunga-icon-post-task'
    },
    {
        title: "<span class='bold'>4. Manage</span><br/>Tasks",
        description: "Work with your existing tools (e.g Slack, GitHub, JIRA). Get daily progress updates.",
        icon: 'tunga-icon-manage-tasks'
    },
    {
        title: "<span class='bold'>5. Finalize</span><br/>Transaction",
        description: "Pay only for approved work done. Fast, cheap and easy. Get your invoices on the fly.",
        icon: 'tunga-icon-make-transaction'
    }
];

export default class HowItWorksPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {step: 0};
    }

    renderHeaderContent() {
        return (
            <div>
                <h1>
                    Hire a software developer <br/>
                    in 5 easy steps.
                </h1>
                <div style={{margin: "60px 0 30px 0"}}>
                    <EmailLoginWidget/>
                </div>
            </div>
        );
    }

    onChangeSliderStep(step) {
        this.setState({step});
    }

    render() {
        return (
            <ShowcaseContainer className="how-it-works-page" headerContent={this.renderHeaderContent()}>
                <Helmet title="Tunga | How Tunga works" />
                <div className="content">
                    <section>
                        <div className="container">
                            <div className="step-slider five">
                                <ul>
                                    {STEP_DETAILS.map((step, idx) => {
                                        return (
                                            <li>
                                                <a href="#"
                                                   onClick={this.onChangeSliderStep.bind(this, idx)}
                                                   onMouseOver={this.onChangeSliderStep.bind(this, idx)}
                                                   className={`slide ${this.state.step == idx?"active":""}`}>
                                                    <span dangerouslySetInnerHTML={{__html: step.title}}/>
                                                    <div className="icon">
                                                        <i className={step.icon}/>
                                                    </div>
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                                <div className="description" dangerouslySetInnerHTML={{__html: STEP_DETAILS[this.state.step].description}}/>
                            </div>
                        </div>
                    </section>
                </div>
            </ShowcaseContainer>
        );
    }
}

