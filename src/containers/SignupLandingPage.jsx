import React, {Component} from 'react';

import AccountType from './AccountType';
import SignUpPage from './SignUpPage';

class SignupLandingPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showAccType: true,
			showForm: false,
			selectedAccType: ''
		}

		this.showSignupForm = this.showSignupForm.bind(this);
	}

	showSignupForm(event) {
		this.setState({showAccType: false, showForm: true, selectedAccType: event.target.value})
	}

	render() {
		return(
			<div>
				{this.state.showAccType === true ? <AccountType displayForm= {this.showSignupForm} /> : ''}

				{this.state.showForm === true ? <SignUpPage userType={this.state.selectedAccType} /> : ''}
			</div>
		)
	}
}

export default SignupLandingPage;