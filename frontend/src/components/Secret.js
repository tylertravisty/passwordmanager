import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';

import {
	Link,
	Redirect
} from "react-router-dom";

import arrow_left from '../icons/arrow-90deg-left.svg';
import check from '../icons/check2.svg';
import clipboard from '../icons/clipboard.svg';
import clipboardcheck from '../icons/clipboard-check.svg';
import dice from '../icons/dice-3.svg';
import eye from '../icons/eye.svg';
import eyeslash from '../icons/eye-slash.svg';
import pencilsquare from '../icons/pencilsquare.svg';
import pluscircle from '../icons/plus-circle.svg';
import question from '../icons/question-circle.svg';
import trash from '../icons/trash.svg';
import xmark from '../icons/x.svg';

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
			deleteEntryName: "",
			stageEntryType: false,
			stagePasswordParameters: false,
			paramUpper: false,
			paramLower: false,
			paramNumber: false,
			paramSymbol: false,
			paramLength: 12,
			passwordIndex: -1,
			hiddenPassword: "************",
			hideValue: [],
			hideValueOriginal: [],
			clipboard: [],
			clipboardIndex: -1,
			intervalID: 0
		}
	}

	editHandler = event => {
		let tempHideValue = [];
		this.state.hideValue.map((hideShow, index) => {
			tempHideValue[index] = hideShow;
		});
		this.props.secretEditHandler();
		this.setState({stageEdit: true, hideValueOriginal: tempHideValue});
	};

	cancelEditHandler = event => {
		this.props.secretCancelEditHandler();

		let tempHideValue = [];
		this.state.hideValueOriginal.map((hideShow, index) => {
			tempHideValue[index] = hideShow;
		});

		this.setState({stageEdit: false, hideValue: tempHideValue});
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

		let name = this.state.entryType;
		target.entryname.value = name.charAt(0).toUpperCase() + name.slice(1);
		target.entrytype.value = this.state.entryType;
		target.entryvalue.value = "";
		this.props.secretSubmitEntryHandler(target);

		let tempHide = this.state.hideValue;
		if (this.state.entryType === "password") {
			tempHide = [...tempHide, "Show"];
		} else {
			tempHide = [...tempHide, "Hide"];
		}

		this.setState({stageEntryType: false, entryType: "text", hideValue: tempHide});
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

		let tempClipboard = this.state.clipboard;
		tempClipboard[index] = !tempClipboard[index];

		const timer = setInterval(() => {
			let tempClipboard = this.state.clipboard;

			if (!tempClipboard[this.state.clipboardIndex]) {
				clearInterval(this.state.intervalID);
				this.setState({intervalID: 0});
			} else {
				tempClipboard[this.state.clipboardIndex] = !tempClipboard[this.state.clipboardIndex];
				this.setState({clipboard: tempClipboard});
			}
		}, 1000);

		this.setState({clipboard: tempClipboard, clipboardIndex: index, intervalID: timer});
	};

	deleteEntryHandler = event => {
		const index = event.target.getAttribute('value');
		const name = this.props.secrets[this.props.secretIndex].entries[index].name;
		this.setState({stageDeleteEntry: true, deleteEntryIndex: index, deleteEntryName: name});
	};

	cancelDeleteEntryHandler = event => {
		this.setState({stageDeleteEntry: false, deleteEntryIndex: -1, deleteEntryName: ""});
	};

	confirmDeleteEntryHandler = event => {
		this.props.secretConfirmDeleteEntryHandler(this.state.deleteEntryIndex);

		let tempHide = this.state.hideValue;
		tempHide.splice(this.state.deleteEntryIndex, 1);
		this.setState({stageDeleteEntry: false, deleteEntryIndex: -1, deleteEntryName: "", hideValue: tempHide});
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
		//event.preventDefault();
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
		let tempClipboard = [];
		let tempHide = [];
		this.props.secrets[this.props.secretIndex].entries.map((entry, index) => {
			if (entry.type === "password") {
				tempHide = [...tempHide, "Show"];
			} else {
				tempHide = [...tempHide, "Hide"];
			}
			tempClipboard[index] = false;
		});

		this.setState({loaded: true, hideValue: tempHide, clipboard: tempClipboard});
	}

	render() {
		if (this.state.loaded === false) {
			return (
				<div>Loading</div>
			);
		}

		if (false) {
			return (
				<DeleteEntry
					cancelDeleteEntryHandler={this.cancelDeleteEntryHandler}
					confirmDeleteEntryHandler={this.confirmDeleteEntryHandler}
				/>
			);
		}

		if (false) {
			return (
				<EntryType
					submitEntryTypeHandler={this.submitEntryTypeHandler}
					cancelAddEntryHandler={this.cancelAddEntryHandler}
					changeEntryTypeHandler={this.changeEntryTypeHandler}
					entryType={this.state.entryType}
				/>
			);
		}

		if (false) {
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
				<div className="App">
					<Navbar className="NavTitle">
						<Nav fill className="bg-dark fixed-top justify-content-center">
							<Nav.Item>
								<span className="Title"><input className="InputTitle" type="text" name="secretName" value={this.props.secrets[this.props.secretIndex].name} onChange={this.props.secretNameChangeHandler}/></span>
							</Nav.Item>
						</Nav>
					</Navbar>
					<ListGroup className="EntryList">
						{this.props.secrets[this.props.secretIndex].entries.map((entry, index) =>
						<ListGroup.Item>
								<Row>
									<Col xs={3} sm={2} md={2} lg={1}><input className="InputCol" type="text" name={index} value={entry.name} onChange={this.entryNameChangeHandler}/></Col>
									<Col><input className="InputCol" type="text" name={index} onChange={this.entryValueChangeHandler} value={entry.value}/></Col>
									<Col className="ButtonCol" xs={2}>
										{entry.type==="password" ? <Button variant="white" size="sm" value={index} onClick={this.generatePasswordHandler}><img value={index} src={dice}/></Button> : ""}
										<Button variant="white" size="sm" value={index} onClick={this.deleteEntryHandler}><img value={index} src={trash}/></Button>
									</Col>
								</Row>
						</ListGroup.Item>
						)}
						<ListGroup.Item>
							<Row>
								<Col className="CenterButtonCol">
										<Button variant="white" size="sm" onClick={this.addEntryHandler}><img src={pluscircle}/></Button>
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
					<DeleteEntryModal show={this.state.stageDeleteEntry} onHide={this.cancelDeleteEntryHandler} entryName={this.state.deleteEntryName} confirmDelete={this.confirmDeleteEntryHandler}/>
					<EntryTypeModal show={this.state.stageEntryType} onHide={this.cancelAddEntryHandler} entryType={this.state.entryType} submitEntryType={this.submitEntryTypeHandler} changeEntryType={this.changeEntryTypeHandler}/>
					<PasswordParametersModal show={this.state.stagePasswordParameters} onHide={this.cancelGeneratePasswordHandler} submitPasswordParameters={this.submitPasswordParametersHandler} check={this.checkHandler} length={this.lengthHandler} paramUpper={this.state.paramUpper} paramLower={this.state.paramLower} paramNumber={this.state.paramNumber} paramSymbol={this.state.paramSymbol} paramLength={this.state.paramLength}/>
				</div>
			);
		} else {
			return (
				<div className="App">
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
										<Col xs={3} sm={2} md={2} lg={1}>{entry.name}</Col>
										<Col>{this.state.hideValue[index]==="Show" ? this.state.hiddenPassword : entry.value}</Col>
										<Col className="ButtonCol" xs={2}>
											{entry.type==="password" ? <Button variant="white" size="sm" value={index} onClick={this.hideShowHandler}>{this.state.hideValue[index]==="Show" ? <img value={index} src={eye}/> : <img value={index} src={eyeslash}/>}</Button> : ""}
											<Button variant="white" size="sm" value={index} onClick={this.copyValueHandler}>{this.state.clipboard[index] ? <img value={index} src={clipboardcheck}/> : <img value={index} src={clipboard}/>}</Button>
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

function DeleteEntryModal(props) {
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
					Delete {props.entryName}?
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>Are you sure you want to delete this entry?</p>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={props.onHide}>Cancel</Button>
				<Button variant="danger" onClick={props.confirmDelete}>Delete</Button>
			</Modal.Footer>
		</Modal>
	);
}

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

function EntryTypeModal(props) {
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
					Add Entry
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form.Select value={props.entryType} onChange={props.changeEntryType} aria-label="Default select example">
					<option value="password">Password</option>
					<option value="text">Text</option>
				</Form.Select>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={props.onHide}>Cancel</Button>
				<Button variant="dark" onClick={props.submitEntryType}>Submit</Button>
			</Modal.Footer>
		</Modal>
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

function PasswordParametersModal(props) {
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
					Randomly Generate Password
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form variant="dark">
					<Form.Check
						type="checkbox"
						label="Include upper case letters"
						id="upper"
						name="upper"
						variant="dark"
						onChange={props.check}
						checked={props.paramUpper}
					/>
					<Form.Check
						type="checkbox"
						label="Include lower case letters"
						id="lower"
						name="lower"
						onChange={props.check}
						checked={props.paramLower}
					/>
					<Form.Check
						type="checkbox"
						label="Include numbers"
						id="number"
						name="number"
						onChange={props.check}
						checked={props.paramNumber}
					/>
					<Form.Check
						type="checkbox"
						label="Include symbols"
						id="symbol"
						name="symbol"
						onChange={props.check}
						checked={props.paramSymbol}
					/>
					<Form.Label inline htmlFor="length">Length: {props.paramLength}</Form.Label>
					<Form.Range
						inline
						id="length"
						name="length"
						min="1"
						max="30"
						step="1"
						onChange={props.length}
						value={props.paramLength}
					/>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={props.onHide}>Cancel</Button>
				<Button variant="dark" onClick={props.submitPasswordParameters}>Submit</Button>
			</Modal.Footer>
		</Modal>
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
