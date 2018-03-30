import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Reveal from 'react-reveal';
import ShowcaseContainer from '../containers/ShowcaseContainer';
import ShowCaseFooter from '../containers/ShowCaseFooter';
import MetaTags from '../components/MetaTags';

import {openCalendlyWidget, showCallWidget,} from '../utils/router';


import * as SkillPageActions from '../actions/SkillPageActions';
import {nl_to_br} from '../utils/html';

import Progress from '../components/status/Progress';
import {Button, Form, FormControl, FormGroup} from "react-bootstrap";
import Avatar from "../components/Avatar";
import {Link} from "react-router";

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
        <div className="col-lg-10 skill-page skill-header">
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
        </div>
        <div className="col-sm-5 skill-page sub_header ">
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
        <div className="col-sm-12">
          {/*clearing grid hack*/}
        </div>
        <div className="col-sm-5">
          <div>
            <a className="btn skill-page schedule_call" href="/call/">
              Schedule a call</a>
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
              ? <section className="skill-page skill-pitch">
                <div className="container">
                  <div className="col-sm-8 skill-page pitch_header">
                    {skill_page.pitch_header}
                  </div>
                  <div className="col-sm-5">
                    <hr className="hr-tunga"/>
                  </div>
                  <div className="col-sm-12">
                  </div>
                  <div className="col-sm-7 skill-page pitch_body">
                    {skill_page.pitch_body}
                  </div>
                  {skill_page.pitch_image ?
                    <div className="col-sm-3">
                      <img src={skill_page.pitch_image.url} alt="tunga_developer.jpg"
                           style={{width: '300px', height: '300px'}}/>
                    </div>
                    : null}

                </div>
              </section>
              : null}
            <section id="press" className="skill-page">
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

            <section className="skill-page skill_content">
              <div className="container">
                <div className="row skill-page">

                  <div className="col-md-offset-2 col-md-8 content_header">
                    <p>{skill_page.content_header}</p>
                  </div>

                  <div className="col-md-offset-4 col-md-4 col-md-offset-4">
                    <hr className="hr-tunga"/>
                  </div>

                  <div className="col-md-8">
                    <p>{skill_page.content_sub_header}</p>
                  </div>
                  <div className="col-md-12">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: nl_to_br(skill_page.content),
                      }}>

                    </p>
                  </div>

                  <div className="col-md-12 skill-page content_schedule_call">
                    <a className="btn btn-callout" href="/call/">
                      Schedule a call with us</a>
                  </div>


                </div>
              </div>
            </section>

            {skill_page.profiles && skill_page.profiles.length
              ? <section id="skill-profiles" className="skill-page skill-profile">
                  <div className='col-md-offset-4 row'>
                    {skill_page.profiles.map(profile => {
                      return (
                        <div className="col-sm-3 skill-profile-border">
                          <div className="col-sm-12 skill-page card user-card">
                            <div className="skill-page skill-profile-avatar">
                              <Avatar
                                src={profile.user.avatar_url}
                                size="large"
                              />
                            </div>

                            <div className="col-sm-12 skill-page skill-profile-name">
                              <p><strong>{profile.user.display_name}</strong>
                                <br/>
                                {profile.user.profile &&
                                (profile.user.profile.city ||
                                  profile.user.profile.country_name)
                                  ? `${profile.user.profile
                                    .city}, ${profile.user.profile
                                    .country_name}`
                                  : null}
                              </p>
                            </div>
                            <div
                              className="intro"
                              dangerouslySetInnerHTML={{
                                __html: nl_to_br(profile.intro),
                              }}
                            />
                            <div className="skill-page skill-profile-skills">
                              {profile.user.profile && profile.user.profile.skills ?
                                <div>
                                  {this.reorderProfileSkills(profile.user.profile.skills)
                                    .slice(0, 4)
                                    .map(skill => {
                                      return (
                                        <span className="skill-profile-skills-items">
                                                    {skill.name}
                                                  </span>
                                      );
                                    })}
                                </div> : null}

                            </div>
                            <div className="skill-page skill-profile-url">
                              {profile.user.profile && profile.user.profile.skills ?
                                <a href={'/developer/' + profile.user.username}>View full profile</a>
                                : null}
                            </div>
                          </div>

                        </div>
                      );
                    })}
                </div>
              </section>
              :
              null}

            <section id="story" className="skill-page story_interlude_one_image">
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
                id="story-interlude-one" className="skill-page story_interlude"
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
                id="story-interlude-two" className="skill-page story_interlude"
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
                  className="readable"
                  dangerouslySetInnerHTML={{
                    __html: skill_page.story_body_three,
                  }}
                />
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
                        Address, Street, postal code, Lagos, Nigeria
                      </p>
                      <br/>

                      <p className="">hello@tunga.io</p>
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
                          <FormControl componentClass="textarea" placeholder="Type your message here"/>
                        </FormGroup>
                        <br/>
                        <br/>
                        <br/>
                        <div className="pull-right">
                          <Button type="submit">Send</Button>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        }

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
