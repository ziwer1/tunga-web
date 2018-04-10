import React from 'react';
import {Link} from 'react-router';
import Slider from 'react-slick';
import Reveal from 'react-reveal';

import ShowcaseContainer from '../containers/ShowcaseContainer';
import ShowCaseFooter from '../containers/ShowCaseFooter';
import ComponentWithModal from '../components/ComponentWithModal';
import MetaTags from '../components/MetaTags';
import SectionHeading from '../components/SectionHeading';

import {openCalendlyWidget, showCallWidget} from '../utils/router';
import {TESTIMONIALS} from '../constants/data';

let overlayTimer = null;

export default class LandingPage extends ComponentWithModal {
    static pageClass = '';

    constructor(props) {
        super(props);
        this.state = {
            player: null,
            play: false,
            step: 0,
            pageClass: '',
            showVideo: true,
            youtubeOpts: {height: '360px'},
            hasAnimatedNumbers: false,
            showOverlay: false,
            closeChat: false,
        };
    }

    componentDidMount() {
        let lp = this;
        if (showCallWidget(this.props.routes)) {
            openCalendlyWidget();
        }

        function displayOverlay() {
            if (window.tungaCanOpenOverlay) {
                lp.setState({showOverlay: true});
            }
        }

        function resetTimer() {
            if (overlayTimer) {
                clearTimeout(overlayTimer);
            }
            if (window.tungaCanOpenOverlay) {
                overlayTimer = setTimeout(
                    displayOverlay,
                    __PRODUCTION__ ? 45000 : 60 * 60 * 1000,
                );
            }
        }

        window.tungaCanOpenOverlay = true;
        resetTimer();

        // Reset timer when any activity happens
        document.onmousemove = resetTimer;
        document.onkeypress = resetTimer;
        document.onscroll = resetTimer;

        let updateBg = function() {
            let menuItemToggled = false;
            let windowWidth = $(window).innerWidth();
            let width = windowWidth / 2;
            let height = 60;
            let roundTungaLogoTop = $('.tunga-logo-top');

            if (windowWidth <= 360) {
                height = 30;
                lp.setState({youtubeOpts: {width: `${windowWidth}px`}});
            } else {
                lp.setState({youtubeOpts: {width: '800', height: '450'}});
            }
            $('.ribbon').css('borderWidth', `${height}px ${width}px 0`);

            $(this).scroll(function() {
                var currentPos = $(this).scrollTop();
                var cta = $('header .btn-callout.btn-main-cta');
                if (!cta.size()) {
                    cta = $('.lander .task-wizard .btn.cta-action');
                }

                if (cta.size()) {
                    var ctaPos = cta.offset().top;
                    var navActions = $('.nav.nav-actions');

                    if (currentPos >= ctaPos + 50) {
                        navActions.addClass('show-launch');
                    } else {
                        navActions.removeClass('show-launch');
                    }
                }

                if (roundTungaLogoTop.size()) {
                    var logoPos = roundTungaLogoTop.offset().top;
                    var currentLogoPos = logoPos - $(this).scrollTop();

                    if (menuItemToggled === true) {
                        if (currentPos >= 0) {
                            $('.navbar').addClass('navbarbgOnScroll');
                            $('.navbar').removeClass('navbar-brand');
                            $('.navbar-brand').addClass('medium-showcase');
                            $('.navbar-brand').addClass('navbar-scrolled-top');
                        }
                    } else {
                        if (currentPos >= logoPos + 50) {
                            $('.navbar').addClass('navbarbgOnScroll');
                            $('.navbar').removeClass('navbar-brand');
                            $('.navbar-brand').addClass('medium-showcase');
                            $('.navbar-brand').addClass('navbar-scrolled-top');
                        } else {
                            $('.navbar').removeClass('navbarbgOnScroll');
                            $('.navbar-brand').removeClass('medium-showcase');
                            $('.navbar-brand').removeClass(
                                'navbar-scrolled-top',
                            );
                        }
                    }
                }
            });

            $('.navbar-toggle').click(function() {
                if (windowWidth < 768) {
                    var $navbar = $('.navbar-collapse');
                    var _opened = $navbar.hasClass('in');

                    if (_opened === true) {
                        var logoPos = roundTungaLogoTop.offset().top;
                        var currentLogoPos = logoPos - $(document).scrollTop();
                        // console.log('position 2 is '+ currentLogoPos);
                        menuItemToggled = false;
                        if (currentLogoPos >= 50) {
                            $('.navbar').removeClass('navbarbg');
                            $('.navbar-brand').removeClass('medium-showcase');
                        } else {
                            $('.navbar-brand').addClass('medium-showcase');
                        }
                        // console.log('closed');
                    } else {
                        $('.navbar').addClass('navbarbg');
                        $('.navbar').removeClass('navbar-brand');
                        $('.navbar-brand').addClass('medium-showcase');
                        menuItemToggled = true;
                        // console.log('open');
                    }
                }
            });
        };

        $(document).ready(updateBg);
        $(window).resize(updateBg);
    }

