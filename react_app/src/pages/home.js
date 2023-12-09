import React from "react";
import { Helmet } from 'react-helmet';

const TITLE = 'Home';

class Home extends React.Component {
	render() {
		return (
		<main>
			<Helmet>
				<title> {TITLE} </title>
			</Helmet>
			<p> Welcome to our application. Start by getting registered or logging in.</p>
		</main>
		);
	}
}

export default Home;
