import React from 'react';
import { Redirect } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { ErrInvalidUnlockPassword } from './Error.js';

import './Unlock.css';
import unlock from '../icons/unlock.svg';
import t_circle from '../icons/travisty_t_circle.png';

class Unlock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dialog: "",
			error: "",
			loaded: false,
			password: "",
			show: false,
			gotoPasswordManager: false
		};
	}

	componentDidMount() {
		this.onMount();
	}

	async onMount() {
		try {
			await window.backend.PasswordManager.LockPasswordFile();
			this.setState({loaded: true});
		} catch(err) {
			this.setState({error: err, loaded: true});
		}
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
				this.setState({dialog: "Invalid password. Try again."});
			} else {
				this.setState({error: err});
			}
		}
	}

	render() {
		if (this.state.loaded === false) {
			return (
				<div>Loading</div>
			);
		}

		if (this.state.gotoPasswordManager) {
			return (
				<Redirect to="/passwordmanager" />
			);
		}

		return (
			<div className="Unlock">
				<Form onSubmit={this.submitPasswordHandler}>
					<Form.Group className="mb-3">
						<InputGroup size="lg">
							<Form.Control type="password" name="password" value={this.state.password} onChange={this.passwordChangeHandler} placeholder="Password" />
							<Button variant="dark" type="submit"><img src={unlock}/></Button>
						</InputGroup>
						<Form.Text className="UnlockText">{this.state.dialog}&nbsp;</Form.Text>
					</Form.Group>
				</Form>
			</div>
		);
	}
}

export default Unlock;
