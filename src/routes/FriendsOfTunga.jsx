import React from 'react';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as UtilityActions from '../actions/UtilityActions';
import ShowcaseContainer from '../containers/ShowcaseContainer';
import ShowCaseFooter from '../containers/ShowCaseFooter';

import ComponentWithModal from '../components/ComponentWithModal';
import MetaTags from '../components/MetaTags';

import {OFFER_REQUEST_ITEMS, TASK_SCOPE_TASK, TASK_SCOPE_PROJECT} from '../constants/Api';
import {openCalendlyWidget} from '../utils/router';

class FriendOfTungaPage extends ComponentWithModal {

    constructor(props) {
        super(props);
        this.handleCopyEmail = this
            .handleCopyEmail
            .bind(this);
        this.handleCopySubject = this
            .handleCopySubject
            .bind(this);
        this.handleCopyText = this
            .handleCopyText
            .bind(this);
        this.handleLangSelection = this
            .handleLangSelection
            .bind(this);
        this.handleShareLinkedInPost = this
            .handleShareLinkedInPost
            .bind(this);
        this.state = {
            isCopied: true,
            isEngLangSelected: true
        };
    }

    renderHeaderContent() {
        return (
            <div>
                <h1>Help Us Create Tech Jobs for
                    <br/>
                    African Youths
                </h1>
                <h2>
                    Become a Friend of Tunga by referring leads to us. For each lead that becomes a
                    paying customer we donate 5% up to EUR1,000 to
                    <a href="">Bits Academy</a>, a network of schools that gives free tech education
                    to African youths from less privileged backgrounds</h2>
                <h2
                    style={{
                    'text-decoration': 'underline'
                }}>
                    <Link to="/friends-of-tunga-rules">
                        How it works in detail
                    </Link>
                </h2>
            </div>
        );
    }

    handleLangSelection() {
        this.setState(prevState => ({
            isEngLangSelected: !prevState.isEngLangSelected
        }));
    }

    handleCopyEmail(e) {
        e.preventDefault();
        var text = document.getElementById('email');
        var range = document.createRange();

        range.selectNode(text);
        window
            .getSelection()
            .addRange(range);
        document.execCommand('copy');
        this.setState({isCopied: false});
    }

    handleCopySubject(e) {
        e.preventDefault();
        var text = document.getElementById('subject');
        var range = document.createRange();

        range.selectNode(text);
        window
            .getSelection()
            .addRange(range);
        document.execCommand('copy');
        this.setState({isCopied: false});
    };

    handleCopyText(e) {
        e.preventDefault();
        var text = document.getElementById('text');
        var range = document.createRange();

        range.selectNode(text);
        window
            .getSelection()
            .addRange(range);
        document.execCommand('copy');
        this.setState({isCopied: false});
    }

    handleShareLinkedInPost() {
        var title = "Friends Of Tunga";
        var description = "Trouble finding good developers or looking to build an app? Please check out thi" +
                "s great initiative called Tunga. If you send me a message I can connect you to t" +
                "hem by e-mail. For every paying customer I refer to them they donate 5% up to EU" +
                "R1,000 to Bits Academy, a network of schools that gives free tech education to A" +
                "frican youths from less privileged backgrounds";
        window.open('https://www.linkedin.com/shareArticle?mini=true&url=http://tunga.io/friends-of-t' +
                'unga&title=' + title + '&summary=' + description + '&source=tunga.io');
    }

