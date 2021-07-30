import React from 'react';
import './Unlock.css';
import { Redirect } from "react-router-dom";

import { ErrInvalidUnlockPassword } from './Error.js';

class Unlock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dialog: "Enter password to unlock",
			error: "",
			password: "",
			show: false,
			gotoPasswordManager: false
		};
	}

	passwordChangeHandler = event => {
		this.setState({password: event.target.value});
	};

	submitPasswordHandler = event => {
		event.preventDefault();
		this.unlockPasswordFile();
	};

	async unlockPasswordFile() {
		try {
			await window.backend.PasswordManager.UnlockPasswordFile(this.state.password);
			this.setState({gotoPasswordManager: true});
		} catch(err) {
			if (err === ErrInvalidUnlockPassword) {
				this.setState({dialog: "Invalid password. Try again"});
			} else {
				this.setState({error: err});
			}
		}
	}

	render() {
		if (this.state.gotoPasswordManager) {
			return (
				<Redirect to="/passwordmanager" />
			);
		}

		return (
			<div className="Unlock">
				{this.state.dialog}:
				<form onSubmit={this.submitPasswordHandler}>
					<input type="password" name="password" value={this.state.password} onChange={this.passwordChangeHandler}/>
					<button>Unlock</button>
				</form>
			</div>
		);
	}
}

export default Unlock;
