import React from 'react';
import {Link} from 'react-router';
import YouTube from 'react-youtube';
import Helmet from 'react-helmet';
import Slider from 'react-slick';
import Reveal from 'react-reveal';

import ShowcaseContainer from '../containers/ShowcaseContainer';
import ShowCaseFooter from '../containers/ShowCaseFooter';
import ComponentWithModal from '../components/ComponentWithModal';

import { showWizard, showCallWidget, openCalendlyWidget } from '../utils/router';
import { TESTIMONIALS } from '../constants/data';

import { sendGAEvent, GA_EVENT_CATEGORIES, GA_EVENT_ACTIONS, GA_EVENT_LABELS } from '../utils/tracking';

const STEP_DETAILS = [
    {
        title: "1. Tell us what you need.",
        icon: 'tunga-icon-post-task'
    },
    {
        title: "2. Tunga matches developers with objectively verified skills.",
        icon: 'tunga-icon-browse-developers'
    },
    {
        title: "3. Developers start working in your workflow or set one up for you.",
        icon: 'tunga-icon-manage-tasks'
    },
    {
        title: "4. Get daily feedback reports on progress & quality.",
        icon: 'tunga-icon-build-network'
    },
    {
        title: "5. Effortless payments & invoice overview.",
        icon: 'tunga-icon-make-transaction'
    }
];

export default class LandingPage extends ComponentWithModal {
    constructor(props) {
        super(props);
        this.state = {player: null, play: false, step: 0};
    }

    componentDidMount() {
        if(showCallWidget(this.props.routes)) {
            openCalendlyWidget();
        }
    }

    onScheduleCall() {
        openCalendlyWidget();
    }

    onVideoReady(e) {
        var player = e.target;
        if(player) {
            this.setState({player: e.target});
        }
    }

    onPlayVideo() {
        this.setState({play: true});
        if (this.state.player) {
            this.state.player.playVideo();
            sendGAEvent(GA_EVENT_CATEGORIES.VIDEO, GA_EVENT_ACTIONS.PLAY, GA_EVENT_LABELS.INTRO_VIDEO);
        }
    }

    onPauseVideo() {
        sendGAEvent(GA_EVENT_CATEGORIES.VIDEO, GA_EVENT_ACTIONS.PAUSE, GA_EVENT_LABELS.INTRO_VIDEO);
    }

    onCloseVideo() {
        this.setState({play: false});
        if (this.state.player) {
            this.state.player.stopVideo();
        }
    }

