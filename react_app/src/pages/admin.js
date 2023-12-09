import React from "react";
import { Helmet } from 'react-helmet';

const TITLE = 'Admin';

class Admin extends React.Component {
	render() {
		return (
		<main>
			<Helmet>
				<title> {TITLE} </title>
			</Helmet>

		</main>
		);
	}
}

export default Admin;
