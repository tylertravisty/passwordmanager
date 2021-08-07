import React from 'react';
import './Secret.css';

class Secret extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			stageEdit: false
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

	render() {
		if (this.state.stageEdit) {
			return (
				<div>
					<button className="SecretCancelEdit" onClick={this.cancelEditHandler}>Cancel</button>
					<button onClick={this.saveHandler}> Save </button>
					<h2><input type="text" name="secretName" value={this.props.secrets[this.props.secretIndex].name} onChange={this.props.secretNameChangeHandler}/></h2>
				</div>
			);
		} else {
			return (
				<div>
					<button className="SecretBack" onClick={this.props.secretBackHandler}>Back</button>
					<button onClick={this.editHandler}> Edit </button>
					<h2>{this.props.secrets[this.props.secretIndex].name}</h2>
				</div>
			);
		}
	}
}

export default Secret;
