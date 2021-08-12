import React from 'react';
import './AddEntry.css';

class AddEntry extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			entryName: "",
			entryType: "",
			entryValue: "",
			paramUpper: false,
			paramLower: false,
			paramNumber: false,
			paramSymbol: false,
			paramLength: 12,
			stagePasswordParameters: false
		};
	}

	entryNameChangeHandler = event => {
		this.setState({entryName: event.target.value});
	};

	entryTypeChangeHandler = event => {
		this.setState({entryType: event.target.value});
	};

	entryValueChangeHandler = event => {
		this.setState({entryValue: event.target.value});
	};

	generatePasswordHandler = event => {
		event.preventDefault();
		this.setState({stagePasswordParameters: true});
	};

	submitPasswordParametersHandler = event => {
		event.preventDefault();
		this.generatePassword();
	};

	async generatePassword() {
		try {
			const password = await window.backend.PasswordManager.GeneratePassword(this.state.paramUpper, this.state.paramLower, this.state.paramNumber, this.state.paramSymbol, parseInt(this.state.paramLength));
			this.setState({entryValue: password, stagePasswordParameters: false});
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

	render() {
		if (this.state.stagePasswordParameters) {
			return (
				<PasswordParameters
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

		return (
			<div>
				<button className="CancelAddEntry" onClick={this.props.cancelAddEntryHandler}>Cancel</button>
				<div className="AddEntry">
					<form onSubmit={this.props.submitEntryHandler}>
						Name:<input type="text" name="entryname" value={this.state.entryName} onChange={this.entryNameChangeHandler}/>
						<br/>
						Type:<input type="text" name="entrytype" value={this.state.entryType} onChange={this.entryTypeChangeHandler}/>
						<br/>
						Value:<input type="text" name="entryvalue" value={this.state.entryValue} onChange={this.entryValueChangeHandler}/> <button onClick={this.generatePasswordHandler}>Random</button>
						<br/>
						<button>Submit</button>
					</form>
				</div>
			</div>
		);
	}
}

export default AddEntry;

const PasswordParameters = (props) => {
	return (
		<div>
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
