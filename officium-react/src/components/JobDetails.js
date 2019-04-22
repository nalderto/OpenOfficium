import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { withFirebase } from './Firebase';
import { withRouter } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/storage';
import { compose } from 'recompose';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import Label from '@material-ui/core/FormLabel';
import { StyledDropZone } from 'react-drop-zone';
import 'react-drop-zone/dist/styles.css'
import BackIcon from '@material-ui/icons/ArrowBack';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import DetailTabs from './elements/DetailTabs'
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import queryString from 'query-string';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import moment from 'moment'
import Warning from "@material-ui/icons/Warning"

const styles = theme => ({
  container: {
    textAlign: 'center',
    marginTop: 80,
    margin: 'auto',
  },
  // card: {
  //   padding: theme.spacing.unit * 2,
  //   margin: 'auto',
  //   marginTop: 25,
  //   marginBottom: 50,
  //   backgroundColor: '#eae8ea',
  //   maxWidth: 1000,
  // },
  paper: {
    padding: theme.spacing.unit * 2,
    margin: 'auto',
    marginTop: 25,
    marginBottom: 50,
    backgroundColor: "#eae8ea",
    maxWidth: 1000,
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
  fileError: {
    color: "red",
    marginTop: 10
  },
  item: {
    padding: theme.spacing.unit,
    marginBottom: 10,
    width: "80%",
    margin: "auto"
  },
  paperHeading: {
    flexGrow: 1,
    marginBottom: 20,
    backgroundColor: "white",
    padding: 15
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
    overflowX: 'auto',
    overflowY: 'auto',
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
  Dropzone: {
    height: '50%',
    width: '30%',
    backgroundColor: "white",
    border: '2px dashed rgb(187, 186, 186)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    fontSize: '16px',
  },
  editButton: {
    display: 'inline',
    position: 'relative',
    textAlign: 'left',

  },
  editPaper: {
    marginTop: 20,
    margin: theme.spacing.unit,
    width: '60%',
  },
  notesTypo: {
    textAlign: 'left',
  },
  panes: {
    margin: '10px',
    textAlign: 'left',
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class JobDetailsBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      tab: 0,
      fileUrls: [],
      Contacts: [],
      openDelete: false,
      uploadOpen: false,
      fileType: "",
      showNotes: false,
      notesValue: '',
      job: null,
      openDeleteFile: false,
      fileToDelete: null,
      rbool: false,
      clbool: false,
      bcbool: false,
      mcbool: false,
      width: window.innerWidth,
      sourcePage: "/home",
      loading: false,
      rNum: 0,
      clNum: 0,
      bcNum: 0,
      mcNum: 0,
      canUpload: false,
      uploadProgress: 0,
      fileError: '',
      addContact: false,
      newContactFirstName: '',
      newContactLastName: '',
      newContactEmail: '',
      newContactTitle: '',
      newContactPhone: '',
      expanded: false,
      color: '',
    };
  }

  goBack = event => {
    this.props.history.push(this.state.sourcePage);
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
      fileError: '',
    });
  };

  handleOpenUpload = () => {
    this.setState({ uploadOpen: true });
  };

  handleCloseUpload = () => {
    this.setState({
      uploadOpen: false,
      fileType: "",
      fileError: ''
    });
  };

  handleClickOpenDelete = () => {
    this.setState({ openDelete: true });
  };

  handleCloseDelete = () => {
    this.setState({ openDelete: false });
  };

  handleClickOpenDeleteFile = (file) => {
    this.setState({ fileToDelete: file });
    this.setState({ openDeleteFile: true });
  };

  handleCloseDeleteFile = () => {
    this.setState({ openDeleteFile: false });
  };

  componentWillMount() {
    var parsed = queryString.parse(window.location.search);
    if (parsed["from"]) {
      var sp = "/" + parsed["from"];
      this.setState({
        sourcePage: sp
      });
    }
    var user = firebase.auth().currentUser;
    var db = firebase.firestore();
    var that = this;
    var contacts = [];
    db.collection('users').doc(user.uid).collection('jobs').doc(this.state.id).get().then((snapshot) => {
      if (snapshot.data().Contacts) {
        contacts = snapshot.data().Contacts;
      }
      this.setState({
        loaded: true,
        job: snapshot,
        notesValue: snapshot.data().Notes,
        Contacts: contacts,
      });
    }).then(function () {
      that.getUserFiles();
      //that.getContacts();
    });
  }

  getContacts = () => {
    var uid = firebase.auth().currentUser.uid;
    var jobid = this.state.job.id;
    firebase.firestore().collection('users').doc(uid).collection('jobs').doc(jobid).get().then(async doc => {
      var tempContacts = doc.data()["Contacts"];
      this.setState({
        Contacts: tempContacts,
      });
    });
  }

  getUserFiles = () => {
    var uid = firebase.auth().currentUser.uid;
    var jobid = this.state.job.id;
    var storageRef = firebase.storage().ref();
    var count = 0;
    var types = ["Resumes", "Misc", "CoverLetters", "BusinessCards"];
    var urls = [];
    var that = this;
    firebase.firestore().collection('users').doc(uid).collection('jobs').doc(jobid).get().then(async doc => {
      for (var typeIndex = 0; typeIndex < types.length; typeIndex++) {
        var files = doc.data()["Files_" + types[typeIndex]];

        var path = types[typeIndex] + "/" + uid + "/" + jobid + "/";

        if (files && files.length > 0) {
          var boolMap = ["rbool", "mcbool", "clbool", "bcbool"];
          this.setState({ [boolMap[typeIndex]]: true });

          for (var i = 0; i < files.length; i++) {

            //Make copy instead of copying reference
            var fname = files[i].slice(0);
            // eslint-disable-next-line
            await storageRef.child(path + files[i]).getDownloadURL().then((url) => {
              urls.push({ url: url, fileName: fname, fileType: types[typeIndex] });
              that.setState({
                fileUrls: urls
              });
              if (types[typeIndex] === "Resumes") {
                count = that.state.rNum + 1;
                that.setState({
                  rNum: count
                });
              } else if (types[typeIndex] === "Misc") {
                count = that.state.mcNum + 1;
                that.setState({
                  mcNum: count
                });
              } else if (types[typeIndex] === "CoverLetters") {
                count = that.state.clNum + 1;
                that.setState({
                  clNum: count
                });
              } else if (types[typeIndex] === "BusinessCards") {
                count = that.state.bcNum + 1;
                that.setState({
                  bcNum: count
                });
              }
              /*console.log("Resumes: " + that.state.rNum);
              console.log("CoverLetters: " + that.state.clNum);
              console.log("Business Cards: " + that.state.bcNum);
              console.log("Misc: " + that.state.mcNum);*/
            });
          }
        }
      }
    });
  }

  delUserFile = (deletingApp) => {

    var f = this.state.fileToDelete;
    var fStorageType = f.fileType;
    var fName = f.fileName;
    var fType = f.fileType;
    this.setState({ openDeleteFile: false });
    var user = firebase.auth().currentUser;
    var name = user.uid + '/';
    var jobid = this.state.job.id;
    name += jobid + '/';
    name += fName;
    var storageRef = firebase.storage().ref();
    var p = fStorageType + "/" + name;

    var delRef = storageRef.child(p);

    var count = 0;
    if (fType === "Resumes") {
      if (this.state.rNum > 0) {
        count = this.state.rNum - 1;
        this.setState({
          rNum: count
        });
      }
    } else if (fType === "Misc") {
      if (this.state.mcNum > 0) {
        count = this.state.mcNum - 1;
        this.setState({
          mcNum: count
        });
      }
    } else if (fType === "CoverLetters") {
      if (this.state.clNum > 0) {
        count = this.state.clNum - 1;
        this.setState({
          clNum: count
        });
      }
    } else if (fType === "BusinessCards") {
      if (this.state.bcNum > 0) {
        count = this.state.bcNum - 1;
        this.setState({
          bcNum: count
        });
      }
    }

    delRef.delete().then(() => {
      // File deleted successfully
      //find file to remove from array
      var oldFiles = [...this.state.fileUrls];
      for (var i = 0; i < this.state.fileUrls.length; i++) {
        if (this.state.fileUrls[i].fileName === fName) {
          oldFiles.splice(i, 1);
          break;
        }
      }
      if (!deletingApp) {
        this.setState({
          fileUrls: oldFiles
        });
      }
      var o = {};


      o["Files_" + fType] = firebase.firestore.FieldValue.arrayRemove(fName);
      var boolMap = { "Resumes": "rbool", "Misc": "mcbool", "BusinessCards": "bcbool", "CoverLetters": "clbool" };
      var index = 0;
      var foundAnother = false;
      for (; index < oldFiles.length; index++) {
        if (oldFiles[index].fileType === fType) {
          foundAnother = true;
          break;
        }
      }
      if (!foundAnother) {
        this.setState({
          [boolMap[fType]]: false
        });
      }



      firebase.firestore().collection('users').doc(user.uid).collection('jobs').doc(jobid).update(o).catch(() => {

      });
    }).catch(function (error) {
      // Uh-oh, an error occurred!
      //console.log("An error has occured");
    });

  }

  handleDelete = () => {
    var uid = firebase.auth().currentUser.uid;
    var db = firebase.firestore();
    db.collection('users').doc(uid).collection('jobs').doc(this.state.id).delete().then(() => {
      this.state.fileUrls.forEach((f) => {
        this.setState({ fileToDelete: f });
        this.delUserFile(true);
      });

      this.props.history.push("/home");

    }).catch(function (error) {
    });

  }

  handleEdit = (id) => {
    this.props.history.push(`/jobs/edit/${id}`);
  }

  handleChangeTab = (tab) => {
    this.setState({
      tab: tab,
    });

  }

  selectedFileHandler = (file) => {
    this.setState({
      selectedFile: file,
    });
  };

  canUpload = () => {
    if (this.state.fileType === "Resumes" && this.state.rNum < 1) {
      this.setState({
        canUpload: true
      });
      return true;
    } else if (this.state.fileType === "CoverLetters" && this.state.clNum < 1) {
      this.setState({
        canUpload: true
      });
      return true;
    } else if (this.state.fileType === "BusinessCards" && this.state.bcNum < 5) {
      this.setState({
        canUpload: true
      });
      return true;
    } else if (this.state.fileType === "Misc" && this.state.mcNum < 3) {
      this.setState({
        canUpload: true
      });
      return true;
    }
  }

  fileUploadHandler = () => {
    if (this.canUpload()) {
      var user = firebase.auth().currentUser;
      var uid = firebase.auth().currentUser.uid;
      var name = user.uid + '/';
      var fname = this.state.selectedFile.name;
      var uniqueFName = fname;
      var tries = 1;
      this.setState({
        loading: true
      });
      for (var i = 0; i < this.state.fileUrls.length; i++) {
        if (this.state.fileUrls[i].fileName === uniqueFName) {
          uniqueFName = fname + "(" + tries + ")";
          i = 0;
          tries++;
        }
      }
      fname = uniqueFName;
      var jobid = this.state.job.id;
      name += jobid + '/';
      name += fname;
      var that = this;

      const fd = new FormData();
      fd.append(name, this.state.selectedFile);
      var url = 'https://us-central1-officium-app.cloudfunctions.net/uploadFile?folder=' + this.state.fileType;
      axios.post(url, fd, {
        onUploadProgress: progressEvent => {
          this.setState({
            uploadProgress: Math.round(progressEvent.loaded / progressEvent.total * 100)
          });
        }
      }).then(() => {
        var o = {};
        o["Files_" + this.state.fileType] = firebase.firestore.FieldValue.arrayUnion(fname);
        firebase.firestore().collection('users').doc(uid).collection('jobs').doc(jobid).update(o).then(function () {
          that.getUserFiles();
          that.handleCloseUpload();
          that.setState({
            loading: false,
            uploadProgress: 0,
            selectedFile: null,
          });
        });
      });
    } else {
      if (this.state.fileType === "Resumes") {
        this.setState({
          fileError: "You have already uploaded the maximum number of Resumes"
        });
        return true;
      } else if (this.state.fileType === "CoverLetters") {
        this.setState({
          fileError: "You have already uploaded the maximum number of Cover Letters"
        });
        return true;
      } else if (this.state.fileType === "BusinessCards") {
        this.setState({
          fileError: "You have already uploaded the maximum number of Business Cards"
        });
        return true;
      } else if (this.state.fileType === "Misc") {
        this.setState({
          fileError: "You have already uploaded the maximum number of Miscellaneous files"
        });
        return true;
      }
    }
  }


  handleNotes = () => {
    this.setState({
      showNotes: true,
    });
  }

  handleContactInfo = name => event => {
    if (name === 'FirstName') {
      this.setState({
        newContactFirstName: event.target.value,
      });
    }
    if (name === 'LastName') {
      this.setState({
        newContactLastName: event.target.value,
      });
    }
    if (name === 'Title') {
      this.setState({
        newContactTitle: event.target.value,
      });
    }
    if (name === 'Phone') {
      this.setState({
        newContactPhone: event.target.value,
      });
    }
    if (name === 'Email') {
      this.setState({
        newContactEmail: event.target.value,
      });
    }
  };

  handleNoteSubmission = () => {
    var uid = firebase.auth().currentUser.uid;
    var db = firebase.firestore();
    this.setState({
      showNotes: false,
    });
    db.collection('users').doc(uid).collection('jobs').doc(this.state.id).update({
      Notes: this.state.notesValue,
    }).then(function () {
      //console.log("Document successfully written!");
    })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  }
  handleNotesChange = (event) => {
    this.setState({
      notesValue: event.target.value,
    });
  }

  handleSaveContact = () => {
    var uid = firebase.auth().currentUser.uid;
    var db = firebase.firestore();
    var saveContact = {
      FirstName: this.state.newContactFirstName,
      LastName: this.state.newContactLastName,
      Title: this.state.newContactTitle,
      Email: this.state.newContactEmail,
      Phone: this.state.newContactPhone,
    }
    if (saveContact.FirstName === '' || saveContact.LastName === '' || saveContact.Phone === ''
      || saveContact.Email === '' || saveContact.Title === '') {
      alert("New contact field must not be blank.");
      this.setState({
        newContactFirstName: '',
        newContactPhone: '',
        newContactEmail: '',
        newContactTitle: '',
        newContactLastName: '',
      });
      return;
    }
    if (this.state.Contacts) {
      var oldContacts = this.state.Contacts;
      oldContacts.push(saveContact);
      this.setState({
        Contacts: oldContacts
      });
      db.collection('users').doc(uid).collection('jobs').doc(this.state.id).update({
        Contacts: oldContacts,
      }).then(function () {
        //console.log("Document successfully written!");
      })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    } else {
      console.log("what");
      console.log(this.state.Contacts);
      var updateContacts = [];
      updateContacts.push(saveContact);
      db.collection('users').doc(uid).collection('jobs').doc(this.state.id).update({
        Contacts: updateContacts,
      }).then(function () {
        //console.log("Document successfully written!");
      })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    }
    this.setState({
      newContactFirstName: '',
      newContactPhone: '',
      newContactEmail: '',
      newContactTitle: '',
      newContactLastName: '',
    });
  }

  handleDeleteContact = (name) => {
    var oldContacts = this.state.Contacts;
    for (var i = 0; i < oldContacts.length; i++) {
      if (oldContacts[i].FirstName === name) {
        oldContacts.splice(i, 1);
        break;
      }
    }
    this.setState({
      Contacts: oldContacts,
    });
    var user = firebase.auth().currentUser;
    var jobid = this.state.job.id;


    firebase.firestore().collection('users').doc(user.uid).collection('jobs').doc(jobid).update({
      Contacts: oldContacts
    })
      .catch((error) => {
        console.log(error);
      });
  }

  handleEditContact = (name) => {
    var oldContacts = this.state.Contacts;
    var fixContact;
    var user = firebase.auth().currentUser;
    var jobid = this.state.job.id;
    for (var i = 0; i < oldContacts.length; i++) {
      if (oldContacts[i].FirstName === name) {
        fixContact = oldContacts[i];
        oldContacts.splice(i, 1);
      }
    }
    this.setState({
      Contacts: oldContacts,
      newContactFirstName: fixContact.FirstName,
      newContactPhone: fixContact.Phone,
      newContactEmail: fixContact.Email,
      newContactTitle: fixContact.Title,
      newContactLastName: fixContact.LastName,
      expanded: true
    });
    firebase.firestore().collection('users').doc(user.uid).collection('jobs').doc(jobid).update({
      Contacts: oldContacts
    })
      .catch((error) => {
        console.log(error);
      });
  }

  handleNotesChange = (event) => {
    this.setState({
      notesValue: event.target.value,
    });
  }

  updateDimensions() {
    this.setState({
      width: window.innerWidth,
    });
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  fixExpectedContactA = () => {
    var user = firebase.auth().currentUser;

    firebase.firestore().collection('users').doc(user.uid).collection('jobs').doc(this.state.id).set({
      LastContact: moment().format("L"),
      ApplicationStatus: "Received Offer",
      ExpectedContact: "",
    }, { merge: true })
      .then(() => { window.location.reload() })
      .catch(error => {
        console.log(error);
        console.log("could not update job");
      });
  }

  fixExpectedContactB = () => {
    var user = firebase.auth().currentUser;

    firebase.firestore().collection('users').doc(user.uid).collection('jobs').doc(this.state.id).set({
      LastContact: moment().format("L"),
      ApplicationStatus: "Rejected",
      ExpectedContact: "",
    }, { merge: true })
      .then(() => { window.location.reload() })
      .catch(error => {
        console.log(error);
        console.log("could not update job");
      });
  }

  render() {
    if (!this.state.loaded) return null;
    else {
      let content = null;
      let status = null;
      let notesEdit = null;
      if (this.state.showNotes) {
        notesEdit = (
          <div>
            <div><TextField id="outlined-multiline-static" inputProps={{ maxLength: 500 }} fullWidth rows="4" margin="normal" variant="outlined" value={this.state.notesValue} onChange={this.handleNotesChange} multiline></TextField></div>
            <Button
              variant="contained"
              onClick={this.handleNoteSubmission}
              color="primary"
            >
              Done
            </Button>
          </div>
        );
      } else {
        notesEdit = (
          <Paper className={this.state.editPaper}>
            <Typography variant="body1"
              style={{ whiteSpace: 'pre-line', textAlign: 'left', padding: '3%', marginBottom: '1%' }}>
              {this.state.notesValue}
            </Typography>
          </Paper>
        );
      }

      switch (this.state.job.data().ApplicationStatus) {
        case ("Pending"): {
          status = (<Typography variant='h6' style={{ fontSize: 23, marginTop: 15, color: "#40bfb5" }}>Status: {this.state.job.data().ApplicationStatus}</Typography>);
          break;
        }
        case ("No Response"): {
          status = (<Typography variant='h6' style={{ fontSize: 23, marginTop: 15, color: "#E6E11B" }}>Status: {this.state.job.data().ApplicationStatus}</Typography>);
          break;
        }
        case ("Rejected"): {
          status = (<Typography variant='h6' style={{ fontSize: 23, marginTop: 15, color: "#E50028" }}>Status: {this.state.job.data().ApplicationStatus}</Typography>);
          break;
        }
        case ("Denied Offer"): {
          status = (<Typography variant='h6' style={{ fontSize: 23, marginTop: 15, color: "#ED9400" }}>Status: {this.state.job.data().ApplicationStatus}</Typography>);
          break;
        }
        case ("Received Offer"): {
          status = (<Typography variant='h6' style={{ fontSize: 23, marginTop: 15, color: "#00B829" }}>Status: {this.state.job.data().ApplicationStatus}</Typography>);
          break;
        }
        case ("Accepted Offer"): {
          status = (<Typography variant='h6' style={{ fontSize: 23, marginTop: 15, color: "#00B829" }}>Status: {this.state.job.data().ApplicationStatus}</Typography>);
          break;
        }
        default:
          status = (null)
          break;

      }

      switch (this.state.tab) {
        case 0: {
          //General Details
          content = (
            <div>
              <Typography variant="h2" style={{ margin: 50 }}>General Details</Typography>
              <Paper className={this.props.classes.item}>
                <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                  Application Method:
                  </Typography>
                <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6" id="simple-modal-description">
                  {this.state.job.data().HowApplied}
                </Typography>
              </Paper>
              {(this.state.job.data().Link && this.state.job.data().HowApplied === "Online") ?
                <Paper className={this.props.classes.item}>
                  <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                    Application Link:
                  </Typography>
                  <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6" id="simple-modal-description">
                    <a href={`${this.state.job.data().Link}`}>{this.state.job.data().Link}</a>
                  </Typography>
                </Paper>
                : ''}
              {this.state.job.data().LastContact ?
                <Paper className={this.props.classes.item}>
                  <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                    Last Contacted:
                    </Typography>
                  <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6" id="simple-modal-description">
                    {this.state.job.data().LastContact}
                  </Typography>
                </Paper>
                : ''}
              {this.state.job.data().ExpectedContact ?
                <Paper className={this.props.classes.item}>
                  <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                    Expected Contact:
	                  </Typography>
                  <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6" id="simple-modal-description">
                    {this.state.job.data().ExpectedContact}
                  </Typography>
                </Paper>
                : ''}
              {this.state.job.data().References ?
                <Paper className={this.props.classes.item}>
                  <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                    References:
                  </Typography>
                  <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6" id="simple-modal-description">
                    {this.state.job.data().References}
                  </Typography>
                </Paper>
                : ''}
              {/*<Paper className={this.props.classes.item}>
                <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                  Application Status:
                </Typography>
                <Typography style={{ marginLeft: '1vh', marginBottom: '2vh', color: this.state.color }} variant="h6" id="simple-modal-description">
                  {this.state.job.data().ApplicationStatus}
                </Typography>
              </Paper>*/}
              <Paper className={this.props.classes.item}>
                <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                  Distance:
                  </Typography>
                <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6" id="simple-modal-description">
                  {Math.round(this.state.job.data().Distance)} miles
                  </Typography>
              </Paper>
            </div>
          );
          break;
        }
        case 1: {
          //Documents
          content = (
            <div>
              <Typography variant="h2" style={{ margin: 50 }}>Documents</Typography>
              {this.state.rbool ? <div>
                <Typography variant='h4'>Resumes:</Typography>
                <ul style={{ listStyleType: "none" }}>
                  {this.state.fileUrls.map((url, i) => {
                    return (
                      (Object.is(url.fileType, "Resumes") ?
                        <Paper key={i} className={this.props.classes.item}>
                          <List>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <FolderIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={<a href={url.url}>{url.fileName}</a>}
                              />
                              <ListItemSecondaryAction>
                                <IconButton aria-label="Delete" onClick={() => this.handleClickOpenDeleteFile(url)}>
                                  <DeleteIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          </List>
                        </Paper> : "")
                    )
                  })}
                </ul></div> : ""}
              {this.state.clbool ? <div>
                <Typography variant='h4'>Cover Letters:</Typography>
                <ul style={{ listStyleType: "none" }}>
                  {this.state.fileUrls.map((url, i) => {
                    return (
                      (Object.is(url.fileType, "CoverLetters") ?
                        <Paper className={this.props.classes.item} key={i}>
                          <List>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <FolderIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={<a key={i} href={url.url}>{url.fileName}</a>}
                              />
                              <ListItemSecondaryAction>
                                <IconButton aria-label="Delete" onClick={() => this.handleClickOpenDeleteFile(url)}>
                                  <DeleteIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          </List>
                        </Paper> : "")
                    )
                  })}
                </ul></div> : ""}
              {this.state.bcbool ? <div>
                <Typography variant='h4'>Business Cards:</Typography>
                <ul style={{ listStyleType: "none" }}>
                  {this.state.fileUrls.map((url, i) => {
                    return (
                      (Object.is(url.fileType, "BusinessCards") ?
                        <Paper key={i} className={this.props.classes.item}>
                          <List>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <FolderIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={<a href={url.url}>{url.fileName}</a>}
                              />
                              <ListItemSecondaryAction>
                                <IconButton aria-label="Delete" onClick={() => this.handleClickOpenDeleteFile(url)}>
                                  <DeleteIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          </List>
                        </Paper> : "")
                    )
                  })}
                </ul></div> : ""}
              {this.state.mcbool ? <div>
                <Typography variant='h4'>Miscellaneous:</Typography>
                <ul style={{ listStyleType: "none" }}>
                  {this.state.fileUrls.map((url, i) => {
                    return (
                      (Object.is(url.fileType, "Misc") ?
                        <Paper key={i} className={this.props.classes.item}>
                          <List>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>
                                  <FolderIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={<a href={url.url}>{url.fileName}</a>}
                              />
                              <ListItemSecondaryAction>
                                <IconButton aria-label="Delete" onClick={() => this.handleClickOpenDeleteFile(url)}>
                                  <DeleteIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          </List>
                        </Paper> : "")
                    )
                  })}
                </ul></div> : ""}
              <Button onClick={this.handleOpenUpload} style={{ margin: 20 }} variant="contained" color="primary">Upload File</Button>
              <div>
                <Dialog
                  open={this.state.uploadOpen}
                  onClose={this.state.handleCloseUpload}
                  maxWidth='sm'
                  fullWidth

                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">Upload File</DialogTitle>
                  <DialogContent>
                    <StyledDropZone onDrop={(file) => this.selectedFileHandler(file)} label={
                      this.state.selectedFile ? this.state.selectedFile.name : 'Select or Drop your file here'
                    } />
                    {<Typography className={this.props.classes.fileError}>{this.state.fileError}</Typography>}
                    <DialogContentText id="alert-dialog-description" style={{ paddingBottom: "2%" }}>
                      <Label className="upload-group"></Label>
                    </DialogContentText>
                    <div style={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                      <FormControl required style={{ margin: 20, minWidth: 120 }}>
                        <InputLabel htmlFor="age-required">File Type</InputLabel>
                        <Select
                          value={this.state.fileType}
                          onChange={this.handleChange}
                          name="fileType"
                          inputProps={{
                            id: 'fileType-required',
                          }}
                          style={{ marginTop: 20 }}
                        >
                          <MenuItem value="Misc">Miscellaneous</MenuItem>
                          <MenuItem value="Resumes">Resume</MenuItem>
                          <MenuItem value="CoverLetters">Cover Letter</MenuItem>
                          <MenuItem value="BusinessCards">Business Card</MenuItem>
                        </Select>
                      </FormControl></div>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleCloseUpload} color="secondary">Cancel</Button>
                    {!this.state.loading && <Button onClick={this.fileUploadHandler} color="primary">Upload File</Button>}
                    {this.state.loading &&
                      <div style={{ width: "70%", display: 'flex', justifyContent: 'center', marginBottom: "20px" }}>
                        <CircularProgress
                          variant="indeterminate"
                        />
                      </div>
                    }
                  </DialogActions>
                </Dialog>
              </div>
            </div>
          );
          break;
        }
        case 2: {
          //Notes
          content = (
            <div>
              <div><Typography variant="h2" style={{ margin: 50 }}>Notes</Typography></div>
              <div className={this.props.classes.editButton}><Fab style={{ marginBottom: '0.5%' }} color="primary" size="small" aria-label="Add" onClick={this.handleNotes}><EditIcon /></Fab></div>
              {notesEdit}
            </div>
          );
          break;
        }
        case 3: {
          //City Information (Numbeo)

          if (this.state.width > 900) {
            content = (
              <div>
                <Typography variant="h2" style={{ margin: 50 }}>City Information</Typography>

                {this.state.job.data().numbeo_error ?
                  <Typography variant="h5" color="secondary" style={{ marginLeft: '1vh', marginTop: 10 }}>
                    Error Retrieving City Information.
                  </Typography>
                  :
                  null}
                <Paper className={this.props.classes.item}>


                  {this.state.job.data().numbeo_cpi_index ||
                    this.state.job.data().numbeo_rent_index ||
                    this.state.job.data().numbeo_cpi_and_rent_index ||
                    this.state.job.data().numbeo_purchasing_power_incl_rent_index ||
                    this.state.job.data().numbeo_restaurant_price_index ||
                    this.state.job.data().numbeo_groceries_index ||
                    this.state.job.data().numbeo_safety_index ||
                    this.state.job.data().numbeo_crime_index ||
                    this.state.job.data().numbeo_quality_of_life_index ||
                    this.state.job.data().numbeo_climate_index ||
                    this.state.job.data().numbeo_traffic_index ||
                    this.state.job.data().numbeo_pollution_index ||
                    this.state.job.data().numbeo_traffic_time_index ||
                    this.state.job.data().numbeo_traffic_co2_index ||
                    this.state.job.data().numbeo_traffic_inefficiency_index ||
                    this.state.job.data().numbeo_health_care_index
                    ?
                    null
                    :
                    <Typography variant="h4" style={{ marginTop: 20 }}>No Data Available for this City</Typography>
                  }

                  {this.state.job.data().numbeo_cpi_index ||
                    this.state.job.data().numbeo_rent_index ||
                    this.state.job.data().numbeo_cpi_and_rent_index ||
                    this.state.job.data().numbeo_purchasing_power_incl_rent_index ||
                    this.state.job.data().numbeo_restaurant_price_index ||
                    this.state.job.data().numbeo_groceries_index ?
                    <div>
                      <Typography variant="h4" style={{ marginTop: 20 }}>Cost of Living</Typography>
                      <Typography style={{ fontSize: 20, marginTop: 10 }}>*Indices are relative to New York City (NYC).</Typography>
                    </div>
                    : null}
                  <Grid container direction="row" style={{ justifyContent: 'center' }}>
                    <Grid item className={this.props.classes.panes}>
                      {this.state.job.data().numbeo_cpi_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                          CPI Index:
                        </Typography>
                        : ''}
                      {this.state.job.data().numbeo_rent_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                          Rent:
                        </Typography>
                        : ''}
                      {this.state.job.data().numbeo_cpi_and_rent_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                          CPI and Rent:
                        </Typography>
                        : ''}
                      {this.state.job.data().numbeo_purchasing_power_incl_rent_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                          Purchasing Power:
                          </Typography>
                        : ''}
                      {this.state.job.data().numbeo_restaurant_price_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                          Restaurant Price:
                        </Typography>
                        : ''}
                      {this.state.job.data().numbeo_groceries_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                          Groceries:
                        </Typography>
                        : ''}

                    </Grid>

                    <Grid item className={this.props.classes.panes}>

                      {this.state.job.data().numbeo_cpi_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                          {Math.round(this.state.job.data().numbeo_cpi_index)}%
                  </Typography>
                        : ''}
                      {this.state.job.data().numbeo_rent_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                          {Math.round(this.state.job.data().numbeo_rent_index)}%
                  </Typography>
                        : ''}
                      {this.state.job.data().numbeo_cpi_and_rent_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                          {Math.round(this.state.job.data().numbeo_cpi_and_rent_index)}%
                  </Typography>
                        : ''}
                      {this.state.job.data().numbeo_purchasing_power_incl_rent_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                          {Math.round(this.state.job.data().numbeo_purchasing_power_incl_rent_index)}%
                  </Typography>
                        : ''}
                      {this.state.job.data().numbeo_restaurant_price_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                          {Math.round(this.state.job.data().numbeo_restaurant_price_index)}%
                  </Typography>
                        : ''}
                      {this.state.job.data().numbeo_groceries_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                          {Math.round(this.state.job.data().numbeo_groceries_index)}%
                  </Typography>
                        : ''}


                    </Grid>
                  </Grid>

                  {this.state.job.data().numbeo_safety_index || this.state.job.data().numbeo_crime_index ?
                    <div>
                      <Typography variant="h4" style={{ marginTop: 20 }}>Crime and Safety</Typography>
                    </div>
                    : null}
                  <Grid container direction="row" style={{ justifyContent: 'center' }}>
                    <Grid item className={this.props.classes.panes}>
                      {this.state.job.data().numbeo_crime_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                          Crime:
                        </Typography>
                        : ''}
                      {this.state.job.data().numbeo_safety_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                          Safety:
                        </Typography>
                        : ''}
                    </Grid>

                    <Grid item className={this.props.classes.panes}>
                      {this.state.job.data().numbeo_crime_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                          {Math.round(this.state.job.data().numbeo_crime_index)} / 100
                        </Typography>
                        : ''}
                      {this.state.job.data().numbeo_safety_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>

                          {Math.round(this.state.job.data().numbeo_safety_index)} / 100
                    </Typography>
                        : ''}
                    </Grid>
                  </Grid>

                  {this.state.job.data().numbeo_quality_of_life_index ||
                    this.state.job.data().numbeo_climate_index ||
                    this.state.job.data().numbeo_traffic_index ||
                    this.state.job.data().numbeo_pollution_index ||
                    this.state.job.data().numbeo_traffic_time_index ||
                    this.state.job.data().numbeo_traffic_co2_index ||
                    this.state.job.data().numbeo_traffic_inefficiency_index ||
                    this.state.job.data().numbeo_health_care_index ?
                    <div>
                      <Typography variant="h4" style={{ marginTop: 20, marginBottom: 10 }}>Quality of Life</Typography>
                    </div>
                    : null}
                  {this.state.job.data().numbeo_quality_of_life_index ||
                    this.state.job.data().numbeo_climate_index ||
                    this.state.job.data().numbeo_health_care_index ?
                    <span>(Higher is Better) </span>
                    : null}
                  <Grid container direction="row" style={{ justifyContent: 'center' }}>
                    <Grid item className={this.props.classes.panes}>
                      {this.state.job.data().numbeo_quality_of_life_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                          Quality of Life:
                        </Typography>
                        : ''}
                      {this.state.job.data().numbeo_climate_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                          Climate:
                        </Typography>
                        : ''}
                      {this.state.job.data().numbeo_health_care_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                          Health Care:
                        </Typography>
                        : ''}
                    </Grid>
                    <Grid item className={this.props.classes.panes}>
                      {this.state.job.data().numbeo_quality_of_life_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                          {Math.round(this.state.job.data().numbeo_quality_of_life_index)}
                        </Typography>
                        : ''}
                      {this.state.job.data().numbeo_climate_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                          {Math.round(this.state.job.data().numbeo_climate_index)}
                        </Typography>
                        : ''}
                      {this.state.job.data().numbeo_health_care_index ?
                        <Typography variant="h5" color="textPrimary" >
                          {Math.round(this.state.job.data().numbeo_health_care_index)} / 100
                        </Typography>
                        : ''}
                    </Grid>

                  </Grid>
                  {this.state.job.data().numbeo_traffic_index ||
                    this.state.job.data().numbeo_pollution_index ||
                    this.state.job.data().numbeo_traffic_time_index ||
                    this.state.job.data().numbeo_traffic_co2_index ||
                    this.state.job.data().numbeo_traffic_inefficiency_index ?
                    <span style={{ marginTop: 10 }}>(Higher is Worse)</span>
                    : null}
                  <Grid container direction="row" style={{ justifyContent: 'center' }}>

                    <Grid item className={this.props.classes.panes}>
                      {this.state.job.data().numbeo_traffic_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                          Traffic:
                          </Typography>
                        : ''}
                      {this.state.job.data().numbeo_pollution_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                          Pollution:
                        </Typography>
                        : ''}
                      {this.state.job.data().numbeo_traffic_time_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                          Traffic Time to Work:
                        </Typography>
                        : ''}
                      {this.state.job.data().numbeo_traffic_co2_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                          CO2 Emissions:
                        </Typography>
                        : ''}
                      {this.state.job.data().numbeo_traffic_inefficiency_index ?
                        <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                          Traffic Inefficiency:
                        </Typography>
                        : ''}

                    </Grid>


                    <Grid item className={this.props.classes.panes}>
                      {this.state.job.data().numbeo_traffic_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                          {Math.round(this.state.job.data().numbeo_traffic_index)}
                        </Typography>
                        : ''}
                      {this.state.job.data().numbeo_pollution_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                          {Math.round(this.state.job.data().numbeo_pollution_index)} / 100
                        </Typography>
                        : ''}
                      {this.state.job.data().numbeo_traffic_time_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                          {Math.round(this.state.job.data().numbeo_traffic_time_index)} minutes
                        </Typography>
                        : ''}
                      {this.state.job.data().numbeo_traffic_co2_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                          {Math.round(this.state.job.data().numbeo_traffic_co2_index)} grams
                        </Typography>
                        : ''}
                      {this.state.job.data().numbeo_traffic_inefficiency_index ?
                        <Typography variant="h5" color="textPrimary" style={{ marginLeft: '1vh' }}>
                          {Math.round(this.state.job.data().numbeo_traffic_inefficiency_index)}
                        </Typography>
                        : ''}

                    </Grid>
                  </Grid>
                </Paper>
              </div>
            );
          }
          else {
            content = (
              <div>
                <Typography style={{ fontSize: 28 }}>City Information</Typography>

                {this.state.job.data().numbeo_error ?

                  <Typography variant="h5" color="secondary" style={{ marginLeft: '1vh', marginTop: 10 }}>
                    Error Retrieving City Information.
                          </Typography>

                  : <div></div>}
                {this.state.job.data().numbeo_cpi_index ?
                  <Paper className={this.props.classes.item}>
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      CPI (Relative to NYC):
                          </Typography>
                    <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6">
                      {Math.round(this.state.job.data().numbeo_cpi_index)}%
                          </Typography>
                  </Paper>
                  : ''}
                {this.state.job.data().numbeo_rent_index ?
                  <Paper className={this.props.classes.item}>
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      Rent (Relative to NYC):
                          </Typography>
                    <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6">
                      {Math.round(this.state.job.data().numbeo_rent_index)}%
                          </Typography>
                  </Paper>
                  : ''}
                {this.state.job.data().numbeo_cpi_and_rent_index ?
                  <Paper className={this.props.classes.item}>
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      CPI and Rent (Relative to NYC):
                          </Typography>
                    <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6">
                      {Math.round(this.state.job.data().numbeo_cpi_and_rent_index)}%
                          </Typography>
                  </Paper>
                  : ''}
                {this.state.job.data().numbeo_purchasing_power_incl_rent_index ?
                  <Paper className={this.props.classes.item}>
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      Purchasing Power (Relative to NYC):
                          </Typography>
                    <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6">
                      {Math.round(this.state.job.data().numbeo_purchasing_power_incl_rent_index)}%
                          </Typography>
                  </Paper>
                  : ''}
                {this.state.job.data().numbeo_restaurant_price_index ?
                  <Paper className={this.props.classes.item}>
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      Restaurant Price (Relative to NYC):
                          </Typography>
                    <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6">
                      {Math.round(this.state.job.data().numbeo_restaurant_price_index)}%
                          </Typography>
                  </Paper>
                  : ''}
                {this.state.job.data().numbeo_groceries_index ?
                  <Paper className={this.props.classes.item}>
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      Groceries (Relative to NYC):
                          </Typography>
                    <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6">
                      {Math.round(this.state.job.data().numbeo_groceries_index)}%
                          </Typography>
                  </Paper>
                  : ''}
                {this.state.job.data().numbeo_crime_index ?
                  <Paper className={this.props.classes.item}>
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      Crime:
                          </Typography>
                    <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6">
                      {Math.round(this.state.job.data().numbeo_crime_index)}/100
                          </Typography>
                  </Paper>
                  : ''}
                {this.state.job.data().numbeo_safety_index ?
                  <Paper className={this.props.classes.item}>
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      Safety:
                          </Typography>
                    <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6">
                      {Math.round(this.state.job.data().numbeo_safety_index)}/100
                          </Typography>
                  </Paper>
                  : ''}
                {this.state.job.data().numbeo_quality_of_life_index ?
                  <Paper className={this.props.classes.item}>
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      Quality of Life (Higher Better):
                          </Typography>
                    <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6">
                      {Math.round(this.state.job.data().numbeo_quality_of_life_index)}
                    </Typography>
                  </Paper>
                  : ''}
                {this.state.job.data().numbeo_climate_index ?
                  <Paper className={this.props.classes.item}>
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      Climate (Higher Better):
                          </Typography>
                    <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6">
                      {Math.round(this.state.job.data().numbeo_climate_index)}
                    </Typography>
                  </Paper>
                  : ''}
                {this.state.job.data().numbeo_health_care_index ?
                  <Paper className={this.props.classes.item}>
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      Health Care:
                          </Typography>
                    <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6">
                      {Math.round(this.state.job.data().numbeo_health_care_index)}/100
                          </Typography>
                  </Paper>
                  : ''}
                {this.state.job.data().numbeo_traffic_index ?
                  <Paper className={this.props.classes.item}>
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      Traffic (Higher Worse):
                          </Typography>
                    <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6">
                      {Math.round(this.state.job.data().numbeo_traffic_index)}
                    </Typography>
                  </Paper>
                  : ''}
                {this.state.job.data().numbeo_pollution_index ?
                  <Paper className={this.props.classes.item}>
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      Pollution:
                          </Typography>
                    <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6">
                      {Math.round(this.state.job.data().numbeo_pollution_index)}/100
                          </Typography>
                  </Paper>
                  : ''}
                {this.state.job.data().numbeo_traffic_time_index ?
                  <Paper className={this.props.classes.item}>
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      Traffic Time to Work:
                          </Typography>
                    <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6">
                      {Math.round(this.state.job.data().numbeo_traffic_time_index)} minutes
                          </Typography>
                  </Paper>
                  : ''}
                {this.state.job.data().numbeo_traffic_co2_index ?
                  <Paper className={this.props.classes.item}>
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      CO2 Emissions:
                          </Typography>
                    <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6">
                      {Math.round(this.state.job.data().numbeo_traffic_co2_index)} grams
                          </Typography>
                  </Paper>
                  : ''}
                {this.state.job.data().numbeo_traffic_inefficiency_index ?
                  <Paper className={this.props.classes.item}>
                    <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                      Traffic Inefficiency (Higher Worse):
                          </Typography>
                    <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6">
                      {Math.round(this.state.job.data().numbeo_traffic_inefficiency_index)}
                    </Typography>
                  </Paper>
                  : ''}
              </div>
            );
          }
          break;
        }
        case 4: {
          //Glassdoor Reviews
          content = (
            <div>
              <Typography variant="h2" style={{ margin: 50 }}>Glassdoor Reviews</Typography>
              <Paper className={this.props.classes.item}>
                <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                  Steve Jobs:
                  </Typography>
                <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6" id="simple-modal-description">Wow, now this company thinks different!
                  </Typography>
              </Paper>
              <Paper className={this.props.classes.item}>
                <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                  Abraham Lincoln:
                  </Typography>
                <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6" id="simple-modal-description">I didn't enjoy working for this company. When I left, I felt emancipated!
                  </Typography>
              </Paper>
              <Paper className={this.props.classes.item}>
                <Typography variant="h5" color="primary" style={{ marginLeft: '1vh' }}>
                  John F. Kennedy:
                  </Typography>
                <Typography style={{ marginLeft: '1vh', marginBottom: '2vh' }} variant="h6" id="simple-modal-description">Ask not what this company can do for you, ask what you can do for this company!
                  </Typography>
              </Paper>
            </div>
          );
          break;
        }
        case 5: {
          // console.log(this.state.contacts);
          content = (
            <div>
              <Typography variant="h2" style={{ margin: 50 }}>Contact Information</Typography>
              {this.state.Contacts ? (this.state.Contacts.map((contact, i) => {
                return (
                  <Card className={this.props.classes.item} key={i}>
                    <CardContent>
                      <Typography style={{ fontSize: 20 }}>
                        {contact.FirstName} {contact.LastName}
                      </Typography>
                      <Typography style={{ fontSize: 16 }}>
                        {contact.Title}
                      </Typography>
                      <Typography style={{ fontSize: 16 }}>
                        {this.state.job.data().CompanyName}
                      </Typography>
                      <Typography style={{ fontSize: 16 }}>
                        {contact.Phone}
                      </Typography>
                      <Typography style={{ fontSize: 16 }}>
                        {contact.Email}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => this.handleEditContact(contact.FirstName)}>Edit Contact</Button>
                    </CardActions>
                    <CardActions>
                      <Button size="small" onClick={() => this.handleDeleteContact(contact.FirstName)}>Delete Contact</Button>
                    </CardActions>
                  </Card>
                );
              })) : null}
              <ExpansionPanel expanded={this.state.expanded} onClick={() => {
                this.setState({ expanded: !this.state.expanded });
              }}>
                <ExpansionPanelSummary>
                  <Typography>Add New Contact</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <TextField
                    style={{ margin: 10 }}
                    id="standard-name"
                    label="First Name"
                    // className={classes.textField}
                    value={this.state.newContactFirstName}
                    onChange={this.handleContactInfo('FirstName')}
                    margin="normal"
                    onClick={(event) => event.stopPropagation()}
                  />
                  <TextField
                    style={{ margin: 10 }}
                    id="standard-name"
                    label="Last Name"
                    // className={classes.textField}
                    value={this.state.newContactLastName}
                    onChange={this.handleContactInfo('LastName')}
                    margin="normal"
                    onClick={(event) => event.stopPropagation()}
                  />
                  <TextField
                    style={{ margin: 10 }}
                    id="standard-name"
                    label="Title"
                    // className={classes.textField}
                    value={this.state.newContactTitle}
                    onChange={this.handleContactInfo('Title')}
                    margin="normal"
                    onClick={(event) => event.stopPropagation()}
                  /> <TextField
                    style={{ margin: 10 }}
                    id="standard-name"
                    label="Phone"
                    // className={classes.textField}
                    value={this.state.newContactPhone}
                    onChange={this.handleContactInfo('Phone')}
                    margin="normal"
                    onClick={(event) => event.stopPropagation()}
                  />
                  <TextField
                    style={{ margin: 10 }}
                    id="standard-name"
                    label="Email"
                    // className={classes.textField}
                    value={this.state.newContactEmail}
                    onChange={this.handleContactInfo('Email')}
                    margin="normal"
                    onClick={(event) => event.stopPropagation()}
                  />
                </ExpansionPanelDetails>
                <ExpansionPanelDetails>
                  <Button variant="contained" color="primary" onClick={this.handleSaveContact}>
                    Save Contacts
          </Button>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </div>
          );
          break;
        }
        default:
          content = (null)
          break;
      }
      let warning1 = (
        <div>
          <Grid container direction="row" justify="center" alignItems="center" style={{ fontSize: 20, height: 50, backgroundColor: "lightgreen", color: "black" }}>
            <Warning /><Typography >You’re supposed to hear back soon on your interview! Good luck!</Typography>
          </Grid>
        </div>
      );
      let warning2 = (
        <div>
          <Grid container style={{ fontSize: 20, height: 80, backgroundColor: "pink" }}>
            <Grid container direction="row" justify="center" alignItems="center" >
              <Warning /><Typography>Have you heard back about your interview yet? You were supposed to hear back about {(moment().diff(moment(this.state.job.data().ExpectedContact, 'YYYY-MM-DD'), 'days'))} days ago.</Typography>
            </Grid>
            <Grid container direction="row" justify="center" alignItems="center" >
              <Button onClick={this.fixExpectedContactA} style={{ marginLeft: 10, marginBottom: 10 }} size="small" variant="contained">
                I recieved an offer!
              </Button>
              <Button onClick={this.fixExpectedContactB} style={{ marginLeft: 10, marginBottom: 10 }} size="small" variant="contained">
                I was rejected :(
              </Button>
            </Grid>
          </Grid>
        </div>
      );
      let warning3 = (
        <div>
          <Grid container direction="row" justify="center" alignItems="center" style={{ fontSize: 20, height: 50, backgroundColor: "yellow", color: "black" }}>
            <Warning /><Typography>Your application status hasn't been updated in a while!</Typography>
          </Grid>
        </div>
      );


      return (
        <div>
          <div className={this.props.classes.container}>
            <Button
              variant="contained"
              onClick={this.goBack}
              color="primary"
            >
              <BackIcon />
            </Button>
            <Paper className={this.props.classes.paper}>
              <Paper className={this.props.classes.paperHeading}>
                <Typography style={{ fontSize: 28, marginTop: 15, fontWeight: 500 }}>{this.state.job.data().JobTitle} Job with {this.state.job.data().CompanyName} in {this.state.job.data().Location}</Typography>
                {(this.state.job.data().ApplicationStatus === "No Response" && -1 * (moment().diff(moment(this.state.job.data().ExpectedContact, 'YYYY-MM-DD'), 'days')) < 0 && warning2) ||
                  (this.state.job.data().ApplicationStatus === "No Response" && -1 * (moment().diff(moment(this.state.job.data().ExpectedContact, 'YYYY-MM-DD'), 'days')) < 3 && warning1)}
                {moment().diff(moment(this.state.job.data().LastModified, 'YYYY-MM-DD'), "months") > 0 && warning3}
                {status}
                <Button
                  variant="contained"
                  onClick={this.handleClickOpenDelete}
                  color="secondary"
                  style={{ margin: 15 }}
                >
                  Delete
                  </Button>
                <Button
                  variant="contained"
                  onClick={event => this.handleEdit(this.state.job.id)}
                  color="primary"
                  style={{ margin: 15 }}
                >
                  Edit
                  </Button>
              </Paper>
              <DetailTabs handleChangeTab={this.handleChangeTab} />
              {content}
            </Paper>
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
                {"Delete App?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  Are you sure you would like to delete this application?
                        </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleCloseDelete} style={{ margin: 'auto' }} color="primary">
                  Cancel
                        </Button>
                <Button onClick={event => this.handleDelete(this.state.job.id)} style={{ margin: 'auto' }} color="secondary">
                  Delete App
                        </Button>
              </DialogActions>
            </Dialog>
          </div>
          <div>
            <Dialog
              open={this.state.openDeleteFile}
              TransitionComponent={Transition}
              keepMounted
              onClose={this.handleCloseDeleteFile}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle id="alert-dialog-slide-title">
                {"Delete File?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  Are you sure you would like to delete this file?
                        </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleCloseDeleteFile} style={{ margin: 'auto' }} color="primary">
                  Cancel
                        </Button>
                <Button onClick={() => this.delUserFile(false)} style={{ margin: 'auto' }} color="secondary">
                  Delete File
                        </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      );
    }
  }
}


const JobDetails = compose(
  withRouter,
  withFirebase,
)(JobDetailsBase);

export default withStyles(styles)(JobDetails);
