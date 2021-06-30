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
			hasError: false,
			passwordFile: false,
			onStart: false
		};
	}

	componentDidMount() {
		this.onStart();
	}

	onStart() {
		window.backend.PasswordManager.OnStart().then( () => {
			this.setState({passwordfile: true, onStart: true});
		}).catch(err => {
			this.setState({hasError: true, error: err, onStart: true});
		});
	}

	render() {
		if (this.state.onStart === false) {
			return (
				<div>Loading</div>
			);
		}
		if (this.state.hasError) {
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
