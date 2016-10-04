import React from 'react';
import { Link } from 'react-router';

import ShowcaseContainer from './ShowcaseContainer';

class AccountType extends React.Component {
    renderHeaderContent() {
        return (
            <div className="account-choices">
                <h2 className="crt-acc-heading">Create your Tunga account</h2>
                <Link to="/signup/project-owner" className="btn">I am looking for developers</Link>
                <br/>
                <Link to="/signup/developer" className="btn">Apply as a developer</Link>
            </div>
        );
    }

	render() {
		return(
            <ShowcaseContainer className="auth-page" headerContent={this.renderHeaderContent()}/>
		)
	}
}

export default AccountType;
