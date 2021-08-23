import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';

import {
	Link,
	Redirect
} from "react-router-dom";

import arrow_left from '../icons/arrow-90deg-left.svg';
import clipboard from '../icons/clipboard.svg';
import eye from '../icons/eye.svg';
import eyeslash from '../icons/eye-slash.svg';
import pencilsquare from '../icons/pencilsquare.svg';

import AddEntry from './AddEntry';
import './Secret.css';

class Secret extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			entryType: "text",
			stageEdit: false,
			stageAddEntry: false,
			stageDeleteEntry: false,
			deleteEntryIndex: -1,
			stageEntryType: false,
			stagePasswordParameters: false,
			paramUpper: false,
			paramLower: false,
			paramNumber: false,
			paramSymbol: false,
			paramLength: 12,
			passwordIndex: -1,
			hiddenPassword: "************",
			hideValue: []
		}
	}

	editHandler = event => {
		this.props.secretEditHandler();
		this.setState({stageEdit: true});
	};

	cancelEditHandler = event => {
		this.props.secretCancelEditHandler();
		this.setState({stageEdit: false});
	};

	saveHandler = event => {
		this.props.secretSaveHandler();
		this.setState({stageEdit: false});
	};

	addEntryHandler = event => {
		event.preventDefault();
		this.setState({stageEntryType: true});
	};

	changeEntryTypeHandler = event => {
		this.setState({entryType: event.target.value});
	};

	submitEntryTypeHandler = event => {
		event.preventDefault();
		let target = {};
		target.entryname = {};
		target.entrytype = {};
		target.entryvalue = {};
		target.entryname.value = "";
		target.entrytype.value = this.state.entryType;
		target.entryvalue.value = "";
		this.props.secretSubmitEntryHandler(target);
		this.setState({stageEntryType: false, entryType: "text"});
	};

	cancelAddEntryHandler = event => {
		this.setState({stageEntryType: false});
	};

	submitEntryHandler = event => {
		event.preventDefault();
		this.props.secretSubmitEntryHandler(event.target);
		this.setState({stageAddEntry: false});
	};

	copyValueHandler = event => {
		event.preventDefault();
		const index = event.target.getAttribute('value');
		var input = document.body.appendChild(document.createElement("input"));
		let entryValue = this.props.secrets[this.props.secretIndex].entries[index].value;
		if (entryValue === undefined) {
			entryValue = "";
		}
		input.value = entryValue;
		input.focus();
		input.select();
		document.execCommand('copy');
		input.parentNode.removeChild(input);
	};

	deleteEntryHandler = event => {
		const index = event.target.getAttribute('value');
		this.setState({stageDeleteEntry: true, deleteEntryIndex: index});
	};

	cancelDeleteEntryHandler = event => {
		this.setState({stageDeleteEntry: false, deleteEntryIndex: -1});
	};

	confirmDeleteEntryHandler = event => {
		this.props.secretConfirmDeleteEntryHandler(this.state.deleteEntryIndex);
		this.setState({stageDeleteEntry: false, deleteEntryIndex: -1});
	};

	entryNameChangeHandler = event => {
		const entryIndex = event.target.name;
		const entryName = event.target.value;
		this.props.secretEntryNameChangeHandler(entryIndex, entryName);
	};

	entryValueChangeHandler = event => {
		const entryIndex = event.target.name;
		const entryValue = event.target.value;
		this.props.secretEntryValueChangeHandler(entryIndex, entryValue);
	};

	generatePasswordHandler = event => {
		event.preventDefault();
		const index = event.target.getAttribute('value');
		this.setState({stagePasswordParameters: true, passwordIndex: index});
	};

	cancelGeneratePasswordHandler = event => {
		event.preventDefault();
		this.setState({
			stagePasswordParameters: false,
			paramUpper: false,
			paramLower: false,
			paramNumber: false,
			paramSymbol: false,
			paramLength: 12,
			passwordIndex: -1
		});
	};

	submitPasswordParametersHandler = event => {
		event.preventDefault();
		this.generatePassword();
	};

	async generatePassword() {
		try {
			const password = await window.backend.PasswordManager.GeneratePassword(this.state.paramUpper, this.state.paramLower, this.state.paramNumber, this.state.paramSymbol, parseInt(this.state.paramLength));
			const entryIndex = this.state.passwordIndex;
			this.props.secretEntryValueChangeHandler(entryIndex, password);
			this.setState({
				stagePasswordParameters: false,
				paramUpper: false,
				paramLower: false,
				paramNumber: false,
				paramSymbol: false,
				paramLength: 12,
				passwordIndex: -1
			});
		} catch(err) {
			console.log("Error:", err);
			this.setState({stagePasswordParameters: false});
		}
	};

	checkHandler = event => {
		switch(event.target.name) {
			case 'upper':
				this.setState({paramUpper: event.target.checked});
				return;
			case 'lower':
				this.setState({paramLower: event.target.checked});
				return;
			case 'number':
				this.setState({paramNumber: event.target.checked});
				return;
			case 'symbol':
				this.setState({paramSymbol: event.target.checked});
				return;
		}
	};

	lengthHandler = event => {
		this.setState({paramLength: event.target.value});
	};

	hideShowHandler = event => {
		event.preventDefault();
		const index = event.target.getAttribute('value');
		let tempHide = this.state.hideValue;
		let hideShow = tempHide[index];
		if (hideShow === "Show") {
			tempHide[index] = "Hide";
		} else {
			tempHide[index] = "Show";
		}
		this.setState({hideValue: tempHide});
	}

	componentDidMount() {
		let tempHide = [];
		this.props.secrets[this.props.secretIndex].entries.map((entry, index) => {
			if (entry.type === "password") {
				tempHide = [...tempHide, "Show"];
			} else {
				tempHide = [...tempHide, "Hide"];
			}
		});

		this.setState({loaded: true, hideValue: tempHide});
	}

	render() {
		if (this.state.loaded === false) {
			return (
				<div>Loading</div>
			);
		}

		if (this.state.stageDeleteEntry) {
			return (
				<DeleteEntry
					cancelDeleteEntryHandler={this.cancelDeleteEntryHandler}
					confirmDeleteEntryHandler={this.confirmDeleteEntryHandler}
				/>
			);
		}

		if (this.state.stageEntryType) {
			return (
				<EntryType
					submitEntryTypeHandler={this.submitEntryTypeHandler}
					cancelAddEntryHandler={this.cancelAddEntryHandler}
					changeEntryTypeHandler={this.changeEntryTypeHandler}
					entryType={this.state.entryType}
				/>
			);
		}

		if (this.state.stagePasswordParameters) {
			return (
				<PasswordParameters
					cancelGeneratePasswordHandler={this.cancelGeneratePasswordHandler}
					submitPasswordParametersHandler={this.submitPasswordParametersHandler}
					checkHandler={this.checkHandler}
					lengthHandler={this.lengthHandler}
					paramUpper={this.state.paramUpper}
					paramLower={this.state.paramLower}
					paramNumber={this.state.paramNumber}
					paramSymbol={this.state.paramSymbol}
					paramLength={this.state.paramLength}
				/>
			);
		}

		if (this.state.stageEdit) {
			return (
				<div>
					<button className="SecretCancelEdit" onClick={this.cancelEditHandler}>Cancel</button>
					<button onClick={this.saveHandler}> Save </button>
					<button onClick={this.addEntryHandler}> Add Entry </button>
					<h2><input type="text" name="secretName" value={this.props.secrets[this.props.secretIndex].name} onChange={this.props.secretNameChangeHandler}/></h2>
					<ul>
					{this.props.secrets[this.props.secretIndex].entries.map((entry, index) =>
					<li key={index}>[{entry.type}]<input type="text" name={index} value={entry.name} onChange={this.entryNameChangeHandler}/>:<input type="text" name={index} onChange={this.entryValueChangeHandler} value={entry.value}/>{entry.type==="password" ? <span value={index} className="RandomPassword" onClick={this.generatePasswordHandler}>Random</span> : ""}<span value={index} onClick={this.deleteEntryHandler} className="DeleteEntry">Delete</span></li>
					)}
					</ul>
				</div>
			);
		} else {
			return (
				<div>
					<Navbar className="NavTitle">
						<Nav fill className="bg-dark fixed-top justify-content-center">
							<Nav.Item>
								<span className="Title">{this.props.secrets[this.props.secretIndex].name}</span>
							</Nav.Item>
						</Nav>
					</Navbar>
					<ListGroup className="EntryList">
						{this.props.secrets[this.props.secretIndex].entries.map((entry, index) =>
							<ListGroup.Item>
									<Row>
										<Col xs={3} sm={2} md={2} lg={1}>{entry.type}</Col>
										<Col>{this.state.hideValue[index]==="Show" ? this.state.hiddenPassword : entry.value}</Col>
										<Col xs={2} style={{display:"flex", justifyContent:"flex-end"}}>
											{entry.type==="password" ? <Button variant="white" size="sm" value={index} onClick={this.hideShowHandler}>{this.state.hideValue[index]==="Show" ? <img value={index} src={eye}/> : <img value={index} src={eyeslash}/>}</Button> : ""}
											<Button variant="white" size="sm" value={index} onClick={this.copyValueHandler}><img value={index} src={clipboard}/></Button>
										</Col>
									</Row>
							</ListGroup.Item>
						)}
					</ListGroup>
					<Nav fill className="bg-dark fixed-bottom justify-content-center">
						<Nav.Item>
							<div className="d-grid">
								<Button variant="dark" size="lg" onClick={this.props.secretBackHandler}><img src={arrow_left}/></Button>
							</div>
						</Nav.Item>
						<Nav.Item>
							<div className="d-grid">
								<Button variant="dark" size="lg" onClick={this.editHandler}><img src={pencilsquare}/></Button>
							</div>
						</Nav.Item>
					</Nav>
				</div>
			);
		}
	}
}

