import React from 'react';
import './NewPasswordFile.css';
import { Redirect } from "react-router-dom";

class NewPasswordFile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: "",
			dialog: "Set unlock password",
			complexity: "",
			password: "",
			verifyPassword: "",
			inputPassword: "",
			showVerify: false,
			gotoUnlock: false
		};
	}

	passwordChangeHandler = event => {
		let complexText = ""
		if (event.target.value.length < 3) {
			complexText = "too simple"
		}
		if (event.target.value.length >= 3 && event.target.value.length < 6) {
			complexText = "somewhate complex"
		}
		if (event.target.value.length >= 6) {
			complexText = "really complex"
		}
		this.setState({inputPassword: event.target.value, complexity: complexText});
	};

	submitPasswordHandler = event => {
		const tempPassword = this.state.inputPassword
		event.preventDefault();
		if (!this.state.showVerify) {
			this.setState({dialog: "Re-enter password", password: tempPassword, inputPassword: "", showVerify: true})
		} else {
			if (this.state.password === this.state.inputPassword) {
				this.createPasswordFile();
			} else {
				this.setState({dialog: "Password did not match. Try again", password: "", inputPassword: "", showVerify: false})
			}
		}
	};

	async createPasswordFile() {
		try {
			const filepath = await window.backend.PasswordManager.NewPasswordFile(this.state.password);
			this.setState({gotoUnlock: true});
		} catch(err) {
			this.setState({error: err});
		}
	}

	render() {
		if (this.state.gotoUnlock) {
			return (
				<Redirect to="/unlock" />
			);
		}

		return (
			<div className="NewPasswordFile">
				{this.state.dialog}:
				<form onSubmit={this.submitPasswordHandler}>
					<input type="password" name="password" value={this.state.inputPassword} onChange={this.passwordChangeHandler}/>
					<button>Submit</button>
				</form>
				Password complexity: {this.state.complexity}
			</div>
		);
	}
}

export default NewPasswordFile;
