import React from 'react';
import {Link} from 'react-router';
import Reveal from 'react-reveal';
import YouTube from 'react-youtube';

import ShowcaseContainer from '../containers/ShowcaseContainer';
import MetaTags from '../components/MetaTags';
import ShowCaseFooter from '../containers/ShowCaseFooter';
import {openCalendlyWidget} from '../utils/router';

const STEP_DETAILS = [
    {
        title: '1. Screening Portfolio',
        description:
            'The first thing that we do is screening the CV, references, recent projects of the applicant. If the experience of the developer meets our standard we invite them to a remote interview with one of our senior developers or project coordinators. During this interview, we assess their English proficiency level and communication skills.',
        icon: 'tunga-icon-soft-skills',
    },
    {
        title: '2. Soft skills',
        description:
            '                  When a developer has successfully passed the first stage of our program we assess our developers on several "soft skills". Such as communication skills, management of expectations, work ethics, stress management and time management. At Tunga, we believe that soft skills are as much or more important than software development skills.',
        icon: 'tunga-icon-coding-skills',
    },
    {
        title: '3. Coding Skills',
        description:
            'When a developer passed all our assessments he or she gets to work on a first project on Tunga. For the first couple of projects the developers work under the guidance of a senior Tunga developer to ensure great collaboration between you and the developer(s).',
        icon: 'tunga-icon-teamwork',
    },
    {
        title: '4. Guidance Program',
        description:
            'When a developer passed all our assessments he or she gets to work on the first project on Tunga. For the first couple of projects, the developers work under the guidance of a senior Tunga developer to ensure great collaboration between you and the developer(s) and that all our developer produce top notch products.',
        icon: 'tunga-icon-teamwork',
    },
];

export default class QualityPage extends React.Component {
    renderHeaderContent() {
        return (
            <div id="quality-header">
                <h1>Our quality assurance program</h1>
                <p id="sub-heading">
                    We thoroughly select the brightest developers from the
                    African continent. Tunga nourishes and constantly <br />{' '}
                    improve our community of developers by providing them with
                    the tools and guidance they <br />need to be even more
                    successful.
                </p>
                <p>
                    <a
                        onClick={this.onScheduleCall.bind(this)}
                        className="btn btn-callout">
                        Schedule a call
                    </a>
                </p>
            </div>
        );
    }

    onScheduleCall() {
        openCalendlyWidget();
    }

