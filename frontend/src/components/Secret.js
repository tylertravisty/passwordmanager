import React from 'react';
import './Secret.css';

import AddEntry from './AddEntry';

class Secret extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			stageEdit: false,
			stageAddEntry: false,
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

	render() {
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
					<li key={index}>{entry.name}: {entry.value}<span value={index} onClick={this.deleteEntryHandler} className="DeleteEntry">Delete</span></li>
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
					{JSON.stringify(this.props.secrets[this.props.secretIndex])}
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
