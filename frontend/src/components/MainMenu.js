import React from 'react';
import './MainMenu.css';

class MainMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			passwordFile: props.passwordFile,
			toAddFile: false
		};
	}

	addFileHandler = event => {
		event.preventDefault();
		console.log("Add file");
		this.setState({toAddFile: true});
	};

	render() {
		return(
			<div className="MainMenu">
				Main Menu
				<div style={{border: this.state.passwordFile ? '2px solid Black':'2px solid Tomato'}}>
					<form onSubmit={this.addFileHandler}>
						<button>Add File</button>
					</form>
				</div>
			</div>
		);
	}

}

export default MainMenu;
