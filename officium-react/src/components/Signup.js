import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { withFirebase } from './Firebase';
import { withRouter } from 'react-router-dom';
import TextField from '@material-ui/core/TextField/';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import logo from '../img/large_logo.png';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ReactPasswordStrength from 'react-password-strength';
import Typography from '@material-ui/core/Typography'
import firebase from 'firebase/app'
import getLocationCoordinates from './Location';
import axios from 'axios';

import "./style/react-password-strength.css";

import { GoogleLoginButton } from "react-social-login-buttons";
import { TwitterLoginButton } from "react-social-login-buttons";
import { GithubLoginButton } from "react-social-login-buttons";
import { FacebookLoginButton } from "react-social-login-buttons";

const styles = theme => ({
  container: {
    marginTop: 80,
    marginLeft: 15,
    marginRight: 15,
  },
  logo: {
    'max-width': '200px',
    'max-height': '200px',
    margin: 'auto',
    display: 'block',
  },
  social: {
    padding: 20,
    textAlign: 'center',
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    marginTop: '100px !important',
    margin: 'auto',
    'max-width': '800px',
    'max-height': '800px',
  },
  field: {
    textAlign: 'left',
    margin: 'auto',
    paddingBottom: 10,
    width: '75%',
  },
  button: {
    marginTop: '10px !important',
  },
  error: {
    color: "red",
    marginTop: 10
  },
});

class SignupBase extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.auth === true) {
      this.props.history.push('/home');
    }
    this.state = {
      name: '',
      password: '',
      password2: '',
      email: '',
      city: '',
      missingText: '',
    }
  }

  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value })
  }

  passChange = info => {
    this.setState({ password: info.password })
  }


  signUp = event => {
    if (this.state.name === "") {
      this.setState({ missingText: "Name field cannot be empty" });
      return;
    }
    if (this.state.email === "") {
      this.setState({ missingText: "Email field cannot be empty" });
      return;
    }
    if (this.state.password === "") {
      this.setState({ missingText: "Password field cannot be empty" });
      return;
    }
    if (this.state.city === "") {
      this.setState({ missingText: "City field cannot be empty" });
      return;
    }
    if (this.state.password2 === "") {
      this.setState({ missingText: "Please confirm your password" });
      return;
    }
    if (this.state.password2 !== this.state.password) {
      this.setState({ missingText: "Passwords do not match" });
      return;
    }

    getLocationCoordinates(this.state.city).then(response => {
      var latitude = 0;
      var longitude = 0;
      var validLocation = true;
      if (response.data.length > 0) {
        latitude = response.data[0].lat;
        longitude = response.data[0].lon;
      } else {
        validLocation = false;
      }


      this.props.firebase.createUserWithEmailAndPassword(this.state.email, this.state.password, this.state.name, this.state.city, latitude, longitude, validLocation)
        .then(() => {
          this.numbeo().then((response) => {
            return this.props.firebase.doSendEmailVerification();
          });
        })
        .then(() => {
          this.props.history.push('/home');
        }).catch(error => {
          this.setState({ error });
        });
    });
  }

  numbeo = () => {
    let numbeoLocation = this.state.city.replace(/\s/g, "-");
    numbeoLocation = numbeoLocation.replace(".", "");
    numbeoLocation = numbeoLocation.split(",")[0];
    var queryUrl = `https://www.numbeo.com/api/indices?api_key=${process.env.REACT_APP_NUMBEO_API}&query=${numbeoLocation}`;
    var encodedUrl = encodeURIComponent(queryUrl);

    return axios.get('https://corsbridge.herokuapp.com/' + encodedUrl)
      .then(response => {
        var user = firebase.auth().currentUser;
        firebase.firestore().collection('users').doc(user.uid).set({
          numbeo_crime_index: response.data.crime_index ? response.data.crime_index : 0,
          numbeo_traffic_time_index: response.data.traffic_time_index || 0,
          numbeo_cpi_and_rent_index: response.data.cpi_and_rent_index || 0,
          numbeo_purchasing_power_incl_rent_index: response.data.purchasing_power_incl_rent_index || 0,
          numbeo_restaurant_price_index: response.data.restaurant_price_index || 0,
          numbeo_property_price_to_income_ratio: response.data.property_price_to_income_ratio || 0,
          numbeo_climate_index: response.data.climate_index || 0,
          numbeo_safety_index: response.data.safety_index || 0,
          numbeo_traffic_co2_index: response.data.traffic_co2_index || 0,
          numbeo_cpi_index: response.data.cpi_index || 0,
          numbeo_traffic_inefficiency_index: response.data.traffic_inefficiency_index || 0,
          numbeo_quality_of_life_index: response.data.quality_of_life_index || 0,
          numbeo_rent_index: response.data.rent_index || 0,
          numbeo_health_care_index: response.data.health_care_index || 0,
          numbeo_traffic_index: response.data.traffic_index || 0,
          numbeo_groceries_index: response.data.groceries_index || 0,
          numbeo_pollution_index: response.data.pollution_index || 0,
          numbeo_error: response.data.error || 0,
        }, { merge: true })
          .then(() => {
          }).catch(error => {
            console.log(error);
            console.log("could not update profile with numbeo info");
          });
        return response;
      }).catch(error => {
        console.log(error);
        console.log("could not update profile with numbeo info");
      });
  }

  render() {

    const { error } = this.state;

    return (
      <div className={this.props.classes.container}>
        <Paper className={this.props.classes.paper}>
          <img src={logo} alt="Officium" className={this.props.classes.logo} />
          <form id="loginForm" style={{ paddingTop: '2%' }} onSubmit={this.handleLogin}>
            <TextField
              id="name"
              type="name"
              required
              value={this.state.name}
              onChange={this.handleChange}
              label="Name"
              fullWidth
              className={this.props.classes.field}
              variant="outlined"
            />

            <TextField
              id="email"
              type="email"
              required
              value={this.state.email}
              onChange={this.handleChange}
              label="Email"
              fullWidth
              className={this.props.classes.field}
              variant="outlined"
            />

            <ReactPasswordStrength
              id="password"
              ref={ref => this.ReactPasswordStrength = ref}
              minLength={6}
              minScore={3}
              scoreWords={['weak', 'weak', 'okay', 'good', 'strong']}
              inputProps={{ name: "password", placeholder: "Password*", autoComplete: "off" }}
              changeCallback={this.passChange}
              className={this.props.classes.field}
              style={{ marginBottom: 10, borderRadius: 4, fontSize: '1rem' }}
            />

            <TextField
              id="password2"
              type="password"
              required
              value={this.state.password2}
              onChange={this.handleChange}
              label="Confirm Password"
              fullWidth
              className={this.props.classes.field}
              variant="outlined"
            />

            <TextField
              id="city"
              type="city"
              required
              value={this.state.city}
              onChange={this.handleChange}
              label="Current City"
              fullWidth
              className={this.props.classes.field}
              variant="outlined"
            />
            {error && <AlertDialog errorMessage={error.message} service={"Officium"} />}
          </form>
          {<Typography className={this.props.classes.error}>{this.state.missingText}</Typography>}
          <Button id="signup" onClick={this.signUp} variant="contained" color="primary" className={this.props.classes.button}>SIGN UP</Button>
          <div className={this.props.classes.social}>
            <SignInGoogle id="googleSignup" />
            <SignInTwitter id="twitterSignup" />
            <SignInGithub id="gitHubSignup" />
            <SignInFacebook id="facebookSignup" />
          </div>
        </Paper>
      </div>
    );
  }
}