    onChangeSliderStep(step) {
        this.setState({step});
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

    onRevealNumber(target) {
        $(document).ready(function () {
            var numAnim = new CountUp(target, 0, parseInt($('#'+target).html()));
            numAnim.start();
        });
    }

    renderHeaderContent() {

        const dlp_phrase = this.getDLPPhrase();
        const dlp_tag = this.getDLPTag();
        const dlp_desc = this.getDLPDesc();

        return (
            <div>
                <div className="head-desc">
                    <h1>
                        Software outsourcing done right.
                    </h1>
                    {/*<h3>
                        flexible access to top African {this.getDLPTag() || 'software'} {dlp_desc?dlp_desc.toLowerCase():'developers'}.
                    </h3>*/}
                    <p className="details">
                        <span>Verified skills matching</span>
                        <span className="fa fa-circle"/>
                        <span>Transcultural quality & communications system</span>
                        <span className="fa fa-circle"/>
                        <span>Impact sourcing</span>
                    </p>
                    <div>
                        <Link to="/start/"
                              className="btn btn-callout btn-main-cta">
                            <i className="fa fa-rocket fa-lg"/> {dlp_phrase?`Start hiring ${dlp_phrase}`:'Launch your project'}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        let slider_settings = {
            dots: true,arrows: true, infinite: true, slidesToShow: 3, slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            responsive: [
                { breakpoint: 320, settings: { slidesToShow: 1 } },
                { breakpoint: 768, settings: { slidesToShow: 2 } },
                { breakpoint: 1024, settings: { slidesToShow: 3 } }
            ]
        };

        return (
            <ShowcaseContainer className="landing-page"
                               headerContent={this.renderHeaderContent()}
                               headerVideo={true}
                               chatId={this.props.params?this.props.params.chatId:null}>
                <Helmet title="Tunga | Unlocking Africa's Tech talent potential."/>

                <section id="how-it-works">
                    <div className="container">
                        <div className="section-heading text-center">How it works</div>
                        <div className="step-slider five-sm clearfix">
                            <ul>
                                {STEP_DETAILS.map((step, idx) => {
                                    return (
                                        <li key={idx}>
                                            <a href="#"
                                               onClick={this.onChangeSliderStep.bind(this, idx)}
                                               onMouseOver={this.onChangeSliderStep.bind(this, idx)}
                                               className={`slide ${this.state.step == idx?"active":""} animated fadeInRight`}
                                               style={{animationDelay: `${idx}s`}}>
                                                <div className="icon">
                                                    <i className={step.icon}/>
                                                </div>
                                                <span dangerouslySetInnerHTML={{__html: step.title}}/>
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </section>

                <section id="platform-info">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-5">
                                <div className="workflow">
                                    <div className="step">
                                        <Reveal effect="animated fadeIn" onReveal={this.onRevealNumber.bind(this, "platform-devs")}>
                                            <div className="highlight" id="platform-devs">154</div>
                                            <div>developers</div>
                                        </Reveal>
                                    </div>

                                    <div className="step">
                                        <Reveal effect="animated fadeIn" onReveal={this.onRevealNumber.bind(this, "platform-skills")}>
                                            <div className="highlight" id="platform-skills">89</div>
                                            <div>different coding skills</div>
                                        </Reveal>
                                    </div>

                                    <div className="step">
                                        <Reveal effect="animated fadeIn" onReveal={this.onRevealNumber.bind(this, "platform-code")}>
                                            <div className="highlight" id="platform-code">349281</div>
                                            <div>lines of code written</div>
                                        </Reveal>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-7">
                                <YouTube
                                    videoId="RVVtyapBmuo"
                                    opts={{width: '100%'}}
                                    onReady={this.onVideoReady.bind(this)}
                                    onPause={this.onPauseVideo.bind(this)}
                                />
                            </div>
                        </div>
                    </div>
                </section>
                <section id="press">
                    <div className="container ">
                        <Reveal effect="animated fadeInLeft">
                            <div>
                                <div className="section-heading text-center">Tunga in the press</div>
                                <ul className="press-links">
                                    <li>
                                        <a href="http://www.bbc.co.uk/news/world-africa-38294998"
                                           target="_blank">
                                            <img src={require("../images/press/bbc.png")}/>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.youtube.com/watch?v=v9uRtYpZDQs" target="_blank">
                                            <img src={require("../images/press/campus-party.png")}/>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.oneworld.nl/startup-tunga-lanceert-pilot-programma-voor-nieuw-soort-freelance-platform"
                                           target="_blank">
                                            <img src={require("../images/press/OWlogo.png")}/>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="http://trendwatching.com/blog/featured-innovator-tunga/" target="_blank">
                                            <img src={require("../images/press/trend-watching.png")}/>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://soundcloud.com/african-tech-round-up/a-chat-with-ernesto-spruyt-of-tungaio?in=african-tech-round-up/sets/quick-chats"
                                           target="_blank">
                                            <img src={require("../images/press/African-Tech-Round-Up.png")}/>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="http://spendmatters.com/2016/04/01/tunga-wip-of-the-week/" target="_blank">
                                            <img src={require("../images/press/Spend-Matters.png")}/>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.nabc.nl/africa-business-news/5/technology/377/tunga-founder-ernesto-spruyt-we-create-21st-century-jobs-in-africa"
                                           target="_blank">
                                            <img src={require("../images/press/netherlands-african-business-council.png")}/>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </Reveal>
                    </div>
                </section>
                <section id="clients-testmonial">
                    <div className="container">
                        <div className="section-heading text-center">Testimonials</div>
                        <Slider className="testimonials-slider text-center" {...slider_settings}>
                            {TESTIMONIALS.map(testimonial => {
                                return (
                                    <div className="testimonial">
                                        <div className="body">
                                            <div>
                                                <i className="fa fa-quote-left pull-left"/>
                                                <span dangerouslySetInnerHTML={{__html: testimonial.message}}/>
                                                <i className="fa fa-quote-right pull-right"/>
                                            </div>
                                        </div>
                                        <div className="image" style={{backgroundImage: `url(${testimonial.image})`}} />
                                        <div className="author">{testimonial.name}</div>
                                        <div className="company">{testimonial.company}</div>
                                    </div>
                                );
                            })}
                        </Slider>
                        <div className="text-center"style={{marginTop: '40px'}}>
                            <button className="btn btn-callout" onClick={this.onScheduleCall.bind(this)}>Schedule call</button>
                        </div>
                    </div>
                </section>
                <section id="what-we-can-do">
                    <div className="container">
                        <Reveal effect="animated fadeIn">
                            <div>
                                <div className="section-heading text-center">What we can do</div>
                                <div className="row">
                                    <div className="col-sm-4" id="building-websites">
                                        <Reveal effect="animated rollIn">
                                            <span/>
                                        </Reveal>
                                        <p>
                                            Full stack capacity for web<br/>
                                            API development<br/>
                                            All popular JS frameworks capacity<br/>
                                            Backend development
                                        </p>
                                    </div>
                                    <div className="col-sm-4" id="solving-issues">
                                        <Reveal effect="animated rollIn">
                                            <span/>
                                        </Reveal>
                                        <p>
                                            Integrations with your current workflow<br/>
                                            Slack, Trello, Github, Drive etc.<br/>
                                            Or set up a custom workflow on Tunga<br/>
                                            <Link to="/start">Find out how this will work for you</Link>
                                        </p>
                                    </div>
                                    <div className="col-sm-4" id="full-stack">
                                        <Reveal effect="animated rollIn">
                                            <span/>
                                        </Reveal>
                                        <p>
                                            Excellent Project manager available<br/>
                                            Daily updates from developers<br/>
                                            Full overview of the progress<br/>
                                            <Link to="/start/">Start a project now</Link>
                                        </p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-offset-1 col-sm-5" id="mobile-app">
                                        <Reveal effect="animated rollIn">
                                            <span/>
                                        </Reveal>
                                        <p>
                                            Excellent native app development<br/>
                                            Specialized iOS and Android teams<br/>
                                            App maintenance and improvements<br/>
                                            From idea to application
                                        </p>
                                    </div>
                                    <div className="col-sm-5" id="html-slicing">
                                        <Reveal effect="animated rollIn">
                                            <span/>
                                        </Reveal>
                                        <p>
                                            Slicing experts on demand<br/>
                                            From PSD, Sketch or AI to webpage<br/>
                                            All popular CMS<br/>
                                            Ready within days
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>
                <section id="video-overlay" className={this.state.play?"on":""}>
                    <div className={`modal-backdrop fade in`}></div>
                    <div className="video-close">
                        <button className="btn btn-borderless"
                                title="Close"
                                onClick={this.onCloseVideo.bind(this)}>
                            <i className="fa fa-times fa-lg"/>
                        </button>
                    </div>
                    <div className="container">
                        <YouTube
                            videoId="FQHxc5VNs7A"
                            opts={{height: '80%', width: '100%'}}
                            onReady={this.onVideoReady.bind(this)}
                            onPause={this.onPauseVideo.bind(this)}
                        />
                    </div>
                </section>

                <ShowCaseFooter/>
            </ShowcaseContainer>
        );
    }
}
