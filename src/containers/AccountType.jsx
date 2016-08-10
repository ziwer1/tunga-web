import React from 'react';
import { Link } from 'react-router';

class AccountType extends React.Component {
	render() {
		return(
			<section className="signup-lp">
		  		<div className="container">
		    		<div className="row">
		    			<div className="col-md-12 col-sm-12 col-xs-12">
				            <div className="acct-type-container">

				                <h2 className="crt-acc-heading">Create your Tunga account</h2>

                                <Link to="/signup/project-owner" className="btn acct-type-btn">I am looking for developers</Link>
                                <br/>
                                <Link to="/signup/developer" className="btn acct-type-btn">Apply as a developer</Link>

				            </div>
			          	</div>
		    		</div>
		      	</div>
		  	</section>
		)
	}
}

export default AccountType;
