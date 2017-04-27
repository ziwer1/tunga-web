import React from 'react';
import {Link} from 'react-router';
import YouTube from 'react-youtube';
import Helmet from 'react-helmet';
import Slider from 'react-slick';

import ShowcaseContainer from './ShowcaseContainer';
import ShowCaseFooter from './ShowCaseFooter';
import ComponentWithModal from '../components/ComponentWithModal';

import { showWizard, showCallWidget, openCalendlyWidget } from '../utils/router';
import { TESTIMONIALS } from '../constants/data';

import { sendGAEvent, GA_EVENT_CATEGORIES, GA_EVENT_ACTIONS, GA_EVENT_LABELS } from '../utils/tracking';

var canOpen = true;

export default class LandingPage extends ComponentWithModal {
    constructor(props) {
        super(props);
        this.state = {player: null, play: false};
    }

    componentDidMount() {
        if(showWizard(this.props.routes) && canOpen) {
            canOpen = false;
        }

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

        const dlp_phrase = this.getDLPPhrase();
        const dlp_tag = this.getDLPTag();
        const dlp_desc = this.getDLPDesc();

        return (
            <div>
                <div className="head-desc">
                    <h1>
                        Instant access to skilled <br/>
                        African {this.getDLPTag() || 'software'} {dlp_desc?dlp_desc.toLowerCase():'developers'}.
                    </h1>
                    <p className="details">
                        <span>Easy set up</span>
                        <span className="fa fa-circle"/>
                        <span>Free to connect with freelancers</span>
                        <span className="fa fa-circle"/>
                        <span>No cure no pay for tasks</span>
                    </p>
                    <div>
                        <Link to="/start/"
                                className="btn btn-callout">
                            {dlp_phrase?`Start hiring ${dlp_phrase}`:'Get Started'}
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
            <ShowcaseContainer className="landing-page" headerContent={this.renderHeaderContent()}
                               chatId={this.props.params?this.props.params.chatId:null}>
                <Helmet title="Tunga | Unlocking Africa's Tech talent potential."/>
                <section id="press">
                    <div className="container">
                        <h2 className="text-center">Featured press</h2>
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
                </section>
                <section id="how-it-works">
                    <div className="container">
                        <h2>How it works</h2>
                        <div className="row">
                            <div className="col-md-5">
                                <div className="workflow">
                                    <div className="step">
                                        <i className="icon tunga-icon-post-task"/>
                                        <h5>1. Post your work</h5>
                                    </div>

                                    <img src={require('../images/down-right.png')}/>

                                    <div className="step">
                                        <i className="icon tunga-icon-browse-developers"/>
                                        <h5>2. Select developers</h5>
                                    </div>

                                    <img src={require('../images/down-left.png')}/>

                                    <div className="step">
                                        <i className="icon tunga-icon-manage-tasks"/>
                                        <h5>3. Manage your work</h5>
                                    </div>

                                    <img src={require('../images/down-right.png')}/>

                                    <div className="step">
                                        <i className="icon tunga-icon-make-transaction"/>
                                        <h5>4. Pay your developers</h5>
                                    </div>

                                    <img src={require('../images/down-left.png')}/>

                                    <div className="step">
                                        <i className="icon tunga-icon-build-network"/>
                                        <h5>5. Increase your network</h5>
                                    </div>
                                </div>
                            </div>
                            <div id="demo-mbp" className="col-md-7">
                                <img src={require('../images/mbp.jpg')}/>
                            </div>
                        </div>
                        <div className="text-center">
                            <Link className="btn btn-callout how-it-works-btn" to="/how-it-works/">Find out more</Link>
                        </div>
                    </div>
                </section>
                <section id="clients-testmonial">
                    <div className="container">
                        <h2 className="text-center"><span className="bold">Testimonials</span> </h2>
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
                    </div>
                </section>
                <section id="what-we-can-do">
                    <div className="container">
                        <h2 className="text-center">What we can do</h2>
                        <div className="row">
                            <div className="col-sm-4" id="building-websites">
                                <span></span>
                                <p>Full stack capacity for web development available</p>
                            </div>
                            <div className="col-sm-4" id="solving-issues">
                                <span></span>
                                <p>Building custom service integrations and solving issues in your
                                    Github/Gitlab/Bitbucket workflow</p>
                            </div>
                            <div className="col-sm-4" id="full-stack">
                                <span></span>
                                <p>Scheduled progress reports from our developers for maximum overview</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-offset-1 col-sm-5" id="mobile-app">
                                <span></span>
                                <p>Mobile application developments & maintenance</p>
                            </div>
                            <div className="col-sm-5" id="html-slicing">
                                <span></span>
                                <p>HTML Slicing (PSD to HTML)</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="contact-us">
                    <div className="container text-center">
                        <p>Do you have a project or task and want to find out more?</p>
                        <button className="btn" onClick={this.onScheduleCall.bind(this)}>Schedule a call</button>
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
