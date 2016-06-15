import React, {Component} from 'react';

import AccountType from './AccountType';
import SignUpPage from './SignUpPage';

class SignupLandingPage extends Component {
	constructor(props) {
		super(props);
		this.state = {showAccType: true, selectedAccType: ''};
		this.showSignupForm = this.showSignupForm.bind(this);
	}

	showSignupForm(event) {
		this.setState({showAccType: false, selectedAccType: event.target.value})
	}

	render() {
		return(
			<div>
				{this.state.showAccType?(
                <AccountType displayForm= {this.showSignupForm} />
                    ):(
                <SignUpPage userType={this.state.selectedAccType} />
                    )}
			</div>
		)
	}
}

export default SignupLandingPage;
