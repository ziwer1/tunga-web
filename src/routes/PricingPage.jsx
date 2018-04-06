import React from 'react';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as UtilityActions from '../actions/UtilityActions';
import ShowcaseContainer from '../containers/ShowcaseContainer';
import ShowCaseFooter from '../containers/ShowCaseFooter';
import SectionHeading from '../components/SectionHeading';

import ComponentWithModal from '../components/ComponentWithModal';
import MetaTags from '../components/MetaTags';

import {
    OFFER_REQUEST_ITEMS,
    TASK_SCOPE_TASK,
    TASK_SCOPE_PROJECT,
} from '../constants/Api';
import {openCalendlyWidget} from '../utils/router';

let checkMark = <i className="fa fa-check" />;

let crossMark = <i className="fa fa-times" />;

const OFFER_DETAILS = [
    {
        title: 'Projects',
        description: (
            <p>
                Outsource entire software projects<br/>
                Clean up your bugs/features<br/>
                backlog Get started quickly<br/>
            </p>
        ),
        perks: [
            'Development hours',
            '€20/hr',
            'Project management hours*',
            '€40/hr',
        ],
        disclaimer: '* Project Management hours are Optional'
    },
    {
        title: 'Dedicated developers',
        description: (
            <p>
                Reinforce your team with remote developers <br/>
                Full/part-time. Temporary/permanently.<br/>
                Instant access to Africa’s best programmers
            </p>
        ),
        perks: [
            '',
            'Development hours start',
            '€19',
            ''
        ],
        disclaimer: '* Schedule a call to find out more'
    },
    {
        title: 'Recruitment ',
        description: (
            <p>
                Expand your team with African developers Tap into our extensive
                developer network Quickly find, select and recruit the best fit
            </p>
        ),
        perks: [
            '',
            'Custom pricing',
            '',
            ''
        ],
        disclaimer: '* Schedule a call to find out more'
    },
];

class PricingPage extends ComponentWithModal {
    renderHeaderContent() {
        return (
            <div id="pricing-header" className="showcase-header">
                <h1>High quality and service level at affordable fees</h1>
                <p id="sub-heading">
                    We calculate our fees transparently and stick with that. No
                    excuses, no discussions, no additional costs
                </p>
                <p>
                    <a
                        onClick={this.onScheduleCall.bind(this)}
                        className="btn btn-callout">
                        Schedule a call
                    </a>
                </p>
            </div>
        );
    }

    onScheduleCall() {
        openCalendlyWidget();
    }

    render() {
        let meta_title = 'Tunga | Pricing';
        let meta_description =
            'Tunga offers flexible and affordable pricing. Choose from 3 different plans.';

        return (
            <ShowcaseContainer
                className="pricing-page"
                headerContent={this.renderHeaderContent()}>
                <MetaTags title={meta_title} description={meta_description} />

                <section id="pricing-options">
                    <div className="container">
                        <div className="pricing-slides">
                            {OFFER_DETAILS.map((offer, idx) => {
                                return (
                                    <div key={offer.key} className="slide">
                                        <SectionHeading>{offer.title}</SectionHeading>
                                        <div className="description">
                                            {offer.description}
                                        </div>
                                        <div className="perks">
                                            <div>
                                                {offer.perks &&
                                                offer.perks.map(
                                                    comp => {
                                                        return (
                                                            <p>
                                                                {
                                                                    comp
                                                                }
                                                            </p>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </div>
                                        <div className="disclaimer">{offer.disclaimer}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
                <section id="pricing-action">
                    <div className="container">
                        <p className="text-center">
                            <button
                                onClick={this.onScheduleCall.bind(this)}
                                className="btn btn-callout">
                                Schedule a call
                            </button>
                        </p>
                    </div>
                </section>
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
export default connect(mapStateToProps, mapDispatchToProps)(PricingPage);
