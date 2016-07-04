import React from 'react'
import { Link } from 'react-router'

import { USER_TYPE_CHOICES } from '../constants/Api';

class AccountType extends React.Component {
	render() {
		return(
			<section className="signup-lp">
		  		<div className="container">
		    		<div className="row">
		    			<div className="col-md-12 col-sm-12 col-xs-12">
				            <div className="acct-type-container">

				                <h2 className="crt-acc-heading">Create your Tunga account</h2>

				                <p className="crt-info-text">I want to ...</p>

                                <Link to="/signup/project-owner" className="btn btn-default acct-type-btn">Create an account as a project owner</Link>

                                <Link to="/signup/developer" className="btn btn-default acct-type-btn">Apply as a developer</Link>

				            </div>
			          	</div>
		    		</div>
		      	</div>
		  	</section>
		)
	}
}

export default AccountType;
