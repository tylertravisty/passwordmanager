import React from 'react';
import './AddEntry.css';

class AddEntry extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			entryName: "",
			entryType: "",
			entryValue: ""
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

	render() {
		return (
			<div>
				<button className="CancelAddEntry" onClick={this.props.cancelAddEntryHandler}>Cancel</button>
				<div className="AddEntry">
					<form onSubmit={this.props.submitEntryHandler}>
						Name:<input type="text" name="entryname" value={this.state.entryName} onChange={this.entryNameChangeHandler}/>
						<br/>
						Type:<input type="text" name="entrytype" value={this.state.entryType} onChange={this.entryTypeChangeHandler}/>
						<br/>
						Value:<input type="text" name="entryvalue" value={this.state.entryValue} onChange={this.entryValueChangeHandler}/>
						<br/>
						<button>Submit</button>
					</form>
				</div>
			</div>
		);
	}
}

export default AddEntry;