    render() {
        let meta_title = 'Tunga | Friends of Tunga';
        let meta_description = 'Become a Friend of Tunga by referring leads to us';

        return (
            <ShowcaseContainer
                className="friends-page"
                headerContent={this.renderHeaderContent()}>
                <MetaTags title={meta_title} description={meta_description}/>
                <div className="content">
                    <section className="container">
                        <p className="text-center">
                            <b>Who are we looking for?</b>
                        </p>
                        <div className="col-md-12 ">
                            <div className="col-md-4">
                                <div className="col-md-12 rectangle">
                                    <img
                                        className="col-md-2"
                                        height="50"
                                        width="50"
                                        src={require('images/showcase/Companies large and small.png')}/>
                                    <div className="col-md-10">
                                        <p>
                                            <b>Companies large and small
                                            </b>that want to develop their app or website</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="col-md-12 rectangle">
                                    <img
                                        className="col-md-2"
                                        height="50"
                                        width="50"
                                        src={require('images/showcase/software teams.png')}/>
                                    <div className="col-md-10">
                                        <p>
                                            <b>Software teams</b>
                                            that have trouble finding flexible access to good developers</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="col-md-12 rectangle">
                                    <img
                                        className="col-md-2"
                                        height="50"
                                        width="50"
                                        src={require('images/showcase/Startups.png')}/>
                                    <div className="col-md-10">
                                        <p>
                                            <b>Startups and innovation teams
                                            </b>that need to build a prototype or MVP</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="container">
                        <div className="col-md-12 ">
                            <div className="col-md-8 ">
                                <p
                                    style={{
                                    'padding-top': '21px',
                                    'padding-bottom': '19px'
                                }}>Send
                                    your friends a personal e-mail with bart@tunga.io in cc. To make it easy for
                                    you, we made an example email that you can copy or use to draft your own e-mail.</p>
                                <div className="col-md-12  rectangle-form">
                                    <div hidden={this.state.isCopied} className="rectangle-copied pull-right">
                                        <p className="text-center">Copied</p>
                                    </div>
                                    <form className="form-horizontal">
                                        <div className="col-md-11">
                                            <div className="form-group">
                                                <label className="col-md-2 control-label">To CC</label>
                                                <div className="col-md-10">
                                                    <div className="rectangle-subject">
                                                        <div
                                                            className="rectangle-copy pull-right"
                                                            style={{
                                                            'margin-right': '21px'
                                                        }}>
                                                            <a onClick={this.handleCopyEmail}><img src={require('images/showcase/copyicon.png')}/></a>
                                                        </div>
                                                        <p id="email">bart@tunga.io</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-md-2 control-label ">Subject</label>
                                                <div className="col-md-10">
                                                    <div className="rectangle-subject">
                                                        <div
                                                            className="rectangle-copy pull-right"
                                                            style={{
                                                            'margin-right': '21px'
                                                        }}>
                                                            <a onClick={this.handleCopySubject}><img src={require('images/showcase/copyicon.png')}/></a>
                                                        </div>
                                                        <p id="subject">Introduction to Tunga</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="col-md-10 col-md-offset-2">
                                                    <div className="rectangle-field">
                                                        <div className="rectangle-copy pull-right">
                                                            <a onClick={this.handleCopyText}><img src={require('images/showcase/copyicon.png')}/></a>
                                                        </div>
                                                        <div id="text">
                                                            <p>Hey,</p>

                                                            <p>I wanted to connect you with Bart Leijssenaar of Tunga (cc), which helps
                                                                companies build software and find good developers. Their mission is to create
                                                                tech jobs for African youths. I think this could be interesting for you and a
                                                                contact would be mutually beneficial.</p>

                                                            <p>
                                                                I’ll let you guys take it from here.</p>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-1">
                                            <div className="btn-group">
                                                <a
                                                    class="dropdown-toggle"
                                                    data-toggle="dropdown"
                                                    aria-haspopup="true"
                                                    aria-expanded="false">
                                                    {this.state.isEngLangSelected
                                                        ? <img src={require('images/showcase/English.png')}/>
                                                        : <img src={require('images/showcase/Dutch.png')}/>}<span
                                                        className="caret"
                                                        style={{
                'transform': 'rotate(90deg)', 'color':'black'
            }}></span>
                                                </a>
                                                <ul className="dropdown-menu">
                                                    <li>
                                                        <a onClick={this.handleLangSelection}>
                                                            {this.state.isEngLangSelected
                                                                ? <div><img src={require('images/showcase/Dutch.png')}/>Dutch</div>
                                                                : <div><img src={require('images/showcase/English.png')}/>English</div>}</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div
                                    className="rectangle-share"
                                    style={{
                                    'margin-top': '94px'
                                }}>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <a
                                                onClick={this.handleShareLinkedInPost}
                                                className="rectangle-social text-center col-md-9">
                                                <b>Share this post on LinkedIn</b>
                                            </a>
                                            <span
                                                style={{
                                                'padding-left': '15px'
                                            }}><img src={require('images/showcase/Linkedin.png')} alt="icon"/></span>
                                        </div>
                                        <div className="col-md-12">
                                            <div
                                                style={{
                                                'padding-top': '15px',
                                                'font-size': '16px'
                                            }}>
                                                <b>LinkedIn Post:</b>

                                                {this.state.isEngLangSelected
                                                    ? <span
                                                            className="pull-right"
                                                            style={{
                                                            'margin-right': '18px'
                                                        }}>
                                                            <ul
                                                                style={{
                                                                'list-style-type': 'none'
                                                            }}>
                                                                <li><a onClick={this.handleLangSelection} ><img className="Bitmap" src={require('images/showcase/English.png')}/></a></li>
                                                                <li><a onClick={this.handleLangSelection} ><img onClick={this.handleLangSelection} className="Bitmap" src={require('images/showcase/Dutch.png')}/></a></li>
                                                            </ul>
                                                        </span>

                                                    : <span
                                                        className="pull-right"
                                                        style={{
                                                        'margin-right': '18px'
                                                    }}>
                                                        <ul
                                                            style={{
                                                            'list-style-type': 'none'
                                                        }}>
                                                            <li><img onClick={this.handleLangSelection} className="Bitmap" src={require('images/showcase/Dutch.png')}/></li>
                                                            <li><img onClick={this.handleLangSelection} className="Bitmap" src={require('images/showcase/English.png')}/></li>
                                                        </ul>
                                                    </span>
}

                                            </div>
                                            <div className="rectangle-post">
                                                <p
                                                    style={{
                                                    'padding': '18px 23px 11px 19px'
                                                }}>

                                                    <p>
                                                        Trouble finding good developers or looking to build an app? Please check out
                                                        this great initiative called Tunga .
                                                    </p>
                                                    <p>
                                                        If you send me a message I can connect you to them by e-mail. For every paying
                                                        customer I refer to them they donate 5% up to EUR1,000 to Bits Academy, a
                                                        network of schools that gives free tech education to African youths from less
                                                        privileged backgrounds
                                                    </p>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <ShowCaseFooter/>
            </ShowcaseContainer>
        );
    }
}

function mapStateToProps(state) {
    return {Utility: state.Utility};
}

function mapDispatchToProps(dispatch) {
    return {
        UtilityActions: bindActionCreators(UtilityActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(FriendOfTungaPage);