class AlertDialog extends React.Component {
  state = {
    open: true,
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{this.props.service + " Login Error"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.props.errorMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

class SignInFacebookBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithFacebook()
      .then(u => {
        if (u.additionalUserInfo.isNewUser) {
          var db = firebase.firestore();
          db.collection('users')
            .doc(u.user.uid).set({
              EmailAddress: u.user.email,
              Name: u.user.displayName,
              Created: firebase.firestore.Timestamp.fromDate(new Date()),
              done3Feed: false
            });
        }

      })
      .then(() => {
        this.setState({ error: null });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
    return false;
  };

  render() {
    const { error } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit" style={{ border: 'none', 'backgroundColor': 'white', 'outline': 'none' }} ><FacebookLoginButton size={'40px'} /></button>

        {error && <AlertDialog errorMessage={error.message} service={"Facebook"} />}
      </form>
    );
  }
}
class SignInGoogleBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithGoogle()
      .then(u => {
        if (u.additionalUserInfo.isNewUser) {
          var db = firebase.firestore();
          db.collection('users')
            .doc(u.user.uid).set({
              EmailAddress: u.user.email,
              Name: u.user.displayName,
              Created: firebase.firestore.Timestamp.fromDate(new Date()),
              done3Feed: false
            });
        }

      })
      .then(() => {
        this.setState({ error: null });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
    return false;
  };

  render() {
    const { error } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit" style={{ border: 'none', 'backgroundColor': 'white', 'outline': 'none' }} ><GoogleLoginButton size={'40px'} /></button>

        {error && <AlertDialog errorMessage={error.message} service={"Google"} />}
      </form>
    );
  }
}

class SignInTwitterBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithTwitter()
      .then(u => {
        if (u.additionalUserInfo.isNewUser) {
          var db = firebase.firestore();
          db.collection('users')
            .doc(u.user.uid).set({
              EmailAddress: u.user.email,
              Name: u.user.displayName,
              Created: firebase.firestore.Timestamp.fromDate(new Date()),
              done3Feed: false
            });
        }

      })
      .then(() => {
        this.setState({ error: null });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
    return false;
  };

  render() {
    const { error } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit" style={{ border: 'none', 'backgroundColor': 'white', 'outline': 'none' }} ><TwitterLoginButton size={'40px'} /></button>

        {error && <AlertDialog errorMessage={error.message} service={"Twitter"} />}
      </form>
    );
  }
}
class SignInGithubBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithGithub()
      .then(u => {
        if (u.additionalUserInfo.isNewUser) {
          var db = firebase.firestore();
          db.collection('users')
            .doc(u.user.uid).set({
              EmailAddress: u.user.email,
              Name: u.user.displayName,
              Created: firebase.firestore.Timestamp.fromDate(new Date()),
              done3Feed: false
            });
        }

      })
      .then(() => {
        this.setState({ error: null });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
    return false;
  };

  render() {
    const { error } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit" style={{ border: 'none', 'backgroundColor': 'white', 'outline': 'none' }} ><GithubLoginButton size={'40px'} /></button>

        {error && <AlertDialog errorMessage={error.message} service={"GitHub"} />}
      </form>
    );
  }
}


const SignInGoogle = compose(
  withRouter,
  withFirebase,
)(SignInGoogleBase);
const SignInTwitter = compose(
  withRouter,
  withFirebase,
)(SignInTwitterBase);
const SignInGithub = compose(
  withRouter,
  withFirebase,
)(SignInGithubBase);
const SignInFacebook = compose(
  withRouter,
  withFirebase,
)(SignInFacebookBase);

const Signup = compose(
  withRouter,
  withFirebase,
)(SignupBase);



export default withStyles(styles)(Signup);
export { SignInGoogle, SignInTwitter, SignInGithub, SignInFacebook, AlertDialog };