export default Secret;

const DeleteEntry = (props) => {
	return (
		<div>
			<button className="EntryCancelDelete" onClick={props.cancelDeleteEntryHandler}>Cancel</button>
			<div className="ConfirmDeleteEntry">
				Are you sure you want to delete the entry?<br/>
				<button onClick={props.confirmDeleteEntryHandler}>Delete</button>
			</div>
		</div>
	);
}

const EntryType = (props) => {
	return (
		<div>
			<button className="CancelAddEntry" onClick={props.cancelAddEntryHandler}>Cancel</button>
			<form className="EntryType" onSubmit={props.submitEntryTypeHandler}>
				<label htmlFor="entryType">Entry type: </label>
				<select value={props.entryType} onChange={props.changeEntryTypeHandler}>
					<option value="password">Password</option>
					<option value="text">Text</option>
				</select>
				<br/>
				<button>Submit</button>
			</form>
		</div>
	);
}

const PasswordParameters = (props) => {
	return (
		<div>
			<button className="CancelRandom" onClick={props.cancelGeneratePasswordHandler}>Cancel</button>
			<form className="PasswordParameters" onSubmit={props.submitPasswordParametersHandler}>
				<input type="checkbox" onChange={props.checkHandler} id="upper" name="upper" checked={props.paramUpper}/>
				<label htmlFor="upper"> Include upper case letters</label>
				<br/>
				<input type="checkbox" onChange={props.checkHandler} id="lower" name="lower" checked={props.paramLower}/>
				<label htmlFor="lower"> Include lower case letters</label>
				<br/>
				<input type="checkbox" onChange={props.checkHandler} id="number" name="number" checked={props.paramNumber}/>
				<label htmlFor="number"> Include numbers</label>
				<br/>
				<input type="checkbox" onChange={props.checkHandler} id="symbol" name="symbol" checked={props.paramSymbol}/>
				<label htmlFor="symbol"> Include symbols</label>
				<br/>
				<label htmlFor="length">Length</label>
				<input type="range" onChange={props.lengthHandler} id="length" name="length" min="1" max="30" step="1" value={props.paramLength}/> {props.paramLength}
				<br/>
				<button>Generate</button>
			</form>
		</div>
	);
}
