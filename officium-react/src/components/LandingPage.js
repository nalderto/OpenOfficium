import React from 'react';
import logo from '../img/large_logo.png';
import headerImage from '../img/header.jpg'
import LandingCard from './elements/LandingCard'
import Grid from '@material-ui/core/Grid';
import {
  Hero, CallToAction, ScrollDownIndicator, Section
} from 'react-landing-page'
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  cardGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start', 
  },
  item: {
    margin: 15,
    "align-content": "center",
    display: 'block',
    'marginLeft': 'auto',
    'marginRight': 'auto',
  },
  logo: { 
    marginTop: 60,
    'width': '30.0vw',
    'max-height': '400px', 
    "align-content": "center",
    display: 'block',
    'marginLeft': 'auto',
    'marginRight': 'auto',
    padding: 30,
  },
  background: {
    height: '50vw',
    'background-image': `url(${headerImage})`,
    'background-repeat': 'no-repeat',
    'background-size': '100%',
  },
  headText: {
    color: 'grey',
    'font-size': '32px',
    marginBottom: 15,
    margin: 30,
  },
});

class LandingPage extends React.Component {
  render() {
    return (
      <div>
        <Hero
          color="black"
          bg="white"
          backgroundImage={headerImage}
        >
          <img src={logo} style={{maxWidth: 300}} alt="Officium"></img>
          <header className={this.props.classes.headText}>Keeping track of your applications just got a whole lot easier</header>
          <div style={{flex: 'row', marginTop:'2%'}} >
          <CallToAction id='signUpBtn' href="/signup" bg='grey' color='white' mr={3}>Sign Up</CallToAction>
          <CallToAction id='loginBtn' href= "/login" bg='#2a7fff' color='white'>Login</CallToAction>
          </div>
          <ScrollDownIndicator/>
          </Hero>
          <div style={{margin: "auto"}}>
          <Section
               heading="Officium is your new personal tool to help you keep track of any jobs or internships you apply for."
          >
            <Grid container direction="row" className={this.props.classes.cardGrid}>
              <Grid item className={this.props.classes.item}>
                <LandingCard
                  title="Log your applications"
                  image="business"
                  description="You'll be able to input each of the different jobs you've applied for
                  and all of the specifications that go along with it."
                />
              </Grid>
              <Grid item className={this.props.classes.item}>
                <LandingCard
                  title="Sort your applications"
                  image="sorting"
                  description="You'll be able to sort through all of your applications by preference, location, salary,
                  optimism, enthusiasm, and more."
                />
              </Grid>
            </Grid>
            <Grid container direction="row" className={this.props.classes.cardGrid}>
              <Grid item className={this.props.classes.item}>
                <LandingCard
                      title="Update existing logs"
                      image="update"
                      description="You can go back at any time and edit the information for any of the applications
                      you've already logged."
                />
              </Grid>
              <Grid item className={this.props.classes.item}>
                <LandingCard
                    title="Compared Locations"
                    image="map"
                    description="You can compare the locations of your varioous employment options by cost of living."
                  />
              </Grid> 
            </Grid>
            <Grid container direction="row" className={this.props.classes.cardGrid}>
              <Grid item className={this.props.classes.item}>
                <LandingCard
                      title="Store documents"
                      image="books"
                      description="Store all your documents and business cards in ones place so you have easy access 
                      to them in the future."
                />
              </Grid>
              <Grid item className={this.props.classes.item}>
                <LandingCard
                      title="Set reminders"
                      image="calendar"
                      description="Have an important meeting you need to remember? Don't worry, you can set email
                      reminders for all those interviews you'll get."
                />
              </Grid>
            </Grid>
          
          </Section>
          </div>
    </div>
    )
  }
}

export default withStyles(styles)(LandingPage);
