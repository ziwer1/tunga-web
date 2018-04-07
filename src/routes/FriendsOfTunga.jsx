import React from 'react';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import CopyToClipboard from 'react-copy-to-clipboard';

import * as UtilityActions from '../actions/UtilityActions';
import ShowcaseContainer from '../containers/ShowcaseContainer';
import ShowCaseFooter from '../containers/ShowCaseFooter';

import ComponentWithModal from '../components/ComponentWithModal';
import MetaTags from '../components/MetaTags';
import {nl_to_br} from '../utils/html';

const L10N_RESOURCES = {
    en: {
        flag: '../images/showcase/English.png',
        linkedin:
            'Trouble finding good developers or looking to build an app? Please check out this great initiative called Tunga .\n' +
            '\n' +
            'If you send me a message I can connect you to them by e-mail. For every paying customer I refer to them they donate 5% up to EUR1,000 to Bits Academy, a network of schools that gives free tech education to African youths from less privileged backgrounds',
        email: {
            subject: 'Introduction to Tunga',
            body:
                'Hey,\n' +
                '\n' +
                'I wanted to connect you with Bart Leijssenaar of Tunga (cc), which helps companies build software and find good developers. Their mission is to create tech jobs for African youths. I think this could be interesting for you and a contact would be mutually beneficial.\n' +
                '\n' +
                'I’ll let you guys take it from here.',
            meta: {
                cc: 'To CC:',
                subject: 'Subject:',
            },
        },
    },
    nl: {
        flag: '../images/showcase/Dutch.png',
        linkedin:
            'Problemen met het vinden van goede ontwikkelaars of het bouwen van een app? Bekijk dit geweldige initiatief genaamd Tunga.\n' +
            '\n' +
            'Als u mij een bericht stuurt, kan ik u via e-mail met hen verbinden. Voor elke betalende klant die ik verwijs, geven ze 5% tot maximaal EUR1.000 aan Bits Academy, een netwerk van scholen die gratis technologieonderwijs geven aan Afrikaanse jongeren met een minder bevoorrechte achtergrond',
        email: {
            subject: 'Introductie tot Tunga',
            body:
                'Hallo,\n' +
                '\n' +
                'Ik wilde je verbinden met Bart Leijssenaar van Tunga (cc), die bedrijven helpt met het bouwen van software en het vinden van goede ontwikkelaars. Hun missie is het creëren van technische banen voor Afrikaanse jongeren. Ik denk dat dit interessant voor je zou kunnen zijn en een contact zou voor beide partijen voordelig zijn.\n' +
                '\n' +
                'Ik laat jullie het van hier afhalen.',
            meta: {
                cc: 'Aan CC:',
                subject: 'Onderwerpen',
            },
        },
    },
};

class FriendOfTungaPage extends ComponentWithModal {
    constructor(props) {
        super(props);

        this.state = {
            lang: 'en',
            langClass: '',
            isCopied: true,
            isEngLangSelected: true,
        };
    }

    onSelectLanguage(lang) {
        this.setState({lang, langClass: ''});
    }

    getLinkedInShareLink() {
        return `https://www.linkedin.com/shareArticle?mini=true&url=http://tunga.io/friends-of-tunga&title=${encodeURIComponent(
            'Friends Of Tunga',
        )}&summary=${encodeURIComponent(
            L10N_RESOURCES[this.state.lang].linkedin,
        )}&source=tunga.io`;
    }

    renderLanguageWidget() {
        return (
            <div
                className={`lang-list ${this.state.lang} ${
                    this.state.langClass
                }`}>
                <div className="controls">
                    <i
                        className="fa fa-caret-down open"
                        onClick={() => {
                            this.setState({langClass: ''});
                        }}
                    />
                    <i
                        className="fa fa-caret-left closed"
                        onClick={() => {
                            this.setState({langClass: 'open'});
                        }}
                    />
                </div>
                <div className="flags">
                    <img
                        className="en"
                        src={require('../images/showcase/English.png')}
                        onClick={this.onSelectLanguage.bind(this, 'en')}
                    />
                    <img
                        className="nl"
                        src={require('../images/showcase/Dutch.png')}
                        onClick={this.onSelectLanguage.bind(this, 'nl')}
                    />
                </div>
            </div>
        );
    }

    renderHeaderContent() {
        return (
            <div id="friends-header" className="showcase-header">
                <h1>
                    Help Us Create Tech Jobs for
                    <br />
                    African Youths
                </h1>
                <p id="sub-heading">
                    Become a Friend of Tunga by referring leads to us. For each
                    lead that becomes a paying customer we donate 5% up to EUR
                    1,000 to{' '}
                    <a href="http://bitsacademy.org/" target="_blank">
                        Bits Academy
                    </a>, a network of schools that gives free tech education to
                    African youths from less privileged backgrounds
                </p>
                <p id="link">
                    <Link to="/friends-of-tunga-rules">
                        How it works in detail
                    </Link>
                </p>
            </div>
        );
    }

