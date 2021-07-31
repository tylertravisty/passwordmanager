import React from 'react';
import './MainMenu.css';

import { Link } from "react-router-dom";

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
		if (this.state.loaded === false) {
			return (
				<div>Loading</div>
			);
		}

		return(
			<div className="MainMenu">
				Main Menu
				<div style={{border: !this.state.passwordFilePath === "" ? '2px solid Black':'2px solid Tomato'}}>
					<Link to={'/newpasswordfile'}>
						<button > New Password File </button>
					</Link>
				</div>
			</div>
		);
	}

}

export default MainMenu;
