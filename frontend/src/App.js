import React from 'react';
import './App.css';
import './bootstrap.min.css';
import Home from './components/Home';
import Unlock from './components/Unlock';
import MainMenu from './components/MainMenu';
import NewPasswordFile from './components/NewPasswordFile';
import PasswordManager from './components/PasswordManager';


import {
	MemoryRouter as Router,
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
				<Route path="/newpasswordfile">
					<NewPasswordFile />
				</Route>
				<Route path="/passwordmanager">
					<PasswordManager />
				</Route>
				<Route path="/unlock">
					<Unlock />
				</Route>
				<Route path="/">
					<Home />
				</Route>
			</Switch>
		</Router>
	)
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