    componentWillUnmount() {
        window.tungaCanOpenOverlay = false;
    }

    onScheduleCall() {
        openCalendlyWidget();
    }

    onChangeSliderStep(step) {
        this.setState({step});
    }

    onCloseOverlay() {
        window.tungaCanOpenOverlay = false;
        this.setState({showOverlay: false});
    }

    renderHeaderContent() {
        return (
            <div>
                <div id="lander-header" className="showcase-header">
                    <h1>Unleashing Africa’s Tech Talent</h1>
                    <div className="sub-header">
                        Small and large businesses from all over the world use
                        Tunga for hiring African software engineers to address
                        their most pressing software development needs.
                    </div>
                    <div>
                        <button
                            onClick={this.onScheduleCall}
                            className="btn btn-callout">
                            Schedule a call
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    renderFreeHeaderSection() {
        return (
            <section id="services">
                <div className="service">
                    <div className="wrapper">
                        <div className="headline">
                            Effortless software project
                        </div>
                        <div>
                            Need an app or website? We can build software for
                            you on-demand and turn-key.
                            <Link
                                to="/call"
                                onClick={this.onScheduleCall.bind(this)}>
                                find out more
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="service">
                    <div className="wrapper">
                        <div className="headline">Dedicated developers</div>
                        <div>
                            Use Tunga to quickly mobilize developers. Parttime
                            or fulltime. Individuals or entire teams.
                            <Link
                                to="/call"
                                onClick={this.onScheduleCall.bind(this)}>
                                find out more
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="service">
                    <div className="wrapper">
                        <div className="headline">Recruitment services</div>
                        <div>
                            Tap into our network of top African software
                            programmers to reinforce your own tech team.
                            <Link
                                to="/call"
                                onClick={this.onScheduleCall.bind(this)}>
                                find out more
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    renderPressSection() {
        return (
            <section id="press-landing">
                <div className="container">
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
                                <li>
                                    <a
                                        href="https://blog.tunga.io/our-developers-dont-want-aid-they-want-to-be-productive-4aba9173211e"
                                        target="_blank">
                                        <img
                                            src={require('../images/press/bnr.jpg')}
                                        />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </Reveal>
                </div>
            </section>
        );
    }

    renderMainContent() {
        let slider_settings = {
            dots: true,
            arrows: true,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            centerMode: true,
            centerPadding: 0,
            responsive: [
                {
                    breakpoint: 481,
                    settings: {slidesToShow: 1 /*, centerMode: true*/},
                },
                {
                    breakpoint: 769,
                    settings: {slidesToShow: 2 /*, centerMode: true*/},
                },
                {
                    breakpoint: 1025,
                    settings: {
                        slidesToShow: 3,
                        centerMode: true,
                        centerPadding: 0,
                    },
                },
            ],
        };

        return (
            <div>
                <section id="unique-approach" className="clearfix">
                    <div className="col-md-8">
                        <div className="approach-body">
                            <SectionHeading>
                                Our unusual approach to software development
                            </SectionHeading>

                            <div>
                                <p>
                                    Software projects often go wrong because of
                                    people misunderstanding each other. Tunga
                                    was founded by people from the hospitality
                                    sector to solve this problem with a simple
                                    idea: apply our human-centered mindset to
                                    the software development process and its
                                    actors.
                                </p>

                                <p>
                                    We work with a community of highly talented
                                    youths from several African countries, who
                                    are committed to go the extra mile for you.
                                    Why? Because we not only pay a lot of
                                    attention to our managers and developers
                                    growing a customer-focused attitude, we also
                                    do our utmost to address their needs by
                                    creating interesting and worthwhile work
                                    opportunities for them.
                                </p>

                                <p>
                                    Do you support our mission to create
                                    opportunities for African youths? Become a{' '}
                                    <Link to="/friends-of-tunga">
                                        'Friend of Tunga'!
                                    </Link>{' '}
                                    For each client you refer to us we donate a
                                    sum to Bits Academy, a network of African
                                    schools that focus on giving quality and
                                    free IT-education to youths from less
                                    privileged backgrounds.
                                </p>

                                <button
                                    className="btn btn-callout"
                                    onClick={this.onScheduleCall.bind(this)}>
                                    Find out what we can do for you
                                </button>

                                <Link
                                    className="btn btn-callout visible-xs"
                                    to="/friends-of-tunga">
                                    Become a friend of Tunga
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 side-pic" />
                </section>
                <section id="development-style">
                    <div>
                        <div className="container">
                            <div className="row">
                                <SectionHeading>
                                    Software development Tunga-style
                                </SectionHeading>

                                <div className="development-style-pitch">
                                    We have built a large pool of top African
                                    tech talent that can be deployed flexibly
                                    and rapidly to help you meet your specific
                                    software development needs.
                                </div>

                                <div className="development-style-cases">
                                    <div className="case">
                                        <i className="icon tunga-icon-file-search" />

                                        <p>
                                            <div className="title">
                                                Result-oriented
                                            </div>
                                            We pay a lot of attention to scoping
                                            your project and working out the
                                            technical details. Then we go all
                                            the way to deliver them.
                                        </p>
                                    </div>
                                    <div className="case">
                                        <i className="icon tunga-icon-team" />

                                        <p>
                                            <div className="title">
                                                Quality assured
                                            </div>
                                            We have developed a unique, highly
                                            professional and effective way of
                                            working that enables clients and
                                            developers from any part of the
                                            world to collaborate efficiently.
                                        </p>
                                    </div>
                                    <div className="case">
                                        <i className="icon tunga-icon-money-loop" />
                                        <p>
                                            <div className="title">
                                                Affortable
                                            </div>
                                            Our developers are for hire at a
                                            flat rate of EUR20 per hour. We
                                            calculate projects transparently and
                                            stick with that. No excuses, no
                                            discussions, no additional costs.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="meet-developers">
                    <div>
                        <Link to="/quality" className="headline">
                            Meet our thriving community of developers
                        </Link>
                        <p>
                            Find out how we select our developers and meet some
                            of our talented experts.
                        </p>
                    </div>
                </section>
                {this.renderPressSection()}
                <section id="case-studies">
                    <div className="container">
                        <SectionHeading>Case Studies</SectionHeading>
                        <div id="clients-testmonial-landing-page">
                            <Slider
                                className="testimonials-slider text-center"
                                {...slider_settings}>
                                {TESTIMONIALS.map(testimonial => {
                                    return (
                                        <div className="testimonial-landing-page">
                                            <div className="body">
                                                <div>
                                                    <i className="fa fa-quote-left pull-left" />
                                                    <span
                                                        dangerouslySetInnerHTML={{
                                                            __html:
                                                                testimonial.message,
                                                        }}
                                                    />
                                                    <i className="fa fa-quote-right pull-right" />
                                                </div>
                                            </div>
                                            <div
                                                className="image"
                                                style={{
                                                    backgroundImage: `url(${
                                                        testimonial.image
                                                    })`,
                                                }}
                                            />
                                            <div className="author">
                                                {testimonial.name}
                                            </div>
                                            <div className="company">
                                                <p>
                                                    {testimonial.position}{' '}
                                                    {testimonial.company}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </Slider>
                        </div>
                    </div>
                </section>
                <section id="partners">
                    <div className="container">
                        <div className="new-landing-page-supported-by">
                            Supported By:
                        </div>
                        <Reveal effect="animated fadeInLeft">
                            <div>
                                <ul className="partner-links">
                                    <li>
                                        <a
                                            href="http://www.butterflyworks.org/"
                                            target="_blank"
                                            title="Butterfly Works">
                                            <img
                                                src={require('../images/partners/butterfly-works-logo.png')}
                                            />
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://www.dioraphte.nl/en/"
                                            target="_blank"
                                            title="Dioraphte">
                                            <img
                                                src={require('../images/partners/dioraphte.jpg')}
                                            />
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://www.oxfam.org/"
                                            target="_blank"
                                            title="Oxfam">
                                            <img
                                                src={require('../images/partners/oxfam.png')}
                                            />
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="http://www.doen.nl/about-doen/general.htm"
                                            target="_blank"
                                            title="the DOEN Foundation">
                                            <img
                                                src={require('../images/partners/DOEN.gif')}
                                            />
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://www.edukans.nl/"
                                            target="_blank"
                                            title="Edukans">
                                            <img
                                                src={require('../images/partners/edukans.jpg')}
                                            />
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://www.triodos.com/"
                                            target="_blank"
                                            title="Triodos Bank">
                                            <img
                                                src={require('../images/partners/triodos-bank.png')}
                                            />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </Reveal>
                    </div>
                </section>
                <section className="what-we-do-best">
                    <div className="container ">
                        <div className="row">
                            <SectionHeading>What we do best</SectionHeading>
                            <div className="row">
                                <div className="col-md-4 skill">
                                    <img
                                        src={require('../images/showcase/TungaMobileSkills.png')}
                                    />
                                </div>
                                <div className="col-md-4 skill">
                                    <img
                                        src={require('../images/showcase/TungaWebSkills.png')}
                                    />
                                </div>
                                <div className="col-md-4 skill">
                                    <img
                                        src={require('../images/showcase/TungaOtherSkills.png')}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <button
                                className="btn btn-callout"
                                onClick={this.onScheduleCall.bind(this)}>
                                Find out what we can do for you
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    render() {
        let meta_title = 'Tunga | Software outsourcing done right';
        let meta_description = `Getting software projects done is hard. We make it easy.`;

        return (
            <ShowcaseContainer
                className={`new-landing-page ${this.state.pageClass || ''}`}
                headerContent={this.renderHeaderContent()}
                freeHeaderSection={this.renderFreeHeaderSection()}
                hasArrow={true}
                chatId={this.props.params ? this.props.params.chatId : null}
                closeChat={this.state.closeChat}>
                <MetaTags title={meta_title} description={meta_description} />

                {this.renderMainContent()}

                <ShowCaseFooter showContactUs={true} />
            </ShowcaseContainer>
        );
    }
}
