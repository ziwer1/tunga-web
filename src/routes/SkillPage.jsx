import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Reveal from 'react-reveal';
import {Link} from 'react-router';
import {Button, Form, FormControl, FormGroup} from 'react-bootstrap';

import ShowcaseContainer from '../containers/ShowcaseContainer';
import ShowCaseFooter from '../containers/ShowCaseFooter';
import MetaTags from '../components/MetaTags';
import Progress from '../components/status/Progress';
import Avatar from '../components/Avatar';
import LandingPage from '../routes/LandingPage';
import SectionHeading from '../components/SectionHeading';

import * as SkillPageActions from '../actions/SkillPageActions';

import {nl_to_br} from '../utils/html';
import {openCalendlyWidget, showCallWidget} from '../utils/router';

class SkillPage extends LandingPage {

    constructor(props) {
        super(props);
        this.state = {pageClass: 'new-skill-page'};
    }

    componentDidMount() {
        super.componentDidMount();

        let skill = this.getDLPTag();
        if (skill) {
            const {SkillPageActions} = this.props;
            this.setState({isSkillPage: true});
            SkillPageActions.retrieveSkillPage(skill);
        }

        let lp = this;
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
            ['developers', 'coders', 'programmers'].indexOf(
                location.query.dlp_desc,
            ) > -1
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
        let dlp_phrase = this.getDLPPhrase(),
            {
                SkillPage: {detail: {skill_page, isRetrieving, error}},
            } = this.props;

        if(error.retrieve) {
            return super.renderHeaderContent();
        }

        return (
            <div id="lander-header" className="skill-header showcase-header">
                <h1>
                    {skill_page.welcome_header || 'Unleasing Africa’s Tech Talent'}
                </h1>
                <div className="sub-header">
                    {skill_page.welcome_sub_header || (
                        <div>
                            Small and large businesses from all over the
                            world use Tunga for hiring African software
                            engineers to address their most pressing
                            software development needs.
                        </div>
                    )}
                </div>
                <div>
                    <button
                        onClick={this.onScheduleCall}
                        className="btn btn-callout">
                        {skill_page.welcome_cta || 'Schedule a call'}
                    </button>
                </div>
            </div>
        );
    }

    renderFreeHeaderSection() {
        let dlp_phrase = this.getDLPPhrase(),
            {
                SkillPage: {detail: {skill_page, isRetrieving, error}},
            } = this.props;

        if(error.retrieve) {
            return super.renderFreeHeaderSection();
        }
        return null;
    }

    renderMainContent() {
        let dlp_phrase = this.getDLPPhrase(),
            {
                SkillPage: {detail: {skill_page, isRetrieving, error}},
            } = this.props;

        if(error.retrieve) {
            return super.renderMainContent();
        }
        return (
            <div>
                <section id="pitch">
                    <div className="container">
                        <div className="pitch-text">
                            <SectionHeading>
                                {skill_page.pitch_header}
                            </SectionHeading>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: nl_to_br(skill_page.pitch_body),
                                }}
                            />
                        </div>
                        {skill_page.pitch_image?(
                            <div className="pitch-image">
                                <img src={skill_page.pitch_image}/>
                            </div>
                        ):null}
                    </div>
                </section>

                {this.renderPressSection()}

                <section id="story">
                    <div className="container">
                        <div
                            className="section-heading text-center"
                            dangerouslySetInnerHTML={{
                                __html: nl_to_br(skill_page.content_header),
                            }}
                        />
                        <div
                            className="readable"
                            dangerouslySetInnerHTML={{
                                __html: skill_page.content,
                            }}
                        />

                        {skill_page.content_image?(
                            <img src={skill_page.content_image}/>
                        ):null}

                        <div
                            className="readable"
                            dangerouslySetInnerHTML={{
                                __html: skill_page.story_body_two,
                            }}
                        />

                        <div
                            className="readable"
                            dangerouslySetInnerHTML={{
                                __html: skill_page.story_body_three,
                            }}
                        />
                        <div>
                            <button onClick={this.onScheduleCall}
                                    className="btn btn-callout">
                                Schedule a call with us
                            </button>
                        </div>
                    </div>
                </section>
                {skill_page.profiles && skill_page.profiles.length
                    ? <section id="skill-profiles">
                        <div className="container">
                            <div className="row">
                                {skill_page.profiles.map(profile => {
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
                <section
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
                        {skill_page.story_interlude_one_cta?(
                            <Link to="/start" className="cta">
                                {skill_page.story_interlude_one_cta}
                            </Link>
                        ):null}
                    </div>
                </section>
                {/*
                    <section
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
                    </section>
                */}
            </div>
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
