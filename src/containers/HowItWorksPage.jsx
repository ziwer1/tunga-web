import React from 'react';
import {Link} from 'react-router';
import Helmet from 'react-helmet';

import ShowcaseContainer from './ShowcaseContainer';

const STEP_DETAILS = [
    {
        title: "<span class='bold'>1. Post</span><br/>your work",
        description: <div>Use our <Link to='/start'>wizard</Link> to submit you software need. Our developers and project managers will get back to you soon with a match with great developers.</div>,
        icon: 'tunga-icon-post-task'
    },
    {
        title: "<span class='bold'>2. Select</span><br/> developers",
        description: "Select a developer or a team of developers to work on your software project.",
        icon: 'tunga-icon-browse-developers'
    },
    {
        title: "<span class='bold'>3. Manage</span><br/>your work",
        description: "Tunga offers a wide range of integrations (e.g Github, Slack, Trello) that allows you to easily set up a workflow or allow you to intregate your existing workflow.",
        icon: 'tunga-icon-manage-tasks'
    },
    {
        title: "<span class='bold'>4. Pay</span><br/>your developers",
        description: "Pay only for approved work done. Fast, cheap and easy. Get your invoices on the fly.",
        icon: 'tunga-icon-make-transaction'
    },
    {
        title: "<span class='bold'>5. Increase</span><br/>your network",
        description: "Increase you network of coders for all your future software needs.",
        icon: 'tunga-icon-build-network'
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
            </div>
        );
    }

    onChangeSliderStep(step) {
        this.setState({step});
    }

    render() {
        let meta_title = "Tunga | How Tunga works";

        return (
            <ShowcaseContainer className="how-it-works-page" headerContent={this.renderHeaderContent()}>
                <Helmet
                    title={meta_title}
                    meta={[
                        {name: "twitter:title", content: meta_title},
                        {property: "og:title", content: meta_title}
                    ]}
                />

                <div className="content">
                    <section>
                        <div className="container">
                            <div className="step-slider five clearfix">
                                <ul>
                                    {STEP_DETAILS.map((step, idx) => {
                                        return (
                                            <li key={idx}>
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
                                <div className="description">
                                    {STEP_DETAILS[this.state.step].description}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </ShowcaseContainer>
        );
    }
}

