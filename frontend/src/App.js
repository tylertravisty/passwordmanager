import React from 'react';
import './App.css';
import Home from './components/Home';
import Unlock from './components/Unlock';
import MainMenu from './components/MainMenu';


import {
	MemoryRouter as Router,
	Redirect,
	Route,
	Switch,
	Link
} from "react-router-dom";

export default function App() {
	return (
		<Router>
			<Switch>
				<Route path="/mainmenu">
					<MainMenu />
				</Route>
				<Route path="/error">
					<TestError />
				</Route>
				<Route path="/unlock">
					<TestUnlock />
				</Route>
				<Route path="/">
					<Home />
				</Route>
			</Switch>
		</Router>
	)
}

function TestMainMenu() {
	return (
		<div className="App">
			<h2>MainMenu</h2>
			<Link to="/error">Error</Link><br/>
			<Link to="/unlock">Unlock</Link><br/>
			<Link to="/">Home</Link><br/>
		</div>
	);
}


function TestError() {
	return (
		<div className="App">
			<h2>Error</h2>
			<Link to="/mainmenu">MainMenu</Link><br/>
			<Link to="/unlock">Unlock</Link><br/>
			<Link to="/">Home</Link><br/>
		</div>
	);
}

function TestUnlock() {
	return (
		<div className="App">
			<h2>Unlock</h2>
			<Link to="/mainmenu">MainMenu</Link><br/>
			<Link to="/error">Error</Link><br/>
			<Link to="/">Home</Link><br/>
		</div>
	);
}

function About() {
	return (
		<div className="App">
			<h2>About</h2>
			<Link to="/">Home</Link>
			<Link to="/redir">Redir</Link>
		</div>
	);
}

function Redir() {
	return (
		<Redirect to="/" />
	);
}

class App2 extends React.Component {
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

//export default App2;
