import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { withFirebase } from './Firebase';
import { withRouter } from 'react-router-dom';
import firebase from 'firebase/app';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
import ReactTooltip from 'react-tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';


//import Dropzone from 'react-dropzone'; Potential upgrade to upload file feature

const styles = theme => ({
  wrapper: {
    display: 'flex',
  },
  switchWrapper: {
    marginLeft: "70%",
    position: "absolute"
  },
  container: {
    // width: '80%',
    textAlign: 'center',
    marginTop: '100px !important',
    margin: 'auto',
  },
  paper: {
    padding: theme.spacing.unit * 2,
    'minWidth': '1000px',
    'maxWidth': '1000px',
    'maxHeight': '1000px',
    margin: 'auto',
    marginTop: 50,
  },
  header: {
    "font-weight": 900,
    maxHeight: "!important 10px",
  },
  button: {
    color: 'white',
    marginTop: 20,
    margin: theme.spacing.unit,
  },
  smallIcon: {
    width: 20,
    height: 20,
  },
  statusOpen: {
    backgroundColor: "#25C196",
    '&:hover': {
      backgroundColor: "#25C196",
    },
    backgroundSize: '100%',
    color: "white",
    padding: 0,
  },
  statusClosed: {
    'background-size': '100%',
    color: "white",
    padding: 0
  },
  tableWrapper: {
    flex: 0,
  },
  clickSort: {
    cursor: 'pointer',
  },
  modal: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
    overflowY: 'auto',
    maxHeight: '90%',
  },
  filters: {
    position: 'relative',
    width: 820,
    marginLeft: 'auto',
    marginRight: 'auto',
    left: 0,
    marginTop: 50,

  },
  searchField: {
    display: 'inline-block',
  },
  textField: {
    position: 'absolute',
    width: 200,
    marginLeft: 'auto',
    marginRight: 'auto',
    left: '50%',
    right: 0,
    marginTop: 50,
  },
  filterContent: {
    display: 'block',
    flex: '0 0 20%',
  },
  marginRight: '20px',
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  tableDiv: {
    margin: 'auto',
    maxWidth: '80%',
  },
  bigContainer: {
    textAlign: 'center',
    overflowX: 'scroll',
    overflowY: 'scroll',
    height: '100%',
    margin: 0,
    padding: 0,
  },
  column: {
    flexBasis: '33.33%',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

class HomeBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      jobs: null,
      //Alternate ascending descending sorting
      optimismAscending: false,
      enthusiasmAscending: false,
      titleAscending: true,
      locationAscending: true,
      companyAscending: true,
      applicationAscending: true,
      distanceAscending: false,
      //checkboxes
      checkMap: 7,
      optimismCheck: true,
      enthusiasmCheck: true,
      locationCheck: true,
      applicationCheck: true,
      distanceCheck: true,
      comparing: false,
      weightCheck: true,
      userPos: [0, 0],
      weights: {
        crime: null,
        cpiAndRent: null,
        trafficTime: null,
        purchasingPower: null,
        restaurantPrice: null,
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
      compareJobs: [],
      searchValue: '',
      //Application status
      appStat: 0,
      mapJobs: [],
      highlight: [false,false,false,false],
    };
  }

  updateDimensions() {
    if (window.innerWidth < 900) {
      this.setState({
        optimismCheck: false,
        enthusiasmCheck: false,
        locationCheck: false,
        applicationCheck: false,
        distanceCheck: false,
      })
    }
    else if (window.innerWidth >= 900) {
      var user = firebase.auth().currentUser;
      var db = firebase.firestore();
      if (user) {
        db.collection('users').doc(user.uid).get().then((doc) => {
          //Use bitstring system, a la Unix permissions, to store columns to show
          if (doc.data().checkMap !== undefined) {
            var cM = intTo5Bit(doc.data().checkMap);
            this.setState({
              distanceCheck: cM[0] === "1",
              applicationCheck: cM[1] === "1",
              locationCheck: cM[2] === "1",
              optimismCheck: cM[3] === "1",
              enthusiasmCheck: cM[4] === "1",
              checkMap: doc.data().checkMap,
              userPos: [doc.data().Latitude, doc.data().Longitude],
            });
          }
        });
      }
    }
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
    var user = firebase.auth().currentUser;
    var db = firebase.firestore();

    db.collection('users').doc(user.uid).collection('jobs').get().then((snapshot) => {
      this.setState({
        jobs: snapshot.docs,
        mapJobs: snapshot.docs,
      });
    });
    db.collection('users').doc(user.uid).get().then((doc) => {
      if (doc.data().weights !== undefined) {
        this.setState({
          weights: doc.data().weights,
        });
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  handleClick = () => {
    this.props.history.push('/jobs/new');
  }

  handleChange = name => event => {
    if (name === 'searchValue' && event.target.value === '') {
      var tempHighlight = [false,false,false,false];
      this.setState({
        mapJobs: this.state.jobs,
        highlight: tempHighlight,
      });
    }
    this.setState({
      [name]: event.target.value,
    });
  };

  handleStatChange = event => {
    var tempStat = event.target.value;
    var tempJobs = this.state.jobs;
    var setJobs = [];
    this.setState({ [event.target.name]: event.target.value });
    switch (tempStat) {
      case 0:
        setJobs = tempJobs;
        break;

      case 10:
        setJobs = tempJobs.filter(job => job.data().ApplicationStatus === 'Application Submitted');
        break;

      case 20:
        setJobs = tempJobs.filter(job => job.data().ApplicationStatus === 'No Response');
        break;

      case 50:
        setJobs = tempJobs.filter(job => job.data().ApplicationStatus === 'Rejected');
        break;

      case 60:
        setJobs = tempJobs.filter(job => job.data().ApplicationStatus === 'Denied Offer');
        break;

      case 70:
        setJobs = tempJobs.filter(job => job.data().ApplicationStatus === 'Accepted Offer');
        break;

      default:
        break;
    }
    this.setState({
      mapJobs: setJobs,
    });
  };

  handleOpen = (id, job) => {
    this.props.history.push(`/jobs/details/${id}`);
  }

  getStars = num => {
    if (num === 1) {
      return (<div><Star className={this.props.classes.smallIcon} color="primary" /><StarBorder className={this.props.classes.smallIcon} color="primary" /><StarBorder className={this.props.classes.smallIcon} color="primary" /><StarBorder className={this.props.classes.smallIcon} color="primary" /><StarBorder className={this.props.classes.smallIcon} color="primary" /></div>);
    }
    else if (num === 2) {
      return (<div><Star className={this.props.classes.smallIcon} color="primary" /><Star className={this.props.classes.smallIcon} color="primary" /><StarBorder className={this.props.classes.smallIcon} color="primary" /><StarBorder className={this.props.classes.smallIcon} color="primary" /><StarBorder className={this.props.classes.smallIcon} color="primary" /></div>);
    }
    else if (num === 3) {
      return (<div><Star className={this.props.classes.smallIcon} color="primary" /><Star className={this.props.classes.smallIcon} color="primary" /><Star className={this.props.classes.smallIcon} color="primary" /><StarBorder className={this.props.classes.smallIcon} color="primary" /><StarBorder className={this.props.classes.smallIcon} color="primary" /></div>);
    }
    else if (num === 4) {
      return (<div><Star className={this.props.classes.smallIcon} color="primary" /><Star className={this.props.classes.smallIcon} color="primary" /><Star className={this.props.classes.smallIcon} color="primary" /><Star className={this.props.classes.smallIcon} color="primary" /><StarBorder className={this.props.classes.smallIcon} color="primary" /></div>);
    }
    else if (num === 5) {
      return (<div><Star className={this.props.classes.smallIcon} color="primary" /><Star className={this.props.classes.smallIcon} color="primary" /><Star className={this.props.classes.smallIcon} color="primary" /><Star className={this.props.classes.smallIcon} color="primary" /><Star className={this.props.classes.smallIcon} color="primary" /></div>);
    }
    else {
      return null;
    }
  }

  //------------------------ Begin sorting ------------------------
  //---------------------------------------------------------------
  //---------------------------------------------------------------
  //TODO: Implement column selection UI
  sort = (sortWhat) => {
    var tempJobs = this.state.mapJobs;
    var swapped;
    var temp1;
    var temp2;
    var checker;
    var temporary;
    if (sortWhat === "Location") {
      checker = this.state.locationAscending;
    } else if (sortWhat === "Company") {
      checker = this.state.companyAscending;
    } else if (sortWhat === "Optimism") {
      checker = this.state.optimismAscending;
    } else if (sortWhat === "Enthusiasm") {
      checker = this.state.enthusiasmAscending;
    } else if (sortWhat === "Title") {
      checker = this.state.titleAscending;
    } else if (sortWhat === "Distance") {
      checker = this.state.distanceAscending;
    } else if (sortWhat === "Application") {
      checker = this.state.applicationAscending;
    } else if (sortWhat === 'Weight') {
      checker = this.state.weightAscending;
    } else {
      console.log("Error in sort");
    }
    if (!(checker)) {
      do {
        swapped = false;
        for (var i = 0; i < tempJobs.length - 1; i++) {
          if (sortWhat === "Location") {
            temp1 = tempJobs[i].data().Location;
            temp2 = tempJobs[i + 1].data().Location;
          } else if (sortWhat === "Company") {
            temp1 = tempJobs[i].data().CompanyName;
            temp2 = tempJobs[i + 1].data().CompanyName;
          } else if (sortWhat === "Optimism") {
            temp1 = tempJobs[i].data().Optimism;
            temp2 = tempJobs[i + 1].data().Optimism;
          } else if (sortWhat === "Enthusiasm") {
            temp1 = tempJobs[i].data().Enthusiasm;
            temp2 = tempJobs[i + 1].data().Enthusiasm;
          } else if (sortWhat === "Title") {
            temp1 = tempJobs[i].data().JobTitle;
            temp2 = tempJobs[i + 1].data().JobTitle;
          } else if (sortWhat === "Distance") {
            temp1 = tempJobs[i].data().Distance;
            temp2 = tempJobs[i + 1].data().Distance;
          } else if (sortWhat === "Application") {
            temp1 = tempJobs[i].data().ApplicationStatus;
            temp2 = tempJobs[i + 1].data().ApplicationStatus;
          } else if (sortWhat === "Weight") {
            temp1 = calculateScore(this.state.weights, tempJobs[i].data());
            temp2 = calculateScore(this.state.weights, tempJobs[i + 1].data());
          }
          if (temp1 < temp2) {
            temporary = tempJobs[i];
            tempJobs[i] = tempJobs[i + 1];
            tempJobs[i + 1] = temporary;
            swapped = true;
          }
        }
      } while (swapped);
    } else {
      do {
        swapped = false;
        for (i = 0; i < tempJobs.length - 1; i++) {
          if (sortWhat === "Location") {
            temp1 = tempJobs[i].data().Location;
            temp2 = tempJobs[i + 1].data().Location;
          } else if (sortWhat === "Company") {
            temp1 = tempJobs[i].data().CompanyName;
            temp2 = tempJobs[i + 1].data().CompanyName;
          } else if (sortWhat === "Optimism") {
            temp1 = tempJobs[i].data().Optimism;
            temp2 = tempJobs[i + 1].data().Optimism;
          } else if (sortWhat === "Enthusiasm") {
            temp1 = tempJobs[i].data().Enthusiasm;
            temp2 = tempJobs[i + 1].data().Enthusiasm;
          } else if (sortWhat === "Title") {
            temp1 = tempJobs[i].data().JobTitle;
            temp2 = tempJobs[i + 1].data().JobTitle;
          } else if (sortWhat === "Distance") {
            temp1 = tempJobs[i].data().Distance;
            temp2 = tempJobs[i + 1].data().Distance;
          } else if (sortWhat === "Application") {
            temp1 = tempJobs[i].data().ApplicationStatus;
            temp2 = tempJobs[i + 1].data().ApplicationStatus;
          } else if (sortWhat === "Weight") {
            temp1 = calculateScore(this.state.weights, tempJobs[i].data());
            temp2 = calculateScore(this.state.weights, tempJobs[i + 1].data());
          }
          if (temp1 > temp2) {
            temporary = tempJobs[i];
            tempJobs[i] = tempJobs[i + 1];
            tempJobs[i + 1] = temporary;
            swapped = true;
          }
        }
      } while (swapped);
    }
    if (sortWhat === "Location") {
      this.setState({
        mapJobs: tempJobs,
        locationAscending: !this.state.locationAscending,
        enthusiasmAscending: false,
        companyAscending: true,
        titleAscending: true,
        optimismAscending: false,
        distanceAscending: false,
        applicationAscending: true,
        weightAscending: false,
      });
    } else if (sortWhat === "Company") {
      this.setState({
        mapJobs: tempJobs,
        locationAscending: true,
        enthusiasmAscending: false,
        companyAscending: !this.state.companyAscending,
        titleAscending: true,
        optimismAscending: false,
        distanceAscending: false,
        applicationAscending: true,
        weightAscending: false,
      });
    } else if (sortWhat === "Enthusiasm") {
      this.setState({
        mapJobs: tempJobs,
        locationAscending: true,
        enthusiasmAscending: !this.state.enthusiasmAscending,
        companyAscending: true,
        titleAscending: true,
        optimismAscending: false,
        distanceAscending: false,
        applicationAscending: true,
        weightAscending: false,
      });
    } else if (sortWhat === "Optimism") {
      this.setState({
        mapJobs: tempJobs,
        locationAscending: true,
        enthusiasmAscending: false,
        companyAscending: true,
        titleAscending: true,
        optimismAscending: !this.state.optimismAscending,
        distanceAscending: false,
        applicationAscending: true,
        weightAscending: false,
      });
    } else if (sortWhat === "Title") {
      this.setState({
        mapJobs: tempJobs,
        titleAscending: !this.state.titleAscending,
        enthusiasmAscending: false,
        companyAscending: true,
        optimismAscending: false,
        locationAscending: true,
        distanceAscending: false,
        applicationAscending: true,
        weightAscending: false,
      });
    } else if (sortWhat === "Distance") {
      this.setState({
        mapJobs: tempJobs,
        titleAscending: true,
        enthusiasmAscending: false,
        companyAscending: true,
        optimismAscending: false,
        locationAscending: true,
        distanceAscending: !this.state.distanceAscending,
        applicationAscending: true,
        weightAscending: false,
      });
    } else if (sortWhat === "Application") {
      this.setState({
        mapJobs: tempJobs,
        titleAscending: true,
        enthusiasmAscending: false,
        companyAscending: true,
        optimismAscending: false,
        locationAscending: true,
        applicationAscending: !this.state.applicationAscending,
        distanceAscending: false,
        weightAscending: false,
      });
    } else if (sortWhat === "Weight") {
      this.setState({
        mapJobs: tempJobs,
        titleAscending: true,
        enthusiasmAscending: false,
        companyAscending: true,
        optimismAscending: false,
        locationAscending: true,
        applicationAscending: true,
        distanceAscending: false,
        weightAscending: !this.state.weightAscending,
      });
    }
  }
  sortByCompanyHandler = () => {
    this.sort("Company");
  }

  sortByTitleHandler = () => {
    this.sort("Title");
  }

  sortByOptimismHandler = () => {
    this.sort("Optimism");
  }

  sortByEnthusiasmHandler = () => {
    this.sort("Enthusiasm");
  }

  sortByLocationHandler = () => {
    this.sort("Location");
  }

  sortByApplicationHandler = () => {
    this.sort("Application");
  }

  sortByDistanceHandler = () => {
    this.sort("Distance");
  }

  sortByWeightsHandler = () => {
    this.sort("Weight");
  }

  //---------------------------------------------------------------
  //---------------------------------------------------------------
  //------------------------ End sorting ------------------------
  compareExpansionPanel = () => {
    if (this.state.comparing === false) {
      this.setState({ comparing: true });
    } else {
      this.setState({ comparing: false });
    }
  }

  checkChange = name => event => {
    this.setState({ [name]: event.target.checked });
    var delta = 0;
    switch (name) {
      case "enthusiasmCheck":
        delta += 1;
        break;
      case "optimismCheck":
        delta += 2;
        break;
      case "locationCheck":
        delta += 4;
        break;
      case "applicationCheck":
        delta += 8;
        break;
      case "distanceCheck":
        delta += 16;
        break;
      default:
        break;
    }
    if (!event.target.checked) {
      delta *= -1;
    }
    var user = firebase.auth().currentUser;
    firebase.firestore().collection('users').doc(user.uid).update({
      checkMap: this.state.checkMap + delta
    }).then(() => {
    });
    this.setState({
      checkMap: this.state.checkMap + delta,
    });
  }

  handleCompare = (job) => {
    var tempArray = [];
    if (!Array.isArray(this.state.compareJobs) || !this.state.compareJobs.length) {
      tempArray.push(job);
    } else {
      if (this.state.compareJobs.includes(job)) {
        tempArray = this.state.compareJobs;
        for (var i = 0; i < tempArray.length; i++) {
          if (tempArray[i] === job) {
            tempArray.splice(i, 1);
            this.setState({
              compareJobs: tempArray,
            });
            return;
          }
        }
      }
      if (this.state.compareJobs.length >= 2) {
        alert("You can only compare 2 jobs at this time.");
        return;

      } else {
        tempArray = this.state.compareJobs;
        tempArray.push(job);
      }
    }
    this.setState({
      compareJobs: tempArray,
    });
  }

  checkJobCompare = (job) => {
    if (!Array.isArray(this.state.compareJobs) || !this.state.compareJobs.length) {
      return false;
    } else if (this.state.compareJobs.includes(job)) {
      return true;
    } else {
      return false;
    }
  }

  handleSearch = (searchValue) => {
    var tempHighlight = [false,false,false,false];
    var searchLength = searchValue.length;
    if (searchValue === '') {
      this.setState({
        mapJobs: this.state.jobs,
      });
      return;
    }
    var removeJob = true;
    var tempJobs = this.state.jobs;
    var numJobs = tempJobs.length;
    var copyJobs = [];
    if (tempJobs === null) {
      return;
    }
    var i;
    for (i = 0; i < numJobs; i++) {
      if (tempJobs[i].data().CompanyName.substring(0, searchLength).toLowerCase() === searchValue.toLowerCase()) {
        removeJob = false;
        tempHighlight[0] = true;
      }
      if (tempJobs[i].data().JobTitle.substring(0, searchLength).toLowerCase() === searchValue.substring(0, searchLength).toLowerCase()) {
        removeJob = false;
        tempHighlight[1] = true;
      }
      if (tempJobs[i].data().ApplicationStatus.substring(0, searchLength).toLowerCase() === searchValue.substring(0, searchLength).toLowerCase() && this.state.applicationCheck) {
        removeJob = false;
        tempHighlight[2] = true;
      }
      if (tempJobs[i].data().Location.substring(0, searchLength).toLowerCase() === searchValue.substring(0, searchLength).toLowerCase() && this.state.locationCheck) {
        removeJob = false;
        tempHighlight[3] = true;
      }
      if (!removeJob) {
        copyJobs.push(tempJobs[i]);
      }
      removeJob = true;
    }
    this.setState({
      mapJobs: copyJobs,
      highlight: tempHighlight,
    });
  }

  goToCompare = () => {
    let go = {
      pathname: "/compare",
      state: {
          jobA: this.state.compareJobs[0].data(),
          jobB: this.state.compareJobs[1].data(), 
          jobAid: this.state.compareJobs[0].id,    
          jobBid: this.state.compareJobs[1].id,      
      }
    };
    
    this.props.history.push(go);
  }

  render() {
    let table = (
      <div className={this.props.classes.tableWrapper}>
        <Table>
          <TableBody>
            <TableRow style={{ maxHeight: 10 }}>
              {this.state.comparing ? <TableCell align="center" className={this.props.classes.header}><div>Compare Jobs
              </div>
              </TableCell> : null}
              <TableCell align="center" className={this.props.classes.header}>
                <div>Company
            <IconButton className={this.props.classes.clickSort} onClick={this.sortByCompanyHandler} aria-label="Filter list">
                    <FilterListIcon />
                  </IconButton>
                </div>
              </TableCell>
              <TableCell align="center" className={this.props.classes.header}><div>Job Title
            <IconButton className={this.props.classes.clickSort} onClick={this.sortByTitleHandler} aria-label="Filter list">
                  <FilterListIcon />
                </IconButton>
              </div>
              </TableCell>
              {this.state.locationCheck ? <TableCell align="center" className={this.props.classes.header}><div>Location
            <IconButton className={this.props.classes.clickSort} onClick={this.sortByLocationHandler} aria-label="Filter list">
                  <FilterListIcon />
                </IconButton>
              </div>
              </TableCell> : null}
              {this.state.enthusiasmCheck ? <TableCell align="center" className={this.props.classes.header}><div>Enthusiasm
            <IconButton className={this.props.classes.clickSort} onClick={this.sortByEnthusiasmHandler} aria-label="Filter list">
                  <FilterListIcon />
                </IconButton>
              </div>
              </TableCell> : null}
              {this.state.optimismCheck ? <TableCell align="center" className={this.props.classes.header}><div>Optimism
            <IconButton className={this.props.classes.clickSort} onClick={this.sortByOptimismHandler} aria-label="Filter list">
                  <FilterListIcon />
                </IconButton>
              </div>
              </TableCell> : null}
              {this.state.applicationCheck ? <TableCell align="center" className={this.props.classes.header}><div>Status
            <IconButton className={this.props.classes.clickSort} onClick={this.sortByApplicationHandler} aria-label="Filter list">
                  <FilterListIcon />
                </IconButton>
              </div>
              </TableCell> : null}
              {this.state.distanceCheck ? <TableCell align="center" className={this.props.classes.header}><div>Distance
            <IconButton className={this.props.classes.clickSort} onClick={this.sortByDistanceHandler} aria-label="Filter list">
                  <FilterListIcon />
                </IconButton>
              </div>
              </TableCell> : null}
              {this.state.weightCheck ? <TableCell align="center" className={this.props.classes.header}><div>Weighted Score
            <IconButton className={this.props.classes.clickSort} onClick={this.sortByWeightsHandler} aria-label="Filter list">
                  <FilterListIcon />
                </IconButton>
              </div>
              </TableCell> : null}
            </TableRow>
            {this.state.jobs ? (this.state.mapJobs.map(job => {
              return (
                <TableRow
                  hover
                  key={job.id}
                  style={{ maxHeight: 10 }}
                >
                  {this.state.comparing ?
                    <TableCell>
                      <Checkbox
                        //checkJobCompare sees if this job is in the compare array yet.
                        checked={this.checkJobCompare(job)}
                        value="checkedA"
                        color="primary"
                        //handleCompare adds to the job comparison array
                        onChange={() => { this.handleCompare(job) }}
                      />
                    </TableCell>
                    : null}
                  <TableCell onClick={event => this.handleOpen(job.id, job)} align="center" style={{ backgroundColor: this.state.highlight[0] ? 'yellow' : null, maxWidth: 60, overflowWrap: "break-word" }}>{job.data().CompanyName}</TableCell>
                  <TableCell onClick={event => this.handleOpen(job.id, job)} align="center" style={{ backgroundColor: this.state.highlight[1] ? 'yellow' : null,maxWidth: 60, overflowWrap: "break-word" }}>{job.data().JobTitle}</TableCell>
                  {this.state.locationCheck ?
                    <TableCell onClick={event => this.handleOpen(job.id, job)} align="center" style={{ backgroundColor: this.state.highlight[3] ? 'yellow' : null, maxWidth: 40 }}>{job.data().Location}
                      {(false === job.data().ValidLocation) &&
                        <span>
                          <span ref="invalidLocation" data-tip=
                            "We couldn't find the location you provided.<br/>Certain functionality won't work properly."
                            data-multiline="true" style={{ color: 'red' }}> ( ! )</span>
                          <ReactTooltip />
                        </span>
                      }
                    </TableCell>
                    : null}
                  {this.state.enthusiasmCheck ? <TableCell onClick={event => this.handleOpen(job.id, job)} align="center" style={{ maxWidth: 80, overflowX: "auto" }}>{this.getStars(job.data().Enthusiasm)}</TableCell>
                    : null}
                  {this.state.optimismCheck ? <TableCell onClick={event => this.handleOpen(job.id, job)} align="center" style={{ maxWidth: 80, overflowX: "auto" }}>{this.getStars(job.data().Optimism)}</TableCell>
                    : null}
                  {this.state.applicationCheck ? <TableCell onClick={event => this.handleOpen(job.id, job)} align="center" style={{ backgroundColor: this.state.highlight[2] ? 'yellow' : null,maxWidth: 80, overflowX: "auto" }}>{job.data().ApplicationStatus}</TableCell>
                    : null}
                  {this.state.distanceCheck ? <TableCell onClick={event => this.handleOpen(job.id, job)} align="center" style={{ maxWidth: 80, overflowX: "auto" }}>{Math.round(job.data().Distance) + " miles"}</TableCell>
                    : null}
                  {this.state.weightCheck ? <TableCell onClick={event => this.handleOpen(job.id, job)} align="center" style={{ maxWidth: 60, overflowX: "auto" }}>{calculateScore(this.state.weights, job.data())}</TableCell>
                    : null}
                </TableRow>

              );
            })
            ) : null
            }
          </TableBody>
        </Table>
        {this.state.compareJobs.length === 2 ?
        <Button onClick={this.goToCompare} variant="contained" color="secondary" style={{margin:15}}>
          Compare
        </Button> : null
        }
      </div>
    );
    const width = window.innerWidth > 900;
    return (
      <div>

        <div className={this.props.classes.container}>
          <Typography variant="h2" align="center" color="primary" style={{ margin: 40, marginBotton: 200 }}>Your Applications</Typography>
          <div className={this.props.classes.searchField}>
          <Grid container direction='row'>
            <Grid item>
              <TextField
                id="outlined-name"
                label="Search"
                value={this.state.searchValue}
                onChange={this.handleChange('searchValue')}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <Fab style={{ top: '25%', marginLeft: 10 }} size="small" aria-label="Add" onClick={() => this.handleSearch(this.state.searchValue)}><SearchIcon /></Fab>
            </Grid>
          </Grid>
          <Fab color="primary" size="large" aria-label="Add" onClick={this.handleClick} ><AddIcon /></Fab>
          </div>
          
          <div className={this.props.classes.wrapper}>
            <div className={this.props.classes.tableDiv}>
              {table}
            </div>
          </div>
          {width ? (
            <div><ExpansionPanel className={this.props.classes.filters}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={this.props.classes.heading}>Filters</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={this.props.filterContent}>
                <div>
                  <Grid container spacing={24}>
                    <Grid item xs={3}>
                      <Checkbox
                        checked={this.state.locationCheck}
                        value="checkedA"
                        color="primary"
                        onChange={this.checkChange('locationCheck')}
                      />
                      <Typography>Location</Typography>
                    </Grid>

                    <Grid item xs={3}>
                      <Checkbox
                        checked={this.state.enthusiasmCheck}
                        value="checkedA"
                        color="primary"
                        onChange={this.checkChange('enthusiasmCheck')}
                      />
                      <Typography>Enthusiasm</Typography>
                    </Grid>

                    <Grid item xs={3}>
                      <Checkbox
                        checked={this.state.optimismCheck}
                        value="checkedA"
                        color="primary"
                        onChange={this.checkChange('optimismCheck')}
                      />
                      <Typography>Optimism</Typography>
                    </Grid>

                    <Grid item xs={3}>
                      <Checkbox
                        checked={this.state.applicationCheck}
                        value="checkedA"
                        color="primary"
                        onChange={this.checkChange('applicationCheck')}
                      />
                      <Typography>Status</Typography></Grid>

                    <Grid item xs={3}>
                      <Checkbox
                        checked={this.state.distanceCheck}
                        value="checkedA"
                        color="primary"
                        onChange={this.checkChange('distanceCheck')}
                      />
                      <Typography>Distance</Typography>
                    </Grid>

                    <Grid item xs={3}>
                      <Checkbox
                        checked={this.state.comparing}
                        value="checkedA"
                        color="primary"
                        onChange={() => { this.compareExpansionPanel() }}
                      />
                      <Typography>Compare Jobs</Typography>
                    </Grid>

                    <Grid item xs={3}>
                      <Checkbox
                        checked={this.state.weightCheck}
                        value="checkedA"
                        color="primary"
                        onChange={this.checkChange('weightCheck')}
                      />
                      <Typography>Weighted Scores</Typography>
                    </Grid>

                    <Grid item xs={3}>
                      <FormControl className={this.props.classes.formControl}>
                        <InputLabel htmlFor="status"></InputLabel>
                        <Select
                          value={this.state.appStat}
                          onChange={this.handleStatChange}
                          inputProps={{
                            name: 'appStat',
                            id: 'status'
                          }}
                        >
                          <MenuItem value={0}>All</MenuItem>
                          <MenuItem value={10}>Application Submitted</MenuItem>
                          <MenuItem value={20}>No Response</MenuItem>
                          <MenuItem value={50}>Rejected</MenuItem>
                          <MenuItem value={60}>Denied Offer</MenuItem>
                          <MenuItem value={70}>Accepted Offer</MenuItem>
                        </Select>
                      </FormControl>
                      <Typography>Application Status</Typography>
                    </Grid>
                  </Grid>
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            </div>) : null}
        </div>
      </div>
    );
  }
}
const Home = compose(
  withRouter,
  withFirebase,
)(HomeBase);


function intTo5Bit(i) {
  let b = i.toString(2);
  return "00000".substr(b.length) + b;
}

function getSum(total, num) {
  return total + num;
}
function calculateScore(weights, job) {
  var crime = weights.crime * job.numbeo_crime_index;
  var trafficTime = weights.trafficTime * job.numbeo_traffic_time_index;
  var cpiAndRent = weights.cpiAndRent * job.numbeo_cpi_and_rent_index;
  var purchasingPower = weights.purchasingPower * job.numbeo_purchasing_power_incl_rent_index;
  var climateIndex = weights.climateIndex * job.numbeo_climate_index;
  var safetyIndex = weights.safetyIndex * job.numbeo_safety_index;
  var trafficCo2 = weights.trafficCo2 * job.numbeo_traffic_co2_index;
  //this number is way out of scale with the others, so normalize it a bit
  trafficCo2 /= 100;
  var cpiIndex = weights.cpiIndex * job.numbeo_cpi_index;
  var trafficInefficiency = weights.trafficInefficiency * job.numbeo_traffic_inefficiency_index;
  var qualityOfLife = weights.qualityOfLife * job.numbeo_quality_of_life_index;
  var rent = weights.rent * job.numbeo_rent_index;
  var healthCare = weights.healthCare * job.numbeo_health_care_index;
  var traffic = weights.traffic * job.numbeo_traffic_index;
  var groceries = weights.groceries * job.numbeo_groceries_index;
  var pollution = weights.pollution * job.numbeo_pollution_index;

  var scores = [crime, trafficTime, cpiAndRent, purchasingPower, climateIndex, safetyIndex, trafficCo2, cpiIndex,
    trafficInefficiency, qualityOfLife, rent, healthCare, traffic, groceries, pollution];

  var localeScore = scores.reduce(getSum);
  if (isNaN(localeScore)) {
    return "N/A"
  }

  return Math.round(localeScore);


}

export default withStyles(styles)(Home);
