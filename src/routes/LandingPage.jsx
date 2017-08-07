import React from 'react';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import YouTube from 'react-youtube';
import Slider from 'react-slick';
import Reveal from 'react-reveal';

import ShowcaseContainer from '../containers/ShowcaseContainer';
import ShowCaseFooter from '../containers/ShowCaseFooter';
import ComponentWithModal from '../components/ComponentWithModal';
import MetaTags from '../components/MetaTags';
import Avatar from '../components/Avatar';

import {showCallWidget, openCalendlyWidget} from '../utils/router';
import {TESTIMONIALS} from '../constants/data';

import * as SkillPageActions from '../actions/SkillPageActions';
import {nl_to_br} from '../utils/html';

import {
  sendGAEvent,
  GA_EVENT_CATEGORIES,
  GA_EVENT_ACTIONS,
  GA_EVENT_LABELS,
} from '../utils/tracking';

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

class HowItWorks extends React.Component {
  render() {
    return (
      <section id="how-it-works">
        <div className="container">
          <div className="step-slider two-sm four-md clearfix">
            <ul>
              {STEP_DETAILS.map((step, idx) => {
                return (
                  <li key={idx}>
                    <div
                      href="#"
                      className="slide animated fadeInRight"
                      style={{animationDelay: `${idx}s`}}>
                      <div className="icon">
                        <span className="number">
                          {idx + 1}
                        </span>
                        <i className={step.icon} />
                      </div>
                      <span dangerouslySetInnerHTML={{__html: step.title}} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    );
  }
}

const NETWORK_EXPERTISE = [
  {
    content: (
      <div>
        Full stack capacity for web API development<br />
        All popular JS frameworks<br />
        Backend development
      </div>
    ),
    icon: 'tunga-icon-service-web',
  },
  {
    content: (
      <div>
        Excellent native app development<br />
        Dedicated iOS and Android teams<br />
        App maintenance and improvements
      </div>
    ),
    icon: 'tunga-icon-service-app',
  },
  {
    content: (
      <div>
        Dedicated project managers<br />
        Daily updates from developers<br />
        Full overview of progress
      </div>
    ),
    icon: 'tunga-icon-service-pm',
  },
  {
    content: (
      <div>
        Easily customize your workflow<br />
        with Slack, Trello, GDrive, Github<br />
        on Tunga
      </div>
    ),
    icon: 'tunga-icon-service-workflow',
  },
];

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
    };
  }

  componentDidMount() {
    console.log('componentDidMount');
    if (showCallWidget(this.props.routes)) {
      openCalendlyWidget();
    }

    let skill = this.getDLPTag();
    if (skill) {
      const {SkillPageActions} = this.props;
      this.setState({isSkillPage: true});
      SkillPageActions.retrieveSkillPage(skill);
    }

    let lp = this;

    let updateBg = function() {
      let windowWidth = $(window).innerWidth();
      let width = windowWidth / 2;
      let height = 60;
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

        var stats = $('#platform-stats');
        if (stats.size()) {
          var statsPos = $('footer').offset().top;
          if (currentPos >= statsPos - 800) {
            stats.find('.stat').each(function(idx, elem) {
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

        var outsourceWidget = $('.outsource-widget');
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
        }
      });
    };

    $(document).ready(updateBg);
    $(window).resize(updateBg);
  }

  onScheduleCall() {
    openCalendlyWidget();
  }

  onVideoReady(e) {
    var player = e.target;
    if (player) {
      this.setState({player: e.target});
    }
  }

  onPlayVideo() {
    this.setState({play: true});
    if (this.state.player) {
      this.state.player.playVideo();
      sendGAEvent(
        GA_EVENT_CATEGORIES.VIDEO,
        GA_EVENT_ACTIONS.PLAY,
        GA_EVENT_LABELS.INTRO_VIDEO,
      );
    }
  }

  onPauseVideo() {
    sendGAEvent(
      GA_EVENT_CATEGORIES.VIDEO,
      GA_EVENT_ACTIONS.PAUSE,
      GA_EVENT_LABELS.INTRO_VIDEO,
    );
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
    const {location, params} = this.props;
    if (params && params.skill) {
      return params.skill;
    }
    if (location.query && location.query.dlp_tag) {
      return location.query.dlp_tag;
    }
    return null;
  }

  getDLPDesc() {
    const {location} = this.props;
    if (
      location &&
      location.query.dlp_desc &&
      ['developers', 'coders', 'programmers'].indexOf(location.query.dlp_desc) >
        -1
    ) {
      return location.query.dlp_desc;
    }
    return null;
  }

  getDLPPhrase() {
    const tag = this.getDLPTag();
    const desc = this.getDLPDesc();
    if (tag || desc) {
      return `${this.getDLPTag() || 'software'} ${this.getDLPDesc() ||
        'developers'}`;
    }
    return null;
  }

  reorderProfileSkills(skills) {
    let isSkillPage = this.state.isSkillPage,
      {SkillPage: {detail: {skill_page}}} = this.props;
    if (isSkillPage && skill_page.keyword) {
      let new_skills = [skill_page.skill];
      skills.forEach(skill => {
        if (skill.id != skill_page.skill.id) {
          new_skills.push(skill);
        }
      });
      return new_skills;
    }
    return skills;
  }

  renderHeaderContent() {
    const dlp_phrase = this.getDLPPhrase(),
      isSkillPage = this.state.isSkillPage,
      {SkillPage: {detail: {skill_page}}} = this.props;

    return (
      <div>
        <div
          className={`head-desc ${isSkillPage && this.getDLPTag().length > 7
            ? 'smaller'
            : ''}`}>
          <h1>
            {isSkillPage && skill_page.welcome_header
              ? <span
                  dangerouslySetInnerHTML={{
                    __html: nl_to_br(skill_page.welcome_header),
                  }}
                />
              : <span>
                  Getting software projects done is hard.<br />
                  We make it easy.
                </span>}
          </h1>
          <div className="details">
            {isSkillPage && skill_page.welcome_sub_header
              ? <span
                  dangerouslySetInnerHTML={{
                    __html: nl_to_br(skill_page.welcome_sub_header),
                  }}
                />
              : <span>
                  Tunga enables you to have super-bright{' '}
                  {this.getDLPDesc() || 'developers'} from Africa work on your
                  software project in a productive, friendly and worthwhile way.
                </span>}
          </div>
          <div>
            <Link to="/start/" className="btn btn-callout btn-main-cta">
              <i className="tunga-icon-rocket" />{' '}
              {(isSkillPage && skill_page.welcome_cta) ||
                (dlp_phrase
                  ? `Start hiring ${dlp_phrase}`
                  : 'Start your project')}
            </Link>
          </div>
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
    let meta_description = `Getting software projects done is hard. We make it easy.`;
    let isSkillPage = this.state.isSkillPage,
      {SkillPage: {detail: {skill_page}}} = this.props;

    return (
      <ShowcaseContainer
        className={`landing-page ${this.state.pageClass} ${isSkillPage &&
          'skill-page'}`}
        headerContent={this.renderHeaderContent()}
        headerVideo={false && this.state.showVideo}
        hasArrow={true}
        chatId={this.props.params ? this.props.params.chatId : null}>
        <MetaTags title={meta_title} description={meta_description} />

        {isSkillPage
          ? <section id="pitch">
              <div className="container text-center">
                <div className="section-heading">
                  {skill_page.pitch_header}
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: nl_to_br(skill_page.pitch_body),
                  }}
                />
              </div>
            </section>
          : <div>
              <section id="platform-info">
                <div className="container">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="workflow">
                        <div className="section-heading">
                          How we make it easy
                        </div>
                        <p>
                          Finding great developers is hard nowadays, it is a
                          journey that often takes too much time and money.
                          We're here to help. Tunga not only gives you flexible
                          access to a community of highly committed developers
                          and at affordable rates, we also have a simple process
                          in place to make sure you can stay on top of quality
                          and planning. We get that you want to have overview at
                          all times over the progress of your project. That is
                          why Tunga offers unique automated features that will
                          allow you to smoothly build great products in a cost
                          effective way. Triggered?{' '}
                          <a href="#" onClick={this.onScheduleCall.bind(this)}>
                            Talk with us
                          </a>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <img
                        src={require('images/showcase/video-bg.png')}
                        className="video-trigger"
                        onClick={this.onPlayVideo.bind(this)}
                      />
                    </div>
                  </div>
                </div>
              </section>
              <HowItWorks />
            </div>}
        <section id="press">
          <div className="container ">
            <Reveal effect="animated fadeInLeft">
              <div>
                <ul className="press-links">
                  <li>
                    <a
                      href="http://www.bbc.co.uk/news/world-africa-38294998"
                      target="_blank">
                      <img src={require('../images/press/bbc.png')} />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/watch?v=v9uRtYpZDQs"
                      target="_blank">
                      <img src={require('../images/press/campus-party.png')} />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.oneworld.nl/startup-tunga-lanceert-pilot-programma-voor-nieuw-soort-freelance-platform"
                      target="_blank">
                      <img src={require('../images/press/OWlogo.png')} />
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
                      <img src={require('../images/press/Spend-Matters.png')} />
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
        {isSkillPage
          ? <div>
              {skill_page.profiles && skill_page.profiles.length
                ? <section id="skill-profiles">
                    <div className="container">
                      <div className="row">
                        {skill_page.profiles.map(profile => {
                          console.log('profile', profile);
                          return (
                            <div className="col-sm-4">
                              <div className="card user-card">
                                <Avatar
                                  src={profile.user.avatar_url}
                                  size="xl"
                                />
                                <div className="name">
                                  {profile.user.display_name}
                                </div>
                                <div>
                                  {profile.user.profile &&
                                  (profile.user.profile.city ||
                                    profile.user.profile.country_name)
                                    ? `${profile.user.profile.city}, ${profile
                                        .user.profile.country_name}`
                                    : null}
                                </div>
                                <div className="skills">
                                  {this.reorderProfileSkills(
                                    profile.user.profile.skills,
                                  )
                                    .slice(0, 3)
                                    .map(skill => {
                                      return (
                                        <span>
                                          {skill.name}
                                        </span>
                                      );
                                    })}
                                </div>
                                <div
                                  className="intro"
                                  dangerouslySetInnerHTML={{
                                    __html: nl_to_br(profile.intro),
                                  }}
                                />
                                <div>
                                  <Link to="/start" className="btn btn-block">
                                    Start working with {profile.user.first_name}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                : null}
              <HowItWorks />
              <section id="story">
                <div className="container">
                  <div
                    className="section-heading text-center"
                    dangerouslySetInnerHTML={{
                      __html: nl_to_br(skill_page.story_header),
                    }}
                  />
                  <div
                    dangerouslySetInnerHTML={{
                      __html: skill_page.story_body_one,
                    }}
                  />
                </div>
                <div
                  id="story-interlude-one"
                  style={
                    skill_page.story_interlude_one_image
                      ? {
                          backgroundImage: `url(${skill_page.story_interlude_one_image})`,
                        }
                      : {}
                  }>
                  <div className="container">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: nl_to_br(skill_page.story_interlude_one_text),
                      }}
                    />
                    <Link to="/start" className="cta">
                      {skill_page.story_interlude_one_cta}
                    </Link>
                  </div>
                </div>
                <div className="container">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: skill_page.story_body_two,
                    }}
                  />
                </div>

                <div
                  id="story-interlude-two"
                  style={
                    skill_page.story_interlude_two_image
                      ? {
                          backgroundImage: `url(${skill_page.story_interlude_two_image})`,
                        }
                      : {}
                  }>
                  <div className="container">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: nl_to_br(skill_page.story_interlude_two_text),
                      }}
                    />
                  </div>
                </div>
                <div className="container">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: skill_page.story_body_three,
                    }}
                  />
                </div>
              </section>
            </div>
          : <div>
              <section id="how-we-verify">
                <div className="container">
                  <Link to="/quality">How we verify our Developers</Link>
                </div>
              </section>
              <section id="clients-testmonial">
                <div className="container">
                  <div className="section-heading text-center">
                    What our clients say
                  </div>
                  <Slider
                    className="testimonials-slider text-center"
                    {...slider_settings}>
                    {TESTIMONIALS.map(testimonial => {
                      return (
                        <div className="testimonial">
                          <div className="body">
                            <div>
                              <i className="fa fa-quote-left pull-left" />
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: testimonial.message,
                                }}
                              />
                              <i className="fa fa-quote-right pull-right" />
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
                            {testimonial.company}
                          </div>
                        </div>
                      );
                    })}
                  </Slider>
                </div>
              </section>
              <section id="what-we-can-do">
                <div className="container">
                  <div className="section-heading text-center">
                    Our network expertise
                  </div>
                  <div>
                    <div className="row">
                      {NETWORK_EXPERTISE.map((step, idx) => {
                        return (
                          <div key={idx} className="col-sm-3">
                            <div
                              className={`${this.state.step == idx
                                ? 'active'
                                : ''} animated fadeInRight`}
                              style={{animationDelay: `${idx}s`}}>
                              <div className="icon">
                                <i className={step.icon} />
                              </div>
                              {step.content}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
              <section id="platform-stats">
                <div className="container">
                  <div className="col-sm-offset-1 col-sm-4">
                    <div
                      id="stats-devs"
                      className="highlight figure stat"
                      data-number="154">
                      154
                    </div>
                    <span className="desc">
                      developers and project managers
                    </span>
                  </div>
                  <div className="col-sm-4">
                    <div
                      id="stats-skills"
                      className="highlight figure stat"
                      data-number="89">
                      89
                    </div>
                    <span className="desc">
                      different development skills available
                    </span>
                  </div>
                  <div className="col-sm-3">
                    <div className="highlight figure">
                      <span id="stats-code" className="stat" data-number="70">
                        70
                      </span>
                      <span>k+</span>
                    </div>
                    <span className="desc">lines of code written</span>
                  </div>
                </div>
              </section>
            </div>}
        <section id="video-overlay" className={this.state.play ? 'on' : ''}>
          <div className="modal-backdrop fade in" />
          <div className="video-close">
            <button
              className="btn btn-borderless"
              title="Close"
              onClick={this.onCloseVideo.bind(this)}>
              <i className="fa fa-times fa-lg" />
            </button>
          </div>
          <div className="container">
            <YouTube
              videoId="RVVtyapBmuo"
              opts={this.state.youtubeOpts}
              onReady={this.onVideoReady.bind(this)}
              onPause={this.onPauseVideo.bind(this)}
            />
          </div>
        </section>

        <div className="outsource-widget">
          <div>Ready to outsource the right way?</div>
          <form
            name="task"
            role="form"
            ref="task_form"
            action="/start-outsource/">
            <input
              type="email"
              name="email"
              className="form-control"
              ref="email"
              required
              placeholder="Your email address"
            />
            <button className="btn">Go</button>
          </form>
        </div>

        <ShowCaseFooter />
      </ShowcaseContainer>
    );
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
