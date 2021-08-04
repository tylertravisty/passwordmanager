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
			editing: false,
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
			const secretStoreStr = await window.backend.PasswordManager.GetSecretStore();
			let secretStoreJSON = JSON.parse(secretStoreStr);
			this.setState({secretStore: secretStoreJSON, loaded: true});
		} catch(err) {
			this.setState({error: err, loaded: true});
		}
	}

	editHandler = event => {
		this.setState({editing: true});
	};

	nameChangeHandler = event => {
		let tempStore = this.state.secretStore
		tempStore.name = event.target.value
		this.setState({secretStore: tempStore});
	};

	saveHandler = event => {
		console.log("Entering save handler");
		console.log(this.state.secretStore);
		this.updateSecretStore()
	}

	async updateSecretStore() {
		try {
			const secretStoreStr = JSON.stringify(this.state.secretStore)
			await window.backend.PasswordManager.SetSecretStore(secretStoreStr);
			this.setState({editing: false});
		} catch(err) {
			console.log("Error:", err);
			this.setState({error: err, editing: false});
		}
	}

	addSecretHandler = event => {
		let tempStore = this.state.secretStore;
		let newSecret = {name: "New Secret"};
		if (!tempStore.categories[0].hasOwnProperty("secrets")) {
			tempStore.categories[0].secrets = [];
		}
		tempStore.categories[0].secrets.push(newSecret);
		this.setState({secretStore: tempStore});
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

		if (this.state.editing) {
			return (
				<div className="App">
					<Link to={'/unlock'}>
						<button> Lock </button>
					</Link>
					<button onClick={this.saveHandler}> Save </button>
					<button onClick={this.addSecretHandler}> Add Secret </button>
					<h2><input type="text" name="secretStoreName" value={this.state.secretStore.name} onChange={this.nameChangeHandler}/></h2>
				</div>
			)
		} else {
			return (
				<div className="App">
					<Link to={'/unlock'}>
						<button> Lock </button>
					</Link>
					<button onClick={this.editHandler}> Edit </button>
					<button onClick={this.addSecretHandler}> Add Secret </button>
					<h2>{this.state.secretStore.name == "" ? "Empty Name" : this.state.secretStore.name}</h2>
					{JSON.stringify(this.state.secretStore)}
				</div>
			)
		}
	}
}

export default PasswordManager;
