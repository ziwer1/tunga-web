import React from 'react';
import { Link } from 'react-router';
import { Affix } from 'react-overlays';

import { openTaskWizard } from '../utils/tasks';
import { showWizard, showCallWidget, openCalendlyWidget } from '../utils/router';

import ChatWindow from '../containers/ChatWindow';

export default class ShowcaseContainer extends React.Component {

    render() {
        return (
            <div className={"showcase "+this.props.className}>
                <header>
                    <Affix affixClassName="navbar-fixed-top" offsetTop={60}>
                        <nav className="navbar">
                            <div className="navbar-header">
                                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                                    <span className="sr-only">Toggle navigation</span>
                                    <i className="fa fa-ellipsis-v fa-lg"/>
                                </button>
                                <Link className="navbar-brand" to="/"><img src={require('../images/header-logo.png')} /></Link>
                            </div>

                            <div id="navbar" className="collapse navbar-collapse">
                                <ul className="nav navbar-nav navbar-right nav-actions">
                                    <li><a className="primary" onClick={() => {openCalendlyWidget()}}>Request demo</a></li>
                                    <li><Link to="/signin">Login</Link></li>
                                </ul>
                                <ul className="nav navbar-nav navbar-right">
                                    <li><Link to="/how-it-works" activeClassName="active">How it works</Link></li>
                                    <li><Link to="/pricing" activeClassName="active">Pricing</Link></li>
                                    <li><a href="https://blog.tunga.io" target="_blank">Blog</a></li>
                                </ul>
                            </div>
                        </nav>
                    </Affix>
                    <div className="content">
                        <div className="container">
                            {this.props.headerContent}
                        </div>
                    </div>
                </header>

                {this.props.children}

                <ChatWindow channelId={this.props.chatId || null} />
            </div>
        );
    }
}
