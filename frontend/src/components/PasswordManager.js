import React from 'react';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';

import {
	Link,
	Redirect
} from "react-router-dom";

import check from '../icons/check2.svg';
import lock from '../icons/lock.svg';
import pencilsquare from '../icons/pencilsquare.svg';
import pluscircle from '../icons/plus-circle.svg';
import trash from '../icons/trash.svg';
import xmark from '../icons/x.svg';
import './PasswordManager.css';
import Secret from './Secret';
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
			deleteSecretName: "",
			editing: false,
			originalStore: {},
			error: "",
			loaded: false,
			secretStore: {},
			stageSecret: false,
			stageSecretIndex: -1,
			originalSecret: {}
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
		this.updateSecretStore();
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
		newSecret.entries=[];
		tempStore.categories[0].secrets.push(newSecret);
		this.setState({secretStore: tempStore});
		this.setState({addSecret: false});
	};

	cancelAddSecretHandler = event => {
		this.setState({addSecret: false});
	}

	deleteSecretHandler = event => {
		const index = event.target.getAttribute('value');
		const name = this.state.secretStore.categories[0].secrets[index].name;
		this.setState({deleteSecret: true, deleteSecretIndex: index, deleteSecretName: name});
	}

	cancelDeleteSecretHandler = event => {
		this.setState({deleteSecret: false, deleteSecretIndex: -1});
	}

	confirmDeleteSecretHandler = event => {
		let tempStore = this.state.secretStore;
		tempStore.categories[0].secrets.splice(this.state.deleteSecretIndex, 1);
		this.setState({secretStore: tempStore, deleteSecret: false, deleteSecretIndex: -1});
	}

	secretHandler = event => {
		this.setState({stageSecret: true, stageSecretIndex: event.target.getAttribute('value')});
	}

	secretEditHandler = event => {
		let tempStore = JSON.parse(JSON.stringify(this.state.secretStore));
		this.setState({originalStore: tempStore});
	};

	secretCancelEditHandler = event => {
		let tempStore = JSON.parse(JSON.stringify(this.state.originalStore))
		this.setState({secretStore: tempStore});
	}

	secretBackHandler = event => {
		this.setState({stageSecret: false, stageSecretIndex: -1});
	}

	secretNameChangeHandler = event => {
		let tempIndex = this.state.stageSecretIndex;
		let tempStore = this.state.secretStore;
		tempStore.categories[0].secrets[tempIndex].name = event.target.value;
		this.setState({secretStore: tempStore});
	};

	secretSubmitEntryHandler = target => {
		let tempIndex = this.state.stageSecretIndex;
		let tempStore = this.state.secretStore;
		if (tempStore.categories[0].secrets[tempIndex].entries === null) {
			tempStore.categories[0].secrets[tempIndex].entries = [];
		}
		let newEntry = {};
		newEntry.name = target.entryname.value;
		newEntry.type = target.entrytype.value;
		newEntry.value = target.entryvalue.value;
		tempStore.categories[0].secrets[tempIndex].entries.push(newEntry);
		this.setState({secretStore: tempStore});
	};

	secretConfirmDeleteEntryHandler = entryIndex => {
		let tempStore = this.state.secretStore;
		tempStore.categories[0].secrets[this.state.stageSecretIndex].entries.splice(entryIndex, 1);
		this.setState({secretStore: tempStore});
	}

	secretEntryNameChangeHandler = (entryIndex, name) => {
		let tempStore = this.state.secretStore;
		tempStore.categories[0].secrets[this.state.stageSecretIndex].entries[entryIndex].name = name;
		this.setState({secretStore: tempStore});
	}

	secretEntryValueChangeHandler = (entryIndex, value) => {
		let tempStore = this.state.secretStore;
		tempStore.categories[0].secrets[this.state.stageSecretIndex].entries[entryIndex].value = value;
		this.setState({secretStore: tempStore});
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

		//if (this.state.deleteSecret) {
		if (false) {
			return (
				<DeleteSecret
					cancelDeleteSecretHandler={this.cancelDeleteSecretHandler}
					confirmDeleteSecretHandler={this.confirmDeleteSecretHandler}
				/>
			);
		}

		if (this.state.stageSecret) {
			return (
				<Secret
					secretBackHandler={this.secretBackHandler}
					secretEditHandler={this.secretEditHandler}
					secretCancelEditHandler={this.secretCancelEditHandler}
					secretSaveHandler={this.saveHandler}
					secretNameChangeHandler={this.secretNameChangeHandler}
					secrets={this.state.secretStore.categories[0].secrets}
					secretIndex={this.state.stageSecretIndex}
					secretSubmitEntryHandler={this.secretSubmitEntryHandler}
					secretConfirmDeleteEntryHandler={this.secretConfirmDeleteEntryHandler}
					secretEntryNameChangeHandler={this.secretEntryNameChangeHandler}
					secretEntryValueChangeHandler={this.secretEntryValueChangeHandler}
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
					<Navbar className="NavTitle">
						<Nav fill className="bg-dark fixed-top justify-content-center">
							<Nav.Item>
								<span className="Title"><input className="InputTitle" type="text" name="secretStoreName" value={this.state.secretStore.name} onChange={this.nameChangeHandler}/></span>
							</Nav.Item>
						</Nav>
					</Navbar>
					<ListGroup className="SecretList">
						{this.state.secretStore.categories[0].secrets.map((secret, index) =>
						<ListGroup.Item>
							<Row>
								<Col>
									{secret.name}
								</Col>
								<Col className="ButtonCol">
										<Button variant="white" size="sm" value={index} onClick={this.deleteSecretHandler}><img value={index} src={trash}/></Button>
								</Col>
							</Row>
						</ListGroup.Item>
						)}
						<ListGroup.Item>
							<Row>
								<Col className="CenterButtonCol">
										<Button variant="white" size="sm" onClick={this.addSecretHandler}><img src={pluscircle}/></Button>
								</Col>
							</Row>
						</ListGroup.Item>
					</ListGroup>
					<Nav fill className="bg-dark fixed-bottom justify-content-center">
						<Nav.Item>
							<div className="d-grid">
								<Button className="NavCancel" variant="dark" size="lg" onClick={this.cancelEditHandler}><img src={xmark}/></Button>
							</div>
						</Nav.Item>
						<Nav.Item>
							<div className="d-grid">
								<Button className="NavSave" variant="dark" size="lg" onClick={this.saveHandler}><img src={check}/></Button>
							</div>
						</Nav.Item>
					</Nav>
					<DeleteModal show={this.state.deleteSecret} onHide={this.cancelDeleteSecretHandler} secretName={this.state.deleteSecretName} confirmDelete={this.confirmDeleteSecretHandler}/>
				</div>
			)
		} else {
			return (
				<div className="App">
					<Navbar className="NavTitle">
						<Nav fill className="bg-dark fixed-top justify-content-center">
							<Nav.Item>
								<span className="Title">{this.state.secretStore.name === "" ? "<Empty Name>" : this.state.secretStore.name}</span>
							</Nav.Item>
						</Nav>
					</Navbar>
					<ListGroup className="SecretList">
					{this.state.secretStore.categories[0].secrets.map((secret, index) =>
						<ListGroup.Item action key={index} value={index} onClick={this.secretHandler}>{secret.name}</ListGroup.Item>
					)}
					</ListGroup>
					<Nav fill className="bg-dark fixed-bottom justify-content-center">
						<Nav.Item>
							<Link to={'/unlock'}>
								<div className="d-grid">
									<Button className="NavLock" variant="dark" size="lg"><img src={lock}/></Button>
								</div>
							</Link>
						</Nav.Item>
						<Nav.Item>
							<div className="d-grid">
								<Button className="NavEdit" variant="dark" size="lg" onClick={this.editHandler}><img src={pencilsquare}/></Button>
							</div>
						</Nav.Item>
					</Nav>
				</div>
			)
		}
	}
}

export default PasswordManager;

function DeleteModal(props) {
	return (
		<Modal
			show={props.show}
			onHide={props.onHide}
			animation={false}
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Delete {props.secretName}?
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>Are you sure you want to delete this secret?</p>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={props.onHide}>Cancel</Button>
				<Button variant="danger" onClick={props.confirmDelete}>Delete</Button>
			</Modal.Footer>
		</Modal>
	);
}
