import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Reveal from 'react-reveal';
import ShowcaseContainer from '../containers/ShowcaseContainer';
import ShowCaseFooter from '../containers/ShowCaseFooter';
import MetaTags from '../components/MetaTags';

import {isTungaDomain, openCalendlyWidget, showCallWidget,} from '../utils/router';


import * as SkillPageActions from '../actions/SkillPageActions';
import {nl_to_br} from '../utils/html';

import Progress from '../components/status/Progress';

class SkillPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state || {},
      title: (
        <span>
          Discuss your project within<br/>
          24 hours!
        </span>
      ),
      subtitle: null,
      step: 1,
      pageClass: 'task-wizard-page lander',
      showVideo: false,
    };
  }

  componentDidMount() {
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
  }

  onStepChange(step, idx, all_steps) {
    this.setState({
      title: step && step.title ? step.title : '',
      subtitle: step && step.subtitle ? step.subtitle : null,
      step: idx ? idx + 1 : -1,
    });
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

  getTaskId() {
    if (this.props.params) {
      return this.props.params.taskId;
    }
    return null;
  }

  renderHeaderContent() {
    let dlp_phrase = this.getDLPPhrase(),
      {SkillPage: {detail: {skill_page, isRetrieving, error}}} = this.props;
    let isSkillPage = this.state.isSkillPage && !error.retrieve;

    return (
      <div className="row">
        <div className="col-sm-10">
          <div className="pitch">
            <h1>
              {isSkillPage && skill_page.welcome_header
                ? <h1
                  dangerouslySetInnerHTML={{
                    __html: nl_to_br(skill_page.welcome_header),
                  }}
                />
                : <h1>
                    Getting software projects done is hard.<br/>
                    We make it easy REALLY.
                  </h1>}
            </h1>
            <div className="details">
              {isSkillPage && skill_page.welcome_sub_header
                ? <p
                  dangerouslySetInnerHTML={{
                    __html: nl_to_br(skill_page.welcome_sub_header),
                  }}
                />
                : <p>
                    Tunga enables you to have super-bright{' '}
                  {this.getDLPDesc() || 'developers'} from Africa work on your
                    software project in a productive, friendly and worthwhile
                    way.
                  </p>}
            </div>
            <div className="details">
              <a className="btn btn-callout btn-main-cta" href="/call/">
                <i class="tunga-icon-rocket"/>Schedule a call</a>
            </div>
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
    let {SkillPage: {detail: {skill_page, isRetrieving, error}}} = this.props;
    let isSkillPage = this.state.isSkillPage && !error.retrieve;

    return (
      <ShowcaseContainer
        className={`landing-page ${this.state.pageClass} ${isSkillPage &&
        'skill-page'}`}
        headerContent={this.renderHeaderContent()}
        headerVideo={false && this.state.showVideo}
        hasArrow={true}
        chatId={this.props.params ? this.props.params.chatId : null}
        closeChat={this.state.closeChat}>
        <MetaTags title={meta_title} description={meta_description}/>

        {isRetrieving
          ? <Progress/>
          : <div>
            {isSkillPage
              ? <section id="pitch">
                <div className="container">
                  <div className="section-heading col-sm-8">
                    {skill_page.pitch_header}
                  </div>
                  <div className="section-heading col-sm-3">
                    {skill_page.pitch_body}
                  </div>
                  <div className="section-heading col-sm-8">
                    <img src="#" alt="tunga_developer.jpg"/>
                  </div>

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
                            Finding great developers is hard nowadays, it is
                            a journey that often takes too much time and
                            money. We're here to help. Tunga not only gives
                            you flexible access to a community of highly
                            committed developers and at affordable rates, we
                            also have a simple process in place to make sure
                            you can stay on top of quality and planning. We
                            get that you want to have overview at all times
                            over the progress of your project. That is why
                            Tunga offers unique automated features that will
                            allow you to smoothly build great products in a
                            cost effective way. Triggered?{' '}
                            <a href="#">
                              <p>Talk with us</p>
                            </a>
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                      </div>
                    </div>
                  </div>
                </section>
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
                                    ? `${profile.user.profile
                                      .city}, ${profile.user.profile
                                      .country_name}`
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
                                  <Link
                                    to="/start"
                                    className="btn btn-block">
                                    Start working with{' '}
                                    {profile.user.first_name}
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
                <section id="story">
                  <div className="container">
                    <div
                      className="section-heading text-center"
                      dangerouslySetInnerHTML={{
                        __html: nl_to_br(skill_page.story_header),
                      }}
                    />
                    <div
                      className="readable"
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
                          __html: nl_to_br(
                            skill_page.story_interlude_one_text,
                          ),
                        }}
                      />
                      <Link to="/start" className="cta">
                        {skill_page.story_interlude_one_cta}
                      </Link>
                    </div>
                  </div>
                  <div className="container">
                    <div
                      className="readable"
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
                          __html: nl_to_br(
                            skill_page.story_interlude_two_text,
                          ),
                        }}
                      />
                    </div>
                  </div>
                  <div className="container">
                    <div
                      className="readable"
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
                  </div>
                </section>
                <section id="what-we-can-do">
                  <div className="container">
                    <div className="section-heading text-center">
                      Our network expertise
                    </div>
                    <div>

                    </div>
                  </div>
                </section>
              </div>}

            <div className="outsource-widget">
              <div>Ready to outsource the right way?</div>
              <form
                name="task"
                role="form"
                ref="task_form"
                action={`${isTungaDomain()
                  ? ''
                  : 'https://tunga.io'}/start-outsource/`}>
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
          </div>}

        <ShowCaseFooter/>
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

export default connect(mapStateToProps, mapDispatchToProps)(SkillPage);
