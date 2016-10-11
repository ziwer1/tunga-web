import React from 'react';
import { Link } from 'react-router';
import YouTube from 'react-youtube';
import Helmet from 'react-helmet';

import ShowcaseContainer from './ShowcaseContainer';

export default class LandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {player: null};
    }

    componentDidMount() {
        $(document).ready(function(){
            $('.testimonials-slider').slick({
                dots: true,
                arrows: true,
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 1
            });
        });
    }

    onVideoReady(e) {
        this.setState({player: e.target});
    }

    playIntroVideo(e) {
        e.preventDefault();
        $(e.target).parent('#watch-our-video').addClass('on');
        if(this.state.player) {
            this.state.player.playVideo();
        }
    }

    renderHeaderContent() {
        return (
            <div className="head-desc">
                <h1>Unlocking Africa's Tech talent potential.</h1>
                <p>
                    Tunga is a market network that allows you to build a flexible team of skilled African software programmers,
                    that you can mobilize on-demand.
                </p>
                <Link className="btn btn-lg" to="/signup/project-owner" id="btn-publish">TRY NOW</Link>
            </div>
        );
    }

    render() {
        return (
            <ShowcaseContainer className="landing-page" headerContent={this.renderHeaderContent()} chatId={this.props.params?this.props.params.channelId:null}>
                <Helmet title="Tunga | Unlocking Africa's Tech talent potential." />
                <section id="how-it-works" className="row">
                    <div className="container">
                        <content className="col-md-5 row">
                            <h2><span className="bold">How</span> it works</h2>
                            <ol>
                                <span id="invite-icon"></span>
                                <li>
                                    <h5>INVITE TEAM MEMBERS</h5>
                                    <p>Select and invite coder to join your team on Tunga. This team can be mobilized flexibly to your workflow when you are in need of coding expertise.</p>
                                </li>
                                <span id="publish-icon"></span>
                                <li>
                                    <h5>PUBLISH TASKS</h5>
                                    <p>Relevant developers will apply to your task. You can select which developer(s) you want for the task. Collaborations with multiple developers are possible!</p>
                                </li>
                                <span id="work-icon"></span>
                                <li>
                                    <h5>WORK AS USUAL</h5>
                                    <p>The developers will be hooked to your usual workflow. We can work with multiple git workflow tools.</p>
                                </li>
                            </ol>
                        </content>
                        <div id="demo-mbp" className="col-md-7">
                        </div>
                    </div>
                </section>
                {/*<section id="clients-testmonial">
                    <div className="container">
                        <h2><span className="bold">Clients</span> testimonials</h2>
                        <div className="testimonials-slider text-center">
                            {_.range(1,6).map(x => {
                                return (
                                    <div>
                                        <p className="testimonial-body">Just then her head struck against the roof of the hall: in fact she was now more than nine feet high, and she at once took up the little golden key and hurried off to the garden door.</p>
                                        <img src={require("../images/devs/David.jpg")} className="img-circle" />
                                        <span className="author">JOHN SMITH</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>*/}
                <section id="watch-our-video">
                    <a id="play-btn" href="#"  onClick={this.playIntroVideo.bind(this)}>
                        <span>WATCH OUR VIDEO</span>
                    </a>
                    <YouTube
                        videoId="FQHxc5VNs7A"
                        opts={{height: '100%', width: '80%'}}
                        onReady={this.onVideoReady.bind(this)}
                    />
                </section>
                <section id="what-we-can-do">
                    <div className="container">
                        <h2><span className="bold">What</span> we can do</h2>
                        <div className="row">
                            <div className="col-sm-4" id="building-websites">
                                <span></span>
                                <p>Building & Improving Websites</p>
                            </div>
                            <div className="col-sm-4" id="solving-issues">
                                <span></span>
                                <p>Solving Issues (e.g Bug Fixes) in Github/Gitlab/Bitbucket</p>
                            </div>
                            <div className="col-sm-4" id="full-stack">
                                <span></span>
                                <p>Full Stack Capacity Available</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4" id="mobile-app">
                                <span></span>
                                <p>Contributing to (Mobile) Application Development & Maintenance</p>
                            </div>
                            <div className="col-sm-4" id="html-slicing">
                                <span></span>
                                <p>HTML Slicing (PSD to HTML)</p>
                            </div>
                            <div className="col-sm-4" id="php">
                                <span></span>
                                <p>PHP, Python, Ruby, C, Django, JavaScript, Java</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="meet-our-developers" className="row">
                    <div className="container">
                        <h2><span className="bold">Meet</span> our developers</h2>
                        <p>Tunga works with a vetted community of coders with proven and tested skills. To control costs, you pay per result and not per hour. Tunga also works with private repositories and our developers can sign an NDA if required. Meet some of them here:</p>
                        <div className="row" id="our-devs">
                            <div className="col-xs-6 col-sm-4 col-md-3"><Link to="/signup"><img src={require("../images/devs/Emunot.jpg")} className="img-responsive"/></Link></div>
                            <div className="col-xs-6 col-sm-4 col-md-3"><Link to="/signup"><img src={require("../images/devs/Adeline.jpg")} className="img-responsive"/></Link></div>
                            <div className="col-xs-6 col-sm-4 col-md-3"><Link to="/signup"><img src={require("../images/devs/Joe.jpg")} className="img-responsive"/></Link></div>
                            <div className="col-xs-6 col-sm-4 col-md-3"><Link to="/signup"><img src={require("../images/devs/Jonathan.jpg")} className="img-responsive"/></Link></div>
                            <div className="col-xs-6 col-sm-4 col-md-3"><Link to="/signup"><img src={require("../images/devs/Kenneth.jpg")} className="img-responsive"/></Link></div>
                            <div className="col-xs-6 col-sm-4 col-md-3"><Link to="/signup"><img src={require("../images/devs/Ronald.jpg")} className="img-responsive"/></Link></div>
                            <div className="col-xs-6 col-sm-4 col-md-3"><Link to="/signup"><img src={require("../images/devs/Roy.jpg")} className="img-responsive"/></Link></div>
                            <div className="col-xs-6 col-sm-4 col-md-3"><Link to="/signup"><img src={require("../images/devs/David.jpg")} className="img-responsive"/></Link></div>
                        </div>
                        <div className="row text-center"><Link to="/signup" className="btn " id="join-btn">JOIN OUR TEAM</Link></div>
                    </div>
                </section>
                <section id="contact-us">
                    <div className="container text-center">
                        <p>Want to find out more?<br/>Create an account and check out our platform.</p>
                        <h3>It's free!</h3>
                        <a href="mailto:bart@tunga.io" className="btn">CONTACT US</a>
                    </div>
                </section>
            </ShowcaseContainer>
        );
    }
}
