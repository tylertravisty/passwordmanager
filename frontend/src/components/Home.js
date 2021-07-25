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
			loaded: false,
			passwordFile: false,
		};
	}

	componentDidMount() {
		this.onMount();
	}

	async onMount() {
		try {
			await window.backend.PasswordManager.OnStart();
			this.setState({passwordFile: true, loaded: true});
		} catch(err) {
			this.setState({error: err, loaded: true});
		}
	}

	render() {
		if (this.state.loaded === false) {
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
