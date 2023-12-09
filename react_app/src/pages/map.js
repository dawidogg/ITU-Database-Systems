import React from "react";
import { Helmet } from 'react-helmet';

const TITLE = 'Map';

class Map extends React.Component {
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

export default Map;
