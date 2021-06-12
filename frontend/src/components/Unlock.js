import React from 'react';
import './Unlock.css';

class Unlock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			password: "",
			show: false
		};
	}

	passwordChangeHandler = event => {
		this.setState({password: event.target.value});
	};

	showPassword = event => {
		event.preventDefault();
		console.log("Password: ", this.state.password);
		window.backend.checkPassword(this.state.password).then((passed) => {
			console.log("Success = ", passed)
		});
	};

	componentDidMount() {
		console.log("render Unlock")
	}

	render() {
		return (
			<div className="Unlock">
				Enter password to unlock:
				<form onSubmit={this.showPassword}>
					<input type="password" name="password" value={this.state.password} onChange={this.passwordChangeHandler}/>
					<button>Unlock</button>
				</form>
			</div>
		);
	}
}

export default Unlock;
