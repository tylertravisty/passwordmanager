import React from 'react';
import {
	Link,
	Redirect
} from "react-router-dom";

import {
	ErrSecretStoreNotSet
} from './Error.js';

class PasswordManager extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: "",
			loaded: false,
			secretStore: {}
		};
	}

	componentDidMount() {
		this.onMount();
	}

	async onMount() {
		try {
			const strStore = await window.backend.PasswordManager.GetSecretStore();
			let jsonStore = JSON.parse(strStore);
			this.setState({secretStore: jsonStore, loaded: true});
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

		if (this.state.error !== "") {
			if (this.state.error === ErrSecretStoreNotSet) {
				return (
					<Redirect to="/unlock" />
				)
			}
		}

		return (
			<div className="App">
				<h2>Real Password Manager</h2>
				<Link to={'/unlock'}>
					<button > Lock </button>
				</Link>
				{JSON.stringify(this.state.secretStore)}
			</div>
		)
	}
}

export default PasswordManager;
