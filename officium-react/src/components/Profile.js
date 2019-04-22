import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { withFirebase } from './Firebase';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import 'firebase/auth';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import firebase from 'firebase/app';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField/';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton/';
import EditIcon from '@material-ui/icons/Edit';
import { GoogleLoginButton } from "react-social-login-buttons";
import { TwitterLoginButton } from "react-social-login-buttons";
import { GithubLoginButton } from "react-social-login-buttons";
import { FacebookLoginButton } from "react-social-login-buttons";
import { UnlinkGoogle, UnlinkTwitter, UnlinkGithub, UnlinkFacebook } from "./Unlink";
import AlertDialog from "./Profile";
import Switch from '@material-ui/core/Switch/'
import getLocationCoordinates, { getDistance, inMiles, crowFlies } from './Location';
import ReactTooltip from 'react-tooltip';
import InfoIcon from '@material-ui/icons/Info';
import IntegrationAutosuggest from './elements/IntegrationAutosuggest';
import { getSuggestions } from './elements/IntegrationAutosuggest';
import Slider from '@material-ui/lab/Slider';
import axios from 'axios';


const styles = theme => ({
  root: {
  },
  yourProf: {
    marginTop: '100px',
    marginBottom: '30px',
  },
  panes: {
    margin: '10px',
    textAlign: 'left',
  },
  topDiv: {
    marginTop: '65px',
    textAlign: 'center',
  },
  button: {
    marginTop: '20px',
    margin: theme.spacing.unit,
    position: 'relative',
  },
  linkEmailButton: {
    marginTop: '20px',
    margin: theme.spacing.unit,
    position: 'relative',

    height: '25%',
    width: '200px',
  },
  paper: {
    backgroundColor: '#edf3ff',
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    margin: 'auto',
    'max-width': 500,
    'max-height': '90%',
  },
  paperEdit: {
    marginTop: '20%',
    backgroundColor: '#edf3ff',
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    margin: 'auto',
    'max-width': 500,
    'max-height': '90%',
  },
  profContent: {
    textAlign: 'left',
  },
  editIcon: {
    marginTop: '-5%',
    marginBottom: '-5%',
    marginLeft: '90%',
  },
  infoIcon: {
    marginBottom: '1%',
  },
  editPage: {
    marginTop: '400px',
  },
  field: {
    textAlign: 'center',
    margin: 'auto',
    marginBottom: 10,
    marginTop: 10,
    width: '75%',
  },
  buttonEdit: {
    padding: theme.spacing.unit * 2,
  },
  social: {
    padding: 20,
    textAlign: 'center',
  },
  mobileButtons: {
    fontSize: 12,
  },
  slider: {
    margin: 'auto',
    marginBottom: 5,
    padding: 5,
    width: 300,
    textAlign: 'center',
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class LinkFacebookBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doLinkWithFacebook()
      .then(() => {
        this.setState({ error: null });
        this.props.addFacebook();
      })
      .catch(error => {
        console.log(error);
        this.setState({ error });
      });

    event.preventDefault();
    return false;
  };

  render() {
    const { error } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <button type="submit" style={{ border: 'none', 'backgroundColor': 'white', 'outline': 'none' }} >
          <FacebookLoginButton size={'40px'}>
            <span>Link with Facebook</span>
          </FacebookLoginButton>
        </button>

        {error && <AlertDialog errorMessage={error.message} service={"Facebook"} />}
      </form>
    );
  }
}
class LinkGoogleBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doLinkWithGoogle()
      .then(() => {
        this.setState({ error: null });
        this.props.addGoogle();
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
        <button type="submit" style={{ border: 'none', 'backgroundColor': 'white', 'outline': 'none' }} >
          <GoogleLoginButton size={'40px'}>
            <span>Link with Google</span>
          </GoogleLoginButton>
        </button>

        {error && <AlertDialog errorMessage={error.message} service={"Google"} />}
      </form>
    );
  }
}

class LinkTwitterBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doLinkWithTwitter()
      .then(() => {
        this.setState({ error: null });
        this.props.addTwitter();
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
        <button type="submit" style={{ border: 'none', 'backgroundColor': 'white', 'outline': 'none' }} >
          <TwitterLoginButton size={'40px'} className={this.state.width < 900 ? this.props.classes.mobileButtons : ""}>
            <span>Link with Twitter</span>
          </TwitterLoginButton>
        </button>

        {error && <AlertDialog errorMessage={error.message} service={"Twitter"} />}
      </form>
    );
  }
}
class LinkGithubBase extends React.Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doLinkWithGithub()
      .then(() => {
        this.setState({ error: null });
        this.props.addGithub();
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
        <button type="submit" style={{ border: 'none', 'backgroundColor': 'white', 'outline': 'none' }} >
          <GithubLoginButton size={'40px'}>
            <span>Link with Github</span>
          </GithubLoginButton>
        </button>

        {error && <AlertDialog errorMessage={error.message} service={"GitHub"} />}
      </form>
    );
  }
}


const LinkGoogle = compose(
  withRouter,
  withFirebase,
)(LinkGoogleBase);
const LinkTwitter = compose(
  withRouter,
  withFirebase,
)(LinkTwitterBase);
const LinkGithub = compose(
  withRouter,
  withFirebase,
)(LinkGithubBase);
const LinkFacebook = compose(
  withRouter,
  withFirebase,
)(LinkFacebookBase);

class ProfileBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      name: '',
      city: '',
      email: '',
      timeforfeedback: false,
      done3feed: false,
      verifiedEmail: null,
      expectedDateNotifications: false,
      inActivityNotifications: false,
      openChangePassword: false,
      resetEmail: '',
      openDelete: false,
      openEdit: false,
      openEmail: false,
      nameEdit: '',
      cityEdit: '',
      emailEdit: '',
      nextDisabled: false,
      linkEmailAddress: '',
      linkPassword: '',
      infoDialogShow: false,
      showGoogle: true,
      showTwitter: true,
      showFacebook: true,
      showGithub: true,
      showEmail: true,
      providerCount: 0,
      showTooltip: false,
      width: window.innerWidth,
      crimeWeight: 1,
      weights: {
        crime: null,
        trafficTime: null,
        cpiAndRent: null,
        purchasingPower: null,
        restaurantPrice: null,
        propertyPriceToIncomeRatio: null,
        climateIndex: null,
        safetyIndex: null,
        trafficCo2: null,
        cpiIndex: null,
        trafficInefficiency: null,
        qualityOfLife: null,
        rent: null,
        healthCare: null,
        traffic: null,
        groceries: null,
        pollution: null,
      },
      unlinkEmailInnerText: "Unlink from Email",
    };
    this.addTwitter = this.addTwitter.bind(this);
    this.addFacebook = this.addFacebook.bind(this);
    this.addGithub = this.addGithub.bind(this);
    this.addEmail = this.addEmail.bind(this);
    this.addGoogle = this.addGoogle.bind(this);
    this.removeTwitter = this.removeTwitter.bind(this);
    this.removeFacebook = this.removeFacebook.bind(this);
    this.removeGithub = this.removeGithub.bind(this);
    this.removeEmail = this.removeEmail.bind(this);
    this.removeGoogle = this.removeGoogle.bind(this);
  }
  removeTwitter() {
    this.setState({
      showTwitter: true,
      providerCount: this.state.providerCount - 1
    });
  }
  removeFacebook() {
    this.setState({
      showFacebook: true,
      providerCount: this.state.providerCount - 1
    });
  }
  removeGithub() {
    this.setState({
      showGithub: true,
      providerCount: this.state.providerCount - 1
    });
  }
  removeEmail() {
    this.setState({
      showEmail: true,
      providerCount: this.state.providerCount - 1
    });
  }
  removeGoogle() {
    this.setState({
      showGoogle: true,
      providerCount: this.state.providerCount - 1
    });
  }

  addTwitter() {
    this.setState({
      showTwitter: false,
      providerCount: this.state.providerCount + 1
    });
  }
  addFacebook() {
    this.setState({
      showFacebook: false,
      providerCount: this.state.providerCount + 1
    });
  }
  addGithub() {
    this.setState({
      showGithub: false,
      providerCount: this.state.providerCount + 1
    });
  }
  addEmail() {
    this.setState({
      showEmail: false,
      providerCount: this.state.providerCount + 1
    });
  }
  addGoogle() {
    this.setState({
      showGoogle: false,
      providerCount: this.state.providerCount + 1
    });
  }

  updateDimensions() {
    this.setState({
      width: window.innerWidth,
    })
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  componentDidUpdate(prevProps, prevState){
    var filterstrings = null;
    var passedinstring = null;
    if (prevState.cityEdit !== this.state.cityEdit || prevState.nameEdit !== this.state.nameEdit) {
        if (prevState.cityEdit === undefined)return;
        filterstrings = getSuggestions(this.state.cityEdit);
        passedinstring = this.state.cityEdit.toLowerCase();
        if (filterstrings.length !== 0 && passedinstring.includes(filterstrings[0].label.toLowerCase()) && !!this.state.nameEdit) {
          this.setState({
            nextDisabled: false
          });
        }
        else {
          this.setState({
            nextDisabled: true
          });
        }

    }

  }
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
    var user = firebase.auth().currentUser;
    var showGoogle = true;
    var showTwitter = true;
    var showFacebook = true;
    var showGithub = true;
    var showEmail = true;

    for (var i = 0; i < user.providerData.length; i++) {
      switch (user.providerData[i].providerId) {
        case "password":
          showEmail = false;
          break;
        case "google.com":
          showGoogle = false;
          break;
        case "twitter.com":
          showTwitter = false;
          break;
        case "facebook.com":
          showFacebook = false;
          break;
        case "github.com":
          showGithub = false;
          break;
        default:
          break;
      }
    }
    this.setState({
      verifiedEmail: user.emailVerified,
      showGoogle: showGoogle,
      showTwitter: showTwitter,
      showFacebook: showFacebook,
      showGithub: showGithub,
      showEmail: showEmail,
      providerCount: user.providerData.length
    })
    let db = firebase.firestore();
    db.collection('users').doc(user.uid).get()
      .then(doc => {
        if (!doc.exists) {
          console.log('No such document');
        } else {
          var city = "(not set)";
          var name = "(not set)";
          var email = "(not set)";
          var expectedDateNotifications = false;
          var inActivityNotifications = false;
          var showTooltip = false;
          var weights = this.state.weights;
          var done3feed;
          if (doc.data().Name !== undefined) {
            name = doc.data().Name;
          }
          if (doc.data().City !== undefined) {
            city = doc.data().City;
          }
          if (doc.data().EmailAddress !== undefined) {
            email = doc.data().EmailAddress;
          }
          if (doc.data().ExpectedDateNotifications !== undefined) {
            expectedDateNotifications = doc.data().ExpectedDateNotifications;
          }
          if (doc.data().InActivityNotifications !== undefined) {
            inActivityNotifications = doc.data().InActivityNotifications;
          }
          if (doc.data().ValidLocation !== undefined) {
            showTooltip = !doc.data().ValidLocation;
          }
          if (doc.data().weights !== undefined) {
            weights = doc.data().weights;
          }
          if (doc.data().Created !== undefined) {
            done3feed = doc.data().done3Feed;
            if(!done3feed) {
              var created = doc.data().Created.toDate().getTime();
              var rightNow = Math.floor(Date.now());
              var elapsed = rightNow - created;  //elapsed number of milliseconds
              if(elapsed >= 7776000000) {
                this.setState({
                  timeforfeedback: true
                });
              }
            }
          }

          this.setState({
            name: name,
            city: city,
            email: email,
            inActivityNotifications: inActivityNotifications,
            expectedDateNotifications: expectedDateNotifications,
            showTooltip: showTooltip,
            weights: weights,
            done3feed: done3feed
          });
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      })
  }

  deleteAccount = event => {
    this.props.firebase.deleteAccount();
    this.setState({ openDelete: false });
    this.handleFeedback();
  };


  reDirect = () => {
    this.props.history.push('/logout');
  }

  handleBugReport = () => {
    this.props.history.push('/bugreport');
  }

  handleThreeMonth = () => {
    this.handleClose3Feed();
    this.props.history.push('/threemonthfeedback');
  }

  handleClose3Feed = () => {
    this.setState({
      timeforfeedback: false
    });
    let oppositeState = !this.state.done3Feed;
    this.setState({
      done3Feed: oppositeState
    });
    let user = firebase.auth().currentUser;
    let db = firebase.firestore();
    db.collection('users').doc(user.uid).update({
      done3Feed: oppositeState
    })
      .then(() => {
      })
      .catch(err => {
        console.log('Error changing 3Feed', err);
      })
  }

  handleFeedback = () => {
    this.props.history.push('/deletefeedback');
  }

  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value })
  };

  state = {
    openChangePassword: false,
    openDelete: false
  };

  handleClickOpenDelete = () => {
    this.setState({ openDelete: true });
  };

  handleClickLinkEmail = () => {
    this.setState({ openEmail: true });
  };

  handleClickUnlinkEmail = () => {
    this.setState({
      unlinkEmailInnerText: "Unlinking..."
    });
    var user = firebase.auth().currentUser;
    user.unlink("password").then(() => {
      this.removeEmail();

    }).catch(function (error) {
      console.error("Unlink Error: ", error);
    });

  };

  handleCloseDelete = () => {
    this.setState({ openDelete: false });
  };

  handleClickOpenChangePassword = () => {
    this.setState({ openChangePassword: true });
  };

  handleCloseChangePassword = () => {
    this.setState({
      openChangePassword: false,
      error: '',
      resetEmail: '',
    });
  };
  handleCloseEmail = () => {
    this.setState({
      openEmail: false,
      error: '',
    });
  };

  handleCloseEdit = () => {
    this.setState({ openEdit: false });
  };

  handleEdit = () => {
    this.setState({
      openEdit: true,
      nameEdit: this.state.name,
      cityEdit: this.state.city,
      emailEdit: this.state.email,
    });
  };


  handleInfoOpen = () => {
    this.setState({
      infoDialogShow: true,
    })
  }

  setWeights = () => {
    this.setState({
      open:true,
    });
  }

  closeWeights = () => {
    var uid = firebase.auth().currentUser.uid;
    var db = firebase.firestore();
    db.collection('users').doc(uid).update({
      weights: this.state.weights,
    }).then(function () {
      //console.log("Document successfully written!");
    })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
    this.setState({
      open: false,
    });
  }

  handleInfoClose = () => {
    this.setState({
      infoDialogShow: false,
    })
  }

  handleChangeEditEmail = (event) => {
    this.setState({ emailEdit: event.target.value });
  };

  handleChangeEditCity = (name) => {
    this.setState({ cityEdit: name });
  };

  handleChangeEditName = (event) => {
    this.setState({ nameEdit: event.target.value });
  };

  handleChangeExpectedNotifications = () => {
    let oppositeState = !this.state.expectedDateNotifications;
    this.setState({
      expectedDateNotifications: oppositeState
    });
    let user = firebase.auth().currentUser;
    let db = firebase.firestore();
    db.collection('users').doc(user.uid).update({
      ExpectedDateNotifications: oppositeState
    })
      .then(() => {
      })
      .catch(err => {
        console.log('Error getting document', err);
      })
  }

  handleChangeInactivityNotifications = () => {
    let oppositeState = !this.state.inActivityNotifications;
    this.setState({
      inActivityNotifications: oppositeState
    });
    let user = firebase.auth().currentUser;
    let db = firebase.firestore();
    db.collection('users').doc(user.uid).update({
      InActivityNotifications: oppositeState
    })
      .then(() => {
      })
      .catch(err => {
        console.log('Error getting document', err);
      })
  }

  updateJobDistances = (db, user, latitude, longitude, validLocation) => {
    if (!validLocation) {
      return new Promise(function (resolve, reject) {
        resolve(true);
      });
    }
    var userValidLocation = validLocation;
    return db.collection('users').doc(user.uid).collection('jobs').get().then((snapshot) => {
      snapshot.forEach(async doc => {
        validLocation = userValidLocation && doc.data().ValidLocation;
        await getDistance(latitude, longitude, doc.data().Latitude, doc.data().Longitude, validLocation).then(async response => {
          //console.log(response);
          if (response) {
            var remaining = parseInt(response["headers"]["x-ratelimit-remaining"]);
            var distance = 0;
            remaining = 0;
            if (remaining <= 1 || response.status === 400) {
              distance = crowFlies(latitude, longitude, doc.data().Latitude, doc.data().Longitude);
            } else {
              distance = inMiles(response.data.paths[0].distance);
            }
            //console.log(distance);
            await db.collection('users').doc(user.uid).collection('jobs').doc(doc.id).update({
              Distance: distance
            }).then(() => {
              return true;
            });
          }
        }).then(() => {

        });
      });
    });

  }

  handleSubmit = () => {
    var user = firebase.auth().currentUser;
    var db = firebase.firestore();
    this.numbeo().then((response) => {
      getLocationCoordinates(this.state.cityEdit).then(response => {
        var latitude = 0;
        var longitude = 0;
        var validLocation = true;
        if (response.data.length > 0) {
          latitude = response.data[0].lat;
          longitude = response.data[0].lon;
        } else {
          validLocation = false;
        }
        this.updateJobDistances(db, user, latitude, longitude, validLocation)
          .then(() => {
            db.collection('users').doc(user.uid).update({
              Name: this.state.nameEdit,
              EmailAddress: this.state.emailEdit,
              City: this.state.cityEdit,
              ExpectedDateNotifications: this.state.expectedDateNotifications,
              InActivityNotifications: this.state.inActivityNotifications,
              Latitude: latitude,
              Longitude: longitude,
              ValidLocation: validLocation,
              weights: this.state.weights
            })
              .catch(err => {
                console.log('Error getting document', err);
              })
            this.setState({
              openEdit: false,
              showTooltip: !validLocation,
              name: this.state.nameEdit,
              city: this.state.cityEdit,
              email: this.state.emailEdit
            });
          }).catch(error => {
            console.error(error);
          });
      });
    });
  }

  handleLinkEmail = event => {

    var credential = firebase.auth.EmailAuthProvider
      .credential(this.state.linkEmailAddress, this.state.linkPassword);
    firebase.auth().currentUser.linkAndRetrieveDataWithCredential(credential)
      .then((usercred) => {
        var user = usercred.user;
        this.addEmail();
        this.setState({
          openEmail: false,
          unlinkEmailInnerText: "Unlink from Email"
        });
        console.log("Account linking success", user);
      }, function (error) {
        console.error("Account linking error", error);
      });

  }

  getCity = () => {
    return this.state.city;
  }

  handleReset = event => {
    var that = this;
    this.props.firebase.sendPasswordResetEmail(this.state.resetEmail)
      .then(function () {
        //Email sent
        this.setState({ openChangePassword: false, error: '' });

      })
      .catch(function (error) {
        console.log(error.code);
        let errorCode = error.code;
        if (errorCode === 'auth/invalid-email') {
          that.setState({
            error: "Invalid email format"
          });
        }
        else if (errorCode === 'auth/user-not-found') {
          that.setState({
            error: "Email address not recognized"
          });
        }
        else if (errorCode != null) {
          that.setState({
            error: "Error: Please try again later."
          });
        }
        else if (errorCode == null) {
          that.setState({ open: false, error: '' });
        }
      })
  };

  // Setting user weights
  //- - - - - Sorry it's so ugly - - - - - -
  handleCrime = (event,sliderValue) => {
    let tempWeights = Object.assign({}, this.state.weights);  
    tempWeights.crime = sliderValue;
    tempWeights.crime = tempWeights.crime / 10;
    this.setState({
      // crimeWeight: [event.target.value],
      weights: tempWeights,
    });
  }
  handleCpiAndRent = (event,sliderValue) => {
    let tempWeights = Object.assign({}, this.state.weights);  
    tempWeights.cpiAndRent = sliderValue;
    this.setState({
      // crimeWeight: [event.target.value],
      weights: tempWeights,
    });
  }
  handleTrafficTime = (event,sliderValue) => {
    let tempWeights = Object.assign({}, this.state.weights);  
    tempWeights.trafficTime = sliderValue;
    this.setState({
      // crimeWeight: [event.target.value],
      weights: tempWeights,
    });
  }
  handlePurchasingPower= (event,sliderValue) => {
    let tempWeights = Object.assign({}, this.state.weights);  
    tempWeights.purchasingPower = sliderValue;
    this.setState({
      // crimeWeight: [event.target.value],
      weights: tempWeights,
    });
  }
  handleRestaurantPrice = (event,sliderValue) => {
    let tempWeights = Object.assign({}, this.state.weights);  
    tempWeights.restaurantPrice = sliderValue;
    this.setState({
      // crimeWeight: [event.target.value],
      weights: tempWeights,
    });
  }
  handlePopertyPriceToIncomeRatio = (event,sliderValue) => {
    let tempWeights = Object.assign({}, this.state.weights);  
    tempWeights.propertyPriceToIncomeRatio = sliderValue;
    this.setState({
      // crimeWeight: [event.target.value],
      weights: tempWeights,
    });
  }
  handleClimateIndex = (event,sliderValue) => {
    let tempWeights = Object.assign({}, this.state.weights);  
    tempWeights.climateIndex = sliderValue;
    this.setState({
      // crimeWeight: [event.target.value],
      weights: tempWeights,
    });
  }
  handleSafetyIndex = (event,sliderValue) => {
    let tempWeights = Object.assign({}, this.state.weights);  
    tempWeights.safetyIndex = sliderValue;
    this.setState({
      // crimeWeight: [event.target.value],
      weights: tempWeights,
    });
  }
  handleTrafficCo2 = (event,sliderValue) => {
    let tempWeights = Object.assign({}, this.state.weights);  
    tempWeights.trafficCo2 = sliderValue;
    this.setState({
      // crimeWeight: [event.target.value],
      weights: tempWeights,
    });
  }
  handleCpiIndex = (event,sliderValue) => {
    let tempWeights = Object.assign({}, this.state.weights);  
    tempWeights.cpiIndex = sliderValue;
    this.setState({
      // crimeWeight: [event.target.value],
      weights: tempWeights,
    });
  }
  handleTrafficInefficiency = (event,sliderValue) => {
    let tempWeights = Object.assign({}, this.state.weights);  
    tempWeights.trafficInefficiency = sliderValue;
    this.setState({
      // crimeWeight: [event.target.value],
      weights: tempWeights,
    });
  }
  handleQualityOfLife = (event,sliderValue) => {
    let tempWeights = Object.assign({}, this.state.weights);  
    tempWeights.qualityOfLife = sliderValue;
    this.setState({
      // crimeWeight: [event.target.value],
      weights: tempWeights,
    });
  }
  handleRent = (event,sliderValue) => {
    let tempWeights = Object.assign({}, this.state.weights);  
    tempWeights.rent = sliderValue;
    this.setState({
      // crimeWeight: [event.target.value],
      weights: tempWeights,
    });
  }
  handleHealthCare = (event,sliderValue) => {
    let tempWeights = Object.assign({}, this.state.weights);  
    tempWeights.healthCare = sliderValue;
    this.setState({
      // crimeWeight: [event.target.value],
      weights: tempWeights,
    });
  }
  handleTraffic = (event,sliderValue) => {
    let tempWeights = Object.assign({}, this.state.weights);  
    tempWeights.traffic = sliderValue;
    this.setState({
      // crimeWeight: [event.target.value],
      weights: tempWeights,
    });
  }
  handleGroceries = (event,sliderValue) => {
    let tempWeights = Object.assign({}, this.state.weights);  
    tempWeights.groceries = sliderValue;
    this.setState({
      // crimeWeight: [event.target.value],
      weights: tempWeights,
    });
  }
  handlePollution = (event,sliderValue) => {
    let tempWeights = Object.assign({}, this.state.weights);
    tempWeights.pollution = sliderValue;
    this.setState({
      weights:tempWeights,
    });

  }


  numbeo = () => {
    let numbeoLocation = this.state.cityEdit.replace(/\s/g, "-");
    numbeoLocation = numbeoLocation.replace(".", "");
    numbeoLocation = numbeoLocation.split(",")[0];
    var queryUrl = `https://www.numbeo.com/api/indices?api_key=${process.env.REACT_APP_NUMBEO_API}&query=${numbeoLocation}`;
    var encodedUrl = encodeURIComponent( queryUrl );

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
      }, {merge: true})
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
    if (!this.state.openEdit) {
      //DESKTOP UI
      if (this.state.width > 900) {
        return (
          <div>
            <div className={this.props.classes.topDiv}>
              <Typography className={this.props.classes.yourProf} variant="h4" gutterBottom>
                Your Profile
          </Typography>
            </div>
            <div>
              <Paper className={this.props.classes.paper}>
                <IconButton className={this.props.classes.editIcon} onClick={this.handleEdit} aria-label="Edit">
                  <EditIcon />
                </IconButton>
                <Grid container className={this.props.classes.root} spacing={0}>
                  <Grid item className={this.props.classes.panes}>
                    <Typography variant="h6" gutterBottom>
                      Name:
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      City:
                      {this.state.showTooltip &&
                        <span>
                          <span ref="invalidLocation" data-tip=
                            "We couldn't find the location you provided.<br/>Certain functionality won't work properly."
                            data-multiline="true" style={{ color: 'red' }}> ( ! )</span>
                          <ReactTooltip />
                        </span>
                      }
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Email:
                    </Typography>
                  </Grid>
                  <Grid item className={this.props.classes.panes}>
                    <Typography variant="h6" gutterBottom>
                      {this.state.name}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {this.state.city}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {this.state.email}
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="h6" gutterBottom>
                  Notifications:
                <IconButton className={this.props.classes.infoIcon} onClick={this.handleInfoOpen} aria-label="Edit">
                    <InfoIcon />
                  </IconButton>
                </Typography>

                <Grid container className={this.props.classes.root} spacing={0}>
                  <Grid item className={this.props.classes.panes}>
                    <Typography variant="h6" gutterBottom>
                      Expected Response:
                  </Typography>
                    <Typography variant="h6" gutterBottom>
                      Inactivity:
                  </Typography>
                  </Grid>
                  <Grid item className={this.props.classes.panes}>
                    <div
                      style={{ "marginTop": -8, "marginLeft": -12 }}>
                      <Switch
                        checked={this.state.expectedDateNotifications}
                        onChange={this.handleChangeExpectedNotifications}
                      />
                    </div>
                    <div
                      style={{ "marginTop": -8, "marginLeft": -12 }}>
                      <Switch
                        checked={this.state.inActivityNotifications}
                        onChange={this.handleChangeInactivityNotifications}
                      />
                    </div>
                  </Grid>
                </Grid>
                {!(this.state.verifiedEmail) &&
                  <Button color="secondary" onClick={this.props.firebase.doSendEmailVerification}>Send Verification Email</Button>
                }

              </Paper>
              <Grid container direction="row-reverse" justify="center" alignItems="center">
              <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                scroll="paper"
                aria-labelledby="scroll-dialog-title"
                fullWidth
              >
          
          <DialogTitle id="scroll-dialog-title" align="center">
            <Typography variant="h5" color="primary">Customize User Weights (1-10)</Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
            <Typography variant="subtitle1" align="center">How important is crime to you?</Typography>
              <Slider className={this.props.classes.slider}
                value={this.state.weights.crime * 10 || 0}
                min={0}
                max={10}
                step={1}
                onChange={this.handleCrime}
              />
              <Typography variant="subtitle1" align="center">How important is CPI and rent to you?</Typography>
              <Slider className={this.props.classes.slider}
                value={this.state.weights.cpiAndRent || 0}
                min={0}
                max={10}
                step={1}
                onChange={this.handleCpiAndRent}
              />
              <Typography variant="subtitle1" align="center">How important is traffic time to you?</Typography>
              <Slider className={this.props.classes.slider}
                value={this.state.weights.trafficTime || 0}
                min={0}
                max={10}
                step={1}
                onChange={this.handleTrafficTime}
              />
              <Typography variant="subtitle1" align="center">How important is purchasing power to you?</Typography>
              <Slider className={this.props.classes.slider}
                value={this.state.weights.purchasingPower || 0}
                min={0}
                max={10}
                step={1}
                onChange={this.handlePurchasingPower}
              />
              <Typography variant="subtitle1" align="center">How important is restaurant price to you?</Typography>
              <Slider className={this.props.classes.slider}
                value={this.state.weights.restaurantPrice || 0}
                min={0}
                max={10}
                step={1}
                onChange={this.handleRestaurantPrice}
              />
              <Typography variant="subtitle1" align="center">How important is property price to you?</Typography>
              <Slider className={this.props.classes.slider}
                value={this.state.weights.propertyPriceToIncomeRatio || 0}
                min={0}
                max={10}
                step={1}
                onChange={this.handlePopertyPriceToIncomeRatio}
              />
              <Typography variant="subtitle1" align="center">How important is climate to you?</Typography>
              <Slider className={this.props.classes.slider}
                value={this.state.weights.climateIndex || 0}
                min={0}
                max={10}
                step={1}
                onChange={this.handleClimateIndex}
              />
              <Typography variant="subtitle1" align="center">How important is safety to you?</Typography>
              <Slider className={this.props.classes.slider}
                value={this.state.weights.safetyIndex || 0}
                min={0}
                max={10}
                step={1}
                onChange={this.handleSafetyIndex}
              />
              <Typography variant="subtitle1" align="center">How important is traffic CO2 to you?</Typography>
              <Slider className={this.props.classes.slider}
                value={this.state.weights.trafficCo2 || 0}
                min={0}
                max={10}
                step={1}
                onChange={this.handleTrafficCo2}
              />
              <Typography variant="subtitle1" align="center">How important is cpi index to you?</Typography>
              <Slider className={this.props.classes.slider}
                value={this.state.weights.cpiIndex || 0}
                min={0}
                max={10}
                step={1}
                onChange={this.handleCpiIndex}
              />
              <Typography variant="subtitle1" align="center">How important is traffic inefficiency to you?</Typography>
              <Slider className={this.props.classes.slider}
                value={this.state.weights.trafficInefficiency || 0}
                min={0}
                max={10}
                step={1}
                onChange={this.handleTrafficInefficiency}
              />
              <Typography variant="subtitle1" align="center">How important is quality of life to you?</Typography>
              <Slider className={this.props.classes.slider}
                value={this.state.weights.qualityOfLife || 0}
                min={0}
                max={10}
                step={1}
                onChange={this.handleQualityOfLife}
              />
              <Typography variant="subtitle1" align="center">How important is rent to you?</Typography>
              <Slider className={this.props.classes.slider}
                value={this.state.weights.rent || 0}
                min={0}
                max={10}
                step={1}
                onChange={this.handleRent}
              />
              <Typography variant="subtitle1" align="center">How important is healthcare to you?</Typography>
              <Slider className={this.props.classes.slider}
                value={this.state.weights.healthCare || 0}
                min={0}
                max={10}
                step={1}
                onChange={this.handleHealthCare}
              />
              <Typography variant="subtitle1" align="center">How important is traffic to you?</Typography>
              <Slider className={this.props.classes.slider}
                value={this.state.weights.traffic || 0}
                min={0}
                max={10}
                step={1}
                onChange={this.handleTraffic}
              />
              <Typography variant="subtitle1" align="center">How important is groceries to you?</Typography>
              <Slider className={this.props.classes.slider}
                value={this.state.weights.groceries || 0}
                min={0}
                max={10}
                step={1}
                onChange={this.handleGroceries}
              />
              <Typography variant="subtitle1" align="center">How important is pollution to you?</Typography>
              <Slider className={this.props.classes.slider}
                value={this.state.weights.pollution || 0}
                min={0}
                max={10}
                step={1}
                onChange={this.handlePollution}
              />
              </DialogContentText>
              </DialogContent>
              <DialogActions>
            <Button className={this.props.classes.button} onClick={this.closeWeights} size="small" variant="contained" color="primary">Close</Button>
            </DialogActions>
        </Dialog>
                <Button className={this.props.classes.button} onClick={this.setWeights} size="small" variant="contained" color="primary">Customize Weights</Button>
                <Button className={this.props.classes.button} onClick={this.handleClickOpenChangePassword} size="small" variant="contained" color="primary">Change Password</Button>
                <Button className={this.props.classes.button} onClick={this.handleClickOpenDelete} size="small" variant="contained" color="secondary">Delete Account</Button>
                <Button className={this.props.classes.button} onClick={this.handleBugReport} size="small" variant="contained" color="inherit">Report A Bug</Button>
              </Grid>
              <div className={this.props.classes.social}>
                {this.state.showEmail &&
                  <Button className={this.props.classes.linkEmailButton} onClick={this.handleClickLinkEmail} size="small" variant="contained" color="primary">Link With Email</Button>
                }
                {!this.state.showEmail && this.state.providerCount > 1 &&
                  <Button className={this.props.classes.linkEmailButton} onClick={this.handleClickUnlinkEmail} size="small" variant="contained" color="primary">{this.state.unlinkEmailInnerText}</Button>
                }
                {this.state.showGoogle &&
                  <LinkGoogle addGoogle={this.addGoogle} id="googleSignup" />
                }
                {!this.state.showGoogle && this.state.providerCount > 1 &&
                  <UnlinkGoogle removeGoogle={this.removeGoogle} />
                }

                {this.state.showTwitter &&
                  <LinkTwitter addTwitter={this.addTwitter} id="twitterSignup" />
                }
                {!this.state.showTwitter && this.state.providerCount > 1 &&
                  <UnlinkTwitter removeTwitter={this.removeTwitter} />
                }

                {this.state.showGithub &&
                  <LinkGithub addGithub={this.addGithub} id="githubSignup" />
                }
                {!this.state.showGithub && this.state.providerCount > 1 &&
                  <UnlinkGithub removeGithub={this.removeGithub} />
                }

                {this.state.showFacebook &&
                  <LinkFacebook addFacebook={this.addFacebook} id="facebookSignup" />
                }
                {!this.state.showFacebook && this.state.providerCount > 1 &&
                  <UnlinkFacebook removeFacebook={this.removeFacebook} />
                }
              </div>
            </div>

            <div>
              <Dialog
                id="Link Email"
                open={this.state.openEmail}
                onClose={this.handleCloseEmail}
                TransitionComponent={Transition}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{"Link Email"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description" style={{ paddingBottom: "2%" }}>
                    Please type the email and password you'd like to use for this account.
                  </DialogContentText>
                  <TextField
                    id="linkEmailAddress"
                    type="email"
                    required
                    value={this.state.linkEmailAddress}
                    onChange={this.handleChange}
                    label="Email"
                    fullWidth
                  />
                  <TextField
                    id="linkPassword"
                    type="password"
                    required
                    value={this.state.linkPassword}
                    onChange={this.handleChange}
                    label="Password"
                    fullWidth
                  />
                  {<Typography className={this.props.classes.error}>{this.state.error}</Typography>}
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleCloseEmail} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={this.handleLinkEmail} color="primary">
                    Link Email
              </Button>
                </DialogActions>
              </Dialog>
            </div>
            <div>
              <Dialog
                id="Change Password"
                open={this.state.openChangePassword}
                onClose={this.handleCloseChangePassword}
                TransitionComponent={Transition}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{"Password Reset"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description" style={{ paddingBottom: "2%" }}>
                    Please type the email associated with your account so we can send you
                    a link to change your password.
                  </DialogContentText>
                  <TextField
                    id="resetEmail"
                    type="email"
                    required
                    value={this.state.resetEmail}
                    onChange={this.handleChange}
                    label="Email"
                    fullWidth
                  />
                  {<Typography className={this.props.classes.error}>{this.state.error}</Typography>}
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleCloseChangePassword} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={this.handleReset} color="primary">
                    Send Email
              </Button>
                </DialogActions>
              </Dialog>
            </div>
            <div>
              <Dialog
                open={this.state.openDelete}
                TransitionComponent={Transition}
                keepMounted
                onClose={this.handleCloseDelete}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogTitle id="alert-dialog-slide-title">
                  {"Delete Account?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-slide-description">
                    Are you sure you would like to delete your account?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleCloseDelete} style={{ margin: 'auto' }} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={this.deleteAccount} style={{ margin: 'auto' }} color="secondary">
                    Delete Account
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
            <Dialog
              open={this.state.infoDialogShow}
              onClose={this.handleInfoClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Notification Info"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <strong>Expected Response:</strong> You will recieve emails when the expected response date for a job application approaches.
            </DialogContentText>
                <br></br>
                <DialogContentText id="alert-dialog-description">
                  <strong>Inactivity:</strong> If a job application has not been updated in a month, then you will recieve an email reminder.
            </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleInfoClose} color="primary" autoFocus>
                  Okay
              </Button>
              </DialogActions>
            </Dialog>
            
            <div>
          <Dialog
            open={(!this.state.done3feed && this.state.timeforfeedback)}
            TransitionComponent={Transition}
            keepMounted
            onClose={this.handleClose3Feed}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {"Help us out?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Hey! You have officially been using Officium for three months!
                We would love if you could help us out and leave us some general feedback about our site!
                </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose3Feed} style={{ margin: 'auto' }} color="primary">
                No
                </Button>
              <Button onClick={this.handleThreeMonth} style={{ margin: 'auto' }} color="secondary">
                Sure!
                </Button>
            </DialogActions>
          </Dialog>
        </div>
          </div>
        );
      }
      //MOBILE UI
      else {
        return (
          <div>
            <div className={this.props.classes.topDiv}>
              <Typography className={this.props.classes.yourProf} variant="h4" gutterBottom>
                Your Profile
            </Typography>
            </div>
            <div>
              <Paper className={this.props.classes.paper}>
                <IconButton className={this.props.classes.editIcon} onClick={this.handleEditOpen} aria-label="Edit">
                  <EditIcon />
                </IconButton>
                <Grid container className={this.props.classes.root} spacing={0}>
                  <Grid item className={this.props.classes.panes}>
                    <Typography variant="subtitle2" gutterBottom>
                      Name:
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      City:
                    {this.state.showTooltip &&
                        <span>
                          <span ref="invalidLocation" data-tip=
                            "We couldn't find the location you provided.<br/>Certain functionality won't work properly."
                            data-multiline="true" style={{ color: 'red' }}> ( ! )</span>
                          <ReactTooltip />
                        </span>
                      }
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      Email:
                    </Typography>
                  </Grid>
                  <Grid item className={this.props.classes.panes}>
                    <Typography variant="subtitle2" gutterBottom>
                      {this.state.name}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      {this.state.city}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      {this.state.email}
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="subtitle1" gutterBottom>
                  Notifications:
                  <IconButton className={this.props.classes.infoIcon} onClick={this.handleInfoOpen} aria-label="Info">
                    <InfoIcon />
                  </IconButton>
                </Typography>

                <Grid container className={this.props.classes.root} spacing={0}>
                  <Grid item className={this.props.classes.panes}>
                    <Typography variant="subtitle2" gutterBottom>
                      Expected Response:
                  </Typography>
                    <Typography variant="subtitle2" gutterBottom style={{ "marginTop": 20 }}>
                      Inactivity:
                  </Typography>
                  </Grid>
                  <Grid item className={this.props.classes.panes}>
                    <div
                      style={{ "marginTop": -12, "marginLeft": -12 }}>
                      <Switch
                        checked={this.state.expectedDateNotifications}
                        onChange={this.handleChangeExpectedNotifications}
                      />
                    </div>
                    <div
                      style={{ "marginTop": -8, "marginLeft": -12 }}>
                      <Switch
                        checked={this.state.inActivityNotifications}
                        onChange={this.handleChangeInactivityNotifications}
                      />
                    </div>
                  </Grid>
                </Grid>
                {!(this.state.verifiedEmail) &&
                  <Button color="secondary" onClick={this.props.firebase.doSendEmailVerification}>Send Verification Email</Button>
                }

              </Paper>
              <Grid container direction="row-reverse" justify="center" alignItems="center">
                <Button className={this.props.classes.button} onClick={this.handleClickOpenChangePassword} size="small" variant="contained" color="primary">Change Password</Button>
                <Button className={this.props.classes.button} onClick={this.handleClickOpenDelete} size="small" variant="contained" color="secondary">Delete Account</Button>
                <Button className={this.props.classes.button} onClick={this.handleBugReport} size="small" variant="contained" color="inherit">Report A Bug</Button>
              </Grid>
              <div className={this.props.classes.social}>
                {this.state.showEmail &&
                  <Button className={this.props.classes.linkEmailButton} onClick={this.handleClickLinkEmail} size="small" variant="contained" color="primary">Link With Email</Button>
                }
                {!this.state.showEmail && this.state.providerCount > 1 &&
                  <Button className={this.props.classes.linkEmailButton} onClick={this.handleClickUnlinkEmail} size="small" variant="contained" color="primary">Unlink From Email</Button>
                }
                {this.state.showGoogle &&
                  <LinkGoogle addGoogle={this.addGoogle} id="googleSignup" />
                }
                {!this.state.showGoogle && this.state.providerCount > 1 &&
                  <UnlinkGoogle removeGoogle={this.removeGoogle} />
                }

                {this.state.showTwitter &&
                  <LinkTwitter addTwitter={this.addTwitter} id="twitterSignup" />
                }
                {!this.state.showTwitter && this.state.providerCount > 1 &&
                  <UnlinkTwitter removeTwitter={this.removeTwitter} />
                }

                {this.state.showGithub &&
                  <LinkGithub addGithub={this.addGithub} id="githubSignup" />
                }
                {!this.state.showGithub && this.state.providerCount > 1 &&
                  <UnlinkGithub removeGithub={this.removeGithub} />
                }

                {this.state.showFacebook &&
                  <LinkFacebook addFacebook={this.addFacebook} id="facebookSignup" />
                }
                {!this.state.showFacebook && this.state.providerCount > 1 &&
                  <UnlinkFacebook removeFacebook={this.removeFacebook} />
                }
              </div>
            </div>

            <div>
              <Dialog
                id="Link Email"
                open={this.state.openEmail}
                onClose={this.handleCloseEmail}
                TransitionComponent={Transition}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{"Link Email"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description" style={{ paddingBottom: "2%" }}>
                    Please type the email and password you'd like to use for this account.
                    </DialogContentText>
                  <TextField
                    id="linkEmailAddress"
                    type="email"
                    required
                    value={this.state.linkEmailAddress}
                    onChange={this.handleChange}
                    label="Email"
                    fullWidth
                  />
                  <TextField
                    id="linkPassword"
                    type="password"
                    required
                    value={this.state.linkPassword}
                    onChange={this.handleChange}
                    label="Password"
                    fullWidth
                  />
                  {<Typography className={this.props.classes.error}>{this.state.error}</Typography>}
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleCloseEmail} color="primary">
                    Cancel
                    </Button>
                  <Button onClick={this.handleLinkEmail} color="primary">
                    Link Email
                </Button>
                </DialogActions>
              </Dialog>
            </div>
            <div>
              <Dialog
                id="Change Password"
                open={this.state.openChangePassword}
                onClose={this.handleCloseChangePassword}
                TransitionComponent={Transition}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{"Password Reset"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description" style={{ paddingBottom: "2%" }}>
                    Please type the email associated with your account so we can send you
                    a link to change your password.
                    </DialogContentText>
                  <TextField
                    id="resetEmail"
                    type="email"
                    required
                    value={this.state.resetEmail}
                    onChange={this.handleChange}
                    label="Email"
                    fullWidth
                  />
                  {<Typography className={this.props.classes.error}>{this.state.error}</Typography>}
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleCloseChangePassword} color="primary">
                    Cancel
                    </Button>
                  <Button onClick={this.handleReset} color="primary">
                    Send Email
                </Button>
                </DialogActions>
              </Dialog>
            </div>
            <div>
              <Dialog
                open={this.state.openDelete}
                TransitionComponent={Transition}
                keepMounted
                onClose={this.handleCloseDelete}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogTitle id="alert-dialog-slide-title">
                  {"Delete Account?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-slide-description">
                    Are you sure you would like to delete your account?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleCloseDelete} style={{ margin: 'auto' }} color="primary">
                    Cancel
                    </Button>
                  <Button onClick={this.deleteAccount} style={{ margin: 'auto' }} color="secondary">
                    Delete Account
                    </Button>
                </DialogActions>
              </Dialog>
            </div>
            <Dialog
              open={this.state.infoDialogShow}
              onClose={this.handleInfoClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Notification Info"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <strong>Expected Response:</strong> You will recieve emails when the expected response date for a job application approaches.
            </DialogContentText>
                <br></br>
                <DialogContentText id="alert-dialog-description">
                  <strong>Inactivity:</strong> If a job application has not been updated in a month, then you will recieve an email reminder.
            </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleInfoClose} color="primary" autoFocus>
                  Okay
              </Button>
              </DialogActions>
            </Dialog>
          <div>
          <Dialog
            open={!this.state.done3feed && this.state.timeforfeedback}
            TransitionComponent={Transition}
            keepMounted
            onClose={this.handleClose3Feed}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">
              {"Help us out?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Hey! You have officially been using Officium for three months!
                We would love if you could help us out and leave us some general feedback about our site!
                </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose3Feed} style={{ margin: 'auto' }} color="primary">
                No
                </Button>
              <Button onClick={this.handleThreeMonth} style={{ margin: 'auto' }} color="secondary">
                Sure!
                </Button>
            </DialogActions>
          </Dialog>
        </div>
        </div>
        );
      }


    } else {
      return <Paper className={this.props.classes.paperEdit}>
      <Grid container>
        <Grid item className={this.props.classes.panes}>
          <TextField
            id="name"
            type="name"
            required
            value={this.state.nameEdit}
            onChange={this.handleChangeEditName}
            label='name'
            fullWidth
            className={this.props.classes.field}
            variant="outlined"
          />
          {/* <TextField
            id="city"
            type="city"
            required
            value={this.state.cityEdit}
            onChange={this.handleChangeEditCity}
            label='City'
            fullWidth
            className={this.props.classes.field}
            variant="outlined"
          /> */}

         <IntegrationAutosuggest
          handler={this.handleChangeEditCity}
          location={this.state.city}
          profile={true} />

          <TextField
            id="email"
            type="email"
            required
            value={this.state.emailEdit}
            onChange={this.handleChangeEditEmail}
            label='email'
            fullWidth
            className={this.props.classes.field}
            variant="outlined"
            disabled={true}
          />
          </Grid>
          <Grid container direction="row-reverse" justify="center" alignItems="center">
            <Button className={this.props.classes.buttonEdit} disabled={this.state.nextDisabled} variant='contained' onClick={this.handleSubmit} style={{ margin: 'auto' }} color="primary">
              Submit Changes
        </Button>
            <Button className={this.props.classes.buttonEdit} variant='contained' onClick={this.handleCloseEdit} style={{ margin: 'auto' }} color="secondary">
              Cancel
        </Button>
          </Grid>
        
      </Grid>
      </Paper>;
    }
  }


}
const Profile = compose(
  withRouter,
  withFirebase,
)(ProfileBase);

export default withStyles(styles)(Profile);
