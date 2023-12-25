import React from "react";
import { Helmet } from 'react-helmet';
import peopleImage from '../images/people.png';

const TITLE = 'Voyify - Your Ultimate Travel Companion';

const styles = {
  main: {
    maxWidth: '800px',
    margin: 'auto',
    padding: '20px',
  },
  welcomeSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  welcomeText: {
    maxWidth: '400px',
  },
  image: {
    width: '100%',
    maxWidth: '400px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  descriptionSection: {
    textAlign: 'justify',
    backgroundColor: '#f8f8f8',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
};

class Home extends React.Component {
  render() {
    return (
      <main style={styles.main}>
        <Helmet>
          <title>{TITLE}</title>
        </Helmet>
        <section style={styles.welcomeSection}>
          <div style={styles.welcomeText}>
            <h1>Welcome to Voyify!</h1>
            <p>Start by getting registered or logging in.</p>
          </div>
          <img src={peopleImage} alt="People enjoying travel" style={styles.image} />
        </section>
        <section style={styles.descriptionSection}>
          <p>
            Embark on a journey of seamless travel planning with Voyify, where your travel
            dreams come to life! Say goodbye to the hassle of coordinating itineraries and
            let Voyify transform your ideas into unforgettable adventures. Whether you're a
            solo explorer, a couple seeking a romantic getaway, or a group of friends ready
            for a new escapade, Voyify is your go-to app for personalized travel experiences.
          </p>
        </section>
      </main>
    );
  }
}

export default Home;
