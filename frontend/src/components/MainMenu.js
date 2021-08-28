import React from 'react';
import Button from 'react-bootstrap/Button';
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
					<Link to={'/newpasswordfile'}>
						<Button variant="danger"> New Password File </Button>
					</Link>
			</div>
		);
	}

}

export default MainMenu;
