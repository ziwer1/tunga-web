import React from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import YouTube from 'react-youtube'

import * as UtilityActions from '../actions/UtilityActions'
import Success from '../components/status/Success'
import Error from '../components/status/Error'

class LandingPage extends React.Component {
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

            $('#head-wrapper').css('height', $('#main-header').height()+'px');
        });

        $(window).resize(function() {
            $('#head-wrapper').css('height', $('#main-header').height()+'px');
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.Utility.contact.isSent && !prevProps.Utility.contact.isSent) {
            this.refs.contact_form.reset();
        }
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

    sendEmail(e) {
        e.preventDefault();
        const email = this.refs.email.value.trim();
        const { UtilityActions } = this.props;
        UtilityActions.sendContactRequest({email});
    }

    render() {
        const { Utility } = this.props;

        return (
            <div id="landing-page">
                <header id="main-header">
                    <div id="head-wrapper">
                        <nav className="navbar">
                            <div className="container">
                                <div className="navbar-header">
                                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#tunga-navbar" aria-expanded="false" aria-controls="navbar">
                                        <span className="sr-only">Toggle navigation</span>
                                        <i className="fa fa-ellipsis-v fa-lg"></i>
                                    </button>
                                    <a className="navbar-brand" href="#"><img src={require('../images/tunga-newlogo-small.png')} /></a>
                                </div>

                                <div className="collapse navbar-collapse" id="tunga-navbar">
                                    <ul className="nav navbar-nav navbar-right nav-actions">
                                        <li><Link to="/signup" className="join">JOIN</Link></li>
                                        <li><Link to="/signin" className="login">LOGIN</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                        <div className="container">
                            <div className="col-md-8 col-md-offset-1 row" id="head-desc">
                                <h1>Have top African coders work on your software tasks within minutes.</h1>
                                <p className="col-md-12 row"><span className="col-md-7 row">Tunga is a market network that allows you to build a flexible team of skilled African software programmers, that you can mobilize on-demand</span></p>
                                <Link className="btn " to="/signup" id="btn-publish">TRY NOW</Link>
                            </div>
                        </div>
                    </div>
                </header>

                <section id="how-it-works" className="row">
                    <div className="container">
                        <content className="col-md-5 row">
                            <h2><span className="h2-bold">How</span> it works</h2>
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
                {/*<section id="clients-testmonial" className="row">
                    <div className="container">
                        <h2><span className="h2-bold">Clients</span> testimonials</h2>
                        <div className="testimonials-slider text-center">
                            <div>
                                <p className="testimonial-body">Just then her head struck against the roof of the hall: in fact she was now more than nine feet high, and she at once took up the little golden key and hurried off to the garden door.</p>
                                <img src="images/devs/daniel_portrait.jpg" className="img-circle" />
                                <span className="author">JOHN SMITH</span>
                            </div>
                            <div>
                                <p className="testimonial-body">Just then her head struck against the roof of the hall: in fact she was now more than nine feet high, and she at once took up the little golden key and hurried off to the garden door.</p>
                                <img src="images/devs/daniel_portrait.jpg" className="img-circle" />
                                <span className="author">JOHN SMITH</span>
                            </div>
                            <div>
                                <p className="testimonial-body">Just then her head struck against the roof of the hall: in fact she was now more than nine feet high, and she at once took up the little golden key and hurried off to the garden door.</p>
                                <img src="images/devs/daniel_portrait.jpg" className="img-circle" />
                                <span className="author">JOHN SMITH</span>
                            </div>
                            <div>
                                <p className="testimonial-body">Just then her head struck against the roof of the hall: in fact she was now more than nine feet high, and she at once took up the little golden key and hurried off to the garden door.</p>
                                <img src="images/devs/daniel_portrait.jpg" className="img-circle" />
                                <span className="author">JOHN SMITH</span>
                            </div>
                            <div>
                                <p className="testimonial-body">Just then her head struck against the roof of the hall: in fact she was now more than nine feet high, and she at once took up the little golden key and hurried off to the garden door.</p>
                                <img src="images/devs/daniel_portrait.jpg" className="img-circle" />
                                <span className="author">JOHN SMITH</span>
                            </div>
                            <div>
                                <p className="testimonial-body">Just then her head struck against the roof of the hall: in fact she was now more than nine feet high, and she at once took up the little golden key and hurried off to the garden door.</p>
                                <img src="images/devs/daniel_portrait.jpg" className="img-circle" />
                                <span className="author">JOHN SMITH</span>
                            </div>
                        </div>
                    </div>
                </section>*/}
                <section id="watch-our-video" className="row">
                    <img src={require("../images/video.png")} />
                    <a id="play-btn" href="#"  onClick={this.playIntroVideo.bind(this)}>
                        <span>WATCH OUR VIDEO</span>
                    </a>
                    <YouTube
                        videoId="FQHxc5VNs7A"
                        opts={{height: '100%', width: '80%'}}
                        onReady={this.onVideoReady.bind(this)}
                    />
                    {/*<iframe width="80%" height="100%" src="https://www.youtube.com/embed/FQHxc5VNs7A?enablejsapi=1" frameBorder="0" allowFullScreen id="learn-video"></iframe>*/}
                </section>
                <section id="what-we-can-do" className="row">
                    <div className="container">
                        <h2><span className="h2-bold">What</span> we can do</h2>
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
                        <h2><span className="h2-bold">Meet</span> our developers</h2>
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
                <section id="contact-us" className="row">
                    <div className="container text-center">
                        <p className="text-center">Want to find out more?<br/>Create an account and check out our platform.</p>
                        <h3>It's free!</h3>
                        <a href="mailto:bart@tunga.io" className="btn ">CONTACT US</a>
                    </div>
                </section>
                <footer className="row" id="main-footer">
                    <div className="container">
                        <div className="col-sm-3" id="social">
                            <div id="tunga-logo-btm"><img src={require("../images/logo.png")}/></div>
                            <div id="social-networks">
                                <a target="_blank" href="https://www.facebook.com/tunga.io" id="fb"><i className="fa fa-facebook"></i></a>
                                <a target="_blank" href="https://twitter.com/tunga_io" id="twitter"><i className="fa fa-twitter"></i></a>
                                {/*<a target="_blank" href="#" id="g-plus"><i className="fa fa-google-plus"></i></a>
                                <a target="_blank" href="#" id="instagram"><i className="fa fa-instagram"></i></a>*/}
                            </div>
                        </div>
                        <div className="col-sm-4" id="contact-info">
                            <h4>CONTACT INFORMATION</h4>
                            <p><i className="fa fa-map-marker"></i> Ms van Riemsdijkweg 57, 1033RC Amsterdam, The Netherlands</p>
                            <p><i className="fa fa-phone"></i> 0615955193 <i className="fa fa-envelope"></i> bart@tunga.io</p>
                            <form id="contact-form" role="form" name="contact-form" ref="contact_form">
                                {Utility.contact.isSent?(
                                <Success message="Contact request sent"/>
                                    ):null}
                                {Utility.error && Utility.error.contact?(
                                <Error message={Utility.error.contact.email || "Your request couldn't be processed. Please try again later."}/>
                                    ):null}
                                <div className="input-group input-group-lg">
                                    <input className="form-control" ref="email" name="email" type="email" placeholder="Drop your email here and we will contact you" required/>
                                    <span className="input-group-btn">
                                        <button className="btn " type="submit" disabled={Utility.contact.isSending}>
                                            <i className="fa fa-envelope" onClick={this.sendEmail.bind(this)}></i>
                                        </button>
                                    </span>
                                </div>
                            </form>
                        </div>
                        <div className="col-sm-3" id="latest-from-blog">
                            <h4>LATEST FROM OUR BLOG</h4>
                            <ul className="list-unstyled">
                                <li><a target="_blank" href="https://medium.com/the-tunga-blog/why-its-a-good-idea-to-mobilize-remote-workers-in-africa-f9c707cdced7?source=latest---"><i className="fa fa-angle-right"></i> Why it’s a Good Idea to Mobilize Remote Workers in Africa.</a></li>
                                <li><a target="_blank" href="https://medium.com/the-tunga-blog/how-using-bitcoin-to-pay-gig-workers-in-africa-is-a-no-brainer-621087d03852?source=latest---"><i className="fa fa-angle-right"></i> How using Bitcoin to pay gig-workers in Africa is a no-brainer</a></li>
                                <li><a target="_blank" href="https://medium.com/the-tunga-blog/why-i-think-africa-is-a-hotbed-of-innovation-that-everybody-should-know-about-96bd1c649527?source=latest---"><i className="fa fa-angle-right"></i> Why I Think Africa is a Hotbed of Innovation That Everybody Should Know About.</a></li>
                                <li><a target="_blank" href="https://medium.com/the-tunga-blog/how-to-use-digital-storytelling-for-social-enterprises-a2e92bb40558?source=latest---"><i className="fa fa-angle-right"></i> How to Use Digital Storytelling for Social Enterprises</a></li>
                                <li><a target="_blank" href="https://medium.com/the-tunga-blog/african-coders-are-more-suited-for-the-gig-economy-than-their-western-counterparts-99a32366fcd3#.5a5ppu93f"><i className="fa fa-angle-right"></i> African coders are more suited for the ‘gig economy’ than their western counterparts</a></li>
                            </ul>
                        </div>
                        <div className="col-sm-2" id="quick-links">
                            <h4>QUICK LINKS</h4>
                            <ul className="list-unstyled">
                                <li><Link to="/signin">Login</Link></li>
                                <li><Link to="/signup">Sign Up</Link></li>
                                {/*<li><a href="#">About Us</a></li>
                                <li><a href="#">Team</a></li>
                                <li><a href="#">Contact Us</a></li>*/}
                            </ul>
                        </div>
                    </div>
                    <div className="row text-center">
                        <p><a href="#">Privacy Policy</a> &nbsp; | &nbsp; <a href="#">Terms and Conditions</a></p>
                        <small>&copy; 2016 Tunga.io &mdash; All rights reserved.</small>
                    </div>
                </footer>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {Utility: state.Utility};
}

function mapDispatchToProps(dispatch) {
    return {
        UtilityActions: bindActionCreators(UtilityActions, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
