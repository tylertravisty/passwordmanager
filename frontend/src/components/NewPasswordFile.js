import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import './NewPasswordFile.css';
import { Redirect } from "react-router-dom";

class NewPasswordFile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: "",
			dialog: "Set unlock password",
			subDialog: "",
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
		event.preventDefault();
		const tempPassword = this.state.inputPassword
		if (!this.state.showVerify) {
			this.setState({dialog: "Re-enter password", subDialog: "", password: tempPassword, inputPassword: "", showVerify: true})
		} else {
			if (this.state.password === this.state.inputPassword) {
				this.createPasswordFile();
			} else {
				this.setState({dialog: "Set unlock password", subDialog: "Password did not match. Try again", password: "", inputPassword: "", showVerify: false})
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
				<Form onSubmit={this.submitPasswordHandler}>
					<Form.Group className="mb-3">
						<Form.Label className="Dialog">{this.state.dialog}</Form.Label>
						<InputGroup size="lg">
							<Form.Control type="password" name="password" value={this.state.inputPassword} onChange={this.passwordChangeHandler} placeholder="Password" />
							<Button variant="dark" type="submit">Submit</Button>
						</InputGroup>
						<Form.Text className="InputPasswordText">{this.state.subDialog}&nbsp;</Form.Text>
					</Form.Group>
				</Form>
			</div>
		);
	}
}

export default NewPasswordFile;
