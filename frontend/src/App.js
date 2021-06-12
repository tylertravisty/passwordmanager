import React from 'react';
import './App.css';
import Unlock from './components/Unlock';
import MainMenu from './components/MainMenu';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			passwordFile: false,
			loadError: "",
		};
	}

	componentDidMount() {
		this.onStart()
	}

	onStart() {
		console.log("onStart");
		window.backend.PasswordManager.OnStart().then( () => {
			console.log("good");
			this.setState({passwordfile: true});
		}).catch(error => {
			if(error !== "Password file path is empty" && error !== "Password file is missing") {
				this.setState({loadError: error});
			}
			this.setState({loadError: error})
			console.log("not as bad", error)
		});
	}

	render () {
		console.log("render", this.state.passwordFile)
		if(this.state.passwordFile === false) {
			return (
				<div className="App">
					<MainMenu passwordFile={this.state.passwordFile}/>
				</div>
			)
		}
		return (
			<div className="App">
				<Unlock />
			</div>
		);
	}
}

export default App;
