import React from 'react';
import './DeleteSecret.css';

class DeleteSecret extends React.Component {
	constructor(props) {
		super(props);
	}

	secretNameChangeHandler = event => {
		this.setState({secretName: event.target.value});
	};

	render() {
		return (
			<div>
				<button onClick={this.props.cancelDeleteSecretHandler}>Cancel</button>
				<div className="ConfirmDeleteSecret">
					Are you sure you want to delete the secret?<br/>
					<button onClick={this.props.confirmDeleteSecretHandler}>Delete</button>
				</div>
			</div>
		);
	}
}

export default DeleteSecret;
