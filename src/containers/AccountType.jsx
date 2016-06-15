import React, {Component} from 'react';

import { USER_TYPE_CHOICES } from '../constants/Api';

class AccountType extends Component {
	render() {
		return(
			<section className="signup-lp">
		  		<div className="container">
		    		<div className="row">
		    			<div className="col-md-12 col-sm-12 col-xs-12">
				            <div className="acct-type-container">

				                <h2 className="crt-acc-heading">Create your Tunga account</h2>
				                <p className="crt-info-text">I want to ...</p>

			                  	<button value={USER_TYPE_CHOICES[1].id} onClick={this.props.displayForm} className="btn btn-default acct-type-btn">
			                    	create an account as a project owner
			                  	</button>

			                  	<button value={USER_TYPE_CHOICES[0].id} onClick={this.props.displayForm} className="btn btn-default acct-type-btn">
			                  		apply as a developer
			                  	</button>
				            </div>
			          	</div>
		    		</div>
		      	</div>
		  	</section>
		)
	}
}

export default AccountType;
