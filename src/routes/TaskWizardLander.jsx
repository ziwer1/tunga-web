import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {LandingPage} from '../routes/LandingPage';

import * as SkillPageActions from '../actions/SkillPageActions';
import {nl_to_br} from '../utils/html';

class TaskWizardLander extends LandingPage {
  constructor(props) {
    super(props);
    this.state = {
      title: (
        <span>
          Discuss your project within<br />
          24 hours!
        </span>
      ),
      subtitle: null,
      step: 1,
      pageClass: 'task-wizard-page lander',
      showVideo: false,
    };
  }

  onStepChange(step, idx, all_steps) {
    this.setState({
      title: step && step.title ? step.title : '',
      subtitle: step && step.subtitle ? step.subtitle : null,
      step: idx ? idx + 1 : -1,
    });
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

    console.log('log', dlp_phrase, isSkillPage, skill_page);

    return (
      <div className="row">
        <div className="col-sm-6 col-md-8">
          <div className="pitch">
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
                    software project in a productive, friendly and worthwhile
                    way.
                  </span>}
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-md-4">
          <div className="task-wizard">
            <div>
              {this.state.step == 1 && !this.getTaskId()
                ? <h3
                    className=""
                    dangerouslySetInnerHTML={{
                      __html: dlp_phrase
                        ? `Start hiring ${dlp_phrase}`
                        : 'Discuss your project!',
                    }}
                  />
                : <div className="heading-3 text-center">
                    {this.state.title}
                  </div>}
              <div>
                <form
                  name="task"
                  role="form"
                  ref="task_form"
                  action="/start-welcome/">
                  <div className="form-group">
                    <div className="row">
                      <div className="col-xs-5">
                        <input
                          type="text"
                          name="first_name"
                          className="form-control"
                          ref="first_name"
                          required
                          placeholder="First Name"
                        />
                      </div>
                      <div className="col-xs-7">
                        <input
                          type="text"
                          name="last_name"
                          className="form-control"
                          ref="last_name"
                          required
                          placeholder="Last Name"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        ref="email"
                        required
                        placeholder="Email"
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn cta-action">
                    <span>
                      <i className="tunga-icon-rocket fa-lg" />{' '}
                    </span>Get me started!
                  </button>
                </form>
              </div>
            </div>
            <div className="clearfix" />
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(TaskWizardLander);
