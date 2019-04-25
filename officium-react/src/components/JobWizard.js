import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import Slider from '@material-ui/lab/Slider';
import Typography from '@material-ui/core/Typography';
import { compose } from 'recompose';
import { withFirebase } from './Firebase';
import { withRouter } from 'react-router-dom';
import firebase from 'firebase/app';
import getLocationCoordinates, { getDistance, inMiles, crowFlies } from './Location';
import axios from 'axios';
import moment from 'moment';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import IntegrationAutosuggest from './elements/IntegrationAutosuggest';
import { getSuggestions } from './elements/IntegrationAutosuggest';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    marginTop: '100px !important',
    margin: 'auto',
    'max-width': '700px',
    'max-height': '800px',
  },
  buttons: {
    textAlign: 'center',
    paddingBottom: '10px',
    paddingTop: '20px',
  },
  slider: {
    margin: 'auto',
    marginBottom: 10,
    padding: 20,
    width: 300,
    textAlign: 'center',
  },
  field: {
    textAlign: 'left',
    margin: 'auto',
    paddingBottom: 20,
    width: '60%',
  },
  checkboxRow: {
    display: 'flex',
    'flex-direction': 'row',
    'justify-content': 'center',
    marginBottom: 10,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  }
});

class JobWizardBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 1,
      nextDisabled: true,
      jobid: this.props.match.params.id,
      edit: !!this.props.match.params.id,
      appStat: "",
      job: {
        companyName: '',
        jobTitle: '',
        location: '',
        howApplied: '',
        link: '',
        lastContact: moment().format('YYYY-MM-DD'),
        expectedContact: moment().add(7, 'days').format('YYYY-MM-DD'),
        optimism: 3,
        enthusiasm: 3,
        hasInterviewed: false,
        applicationStatus: "",
      },
    };
    this.handleOptimismChange = this.handleOptimismChange.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.cancel = this.cancel.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    var user = firebase.auth().currentUser;
    var db = firebase.firestore();
    if (this.state.jobid) {
      db.collection('users').doc(user.uid).collection('jobs').doc(this.state.jobid).get().then((job) => {
        const jobData = job.data();
        this.setState({
          edit: true,
          job: {
            companyName: jobData.CompanyName,
            jobTitle: jobData.JobTitle,
            location: jobData.Location,
            hasInterviewed: jobData.HasInterviewed || false,
            howApplied: jobData.HowApplied,
            link: jobData.Link,
            lastContact: jobData.LastContact,
            expectedContact: jobData.ExpectedContact,
            optimism: jobData.Optimism,
            enthusiasm: jobData.Enthusiasm,
            applicationStatus: jobData.ApplicationStatus,
          },
          originalLocation: jobData.Location,

        });
      })
    }

  }

  componentDidUpdate() {

    var filterstrings = null;
    var passedinstring = null;

    if (this.state.nextDisabled) {
      if (this.state.currentStep === 1 && this.state.job.jobTitle && this.state.job.companyName && this.state.job.location) {

        filterstrings = getSuggestions(this.state.job.location);
        passedinstring = this.state.job.location.toLowerCase();

        if (filterstrings.length !== 0 && passedinstring.includes(filterstrings[0].label.toLowerCase())) {
          this.setState({
            nextDisabled: false
          });
        }

      }
      else if (this.state.currentStep === 2 && this.state.job.howApplied && this.state.job.lastContact && (this.state.job.howApplied === "Online" ? this.isValidURL(this.state.job.link) : true)) {
        this.setState({
          nextDisabled: false
        });
      }
    }

    if (!this.state.nextDisabled) {
      if (this.state.currentStep === 1) {

        filterstrings = getSuggestions(this.state.job.location);
        passedinstring = this.state.job.location.toLowerCase();

        if (filterstrings.length === 0 || !passedinstring.includes(filterstrings[0].label.toLowerCase()) || !this.state.job.jobTitle || !this.state.job.companyName || !this.state.job.location) {
          this.setState({
            nextDisabled: true
          });
        }

      }
      else if (this.state.currentStep === 2) {
        if (!this.state.job.howApplied || !this.state.job.lastContact || (this.state.job.howApplied === "Online" && (!this.isValidURL(this.state.job.link)))) {
          this.setState({
            nextDisabled: true
          });
        }
      }
    }

  }

  handleOptimismChange = (event, sliderValue) => {
    this.setState({
      job: {
        ...this.state.job,
        optimism: sliderValue,
      }
    });
  };

  handleEnthusiasmChange = (event, sliderValue) => {
    this.setState({
      job: {
        ...this.state.job,
        enthusiasm: sliderValue,
      }
    });
  };

  handleCheckboxChange = name => event => {
    this.setState({
      job: {
        ...this.state.job,
        [name]: event.target.checked,
      }
    });
  };

  handleStatusChange = name => event => {
    this.setState({
      job: {
        ...this.state.job,
        [name]: event.target.value
      }
    });
  };

  handleMethodChange = name => event => {
    this.setState({
      job: {
        ...this.state.job,
        howApplied: event.target.value
      }
    });
  };

  handleOptimismChange = (event, sliderValue) => {
    this.setState({
      job: {
        ...this.state.job,
        optimism: sliderValue,
      }
    });
  };

  handleEnthusiasmChange = (event, sliderValue) => {
    this.setState({
      job: {
        ...this.state.job,
        enthusiasm: sliderValue,
      }
    });
  };

  numbeo = () => {
    let numbeoLocation = this.state.job.location.replace(/\s/g, "-");
    numbeoLocation = numbeoLocation.replace(".", "");
    numbeoLocation = numbeoLocation.split(",")[0];
    var queryUrl = `https://www.numbeo.com/api/indices?api_key=${process.env.REACT_APP_NUMBEO_API}&query=${numbeoLocation}`;
    var encodedUrl = encodeURIComponent(queryUrl);

    return axios.get('https://corsbridge.herokuapp.com/' + encodedUrl)
      .then(response => {
        var user = firebase.auth().currentUser;

        firebase.firestore().collection('users').doc(user.uid).collection('jobs').doc(this.state.jobid).set({
          numbeo_crime_index: response.data.crime_index ? response.data.crime_index : 0,
          numbeo_traffic_time_index: response.data.traffic_time_index || 0,
          numbeo_cpi_and_rent_index: response.data.cpi_and_rent_index || 0,
          numbeo_purchasing_power_incl_rent_index: response.data.purchasing_power_incl_rent_index || 0,
          numbeo_restaurant_price_index: response.data.restaurant_price_index || 0,
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
          numbeo_error: response.data.error || "",
        }, { merge: true })
          .then((response) => {
          }).catch(error => {
            console.log(error);
            console.log("could not update job with numbeo info");
          });
          return response;
      }).catch(error => {
        console.log(error);
        console.log("could not update job with numbeo info");
      });
  }

  textChange = event => {
    this.setState({
      job: {
        ...this.state.job,
        [event.target.id]: event.target.value,
      },
    })
  }

  locationChange = (name) => {
    this.setState({
      job: {
        ...this.state.job,
        location: name,
      },
    });
  }

  cancel() {
    if (!this.state.edit) {
      this.props.history.push('/home');
    }
    else {
      this.props.history.push(`/jobs/details/${this.state.jobid}`);
    }

  }

  submit() {
    this.setState({
      disabled: true
    });

    getLocationCoordinates(this.state.job.location).then(response => {
      var latitude = 0;
      var longitude = 0;
      var validLocation = true;
      if (response.data.length > 0) {
        latitude = response.data[0].lat;
        longitude = response.data[0].lon;
      } else {
        validLocation = false;
      }

      let db = firebase.firestore();
      var user = firebase.auth().currentUser;
      db.collection('users').doc(user.uid).get().then(doc => {
        var userLat = doc.data().Latitude;
        var userLon = doc.data().Longitude;


        getDistance(userLat, userLon, latitude, longitude, validLocation).then(response => {
          var remaining = parseInt(response["headers"]["x-ratelimit-remaining"]);
          var distance = 0;
          if (validLocation) {
            if (remaining <= 1 || response.status === 400) {
              distance = crowFlies(userLat, userLon, latitude, longitude);
            } else {
              distance = inMiles(response.data.paths[0].distance);
            }
          }

          let tempCompanyName = this.state.job.companyName;
          let tempJobTitle = this.state.job.jobTitle;
          if (!this.state.edit) {

            this.props.firebase.addJob(
              tempCompanyName,
              tempJobTitle,
              this.state.job.location,
              this.state.job.howApplied,
              this.state.job.applicationStatus,
              this.state.job.hasInterviewed,
              this.state.job.optimism,
              this.state.job.howApplied === "Online" ? this.state.job.link : '',
              this.state.job.enthusiasm,
              this.state.job.lastContact,
              this.state.job.expectedContact,
              latitude,
              longitude,
              distance,
              validLocation
            )
              .then((id) => {
                this.numbeo().then((response) =>{
                  this.setState({
                    success: true, disabled: false, jobid: id,
                  });
                });
              }).catch(error => {
                this.setState({ errorMsg: error, success: false });
              });
          }
          else {
            var user = firebase.auth().currentUser;
            let tempCompanyName = this.state.job.companyName;
            let tempJobTitle = this.state.job.jobTitle;
            console.log(firebase.firestore.Timestamp.fromDate(new Date()));
            firebase.firestore().collection('users').doc(user.uid).collection('jobs').doc(this.state.jobid).update({
              CompanyName: tempCompanyName,
              JobTitle: tempJobTitle,
              Location: this.state.job.location,
              HowApplied: this.state.job.howApplied,
              ApplicationStatus: this.state.job.applicationStatus,
              HasInterviewed: this.state.job.hasInterviewed,
              Optimism: this.state.job.optimism,
              Link: this.state.job.howApplied === "Online" ? this.state.job.link : '',
              Enthusiasm: this.state.job.enthusiasm,
              LastContact: this.state.job.lastContact,
              ExpectedContact: this.state.job.expectedContact,
              Latitude: latitude,
              Longitude: longitude,
              Distance: distance,
              ValidLocation: validLocation,
              LastModified: firebase.firestore.Timestamp.fromDate(new Date()),
            })
              .then(() => {
                this.numbeo().then((response) =>{
                  this.setState({
                    success: true, disabled: false, 
                  });
                });
              }).catch(error => {
                this.setState({ errorMsg: error, success: false });
              });
          }
        }).catch(error => {
          //this.setState({ errorMsg: error, success: false });
          //console.log(error);

        });
      });
    });

  }

  isValidURL = (string) => {
    if (string === '') return true;
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g);
    if (res == null)
      return false;
    else
      return true;
  };

  next() {
    let nextStep = this.state.currentStep;
    // Make sure currentStep is set to something reasonable
    if (nextStep >= 2) {
      nextStep = 3;
    } else {
      nextStep = nextStep + 1;
    }

    this.setState({
      currentStep: nextStep,
      nextDisabled: true
    });
  }

  prev() {
    let currentStep = this.state.currentStep;
    if (currentStep <= 1) {
      currentStep = 1;
    } else {
      currentStep = currentStep - 1;
    }

    this.setState({
      currentStep: currentStep,
      nextDisabled: true
    });
  }

  render() {

    let step1 = null;
    let step2 = null;
    let step3 = null;


    step1 = this.state.currentStep === 1 ? (
      <div className={this.props.classes.formContainer}>
        <Typography variant="h6" align="center" style={{ marginBottom: 10 }}>What's the job title you want (and deserve)?</Typography>
        <TextField
          id="jobTitle"
          required
          value={this.state.job.jobTitle}
          onChange={this.textChange}
          label="Job Title"
          className={this.props.classes.field}
          variant="outlined"
        />
        <Typography variant="h6" align="center" style={{ marginBottom: 10 }}>What company will you work for?</Typography>
        <TextField
          id="companyName"
          required
          value={this.state.job.companyName}
          onChange={this.textChange}
          label="Company"
          className={this.props.classes.field}
          variant="outlined"
        />
        <Typography variant="h6" align="center" style={{ marginBottom: 10 }}>Where's the office?</Typography>


        <IntegrationAutosuggest
          handler={this.locationChange}
          location={this.state.originalLocation || ''} />


        {/* <TextField
            id="location"
            required
            value={this.state.job.location}
            onChange={this.textChange}
            label="City"
            className={this.props.classes.field}
            variant="outlined"
          /> */}
      </div>
    ) : null;

    step2 = this.state.currentStep === 2 ? (
      <div className={this.props.classes.formContainer}>
        <Typography variant="h6" align="center" style={{ marginBottom: 10 }}>How did you apply?</Typography>
        <Select
          value={this.state.job.howApplied}
          onChange={this.handleMethodChange()}
          required
          className={this.props.classes.field}
          style={{ marginBottom: 20 }}
          inputProps={{
            name: 'Application Method',
            id: 'howApplied',
          }}
        >
          <MenuItem value={"Phone"}>Phone</MenuItem>
          <MenuItem value={"Online"}>Online</MenuItem>
          <MenuItem value={"Email"}>Email</MenuItem>
          <MenuItem value={"In-Person"}>In-Person</MenuItem>
          <MenuItem value={"Other"}>Other</MenuItem>
        </Select>
        {this.state.job.howApplied === "Online" &&
          <div>
            <Typography variant="h6" align="center" style={{ marginBottom: 10 }}>Store a link to your application portal here.</Typography>
            <TextField
              id="link"
              type="url"
              value={this.state.job.link}
              onChange={this.textChange}
              label="Link"
              className={this.props.classes.field}
              variant="outlined"
            />
          </div>
        }
        <Typography variant="h6" align="center" style={{ marginBottom: 10 }}>When was your last contact with the employer?</Typography>
        <TextField
          id="lastContact"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          required
          value={this.state.job.lastContact}
          onChange={this.textChange}
          label="Last Contact"
          className={this.props.classes.field}
          variant="outlined"
        />
        <Typography variant="h6" align="center" style={{ marginBottom: 10 }}>When do you expect to hear back?</Typography>
        <TextField
          id="expectedContact"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={this.state.job.expectedContact}
          onChange={this.textChange}
          label="Expected Response"
          className={this.props.classes.field}
          variant="outlined"
        />
      </div>
    ) : null;

    step3 = this.state.currentStep === 3 ? (
      <div className={this.props.classes.formContainer}>
        <Typography variant="h6" align="center">How optimistic are you about getting this position?</Typography>
        <Slider className={this.props.classes.slider}
          value={this.state.job.optimism}
          min={1}
          max={5}
          step={1}
          onChange={this.handleOptimismChange}
        />
        <Typography variant="h6" align="center">How enthusiastic are you about getting this position?</Typography>
        <Slider className={this.props.classes.slider}
          value={this.state.job.enthusiasm}
          min={1}
          max={5}
          step={1}
          onChange={this.handleEnthusiasmChange}
        />
        <Typography variant="h6" align="center" style={{ margin: 'theme.spacing.unit' }}>What is the status of your application?</Typography>
        <div><FormControl required style={{ margin: 20, minWidth: 300 }}>
          <InputLabel htmlFor="age-required">Status</InputLabel>
          <Select
            value={this.state.job.applicationStatus}
            onChange={this.handleStatusChange('applicationStatus')}
            name="appStat"
            inputProps={{
              id: 'appStat-required',
            }}
            style={{ marginTop: 20 }}
          >
            <MenuItem value="Application Submitted">Application Submitted</MenuItem>
            <MenuItem value="No Response">No Response</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="Denied Offer">Denied Offer</MenuItem>
            <MenuItem value="Accepted Offer">Accepted Offer</MenuItem>
          </Select>
        </FormControl></div>
        <Grid className={this.props.classes.checkboxRow}>
          <Typography variant="h6" align="center">Have you been interviewed?</Typography>
          <Checkbox
            style={{ marginTop: -8 }}
            checked={this.state.job.hasInterviewed}
            onChange={this.handleCheckboxChange('hasInterviewed')}
            value={`${this.state.job.hasInterviewed}`}
            color="primary"
          />
        </Grid>
      </div>
    ) : null;

    if (!this.state.success) {
      return (
        <div>
          <Paper className={this.props.classes.paper}>
            {this.state.edit ?
              <Typography variant="h2" align="center" color="primary" style={{ margin: 40 }}>Edit Job Application</Typography>
              :
              <Typography variant="h2" align="center" color="primary" style={{ margin: 40 }}>New Job Application</Typography>
            }

            <Typography variant="h5" align="center" color="primary" style={{ margin: 40 }}>Page {this.state.currentStep} of 3</Typography>
            {step1}
            {step2}
            {step3}
            <div className={this.props.classes.buttons}>
              {this.state.currentStep !== 1 ?
                <Button variant="contained" color="primary" onClick={this.prev} style={{ margin: 10 }}>Back</Button>
                :
                <Button variant="contained" color="primary" onClick={this.cancel} style={{ margin: 10 }}>Cancel</Button>
              }
              {this.state.currentStep !== 3 ?
                <Button variant="contained" color="primary" disabled={this.state.nextDisabled} onClick={this.next} style={{ margin: 10 }}>Next</Button>
                :
                <Button variant="contained" color="primary" onClick={this.submit} disabled={this.state.disabled} style={{ margin: 10 }}>Submit</Button>
              }
            </div>
          </Paper>
        </div>
      );
    }
    else {
      return (
        <Paper className={this.props.classes.paper}>
          <Typography variant="h2" align="center" color="primary" style={{ margin: 40 }}>Success!</Typography>
          {this.state.edit ? (
            <div>
              <Typography variant="h5" align="center" color="primary" style={{ margin: 40 }}>Edits to your application were made.</Typography>
              <Button variant="contained" color="primary" onClick={this.cancel} style={{ margin: 10 }}>Back to Application Detail</Button>
            </div>
          )
            : (
              <div>
                <Typography variant="h5" align="center" color="primary" style={{ margin: 40 }}>Your application was created!</Typography>
                <Button variant="contained" color="primary" onClick={this.cancel} style={{ margin: 10 }}>Back to Applications</Button>
              </div>
            )
          }

        </Paper>
      );
    }
  }
}
const JobWizard = compose(
  withRouter,
  withFirebase,
)(JobWizardBase);

export default withStyles(styles)(JobWizard);