    render() {
        let meta_title = 'Tunga | Quality';
        let meta_description = 'Our quality assurance program';

        return (
            <ShowcaseContainer
                className="quality-page"
                headerContent={this.renderHeaderContent()}>
                <MetaTags title={meta_title} description={meta_description} />

                <div className="content">
                    <section id="select-devs-section">
                        <div className="container">
                            <div className="section-heading text-center">
                                How we select the best developers
                                <hr className="under-line" />
                            </div>
                        </div>
                    </section>

                    <section id="new-quality-guide">
                        <div className="container">
                            <div className="step clearfix">
                                <div className="step-icon">
                                    <i className="tunga-icon-cv-alt" />
                                </div>
                                <div className="step-body">
                                    <div className="number">1</div>
                                    <h1>Screening Portfolio</h1>
                                    <div>
                                        The first thing that we do is screening
                                        the CV, references, recent projects of
                                        the applicant. If the experience of the
                                        developer meets our standard we invite
                                        them to a remote interview with one of
                                        our senior developers or project
                                        coordinators. During this interview, we
                                        assess their English proficiency level
                                        and communication skills.
                                    </div>
                                </div>
                                <div className="dot-connector">
                                    <img
                                        src={require('../images/icons/dot_curve1.png')}
                                        alt=""
                                    />
                                </div>
                            </div>

                            <div className="step clearfix">
                                <div className="step-icon">
                                    <i className="tunga-icon-soft-skills" />
                                </div>
                                <div className="step-body">
                                    <div className="number">2</div>
                                    <h1>Soft skills</h1>
                                    <div>
                                        When a developer has successfully passed
                                        the first stage of our program we assess
                                        our developers on several "soft skills".
                                        Such as communication skills, management
                                        of expectations, work ethics, stress
                                        management and time management. At
                                        Tunga, we believe that soft skills are
                                        as much or more important than software
                                        development skills.
                                    </div>
                                </div>
                                <div className="dot-connector">
                                    <img
                                        src={require('../images/icons/dot_curve2.png')}
                                        alt=""
                                    />
                                </div>
                            </div>

                            <div className="step clearfix">
                                <div className="step-icon">
                                    <i className="tunga-icon-coding-skills" />
                                </div>
                                <div className="step-body">
                                    <div className="number">3</div>
                                    <h1>Coding skills</h1>
                                    <div>
                                        When the developer has passed our soft
                                        skills assessment we thoroughly test
                                        their coding skills. We do this in
                                        several ways: reviewing recent projects,
                                        online coding tests, and in depth Skype
                                        interviews. Only the brightest
                                        developers are selected to go to the
                                        next stage of our program.
                                    </div>
                                </div>
                                <div className="dot-connector">
                                    <img
                                        src={require('../images/icons/dot_curve1.png')}
                                        alt=""
                                    />
                                </div>
                            </div>

                            <div className="step clearfix">
                                <div className="step-icon">
                                    <i className="tunga-icon-teamwork" />
                                </div>
                                <div className="step-body">
                                    <div className="number">4</div>
                                    <h1>Guidance program</h1>
                                    <div>
                                        When a developer passed all our
                                        assessments he or she gets to work on
                                        the first project on Tunga. For the
                                        first couple of projects, the developers
                                        work under the guidance of a senior
                                        Tunga developer to ensure great
                                        collaboration between you and the
                                        developer(s) and that all our developer
                                        produce top notch products.
                                    </div>
                                </div>
                            </div>

                            {/* <div className="text-center">
                <Link to="/start/" className="btn btn-callout btn-main-cta">
                  <i className="tunga-icon-rocket fa-lg" /> Get me started!
                </Link>
              </div> */}
                        </div>
                    </section>

                    <section id="press">
                        <div className="container ">
                            <Reveal effect="animated fadeInLeft">
                                <div>
                                    <ul className="press-links">
                                        <li>
                                            <a
                                                href="http://www.bbc.co.uk/news/world-africa-38294998"
                                                target="_blank">
                                                <img
                                                    src={require('../images/press/bbc.png')}
                                                />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://www.youtube.com/watch?v=v9uRtYpZDQs"
                                                target="_blank">
                                                <img
                                                    src={require('../images/press/campus-party.png')}
                                                />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://www.oneworld.nl/startup-tunga-lanceert-pilot-programma-voor-nieuw-soort-freelance-platform"
                                                target="_blank">
                                                <img
                                                    src={require('../images/press/OWlogo.png')}
                                                />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="http://trendwatching.com/blog/featured-innovator-tunga/"
                                                target="_blank">
                                                <img
                                                    src={require('../images/press/trend-watching.png')}
                                                />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://soundcloud.com/african-tech-round-up/a-chat-with-ernesto-spruyt-of-tungaio?in=african-tech-round-up/sets/quick-chats"
                                                target="_blank">
                                                <img
                                                    src={require('../images/press/African-Tech-Round-Up.png')}
                                                />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="http://spendmatters.com/2016/04/01/tunga-wip-of-the-week/"
                                                target="_blank">
                                                <img
                                                    src={require('../images/press/Spend-Matters.png')}
                                                />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="https://www.nabc.nl/africa-business-news/5/technology/377/tunga-founder-ernesto-spruyt-we-create-21st-century-jobs-in-africa"
                                                target="_blank">
                                                <img
                                                    src={require('../images/press/netherlands-african-business-council.png')}
                                                />
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </Reveal>
                        </div>
                    </section>
                    <section className="quality-cv">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="career">
                                        <p className="text-center">
                                            <img
                                                src="http://placehold.it/76x80"
                                                className="img-circle "
                                            />
                                        </p>
                                        <p className="text-center">
                                            <b>Acellam Guy</b>
                                        </p>
                                        <p className="text-center">
                                            Kampala, Uganda
                                        </p>
                                        <p className="">
                                            Lorem ipsum dolor sit amet,
                                            consectetur adipiscing elit, sed do
                                            eiusmod tempor incididunt ut labore
                                            et dolore magna aliqua. Ut enim ad
                                            minim veniam, quis nostrud
                                            exercitation
                                        </p>
                                        <p>
                                            <a className="btn">.NET</a>
                                            <a className="btn">Android</a>
                                            <a className="btn">AngularJS</a>
                                        </p>
                                        <p>
                                            <a className="btn">CakePHP</a>
                                            <a className="btn">Codeigniter</a>
                                            <a className="btn">ExpressJS</a>
                                        </p>
                                        <p className="text-center">
                                            <b>
                                                <a href="">View full profile</a>
                                            </b>
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="career">
                                        <p className="text-center">
                                            <img
                                                src="http://placehold.it/76x80"
                                                className="img-circle "
                                            />
                                        </p>
                                        <p className="text-center">
                                            <b>Example Developer</b>
                                        </p>
                                        <p className="text-center">
                                            Kampala, Uganda
                                        </p>
                                        <p className="">
                                            Lorem ipsum dolor sit amet,
                                            consectetur adipiscing elit, sed do
                                            eiusmod tempor incididunt ut labore
                                            et dolore magna aliqua. Ut enim ad
                                            minim veniam, quis nostrud
                                            exercitation
                                        </p>
                                        <p>
                                            <a className="btn">.NET</a>
                                            <a className="btn">Android</a>
                                            <a className="btn">AngularJS</a>
                                        </p>
                                        <p>
                                            <a className="btn">CakePHP</a>
                                            <a className="btn">Codeigniter</a>
                                            <a className="btn">ExpressJS</a>
                                        </p>
                                        <p className="text-center">
                                            <b>
                                                <a href="">View full profile</a>
                                            </b>
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="career">
                                        <p className="text-center">
                                            <img
                                                src="http://placehold.it/76x80"
                                                className="img-circle "
                                            />
                                        </p>
                                        <p className="text-center">
                                            <b>Enock Emudde</b>
                                        </p>
                                        <p className="text-center">
                                            Kampala, Uganda
                                        </p>
                                        <p className="">
                                            Lorem ipsum dolor sit amet,
                                            consectetur adipiscing elit, sed do
                                            eiusmod tempor incididunt ut labore
                                            et dolore magna aliqua. Ut enim ad
                                            minim veniam, quis nostrud
                                            exercitation
                                        </p>
                                        <p>
                                            <a className="btn">.NET</a>
                                            <a className="btn">Android</a>
                                            <a className="btn">AngularJS</a>
                                        </p>
                                        <p>
                                            <a className="btn">CakePHP</a>
                                            <a className="btn">Codeigniter</a>
                                            <a className="btn">ExpressJS</a>
                                        </p>
                                        <p className="text-center">
                                            <b>
                                                <a href="">View full profile</a>
                                            </b>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div className="container reach-us">
                            <div className="row">
                                <p className="text-center find-us">
                                    <b>Where to find us</b>
                                </p>
                                <hr className="under-line" />
                                <div className="col-md-6">
                                    <div className="address-info">
                                        <p>Kampala office:</p>
                                        <p>
                                            Design Hub Kampala, 5th Street,
                                            Industrial Area, Kampala, Uganda
                                        </p>
                                    </div>
                                    <div className="address-info">
                                        <p>Amsterdam office:</p>
                                        <p>
                                            The Collab, Wibautstraat 131, 1091
                                            GL Amsterdam, The Netherlands
                                        </p>
                                    </div>
                                    <div className="address-info">
                                        <p>Lagos office:</p>
                                        <p>
                                            Address, Street, postal code, Lagos,
                                            Nigeria
                                        </p>
                                    </div>
                                    <div className="address-info">
                                        <p style={{color: '#ee1f54'}}>
                                            hello@tunga.io
                                        </p>
                                        <p>
                                            <a
                                                className="btn"
                                                onClick={this.onScheduleCall.bind(
                                                    this,
                                                )}>
                                                Schedule a call with us{' '}
                                            </a>
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <form role="form" className="email-form">
                                        <input
                                            className="form-control"
                                            name="sender_name"
                                            type="text"
                                            placeholder="Bart leijssenaar"
                                        />
                                        <input
                                            className="form-control"
                                            name="sender_email"
                                            type="email"
                                            placeholder="Your email address"
                                        />
                                        <textarea
                                            className="form-control"
                                            name="sender_msg"
                                            type="text"
                                            rows="4"
                                            placeholder="Type your message here"
                                        />
                                        <button
                                            type="submit"
                                            className="btn pull-right">
                                            {' '}
                                            Send
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <ShowCaseFooter />
            </ShowcaseContainer>
        );
    }
}
