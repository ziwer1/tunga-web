import React from 'react';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Slider from 'react-slick';
import Reveal from 'react-reveal';

import ShowcaseContainer from '../containers/ShowcaseContainer';
import ShowCaseFooter from '../containers/ShowCaseFooter';
import ComponentWithModal from '../components/ComponentWithModal';
import MetaTags from '../components/MetaTags';

import {openCalendlyWidget, showCallWidget,} from '../utils/router';
import {TESTIMONIALS} from '../constants/data';

import * as SkillPageActions from '../actions/SkillPageActions';
import {Button, Form, FormControl, FormGroup} from "react-bootstrap";

const STEP_DETAILS = [
  {
    title: 'Tell us what you want to build.',
    icon: 'tunga-icon-how-needs',
  },
  {
    title: 'Tunga matches developers with objectively verified skills.',
    icon: 'tunga-icon-how-matches',
  },
  {
    title: 'Developers start working in your workflow or set one up for you.',
    icon: 'tunga-icon-how-workflow',
  },
  {
    title: 'Get daily feedback reports on progress & quality.',
    icon: 'tunga-icon-how-feedback',
  },
];

let overlayTimer = null;

export class LandingPage extends ComponentWithModal {
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
      isSkillPage: false,
      showOverlay: false,
      closeChat: false,
    };
  }

  componentDidMount() {
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
        overlayTimer = setTimeout(displayOverlay, __PRODUCTION__ ? 45000 : 6000);
      }
    }

    window.tungaCanOpenOverlay = true;
    resetTimer();

    // Reset timer when any activity happens
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;
    document.onscroll = resetTimer;

    let updateBg = function () {
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

      $(this).scroll(function () {
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

        var stats = $('#platform-stats');
        if (stats.size()) {
          var statsPos = $('footer').offset().top;
          if (currentPos >= statsPos - 800) {
            stats.find('.stat').each(function (idx, elem) {
              if (!lp.state.hasAnimatedNumbers) {
                var numAnim = new CountUp(
                  $(elem).attr('id'),
                  0,
                  parseInt($(elem).attr('data-number')),
                );
                numAnim.start();
              }
            });
            lp.setState({hasAnimatedNumbers: true});
          } else if (currentPos <= statsPos - 1300) {
            lp.setState({hasAnimatedNumbers: false});
          }
        }

        /*var outsourceWidget = $('.outsource-widget');
        if (outsourceWidget.size()) {
          var outWidgetPos = $('footer').offset().top;
          if (currentPos >= outWidgetPos - 500) {
            if (outsourceWidget.hasClass('slideOutRight')) {
              outsourceWidget.removeClass('open animated slideOutRight');
            }
            outsourceWidget.addClass('open animated slideInRight');
          } else if (currentPos <= outWidgetPos - 1000) {
            if (outsourceWidget.hasClass('slideInRight')) {
              outsourceWidget.removeClass('slideInRight');
              outsourceWidget.addClass('animated slideOutRight');
            }
          }
        }*/

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
              $('.navbar-brand').removeClass('navbar-scrolled-top');
            }
          }
        }
      });

      $('.navbar-toggle').click(function () {
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
        <div className="tunga-logo-top">
          <img src={require('../images/logo_round.png')}/>
        </div>
        <div className='new-landing-page-showcase'>

          <div className='new-landing-page landing-header'>
            <h1>
              Unleasing Africa’s Tech Talent
            </h1>
            <div className="col-sm-5 new-landing-page sub_header">
              <p>
                Small and large businesses from all over the world use Tunga
                for hiring African software engineers to address their most
                pressing software development needs.
              </p>
            </div>
            <div className="col-sm-12">
              {/*clearing grid hack*/}
            </div>
            <div className="col-lg-5">
              <a className="btn new-landing-page schedule_call" href="/call/">
                Schedule a call</a>
            </div>
          </div>
        </div>
        <div className="new-landing-page-services">
          <section className="new-landing-page">
            <div className="col-lg-4 new-landing-page software-section">
              <p className="principle-heading">Effortless software project</p>
              <br/>
              <div className="col-md-offset-2 col-sm-8">
                <p>Need an app or website? We can build software for you on-demand and
                  turn-key.
                </p>
              </div>
            </div>
            <div className="col-lg-4 new-landing-page developers-section">
              <p className="principle-heading">Dedicated developers</p>
              <br/>
              <div className="col-md-offset-2 col-sm-8">
                <p>Use Tunga to quickly mobilize developers. Parttime or fulltime. Individuals or entire teams.
                </p>
              </div>
            </div>
            <div className="col-lg-4 new-landing-page recruitment-section">
              <p className="principle-heading">Recruitment services</p>
              <br/>
              <div className="col-md-offset-2 col-sm-8">

                <p>Tap into our network of top African software programmers to reinforce your own tech team.
                </p>
              </div>
            </div>
          </section>


        </div>

      </div>
    );
  }

  render() {
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
        {breakpoint: 481, settings: {slidesToShow: 1 /*, centerMode: true*/}},
        {breakpoint: 769, settings: {slidesToShow: 2 /*, centerMode: true*/}},
        {
          breakpoint: 1025,
          settings: {slidesToShow: 3, centerMode: true, centerPadding: 0},
        },
      ],
    };

    let meta_title = 'Tunga | Software outsourcing done right';
    return (
      <ShowcaseContainer
        className={`new-landing-page`}
        headerContent={this.renderHeaderContent()}
        hasArrow={true}
        chatId={this.props.params ? this.props.params.chatId : null}
        closeChat={this.state.closeChat}>
        <MetaTags title={meta_title} description={meta_description}/>


        <section id="platform-info" className="new-landing-page">
          <div className="col-md-8">
            <div className="col-md-offset-3">
              <div className="approach-heading">
                Our unusual approach to software development
              </div>

              <div className="col-md-6">
                <hr className="hr-tunga"/>
              </div>

              <div className="col-md-8 approach-body">
                <p>
                  Software projects often go wrong because of people
                  misunderstanding each other. Tunga was founded by
                  people from the hospitality sector to solve this
                  problem with a simple idea: apply our human-centered
                  mindset to the software development process and its actors.

                  <br/>

                  We work with a community of highly talented youths
                  from several African countries, who are committed to
                  go the extra mile for you. Why? Because we not only
                  pay a lot of attention to our managers and developers
                  growing a customer-focused attitude, we also do our utmost
                  to address their needs by creating interesting and
                  worthwhile work opportunities for them.

                  <br/>

                  Do you support our mission to create opportunities
                  for African youths?
                  Become a ‘Friend of Tunga’! For each client you refer
                  to us we donate a sum to Bits Academy, a network of
                  African schools that focus on giving quality and
                  free IT-education to youths from less privileged backgrounds.


                  <a
                    href="#"
                    onClick={this.onScheduleCall.bind(this)}>
                    Talk with us
                  </a>
                </p>

              </div>

            </div>
          </div>
          <div className="col-md-4 side-pic">
            <img
              src={require('images/home/Tungadevelopercodingsection2.jpg')}
            />
          </div>
        </section>

        <section>
          <div>
            <div className="container">
              <div className="row new-landing-page">

                <div className="col-md-offset-2 col-md-8 development-style-heading">
                  <p>Software development Tunga-style</p>
                </div>

                <div className="col-md-offset-4 col-md-4 col-md-offset-5">
                  <hr className="hr-tunga"/>
                </div>

                <div className="col-md-offset-2 col-lg-8 development-style">
                  We have built a large pool of top African tech talent that
                  can be deployed flexibly and rapidly to help you meet your
                  specific software development needs.

                </div>

                <div className="col-lg-4 development-style-item">

                  <img
                    src={require('images/showcase/result-oriented.png')}
                  />

                  <p>Result-oriented
                    We pay a lot of attention to scoping your project and working out the technical details. Then we go
                    all the way to deliver them.
                  </p>


                </div>
                <div className="col-lg-4 development-style-item">

                  <img
                    src={require('images/showcase/quality-assured.png')}
                  />
                  <p>
                    Quality assured
                    We have developed a unique, highly professional and
                    effective way of working that enables clients and
                    developers from any part of the world to collaborate efficiently.
                  </p>

                </div>
                <div className="col-lg-4 development-style-item">

                  <img
                    src={require('images/showcase/affortable.png')}
                  />
                  <p>
                    Affortable
                    Our developers are for hire at a flat rate of EUR20 per hour.
                    We calculate projects transparently and stick with that.
                    No excuses, no discussions, no additional costs.
                  </p>

                </div>
              </div>

            </div>
          </div>

        </section>

        <section className="new-landing-page-meeting-developers" style={{backgroundImage: `url(${require('../images/showcase/verification_new.jpg')},)`}}>

          <div>
            <p>Meet our triving community of developers</p>
            <p>Find out how we select our developers and meet some of our talented experts.
            </p>
          </div>

        </section>
        <section id="press-landing">
          <div className="container">
            <Reveal effect="animated fadeInLeft">
              <div>
                <ul className="press-links">
                  <li>
                    <a
                      href="http://www.bbc.co.uk/news/world-africa-38294998"
                      target="_blank">
                      <img src={require('../images/press/bbc.png')}/>
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
                      <img src={require('../images/press/OWlogo.png')}/>
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
        <section>
          <div className="col-lg-12">

          </div>
        </section>
        <section>
          <div className="container new-landing-page">
            <div className="col-md-offset-2 col-md-8 case-studies">
              <p>Case Studies</p>
            </div>

            <div className="col-md-offset-4 col-md-4 col-md-offset-5">
              <hr className="hr-tunga"/>
            </div>
            <div id="clients-testmonial-landing-page" className="col-sm-12">
              <Slider
                className="testimonials-slider text-center"
                {...slider_settings}>
                {TESTIMONIALS.map(testimonial => {
                  return (
                    <div className="testimonial-landing-page">
                      <div className="body">
                        <div>
                          <i className="fa fa-quote-left pull-left"/>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: testimonial.message,
                            }}
                          />
                          <i className="fa fa-quote-right pull-right"/>
                        </div>
                      </div>
                      <div
                        className="image"
                        style={{
                          backgroundImage: `url(${testimonial.image})`,
                        }}
                      />
                      <div className="author">
                        {testimonial.name}
                      </div>
                      <div className="company">
                        <p>{testimonial.position} {testimonial.company}</p>
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
              <p>Supported By:</p>
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
                      <img src={require('../images/partners/oxfam.png')}/>
                    </a>
                  </li>
                  <li>
                    <a
                      href="http://www.doen.nl/about-doen/general.htm"
                      target="_blank"
                      title="the DOEN Foundation">
                      <img src={require('../images/partners/DOEN.gif')}/>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.edukans.nl/"
                      target="_blank"
                      title="Edukans">
                      <img src={require('../images/partners/edukans.jpg')}/>
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
              <div className="col-md-offset-2 col-md-8 what-we-do-best-heading">
                <p>What we do best</p>
              </div>

              <div className="col-md-offset-4 col-md-4 col-md-offset-5">
                <hr className="hr-tunga"/>
              </div>
              <div className="col-lg-12">
                <div className="col-lg-4">
                  <img src={require('../images/showcase/TungaMobileSkills.png')}/>
                </div>
                <div className="col-lg-4">
                  <img src={require('../images/showcase/TungaWebSkills.png')}/>
                </div>
                <div className="col-lg-4">
                  <img src={require('../images/showcase/TungaOtherSkills.png')}/>
                </div>
              </div>

            </div>
          </div>
        </section>


        <section>
          <div className="container">
            <div className="row skill-page">

              <div className="col-md-offset-2 col-md-8 section-heading">
                <p>Where to find us</p>
              </div>

              <div className="col-md-offset-4 col-md-4 col-md-offset-5">
                <hr className="hr-tunga"/>
              </div>

              <div className="col-md-12 skill-page-contact-us">
                <div className="col-md-5">
                  <p>
                    <strong>Kampala office:</strong><br/>
                    Design Hub Kampala, 5th Street, Industrial Area, Kampala, Uganda
                  </p>
                  <br/>
                  <p>
                    <strong>Amsterdam office:</strong><br/>
                    The Collab, Wibautstraat 131, 1091 GL Amsterdam, The Netherlands
                  </p>
                  <br/>
                  <p>
                    <strong>Lagos office:</strong><br/>
                    32 Barikisu Iyede street, Yaba, Lagos, Nigeria
                  </p>
                  <br/>

                  <Link href="mailto:hello@tunga.io">hello@tunga.io</Link>
                  <div>
                    <a className="btn btn-callout" href="/call/">
                      Schedule a call with us</a>
                  </div>

                </div>
                <div className="col-md-offset-1 col-md-5">
                  <Form>
                    <FormGroup>
                      <FormControl type="input" placeholder="Your Name"/>
                    </FormGroup>
                    <FormGroup>
                      <FormControl type="input" placeholder="Your email address"/>
                    </FormGroup>
                    <FormGroup>
                      <FormControl style={{height: "100px",}} componentClass="textarea"
                                   placeholder="Type your message here"/>
                    </FormGroup>
                    <br/>
                    <br/>
                    <br/>
                    <div className="pull-right">
                      <Button className="btn btn-callout" type="submit">Send</Button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </section>
        }

        <ShowCaseFooter/>
      </ShowcaseContainer>
    );

    let meta_description = `Getting software projects done is hard. We make it easy.`;
  }
}

function mapStateToProps(state) {
  return {Auth: state.Auth, SkillPage: state.SkillPage};
}

function mapDispatchToProps(dispatch) {
  return {
    SkillPageActions: bindActionCreators(SkillPageActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
