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

let checkMark = <i className="fa fa-check"/>;

let crossMark = <i className="fa fa-times"/>;

const OFFER_DETAILS = [
  {
    title: 'Projects',
    description: ( 
      <p>
        Outsource entire software projects
        Clean up your bugs/features backlog
        Get started quickly
      </p> 
    ),
    perks: [
      'Development hours',
      '€20/hr',
      'Project management hours*',
      '€40/hr',  
      '*Project Management hours are Optional',
    ]
  }, {
    title: 'Dedicated developers',
    description: (
        <p>
            Reinforce your team with remote developers
            Full/part-time. Temporary/permanently.
            Instant access to Africa’s best programmers
        </p>
    ), 
    perks: [
      'Development hours start',
      '€19', 
      '',
      '',
      'Schedule a call to find out more'
    ]
  }, {
    title: 'Recruitment ',
    description: (
        <p>
          Expand your team with African developers
          Tap into our extensive developer network
          Quickly find, select and recruit the best fit
        </p>
    ),
    perks: [
      'Custom pricing',
      '',
      '',  
      '',    
      'Schedule a call to find out more'
    ]
  }
];

class PricingPage extends ComponentWithModal {
  renderHeaderContent() {
    return (     
      <div>
        <h1>High quality and service level at affordable fees</h1>
        <h2>We calculate our fees transparently and stick with that. No excuses, no discussions, no additional costs</h2>
        <p>
          <a onClick={this.onScheduleCall.bind(this)}  className="btn btn-callout">
            Schedule a call now
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
    let meta_description = 'Tunga offers flexible and affordable pricing. Choose from 3 different plans.';

    return (
      <ShowcaseContainer
        className="pricing-page"
        headerContent={this.renderHeaderContent()}>
        <MetaTags title={meta_title} description={meta_description}/>

        <section className="pricing-options">
          <div className="container">
            <div className="pricing-table">
              <div className="step-slider three-sm clearfix">
                <ul>
                  {/* <li className="table-key">
                    {this.renderLgTableKey()}
                  </li> */}
                  {OFFER_DETAILS.map((offer, idx) => {
                    return (
                      <li key={offer.key}>
                        <div className="slide">
                          <h3>
                            {offer.title}
                          </h3> 
                          <hr className="under-line" />                    
                          <div className="description">
                            {offer.description}
                          </div>
                          <div className="clearfix perks">
                            <div className="col-xs-12 col-md-12 col-lg-12">
                              {offer.perks && offer
                                .perks
                                .map(comp => {
                                  return (
                                    <p>
                                      {comp}
                                    </p>
                                  );
                                })}
                            </div>
                          </div>      
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className="container">
          <p className="text-center">
          <a onClick={this.onScheduleCall.bind(this)}  className="btn btn-callout">
            Schedule a call now
           </a>
        </p>
          </div>
        </section>
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
export default connect(mapStateToProps, mapDispatchToProps)(PricingPage);
