import React from 'react';
import Helmet from "react-helmet";
import Joyride from 'react-joyride';

import NavBar from '../components/NavBar';
import SideBar from './SideBar';
import ChatWindow from '../containers/ChatWindow';

import { isAdmin, isProjectManager, isProjectOwner } from '../utils/auth';

export default class AppWrapper extends React.Component {

    handleAppClick() {
        const { onAppClick } = this.props;
        if(onAppClick) {
            onAppClick();
        }
    }

    render() {
        const {children, location} = this.props;

        let steps = [
            {
                title: 'Welcome to Tunga',
                text: 'This is the main navigation area',
                selector: '#sidebar',
                position: 'right'
            },
            {
                title: 'Home',
                text: 'A quick glance at all your notifications',
                selector: '#sidebar-home',
                position: 'right'
            },
            {
                title: 'Work',
                text: 'Browse tasks and projects on Tunga',
                selector: '#sidebar-work',
                position: 'right'
            }
        ];

        if(isProjectOwner() || isProjectManager() || isAdmin()) {
            steps = [
                ...steps,
                {
                    title: 'Post Work',
                    text: 'Create projects or tasks',
                    selector: '#sidebar-post-work',
                    position: 'right'
                }
            ]
        }

        steps = [
            ...steps,
            {
                title: 'Messages',
                text: 'Start conversations and check on your new messages',
                selector: '#sidebar-messages',
                position: 'right'
            },
            {
                title: 'Tribe',
                text: 'Browse a catalog of available developers and search for new developers to add to your team based on the skills you desire',
                selector: '#sidebar-tribe',
                position: 'right'
            },
            {
                title: 'Payments',
                text: 'Find invoices for all your payments',
                selector: '#sidebar-payments',
                position: 'right'
            },
            /*{
                title: 'Support',
                text: 'Find helpful information about Tunga',
                selector: '#sidebar-support',
                position: 'right'
            },*/
            {
                title: 'Search',
                text: 'Search for developers, tasks and messages',
                selector: '#navbar-search',
                position: 'bottom'
            },
            {
                title: 'My Account',
                text: 'Manage your profile and settings',
                selector: '#navbar-account',
                position: 'bottom'
            }
        ];

        if(!isAdmin()) {
            steps = [
                ...steps,
                {
                    title: 'Support',
                    text: 'Talk with someone at Tunga',
                    selector: '#support-chat',
                    position: 'top'
                }
            ]
        }

        steps = [
            ...steps,
            {
                title: 'My Profile',
                text: 'Manage your profile and settings',
                selector: '#inner-my-profile',
                position: 'top'
            },
            {
                title: 'Tribe',
                text: 'View your team of developers',
                selector: '#inner-tribe',
                position: 'top'
            },
            {
                title: 'Messages',
                text: 'Start conversations and check on your new messages',
                selector: '#inner-messages',
                position: 'top'
            },
            {
                title: 'Running Tasks',
                text: 'View your on-going tasks',
                selector: '#inner-running-tasks',
                position: 'top'
            },
            {
                title: 'Estimates',
                text: 'Manage your task estimates',
                selector: '#inner-estimates',
                position: 'top'
            },
            {
                title: 'Quotes',
                text: 'Manage your task quotes',
                selector: '#inner-quotes',
                position: 'top'
            }

        ];

        steps = [
            ...steps,
            {
                title: 'View Applications',
                text: 'View Task Applications from developers',
                selector: '#view-applications-btn',
                position: 'bottom'
            },
            {
                title: 'Project Board',
                text: 'View Project Board',
                selector: '#project-board-btn',
                position: 'bottom'
            },
            {
                title: 'Make Payment',
                text: 'Make payments to developers',
                selector: '#make-payment-btn',
                position: 'bottom'
            },
            {
                title: 'Rate Developers',
                text: 'Rate Project Developers',
                selector: '#rate-developers-btn',
                position: 'bottom'
            },
            {
                title: 'Participation Shares',
                text: 'Participation shares',
                selector: '#participation-shares-btn',
                position: 'bottom'
            },
            {
                title: 'Configure updates',
                text: 'Manage updates',
                selector: '#configure-updates-btn',
                position: 'bottom'
            },
            {
                title: 'Settings',
                text: 'Manage Settings',
                selector: '#menu-btn',
                position: 'bottom'
            },
            {
                title: 'Github Repo',
                text: 'View project or task on github',
                selector: '#github-btn',
                position: 'left'
            },
            {
                title: 'Slack team',
                text: 'Go to project or task slack team',
                selector: '#slack-btn',
                position: 'left'
            },
            {
                title: 'Comment Area',
                text: 'View activity about your task or project',
                selector: '#comment-box',
                position: 'top'
            },
            {
                title: 'Comment Widget',
                text: 'Share messages and upload files',
                selector: '#comment-widget',
                position: 'top'
            },
            {
                title: 'Sidebar Bar',
                text: 'View your task or project details',
                selector: '#sidebox',
                position: 'left'
            }

        ];

        return (
            <div className="app-wrapper dashboard" onClick={this.handleAppClick.bind(this)}>
                <Helmet
                    title="Tunga"
                    meta={[
                                {
                                "name": "description",
                                "content": "Tunga is a market network that allows you to build a flexible team " +
                                 "of skilled African software programmers, that you can mobilize on-demand."
                                 }
                              ]}
                />

                <Joyride ref="joyride"
                         steps={steps}
                         run={!__PRODUCTION__ || __PRERELEASE__}
                         debug={!__PRODUCTION__ || __PRERELEASE__}
                         autoStart={!__PRODUCTION__ || __PRERELEASE__}
                         type="continuous"
                         showStepsProgress={true}
                         showSkipButton={true}/>

                <NavBar location={location}/>

                <SideBar location={location}/>

                <div className="main-content">
                    <div className="main">
                        {children}
                    </div>
                </div>

                {!isAdmin()?(
                    <ChatWindow />
                ):null}
            </div>
        );
    }
}
