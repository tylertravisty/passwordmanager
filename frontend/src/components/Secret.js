import React from 'react';
import './Secret.css';

import AddEntry from './AddEntry';

class Secret extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			stageEdit: false,
			stageAddEntry: false,
			stageDeleteEntry: false,
			deleteEntryIndex: -1
		}
	}

	editHandler = event => {
		this.props.secretEditHandler();
		this.setState({stageEdit: true});
	};

	cancelEditHandler = event => {
		this.props.secretCancelEditHandler();
		this.setState({stageEdit: false});
	}

	saveHandler = event => {
		this.props.secretSaveHandler();
		this.setState({stageEdit: false});
	}

	addEntryHandler = event => {
		this.setState({stageAddEntry: true});
	}

	cancelAddEntryHandler = event => {
		this.setState({stageAddEntry: false});
	}

	submitEntryHandler = event => {
		event.preventDefault();
		this.props.secretSubmitEntryHandler(event.target);
		this.setState({stageAddEntry: false});
	}

	deleteEntryHandler = event => {
		const index = event.target.getAttribute('value');
		this.setState({stageDeleteEntry: true, deleteEntryIndex: index});
	}

	cancelDeleteEntryHandler = event => {
		this.setState({stageDeleteEntry: false, deleteEntryIndex: -1});
	}

	confirmDeleteEntryHandler = event => {
		this.props.secretConfirmDeleteEntryHandler(this.state.deleteEntryIndex);
		this.setState({stageDeleteEntry: false, deleteEntryIndex: -1});
	}

	entryNameChangeHandler = event => {
		const entryIndex = event.target.name;
		const entryName = event.target.value;
		this.props.secretEntryNameChangeHandler(entryIndex, entryName);
	}

	entryValueChangeHandler = event => {
		const entryIndex = event.target.name;
		const entryValue = event.target.value;
		this.props.secretEntryValueChangeHandler(entryIndex, entryValue);
	}

	render() {
		if (this.state.stageDeleteEntry) {
			return (
				<DeleteEntry
					cancelDeleteEntryHandler={this.cancelDeleteEntryHandler}
					confirmDeleteEntryHandler={this.confirmDeleteEntryHandler}
				/>
			);
		}

		if (this.state.stageAddEntry) {
			return (
				<AddEntry
					submitEntryHandler={this.submitEntryHandler}
					cancelAddEntryHandler={this.cancelAddEntryHandler}
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
					<li key={index}><input type="text" name={index} value={entry.name} onChange={this.entryNameChangeHandler}/>:<input type="text" name={index} onChange={this.entryValueChangeHandler} value={entry.value}/><span value={index} onClick={this.deleteEntryHandler} className="DeleteEntry">Delete</span></li>
					)}
					</ul>
				</div>
			);
		} else {
			return (
				<div>
					<button className="SecretBack" onClick={this.props.secretBackHandler}>Back</button>
					<button onClick={this.editHandler}> Edit </button>
					<h2>{this.props.secrets[this.props.secretIndex].name}</h2>
					<ul>
					{this.props.secrets[this.props.secretIndex].entries.map((entry, index) =>
					<li key={index} value={index} >{entry.name}: {entry.value}</li>
					)}
					</ul>
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
