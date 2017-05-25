import React from 'react';
import Helmet from 'react-helmet';

import ShowcaseContainer from '../containers/ShowcaseContainer';

const STEP_DETAILS = [
    {
        title: "1. Soft skills",
        description: "We assess our developers on several \"soft skills\". Such as communication skills, management of expectations, work ethics, stress mangement and Time management. At Tunga we believe that soft skills are as much or more important than development skills",
        icon: 'tunga-icon-soft-skills',
        image: require('../images/icons/softskills.png')
    },
    {
        title: "2. Coding skills",
        description: "When the developer passed our soft skills assesment we thoroughly test their coding skills. We do this in several ways: Checking recent projects, coding tests and Skype interviews. We only select the best developers to go to the next stage of our program.",
        icon: 'tunga-icon-coding-skills'
    },
    {
        title: "3. Learning on the job",
        description: "When a developer passed all our assessments he or she gets to work on a first project on Tunga. For the first couple of projects the developers work work under the guidance of a senior Tunga developer to ensure great collobaration between you and the developer(s).",
        //icon: 'tunga-icon-teamwork',
        image: require('../images/icons/teamwork.png')
    }
];

export default class QualityPage extends React.Component {

    renderHeaderContent() {
        return (
            <div>
                <h1>
                    Our quality assurance<br/>
                    program
                </h1>
            </div>
        );
    }

    render() {
        let meta_title = "Tunga | Quality";
        let meta_description = "Our quality assurance program";

        return (
            <ShowcaseContainer className="how-it-works-page" headerContent={this.renderHeaderContent()}>
                <Helmet
                    title={meta_title}
                    meta={[
                        {name: "description",content: meta_description},
                        {name: "twitter:title", content: meta_title},
                        {property: "og:title", content: meta_title}
                    ]}
                />

                <section>
                    <div className="container">
                        <div className="step-slider three clearfix">
                            <ul>
                                {STEP_DETAILS.map((step, idx) => {
                                    return (
                                        <li key={idx}>
                                            <div className="slide animated slideInRight"
                                                 style={{animationDelay: `${idx}s`}}>
                                                <div className="title" dangerouslySetInnerHTML={{__html: step.title}}/>
                                                <div className="icon">
                                                    {step.icon?(
                                                        <i className={step.icon}/>
                                                    ):(
                                                        <img src={step.image}/>
                                                    )}
                                                </div>
                                                <div className="description" dangerouslySetInnerHTML={{__html: step.description}}/>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </section>
            </ShowcaseContainer>
        );
    }
}

