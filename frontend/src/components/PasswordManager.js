import React from 'react';
import {
	Link,
	Redirect
} from "react-router-dom";

class PasswordManager extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (
			<div className="App">
				<h2>Real Password Manager</h2>
				<Link to={'/unlock'}>
					<button > Lock </button>
				</Link>
			</div>
		)
	}
}

export default PasswordManager;
