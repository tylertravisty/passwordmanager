import React from 'react';

import {
	Redirect,
} from "react-router-dom";

import {
	ErrPasswordFileEmpty,
	ErrPasswordFileMissing
} from './Error.js';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: "",
			onStart: false,
			passwordFile: false,
		};
	}

	componentDidMount() {
		this.onStart();
	}

	async onStart() {
		try {
			await window.backend.PasswordManager.OnStart();
			this.setState({passwordFile: true, onStart: true});
		} catch(err) {
			this.setState({error: err, onStart: true});
		}
	}

	render() {
		if (this.state.onStart === false) {
			return (
				<div>Loading</div>
			);
		}

		if (!this.state.passwordFile) {
			if (this.state.error === ErrPasswordFileEmpty || this.state.error === ErrPasswordFileMissing) {
				return (
					<Redirect to="/mainmenu" />
				);
			}
			return (
				<Redirect to="/error" />
			);
		}

		return(
			<Redirect to="/unlock" />
		);
	}

}

export default Home;
