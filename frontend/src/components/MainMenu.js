import React from 'react';
import './MainMenu.css';

class MainMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: "",
			loaded: false,
			passwordFilePath: "",
			toAddFile: false
		};
	}

	componentDidMount() {
		this.onMount();
	}

	async onMount() {
		try {
			const filepath = await window.backend.PasswordManager.GetPasswordFilePath();
			this.setState({passwordFilePath: filepath, loaded: true});
		} catch(err) {
			this.setState({error: err, loaded: true});
		}
	}

	addFileHandler = event => {
		event.preventDefault();
		console.log("Add file");
		this.setState({toAddFile: true});
		this.createPasswordFile();
	};

	async createPasswordFile() {
		try {
			const filepath = await window.backend.PasswordManager.NewPasswordFile();
			this.setState({passwordFilePath: filepath});
		} catch(err) {
			this.setState({error: err});
		}
	}

	render() {
		console.log("Filepath:", this.state.passwordFilePath);
		if (this.state.loaded === false) {
			return (
				<div>Loading</div>
			);
		}

		return(
			<div className="MainMenu">
				Main Menu
				<div style={{border: !this.state.passwordFilePath === "" ? '2px solid Black':'2px solid Tomato'}}>
					<form onSubmit={this.addFileHandler}>
						<button>New Password File</button>
					</form>
				</div>
			</div>
		);
	}

}

export default MainMenu;
