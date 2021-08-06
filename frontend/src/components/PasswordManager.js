import React from 'react';
import './PasswordManager.css';
import {
	Link,
	Redirect
} from "react-router-dom";

import AddSecret from './AddSecret';
import DeleteSecret from './DeleteSecret';

import {
	ErrSecretStoreNotSet
} from './Error.js';

class PasswordManager extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			addSecret: false,
			deleteSecret: false,
			deleteSecretIndex: -1,
			editing: false,
			originalStore: {},
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
		let tempStore = JSON.parse(JSON.stringify(this.state.secretStore));
		this.setState({originalStore: tempStore, editing: true});
	};

	cancelEditHandler = event => {
		let tempStore = JSON.parse(JSON.stringify(this.state.originalStore))
		this.setState({secretStore: tempStore, editing: false});
	}

	nameChangeHandler = event => {
		let tempStore = this.state.secretStore
		tempStore.name = event.target.value
		this.setState({secretStore: tempStore});
	};

	saveHandler = event => {
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
		this.setState({addSecret: true});
	}

	submitSecretNameHandler = event => {
		event.preventDefault();
		let tempStore = this.state.secretStore;
		let newSecret = {name: event.target.querySelector('input').getAttribute('value')};
		if (!tempStore.categories[0].hasOwnProperty("secrets")) {
			tempStore.categories[0].secrets = [];
		}
		tempStore.categories[0].secrets.push(newSecret);
		this.setState({secretStore: tempStore});
		this.setState({addSecret: false});
	};

	cancelAddSecretHandler = event => {
		this.setState({addSecret: false});
	}

	deleteSecretHandler = event => {
		const index = event.target.getAttribute('value');
		this.setState({deleteSecret: true, deleteSecretIndex: index});
	}

	cancelDeleteSecretHandler = event => {
		this.setState({deleteSecret: false, deleteSecretIndex: -1});
	}

	confirmDeleteSecretHandler = event => {
		let tempStore = this.state.secretStore;
		tempStore.categories[0].secrets.splice(this.state.deleteSecretIndex, 1);
		this.setState({secretStore: tempStore, deleteSecret: false, deleteSecretIndex: -1});
	}

	render() {
		if (this.state.loaded === false) {
			return (
				<div>Loading</div>
			);
		}

		if (this.state.addSecret) {
			return (
				<AddSecret
					submitSecretNameHandler={this.submitSecretNameHandler}
					cancelAddSecretHandler={this.cancelAddSecretHandler}
				/>
			);
		}

		if (this.state.deleteSecret) {
			return (
				<DeleteSecret
					cancelDeleteSecretHandler={this.cancelDeleteSecretHandler}
					confirmDeleteSecretHandler={this.confirmDeleteSecretHandler}
				/>
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
					<button className="CancelEdit" onClick={this.cancelEditHandler}> Cancel </button>
					<button onClick={this.saveHandler}> Save </button>
					<button onClick={this.addSecretHandler}> Add Secret </button>
					<h2><input type="text" name="secretStoreName" value={this.state.secretStore.name} onChange={this.nameChangeHandler}/></h2>
					<p>Secret   Store: {JSON.stringify(this.state.secretStore)}</p>
					<p>Original Store: {JSON.stringify(this.state.originalStore)}</p>
					<ul>
					{this.state.secretStore.categories[0].secrets.map((secret, index) =>
					<li key={index}>{secret.name}<span value={index} onClick={this.deleteSecretHandler} className="DeleteSecret">Delete</span></li>
					)}
					</ul>
				</div>
			)
		} else {
			return (
				<div className="App">
					<Link to={'/unlock'}>
						<button className="Lock"> Lock </button>
					</Link>
					<button onClick={this.editHandler}> Edit </button>
					<h2>{this.state.secretStore.name == "" ? "<Empty Name>" : this.state.secretStore.name}</h2>
					<p>Secret   Store: {JSON.stringify(this.state.secretStore)}</p>
					<p>Original Store: {JSON.stringify(this.state.originalStore)}</p>
					<ul>
					{this.state.secretStore.categories[0].secrets.map((secret, index) =>
						<li key={index}>{secret.name}</li>
					)}
					</ul>
				</div>
			)
		}
	}
}

export default PasswordManager;