    render() {
        let meta_title = 'Tunga | Friends of Tunga',
            meta_description =
                'Become a Friend of Tunga by referring leads to us';

        let localeText = L10N_RESOURCES[this.state.lang];

        return (
            <ShowcaseContainer
                className="friends-page"
                headerContent={this.renderHeaderContent()}>
                <MetaTags title={meta_title} description={meta_description} />
                <div className="content">
                    <section id="who-we-are">
                        <div className="container">
                            <div className="who-we-are">
                                Who are we looking for?
                            </div>
                            <div className="text-center">
                                <div className="looking-for-options">
                                    <div className="option">
                                        <div className="first-content-box">
                                            <div className="img-container">
                                                <img
                                                    height="50"
                                                    width="50"
                                                    src={require('images/showcase/Companies large and small.png')}
                                                />
                                            </div>
                                            <div className="text-container">
                                                <p>
                                                    <strong>
                                                        Companies large and
                                                        small
                                                    </strong>{' '}
                                                    that want to develop their
                                                    app or website
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="option">
                                        <div className="first-content-box">
                                            <div className="img-container">
                                                <img
                                                    height="50"
                                                    width="50"
                                                    src={require('images/showcase/software teams.png')}
                                                />
                                            </div>
                                            <div className="text-container">
                                                <p>
                                                    <strong>
                                                        Software teams{' '}
                                                    </strong>
                                                    that have trouble finding
                                                    flexible access to good
                                                    developers
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="option">
                                        <div className="first-content-box">
                                            <div className="img-container">
                                                <img
                                                    height="50"
                                                    width="50"
                                                    src={require('images/showcase/Startups.png')}
                                                />
                                            </div>
                                            <div className="text-container">
                                                <p>
                                                    <strong>
                                                        Startups and innovation
                                                        teams
                                                    </strong>{' '}
                                                    that need to build a
                                                    prototype or MVP
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="container">
                            <div className="middle-content-box">
                                Send your friends a personal e-mail with{' '}
                                <a href="mailto:bart@tunga.io">bart@tunga.io</a>{' '}
                                in cc. To make it easy for you, we made an
                                example email that you can copy or use to draft
                                your own e-mail.
                            </div>
                        </div>
                    </section>

                    <section id="referral">
                        <div className="container">
                            <div className="referral-widgets">
                                <div className="cc-email">
                                    {this.renderLanguageWidget()}
                                    <div className="cc-email-widget">
                                        <div className="meta">
                                            <div className="item">
                                                {localeText.email.meta.cc}
                                            </div>
                                            <div className="item">
                                                {localeText.email.meta.subject}
                                            </div>
                                        </div>
                                        <div className="values">
                                            <div className="item">
                                                <CopyToClipboard
                                                    text={
                                                        localeText.email.subject
                                                    }>
                                                    <div>
                                                        <i className="fa fa-clone" />
                                                        bart@tunga.io
                                                    </div>
                                                </CopyToClipboard>
                                            </div>
                                            <div className="item">
                                                <CopyToClipboard
                                                    text={
                                                        localeText.email.subject
                                                    }>
                                                    <div>
                                                        <i className="fa fa-clone" />
                                                        {
                                                            localeText.email
                                                                .subject
                                                        }
                                                    </div>
                                                </CopyToClipboard>
                                            </div>
                                            <div className="item body">
                                                <CopyToClipboard
                                                    text={
                                                        localeText.email.body
                                                    }>
                                                    <div>
                                                        <i className="fa fa-clone" />
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html: nl_to_br(
                                                                    localeText
                                                                        .email
                                                                        .body,
                                                                ),
                                                            }}
                                                        />
                                                    </div>
                                                </CopyToClipboard>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="linkedin-share">
                                    <div className="linkedin-share-widget">
                                        <a
                                            href={this.getLinkedInShareLink()}
                                            target="_blank"
                                            className="btn btn-linkedin-share">
                                            Share this post on Linkedin
                                        </a>
                                        <i className="fa fa-linkedin-square" />
                                    </div>
                                    <div className="share-title">
                                        Linkedin Post:
                                        {this.renderLanguageWidget()}
                                    </div>
                                    <div className="share-text">
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: nl_to_br(
                                                    localeText.linkedin,
                                                ),
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <ShowCaseFooter />
            </ShowcaseContainer>
        );
    }
}

function mapStateToProps(state) {
    return {Utility: state.Utility};
}

function mapDispatchToProps(dispatch) {
    return {
        UtilityActions: bindActionCreators(UtilityActions, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendOfTungaPage);
