import React from 'react';
import './AddSecret.css';

class AddSecret extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			secretName: ""
		};
	}

	secretNameChangeHandler = event => {
		this.setState({secretName: event.target.value});
	};

	render() {
		return (
			<div>
				<button className="CancelAddSecret" onClick={this.props.cancelAddSecretHandler}>Cancel</button>
				<div className="AddSecret">
					Input secret name:
					<form onSubmit={this.props.submitSecretNameHandler}>
						<input type="text" name="secretname" value={this.state.secretName} onChange={this.secretNameChangeHandler}/>
						<button>Submit</button>
					</form>
				</div>
			</div>
		);
	}
}

export default AddSecret;
